import type {
  TicketEntity,
  TicketsGroupedByStatus,
} from "@/lib/validations/ticket.schema";

type ScreenData = TicketEntity | TicketEntity[] | TicketsGroupedByStatus;

// Exclui TicketsGroupedByStatus — retorna true só para arrays de TicketEntity
export function isTicketList(data: ScreenData): data is TicketEntity[] {
  return Array.isArray(data);
}

// Exclui array e TicketsGroupedByStatus — retorna true só para um TicketEntity
export function isSingleTicket(data: ScreenData): data is TicketEntity {
  return !Array.isArray(data) && !isGroupedByStatus(data);
}

// Já existia no DashboardScreen — centraliza aqui para reuso
export function isGroupedByStatus(
  data: ScreenData,
): data is TicketsGroupedByStatus {
  return (
    typeof data === "object" &&
    data !== null &&
    "ABERTO" in data &&
    "ACEITO" in data &&
    "ENCERRADO" in data &&
    "CANCELADO" in data &&
    "IMPROCEDENTE" in data
  );
}
