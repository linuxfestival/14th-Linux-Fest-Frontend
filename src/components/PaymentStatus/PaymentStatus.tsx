import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheckCircle,
  HiClipboardDocument,
  HiExclamationCircle,
  HiXCircle,
} from "react-icons/hi2";
import { useAppDispatch } from "../../store";
import { verifyPaymentThunk } from "../../core/payment/payment.thunk";
import type { VerifyPaymentResponse } from "../../core/payment/payment.dto";
import {
  actionClass,
  secondaryActionClass,
} from "../Dashboard/dashboard.styles";
import logo from "../../assets/logo.png";

type ResultState = "checking" | "success" | "failed" | "unknown" | "invalid";
const messages: Record<ResultState, { title: string; description: string }> = {
  checking: {
    title: "در حال بررسی پرداخت",
    description:
      "نتیجه تراکنش را از درگاه بررسی می‌کنیم. لطفاً تا مشخص شدن وضعیت، پرداخت دیگری انجام ندهید.",
  },
  success: {
    title: "پرداخت با موفقیت انجام شد",
    description:
      "تراکنش شما تأیید شد. برای مشاهده کارگاه‌ها و ارائه‌هایی که ثبت‌نام کرده‌اید، به حساب کاربری بروید.",
  },
  failed: {
    title: "پرداخت تکمیل نشد",
    description:
      "این پرداخت تأیید نشده است. می‌توانید به سبد خرید برگردید و انتخاب‌هایتان را بررسی کنید.",
  },
  unknown: {
    title: "نتیجه پرداخت هنوز مشخص نیست",
    description:
      "پیش از پرداخت دوباره، وضعیت تراکنش را در بخش پرداخت‌ها بررسی کنید.",
  },
  invalid: {
    title: "اطلاعات پرداخت کامل نیست",
    description:
      "این لینک اطلاعات معتبرِ بازگشت از درگاه را ندارد. برای بررسی تراکنش‌ها، به بخش پرداخت‌های حساب کاربری بروید.",
  },
};

