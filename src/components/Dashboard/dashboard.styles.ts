export const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-primary hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryActionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";
export const priceText = (value: number) =>
  new Intl.NumberFormat("fa-IR").format(value);
export const dateText = (value: string | Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  }).format(new Date(value));
