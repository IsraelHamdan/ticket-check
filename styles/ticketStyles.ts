export const ticketStyles = {
  centered: "flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900",
  loadingText: "mt-3 text-sm text-slate-400 dark:text-slate-500",
  errorWrapper: "flex-1 items-center justify-center px-8 gap-3",
  errorTitle: "text-base font-semibold text-red-500 text-center",
  errorSubtitle: "text-sm text-slate-400 dark:text-slate-500 text-center",

  // Badge compartilhado entre TicketCard e TicketView
  // Cor de fundo e texto vêm de STATUS_CONFIG (variam por status)
  badge: "flex-row items-center gap-1 px-2 py-0.5 rounded-full",
  badgeDot: "w-1.5 h-1.5 rounded-full",
  badgeText: "text-xs font-medium",
} as const;