const PaymentStatus = () => {
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const query = new URLSearchParams(search);
  const authority = query.get("Authority")?.trim() || "";
  const gatewayStatus = query.get("Status");
  const valid =
    !!authority && (gatewayStatus === "OK" || gatewayStatus === "NOK");
  const [attempt, setAttempt] = useState(0);
  const [verification, setVerification] = useState<{
    search: string;
    attempt: number;
    state: ResultState;
    response?: VerifyPaymentResponse;
  }>();
  const request = useRef<{
    authority: string;
    attempt: number;
    promise: ReturnType<ReturnType<typeof verifyPaymentThunk>>;
  }>();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    setCopyState("idle");
  }, [search]);

  useEffect(() => {
    if (!valid || gatewayStatus !== "OK") return;
    let active = true;
    // Reuse the in-flight request during StrictMode's effect replay.
    if (
      request.current?.authority !== authority ||
      request.current.attempt !== attempt
    ) {
      request.current = {
        authority,
        attempt,
        promise: dispatch(verifyPaymentThunk({ authority })),
      };
    }
    void request.current.promise.then((result) => {
      if (!active) return;
      if (verifyPaymentThunk.fulfilled.match(result)) {
        const response = result.payload;
        setVerification({
          search,
          attempt,
          response,
          state:
            response?.status === "success"
              ? "success"
              : response?.status === "failed"
                ? "failed"
                : "unknown",
        });
      } else {
        setVerification({ search, attempt, state: "unknown" });
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch, authority, gatewayStatus, valid, search, attempt]);

  const current =
    verification?.search === search && verification.attempt === attempt
      ? verification
      : undefined;
  const state: ResultState = !valid
    ? "invalid"
    : gatewayStatus === "NOK"
      ? "failed"
      : (current?.state ?? "checking");
  const { title, description } = messages[state];
  const success = state === "success";
  const checking = state === "checking";
  const uncertain = state === "unknown";
  const reference = success ? current?.response?.ref_id : undefined;
  const primaryPath = success
    ? "/profile/workshops"
    : state === "invalid"
      ? "/profile/billing"
      : "/profile/cart/list";
  const primaryLabel = success
    ? "مشاهده کارگاه‌های من"
    : state === "invalid"
      ? "مشاهده پرداخت‌ها"
      : "بازگشت به سبد خرید";

  const copyAuthority = async () => {
    try {
      await navigator.clipboard.writeText(authority);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <div
      className="flex min-h-dvh flex-col bg-text-white text-primary"
      dir="rtl"
    >
      <Helmet>
        <title>لینوکس‌فست | {title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-6 sm:px-8">
        <Link
          to="/"
          aria-label="صفحه اصلی لینوکس‌فست"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary">
            <img src={logo} alt="" className="size-9 object-contain" />
          </span>
          <span className="text-lg font-black">لینوکس‌فست</span>
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-bold text-dark-gray hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
        >
          بازگشت به خانه
          <HiArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 pb-10 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-xl border border-primary/15 bg-white lg:grid-cols-[1.25fr_1fr]">
          <section
            aria-labelledby="payment-title"
            aria-busy={checking}
            className="min-w-0 p-6 sm:p-10 lg:p-12"
          >
            <div aria-hidden="true" className="mb-6">
              {checking ? (
                <span className="block size-12 rounded-full border-4 border-primary/15 border-t-secondary motion-safe:animate-spin" />
              ) : success ? (
                <HiCheckCircle className="size-14 text-green-700" />
              ) : state === "failed" ? (
                <HiXCircle className="size-14 text-ubuntu-red" />
              ) : (
                <HiExclamationCircle className="size-14 text-orange-ink" />
              )}
            </div>
            <div role="status" aria-live="polite" aria-atomic="true">
              <h1
                id="payment-title"
                className="text-2xl font-black leading-relaxed sm:text-3xl"
              >
                {title}
              </h1>
              <p className="mt-3 max-w-prose text-sm leading-8 text-dark-gray">
                {description}
              </p>
            </div>
            {!checking && !success && state !== "invalid" && (
              <p className="mt-6 border-t border-primary/15 pt-5 text-xs leading-7 text-dark-gray">
                اگر مبلغی از حساب شما کسر شده، پیش از پرداخت دوباره وضعیت تراکنش
                را در بخش پرداخت‌ها بررسی کنید. شناسه تراکنش را برای پیگیری نگه
                دارید.
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:items-start">
              {checking ? (
                <p className="text-sm font-bold text-dark-gray">
                  لطفاً کمی صبر کنید…
                </p>
              ) : uncertain ? (
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                  className={actionClass}
                >
                  بررسی دوباره پرداخت
                  <HiArrowLeft aria-hidden="true" className="size-4" />
                </button>
              ) : (
                <Link to={primaryPath} className={actionClass}>
                  {primaryLabel}
                  <HiArrowLeft aria-hidden="true" className="size-4" />
                </Link>
              )}
              {!checking && !success && state !== "invalid" && (
                <Link to="/profile/billing" className={secondaryActionClass}>
                  مشاهده وضعیت در پرداخت‌های من
                </Link>
              )}
              {uncertain && (
                <Link
                  to="/profile/cart/list"
                  className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-dark-gray underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
                >
                  بازگشت به سبد خرید
                </Link>
              )}
              {success && (
                <Link to="/profile/billing" className={secondaryActionClass}>
                  مشاهده رسید پرداخت
                </Link>
              )}
            </div>
          </section>
          <aside
            aria-labelledby="transaction-title"
            className="min-w-0 bg-primary p-6 text-white sm:p-10"
          >
            <h2 id="transaction-title" className="text-xl font-bold">
              پیگیری تراکنش
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-gray">
              اطلاعات زیر را برای بررسی وضعیت پرداخت در اختیار داشته باشید.
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-xs text-text-gray">شناسه تراکنش درگاه</dt>
                <dd
                  className="mt-3 break-all rounded-lg bg-white/5 p-4 text-sm leading-7 text-white"
                  dir={authority ? "ltr" : "rtl"}
                >
                  {authority || "شناسه‌ای دریافت نشده است."}
                </dd>
              </div>
              {reference && (
                <div>
                  <dt className="text-xs text-text-gray">کد پیگیری پرداخت</dt>
                  <dd className="mt-2 break-all text-lg font-bold" dir="ltr">
                    {reference}
                  </dd>
                </div>
              )}
            </dl>
            {authority && (
              <button
                type="button"
                onClick={() => void copyAuthority()}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-indigo/40 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                <HiClipboardDocument aria-hidden="true" className="size-5" />
                {copyState === "copied" ? "شناسه کپی شد" : "کپی شناسه تراکنش"}
              </button>
            )}
            <p
              role="status"
              aria-live="polite"
              className="mt-2 min-h-6 text-xs leading-6 text-text-gray"
            >
              {copyState === "copied"
                ? "شناسه تراکنش در کلیپ‌بورد ذخیره شد."
                : copyState === "error"
                  ? "کپی خودکار انجام نشد؛ شناسه را انتخاب و کپی کنید."
                  : ""}
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentStatus;
