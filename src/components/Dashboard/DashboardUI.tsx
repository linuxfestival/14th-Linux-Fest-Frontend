import {
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { actionClass } from "./dashboard.styles";
import { HiArrowLeft, HiXMark } from "react-icons/hi2";
import type { PaymentState } from "../../core/payment/payment.dto";
export const DashboardPage = ({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}) => (
  <div className="w-full space-y-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black leading-snug sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-dark-gray">
          {description}
        </p>
      </div>
      {action}
    </div>
    {children}
  </div>
);
export const DashboardPanel = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`min-w-0 rounded-xl border border-primary/15 bg-white p-5 sm:p-7 ${className}`}
  >
    {children}
  </section>
);
export const DashboardButton = ({
  children,
  loading,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => (
  <button
    {...props}
    disabled={props.disabled || loading}
    aria-busy={loading || undefined}
    className={`${actionClass} ${props.className ?? ""}`}
  >
    {loading ? (
      <>
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin"
        />
        <span role="status">در حال ارسال…</span>
      </>
    ) : (
      children
    )}
  </button>
);
export const DashboardLoading = ({
  text = "در حال دریافت اطلاعات…",
}: {
  text?: string;
}) => (
  <div
    role="status"
    className="flex min-h-40 items-center justify-center gap-3 text-sm text-dark-gray"
  >
    <span
      aria-hidden="true"
      className="size-5 rounded-full border-2 border-primary/20 border-t-primary motion-safe:animate-spin"
    />
    {text}
  </div>
);
export const DashboardEmpty = ({
  title,
  description,
  link = "/workshops",
  label = "مشاهده ارائه‌ها",
}: {
  title: string;
  description: string;
  link?: string;
  label?: string;
}) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-4 py-10 text-center">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="mt-3 max-w-md text-sm leading-7 text-dark-gray">
      {description}
    </p>
    <Link to={link} className={`${actionClass} mt-6`}>
      {label}
      <HiArrowLeft aria-hidden="true" className="size-4" />
    </Link>
  </div>
);
export const PaymentBadge = ({ state }: { state: PaymentState }) => (
  <span
    className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${state === "COMPLETED" ? "bg-green-50 text-green-800" : state === "FAILED" ? "bg-red-50 text-red-800" : "bg-orange-50 text-orange-900"}`}
  >
    {state === "COMPLETED"
      ? "پرداخت موفق"
      : state === "FAILED"
        ? "پرداخت ناموفق"
        : "در انتظار پرداخت"}
  </span>
);
export const DashboardDialog = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-auto rounded-xl border-0 bg-white p-6 text-primary backdrop:bg-primary/60 sm:p-8"
      dir="rtl"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-xl font-black">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <HiXMark aria-hidden="true" className="size-5" />
        </button>
      </div>
      {children}
    </dialog>,
    document.body,
  );
};
