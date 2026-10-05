import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import Logo from "../../assets/logo.png";
import Terminal from "../../assets/images/pinguin.webp";

const AuthLayout = ({
  title,
  signup = false,
  description,
  children,
}: {
  title: string;
  signup?: boolean;
  description?: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex min-h-dvh flex-col bg-text-white text-primary" dir="rtl">
    <Helmet>
      <title>لینوکس‌فست | {title}</title>
    </Helmet>
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-8 sm:py-6">
      <Link
        to="/"
        aria-label="صفحه اصلی لینوکس‌فست"
        className="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3"
      >
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary">
          <img src={Logo} alt="" className="size-9 object-contain" />
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-8 sm:px-8 sm:pb-10">
      <div className="grid w-full overflow-hidden rounded-xl border border-primary/15 bg-white lg:grid-cols-[1.15fr_1fr]">
        <section
          aria-labelledby="auth-title"
          className="min-w-0 px-5 py-7 sm:px-10 sm:py-10 lg:px-12"
        >
          <h1 id="auth-title" className="text-3xl font-black leading-snug">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-dark-gray">
            {description ?? (
              <>
                {signup ? "حساب کاربری داری؟" : "هنوز حساب کاربری نداری؟"}{" "}
                <Link
                  to={signup ? "/login" : "/signup"}
                  className="rounded-sm font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {signup ? "وارد شو" : "ثبت‌نام کن"}
                </Link>
              </>
            )}
          </p>
          <div className="mt-7">{children}</div>
        </section>
        <aside className="hidden min-w-0 flex-col justify-between bg-primary p-10 text-white lg:flex">
          <div>
            <h2 className="text-3xl font-black leading-relaxed">
              به لینوکس‌فست <span className="text-secondary">خوش اومدی.</span>
            </h2>
          </div>
          <img
            src={Terminal}
            alt=""
            aria-hidden="true"
            className="my-8 h-48 w-full object-contain xl:h-56"
          />
          <Link
            to="/workshops"
            className="inline-flex min-h-11 w-fit items-center gap-3 rounded-lg py-3 text-sm font-bold text-indigo underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            اول ارائه‌ها را ببین
            <HiArrowLeft aria-hidden="true" className="size-4" />
          </Link>
        </aside>
      </div>
    </main>
  </div>
);

export default AuthLayout;
