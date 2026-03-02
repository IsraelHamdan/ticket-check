// utils/ticket.utils.ts
import { TicketEntity } from "@/lib/validations/ticket.schema";

export type RankedTicket = TicketEntity & {
  closingMinutes: number;
  rank: number;
};

export function getTop5FastestClosed(tickets: TicketEntity[]): RankedTicket[] {
  return tickets
    .filter((t) => t.status === "ENCERRADO")
    .map((t) => ({
      ...t,
      closingMinutes: Math.round(
        (t.updatedAt.getTime() - t.createdAt.getTime()) / 1_000 / 60,
      ),
    }))
    .sort((a, b) => a.closingMinutes - b.closingMinutes)
    .slice(0, 5)
    .map((t, i) => ({ ...t, rank: i + 1 }));
}
