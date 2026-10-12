import { isAxiosError } from "axios";

export const cartErrorText = (error: unknown): string => {
  const data = isAxiosError(error) ? error.response?.data : error;
  const code = data && typeof data === "object" ? data.code : undefined;
  const messages: Record<string, string> = {
    already_purchased: "بعضی از برنامه‌های این بسته را قبلاً خریده‌اید. برنامه‌های خریداری‌شده را در پروفایل بررسی کنید.",
    bundle_item: "این برنامه عضو یک بسته است. برای حذف، کل بسته را از سبد خرید حذف کنید.",
    bundle_changed: "برنامه‌های بسته تغییر کرده‌اند. بسته را از سبد حذف و دوباره اضافه کنید.",
  };
  if (code && messages[code]) return messages[code];
  if (isAxiosError(error) && error.response?.status === 503)
    return "بررسی وضعیت پرداخت ممکن نشد. سبد خرید حفظ شده است؛ کمی بعد دوباره تلاش کنید.";
  if (isAxiosError(error) && error.response?.status === 409)
    return typeof data?.detail === "string" ? data.detail : "این انتخاب با خریدها، بسته‌های دیگر یا پرداخت فعال شما تداخل دارد. سبد خرید و پرداخت‌ها را بررسی کنید.";
  return typeof data?.detail === "string" ? data.detail : "به‌روزرسانی سبد خرید انجام نشد. دوباره تلاش کنید.";
};
