export { STATUS_CONFIG } from "./TicketStatusConfig";

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
