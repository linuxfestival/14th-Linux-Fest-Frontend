import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import ErrorScreen from "./ErrorScreen";
import { primaryActionClass, secondaryActionClass } from "./errorScreen.styles";

export default function CrashFallback() {
  return (
    <ErrorScreen
      title="نمایش صفحه با مشکل روبه‌رو شد"
      description="صفحه را دوباره بارگذاری کن. اگر مشکل ادامه داشت، به صفحه اصلی برگرد."
      illustration={<HiOutlineExclamationTriangle aria-hidden="true" className="mb-6 size-16 text-orange-ink" />}
    >
      <div role="alert" className="sr-only">نمایش صفحه با مشکل روبه‌رو شد.</div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.location.reload()} className={primaryActionClass}>بارگذاری دوباره</button>
        <a href="/" className={secondaryActionClass}>بازگشت به صفحه اصلی</a>
      </div>
    </ErrorScreen>
  );
}
