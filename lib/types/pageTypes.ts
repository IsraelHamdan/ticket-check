import { TicketEntity } from "../validations/ticket.schema";

export type ScreenState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: TicketEntity[] | TicketEntity };
