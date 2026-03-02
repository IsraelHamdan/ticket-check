import { z } from "zod/v4";

import {
  generateId,
  getCollection,
  persistCollection,
} from "@/lib/storage/async-storage";
import { parseWithZod } from "@/lib/storage/safe-parse";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import {
  CLOSED_STATUS,
  TICKET_STATUS,
  createTicketSchema,
  storedTicketSchema,
  ticketEntitySchema,
  updateTicketSchema,
  type CreateTicketDTO,
  type StoredTicket,
  type TicketEntity,
  type TicketStatus,
  type UpdateTicketDTO,
} from "@/lib/validations/ticket.schema";

const ticketIdSchema = z.string().trim().min(1, "Ticket id é obrigatório");
const userIdSchema = z.string().trim().min(1, "User id é obrigatório");

const normalizeText = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

const normalizeTicketStatus = (value: string): TicketStatus =>
  value.trim().toUpperCase() as TicketStatus;

const normalizeCreateInput = (input: CreateTicketDTO): CreateTicketDTO => ({
  title: normalizeText(input.title),
  details: input.details.trim(),
  requester: normalizeText(input.requester),
  requesterId: input.requesterId.trim(),
  deadline: input.deadline,
});

const normalizeUpdateInput = (input: UpdateTicketDTO): UpdateTicketDTO => {
  const normalized: UpdateTicketDTO = {};

  if (typeof input.title === "string")
    normalized.title = normalizeText(input.title);
  if (typeof input.details === "string")
    normalized.details = input.details.trim();
  if (typeof input.requester === "string")
    normalized.requester = normalizeText(input.requester);
  if (typeof input.status === "string")
    normalized.status = normalizeTicketStatus(input.status);
  if (typeof input.provider === "string")
    normalized.provider = normalizeText(input.provider);
  if (typeof input.providerId === "string")
    normalized.providerId = input.providerId.trim();
  if (typeof input.closingDetails === "string")
    normalized.closingDetails = input.closingDetails.trim();
  if (typeof input.deadline === "string") normalized.deadline = input.deadline;

  return normalized;
};

const toTicketEntity = (stored: StoredTicket): TicketEntity =>
  parseWithZod(
    ticketEntitySchema,
    {
      ...stored,
      deadline: new Date(stored.deadline),
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
    },
    "toTicketEntity",
  );

export const createTicket = async (
  input: CreateTicketDTO,
): Promise<TicketEntity> => {
  const normalized = normalizeCreateInput(input);
  const parsed = parseWithZod(
    createTicketSchema,
    normalized,
    "createTicket input",
  );

  const now = new Date().toISOString();

  const newTicket = parseWithZod(
    storedTicketSchema,
    {
      id: generateId("tkt"),
      title: parsed.title,
      details: parsed.details,
      requester: parsed.requester,
      requesterId: parsed.requesterId,
      deadline: parsed.deadline,
      status: "ABERTO" satisfies TicketStatus,
      createdAt: now,
      updatedAt: now,
    },
    "createTicket payload",
  );

  await persistCollection(
    STORAGE_KEYS.tickets,
    storedTicketSchema,
    (tickets) => [...tickets, newTicket],
  );

  return toTicketEntity(newTicket);
};

export const listTickets = async (): Promise<TicketEntity[]> => {
  const tickets = await getCollection(STORAGE_KEYS.tickets, storedTicketSchema);
  return tickets
    .map(toTicketEntity)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const listTicketsByStatus = async (
  status: TicketStatus,
): Promise<TicketEntity[]> => {
  const parsedStatus = parseWithZod(
    TICKET_STATUS,
    status,
    "listTicketsByStatus status",
  );
  const all = await listTickets();
  return all.filter((ticket) => ticket.status === parsedStatus);
};

export const getTicketById = async (
  id: string,
): Promise<TicketEntity | null> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "getTicketById id");
  const tickets = await getCollection(STORAGE_KEYS.tickets, storedTicketSchema);
  const found = tickets.find((ticket) => ticket.id === parsedId);
  return found ? toTicketEntity(found) : null;
};

export const updateTicket = async (
  id: string,
  input: UpdateTicketDTO,
  userId: string, // providerId
): Promise<TicketEntity | null> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "updateTicket id");
  const parsedUserId = parseWithZod(
    userIdSchema,
    userId,
    "updateTicket userId",
  );
  const normalized = normalizeUpdateInput(input);
  const parsed = parseWithZod(
    updateTicketSchema,
    normalized,
    "updateTicket input",
  );

  const hasUpdates = Object.keys(parsed).length > 0;

  let resultTicket: StoredTicket | null = null;

  await persistCollection(
    STORAGE_KEYS.tickets,
    storedTicketSchema,
    (tickets) => {
      const index = tickets.findIndex((t) => t.id === parsedId);

      if (index < 0) return tickets;

      const ticket = tickets[index];

      // ✅ Regra de negócio: quem criou não pode atualizar
      if (ticket.requesterId === parsedUserId) {
        throw new Error(
          "Operação não permitida: o solicitante do chamado não pode ser o responsável por resolvê-lo.",
        );
      }

      if (!hasUpdates) {
        resultTicket = ticket;
        return tickets;
      }

      const merged = parseWithZod(
        storedTicketSchema,
        {
          ...ticket,
          ...parsed,
          updatedAt: new Date().toISOString(),
        },
        "updateTicket merged payload",
      );

      const next = [...tickets];
      next[index] = merged;
      resultTicket = merged;

      return next;
    },
  );

  return resultTicket ? toTicketEntity(resultTicket) : null;
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "deleteTicket id");
  let deleted = false;

  await persistCollection(
    STORAGE_KEYS.tickets,
    storedTicketSchema,
    (tickets) => {
      const next = tickets.filter((t) => t.id !== parsedId);
      deleted = next.length < tickets.length;
      return deleted ? next : tickets;
    },
  );

  return deleted;
};

export type TicketStatusDistribution = Record<TicketStatus, number>;
export interface TicketMetrics {
  totalCount: number;
  byStatus: TicketStatusDistribution;
  avgClosingTimeMinutes: number | null;
}

export const getTicketMetrics = async (): Promise<TicketMetrics> => {
  const tickets = await getCollection(STORAGE_KEYS.tickets, storedTicketSchema);
  const entities = tickets.map(toTicketEntity);

  const byStatus: TicketStatusDistribution = {
    ABERTO: 0,
    ACEITO: 0,
    ENCERRADO: 0,
    CANCELADO: 0,
    IMPROCEDENTE: 0,
  };

  let totalClosingMinutes = 0;
  let closedCount = 0;

  for (const ticket of entities) {
    byStatus[ticket.status] += 1;

    const isClosed = (CLOSED_STATUS as readonly string[]).includes(
      ticket.status,
    );
    if (isClosed) {
      const diffMs = ticket.updatedAt.getTime() - ticket.createdAt.getTime();
      totalClosingMinutes += diffMs / 1_000 / 60;
      closedCount += 1;
    }
  }

  return {
    totalCount: entities.length,
    byStatus,
    avgClosingTimeMinutes:
      closedCount > 0 ? Math.round(totalClosingMinutes / closedCount) : null,
  };
};
