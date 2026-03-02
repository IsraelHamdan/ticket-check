import { TicketStatus } from "@/lib/validations/ticket.schema";

export type StatusConfig = {
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
};

export const STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  ABERTO: {
    borderColor: "border-l-blue-500",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    dotColor: "bg-blue-500",
  },
  ACEITO: {
    borderColor: "border-l-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    dotColor: "bg-amber-500",
  },
  ENCERRADO: {
    borderColor: "border-l-emerald-500",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
  },
  CANCELADO: {
    borderColor: "border-l-slate-400",
    badgeBg: "bg-slate-100 dark:bg-slate-700/60",
    badgeText: "text-slate-600 dark:text-slate-300",
    dotColor: "bg-slate-400",
  },
  IMPROCEDENTE: {
    borderColor: "border-l-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900/40",
    badgeText: "text-red-600 dark:text-red-300",
    dotColor: "bg-red-400",
  },
};
