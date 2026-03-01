import { TicketStatus } from "@/lib/validations/ticket.schema";

export const STATUS_CONFIG: Record<
  TicketStatus,
  { borderColor: string; badgeBg: string; badgeText: string; dotColor: string }
> = {
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

export const styles = {
  pressable: "active:opacity-70",
  card: "flex-row border-l-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm shadow-black/5 dark:shadow-black/30 overflow-hidden",
  body: "flex-1 px-4 py-3 gap-1",
  header: "flex-row items-center justify-between gap-2",
  title:
    "flex-1 text-sm font-semibold text-slate-900 dark:text-white leading-snug",
  badgeRow: "flex-row items-center gap-1.5",
  badgeDot: "w-1.5 h-1.5 rounded-full",
  badgeText: "text-xs font-medium",
  badge: "flex-row items-center gap-1 px-2 py-0.5 rounded-full",
  details: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed",
  footer: "flex-row items-center justify-between mt-1",
  metaRow: "flex-row items-center gap-1",
  metaText: "text-xs text-slate-400 dark:text-slate-500",
  chevron: "ml-2 self-center",
} as const;
