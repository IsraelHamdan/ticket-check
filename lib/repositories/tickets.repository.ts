import { z } from "zod";

import {
  generateId,
  getCollection,
  persistCollection,
} from "@/lib/storage/async-storage";
import { parseWithZod } from "@/lib/storage/safe-parse";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import {
  TICKET_STATUS,
  ticketSchema,
  updateTicketSchema,
  type TicketStatus,
} from "@/lib/validations/ticket.schema";

const ticketIdSchema = z.string().trim().min(1, "Ticket id is required");

const ticketCoreSchema = ticketSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict();

const createTicketInputSchema = ticketCoreSchema
  .extend({
    status: TICKET_STATUS.optional(),
  })
  .strict()
  .transform((input) => ({
    ...input,
    status: input.status ?? "OPEN",
  }));

const updateTicketInputSchema = updateTicketSchema
  .partial()
  .omit({
    updatedAt: true,
  })
  .strict();

const storedTicketSchema = ticketCoreSchema
  .extend({
    id: z.string().min(1),
    provider: z.string().trim().min(1).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

const ticketEntitySchema = ticketSchema
  .extend({
    id: z.string().min(1),
    provider: z.string().min(1).optional(),
  })
  .strict();

type StoredTicket = z.infer<typeof storedTicketSchema>;

export type TicketEntity = z.infer<typeof ticketEntitySchema>;
export type CreateTicketInput = z.input<typeof createTicketInputSchema>;
export type UpdateTicketInput = z.input<typeof updateTicketInputSchema>;

const normalizeText = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

const normalizeTicketStatus = (status: string): TicketStatus =>
  status.trim().toUpperCase() as TicketStatus;

const normalizeCreateTicketInput = (
  input: CreateTicketInput
): CreateTicketInput => ({
  ...input,
  title: normalizeText(input.title),
  details: input.details.trim(),
  requester: normalizeText(input.requester),
  status: input.status ? normalizeTicketStatus(input.status) : undefined,
});

const normalizeUpdateTicketInput = (
  input: UpdateTicketInput
): UpdateTicketInput => {
  const normalizedInput: UpdateTicketInput = {};

  if (typeof input.title === "string") {
    normalizedInput.title = normalizeText(input.title);
  }

  if (typeof input.details === "string") {
    normalizedInput.details = input.details.trim();
  }

  if (typeof input.requester === "string") {
    normalizedInput.requester = normalizeText(input.requester);
  }

  if (typeof input.status === "string") {
    normalizedInput.status = normalizeTicketStatus(input.status);
  }

  if (typeof input.provider === "string") {
    normalizedInput.provider = normalizeText(input.provider);
  }

  return normalizedInput;
};

const toTicketEntity = (storedTicket: StoredTicket): TicketEntity =>
  parseWithZod(
    ticketEntitySchema,
    {
      ...storedTicket,
      createdAt: new Date(storedTicket.createdAt),
      updatedAt: new Date(storedTicket.updatedAt),
    },
    "stored ticket entity"
  );

export const createTicket = async (
  input: CreateTicketInput
): Promise<TicketEntity> => {
  const normalizedInput = normalizeCreateTicketInput(input);
  const parsedInput = parseWithZod(
    createTicketInputSchema,
    normalizedInput,
    "createTicket input"
  );

  const now = new Date().toISOString();
  const newTicket = parseWithZod(
    storedTicketSchema,
    {
      id: generateId("tkt"),
      ...parsedInput,
      createdAt: now,
      updatedAt: now,
    },
    "createTicket payload"
  );

  await persistCollection(STORAGE_KEYS.tickets, storedTicketSchema, (tickets) => [
    ...tickets,
    newTicket,
  ]);

  return toTicketEntity(newTicket);
};

export const listTickets = async (): Promise<TicketEntity[]> => {
  const tickets = await getCollection(STORAGE_KEYS.tickets, storedTicketSchema);
  return tickets.map(toTicketEntity);
};

export const getTicketById = async (
  id: string
): Promise<TicketEntity | null> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "getTicketById id");
  const tickets = await getCollection(STORAGE_KEYS.tickets, storedTicketSchema);

  const targetTicket = tickets.find((ticket) => ticket.id === parsedId);
  return targetTicket ? toTicketEntity(targetTicket) : null;
};

export const updateTicket = async (
  id: string,
  input: UpdateTicketInput
): Promise<TicketEntity | null> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "updateTicket id");
  const normalizedInput = normalizeUpdateTicketInput(input);
  const parsedInput = parseWithZod(
    updateTicketInputSchema,
    normalizedInput,
    "updateTicket input"
  );
  const hasUpdates = Object.keys(parsedInput).length > 0;

  let updatedTicket: StoredTicket | null = null;
  let existingTicket: StoredTicket | null = null;

  await persistCollection(
    STORAGE_KEYS.tickets,
    storedTicketSchema,
    (tickets) => {
      const ticketIndex = tickets.findIndex((ticket) => ticket.id === parsedId);
      if (ticketIndex < 0) {
        return tickets;
      }

      existingTicket = tickets[ticketIndex];

      if (!hasUpdates) {
        return tickets;
      }

      const mergedTicket = parseWithZod(
        storedTicketSchema,
        {
          ...tickets[ticketIndex],
          ...parsedInput,
          updatedAt: new Date().toISOString(),
        },
        "updateTicket payload"
      );

      const nextTickets = [...tickets];
      nextTickets[ticketIndex] = mergedTicket;
      updatedTicket = mergedTicket;

      return nextTickets;
    }
  );

  if (updatedTicket) {
    return toTicketEntity(updatedTicket);
  }

  if (existingTicket) {
    return toTicketEntity(existingTicket);
  }

  return null;
};

export const deleteTicket = async (id: string): Promise<boolean> => {
  const parsedId = parseWithZod(ticketIdSchema, id, "deleteTicket id");
  let deleted = false;

  await persistCollection(STORAGE_KEYS.tickets, storedTicketSchema, (tickets) => {
    const nextTickets = tickets.filter((ticket) => ticket.id !== parsedId);
    deleted = nextTickets.length !== tickets.length;
    return deleted ? nextTickets : tickets;
  });

  return deleted;
};
