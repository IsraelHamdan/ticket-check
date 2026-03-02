import { z } from "zod/v4";
import { parseBRDigitsToDate } from "../utils/formarters";

export const TICKET_STATUS = z.enum([
  "ABERTO",
  "ACEITO",
  "ENCERRADO",
  "CANCELADO",
  "IMPROCEDENTE",
]);

export type TicketStatus = z.infer<typeof TICKET_STATUS>;

export const CLOSED_STATUSES = [
  "ENCERRADO",
  "CANCELADO",
  "IMPROCEDENTE",
] as const satisfies TicketStatus[];

export type ClosedTicketStatus = (typeof CLOSED_STATUSES)[number];

export const ticketStatusLabel: Record<TicketStatus, string> = {
  ABERTO: "Aberto",
  ACEITO: "Aceito",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
  IMPROCEDENTE: "Improcedente",
};

export const ticketBaseSchema = z.object({
  title: z.string().trim().min(3, "Título deve ter no mínimo 3 caracteres"),
  details: z.string().trim().min(1, "Detalhes são obrigatórios"),
  requester: z.string().trim().min(1, "Solicitante é obrigatório"),
  requesterId: z.string().trim().min(1, "requesterId é obrigatório"),
  deadline: z.iso.datetime({ message: "Prazo inválido" }),
});

export const createTicketSchema = ticketBaseSchema;
export type CreateTicketDTO = z.infer<typeof createTicketSchema>;

export const newTicketFormSchema = z.object({
  title: z.string().trim().min(3, "Título deve ter no mínimo 3 caracteres"),
  details: z.string().trim().min(1, "Detalhes são obrigatórios"),
  requester: z.string().trim().min(1, "Solicitante é obrigatório"),
  requesterId: z.string().trim().min(1, "requesterId é obrigatório"),
  deadline: z
    .string()
    .refine(
      (val) => parseBRDigitsToDate(val) !== null,
      "Informe uma data válida no formato DD/MM/AAAA",
    )
    .transform((val) => {
      const date = parseBRDigitsToDate(val) as Date;
      return date.toISOString();
    }),
});

export type NewTicketFormValues = z.input<typeof newTicketFormSchema>;
export type NewTicketFormOutput = z.output<typeof newTicketFormSchema>;

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(3).optional(),
    details: z.string().trim().min(1).optional(),
    requester: z.string().trim().min(1).optional(),
    deadline: z.iso.datetime().optional(),
    status: TICKET_STATUS.optional(),
    provider: z.string().trim().min(1).optional(),
    providerId: z.string().trim().min(1).optional(),
    closingDetails: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) => {
      const isClosing =
        data.status !== undefined &&
        (CLOSED_STATUSES as readonly string[]).includes(data.status);
      if (isClosing) {
        return (
          typeof data.closingDetails === "string" &&
          data.closingDetails.length > 0 &&
          typeof data.provider === "string" &&
          data.provider.length > 0 &&
          typeof data.providerId === "string" &&
          data.providerId.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Ao encerrar, cancelar ou marcar como improcedente, informe o responsável e os detalhes do encerramento.",
      path: ["closingDetails"],
    },
  );

export type UpdateTicketDTO = z.infer<typeof updateTicketSchema>;

export const storedTicketSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  details: z.string(),
  requester: z.string().min(1),
  requesterId: z.string().min(1).optional(),
  deadline: z.iso.datetime(),
  status: TICKET_STATUS,
  provider: z.string().trim().min(1).optional(),
  providerId: z.string().trim().min(1).optional(),
  closingDetails: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type StoredTicket = z.infer<typeof storedTicketSchema>;

export const ticketEntitySchema = storedTicketSchema.extend({
  deadline: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TicketEntity = z.infer<typeof ticketEntitySchema>;
