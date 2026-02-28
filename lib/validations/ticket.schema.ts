import z from "zod";

export const TICKET_STATUS = z.enum([
  "OPEN",
  "ACCEPTED",
  "COMPLETED",
  "CANCELED",
]);

export type TicketStatus = z.infer<typeof TICKET_STATUS>;

export const ticketStatusLabel: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  ACCEPTED: "Aceito",
  COMPLETED: "CONCLUIDO",
  CANCELED: "Cancelado",
};

export const ticketSchema = z.object({
  title: z.string().min(3),
  details: z.string(),
  status: TICKET_STATUS,
  requester: z.string(), // nome do usuário que solicitou o
  //inicialmente eles tem o mesmo valor, mas o createdAt é fixo e não atualizavel, já o updatedAt, a cada atualização deve ser modificado
  createdAt: z.date(), // TODO:AQUI DEVE SER AUTO PREENCHIDO QUANDO A TASK FOR CRIADA, SEMELHANTE A UM BANCO DE DADOS, POR EXEMPLO POSTGRES
  updatedAt: z.date(), // TODO: AQUI DEVE SER MARCADO QUANDO O TICKET FOR ATUALIZADO,
});

export const updateTicketSchema = ticketSchema
  .partial()
  .extend({
    provider: z.string(), // nome de quem vai resolver o chamado
  })
  .omit({
    createdAt: true,
  });

export type CreateTickerDTO = z.infer<typeof ticketSchema>;

export type UpdateTypeDTO = z.infer<typeof updateTicketSchema>;
