export const formStyles = {
  layoutContainer: "flex-1 bg-white dark:bg-slate-900",
  container: "flex-1 justify-center bg-white dark:bg-slate-900 px-6",
  title: "mb-6 text-3xl font-bold text-slate-900 dark:text-white",
  input:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
  rootError: "mb-3 text-sm text-red-500",
  button:
    "mt-2 w-full items-center justify-center rounded-xl bg-indigo-600 py-3 dark:bg-indigo-500",
  buttonDisabled: "opacity-50",
  buttonText: "text-base font-semibold text-white",
  link: "mt-4 text-center font-medium text-indigo-600 dark:text-indigo-400",
} as const;
