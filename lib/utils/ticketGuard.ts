import { TicketEntity } from "../validations/ticket.schema";

export function isSingleTicket(
  data: TicketEntity | TicketEntity[],
): data is TicketEntity {
  return !Array.isArray(data);
}
