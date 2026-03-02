export const ticketStyles = {
  container: "flex-1 bg-slate-50 dark:bg-slate-900",
  centered: "flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900",
  loadingText: "mt-3 text-sm text-slate-400 dark:text-slate-500",
  listContent: "px-4 pt-4 pb-10 gap-3",
  emptyWrapper: "flex-1 items-center justify-center px-8 gap-3",
  emptyIcon: "mb-1 opacity-30",
  emptyTitle:
    "text-base font-semibold text-slate-500 dark:text-slate-400 text-center",
  emptySubtitle:
    "text-sm text-slate-400 dark:text-slate-500 text-center leading-relaxed",
  errorWrapper: "flex-1 items-center justify-center px-8 gap-3",
  errorTitle: "text-base font-semibold text-red-500 text-center",
  errorSubtitle: "text-sm text-slate-400 dark:text-slate-500 text-center",
} as const;
