import { HiCheckCircle, HiComputerDesktop, HiUserGroup } from "react-icons/hi2";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import { getCartThunk } from "../../core/cart/cart.thunk";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import WorkshopCartAction from "../WorkshopsList/components/WorkshopCartAction";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary";
const INSTALL_FEST_PRESENTATION_ID = 23;

const InstallFest = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (authenticated)
      void dispatch(getCartThunk({ suppressErrorToast: true }));
  }, [authenticated, dispatch]);

  return (
    <div className="min-h-dvh bg-text-white text-primary" dir="rtl">
      <section className="relative isolate overflow-hidden bg-primary text-text-white">
        <div className="pointer-events-none absolute -right-36 top-32 size-[30rem] rounded-full border-[42px] border-indigo/15" />
        <div className="pointer-events-none absolute -bottom-52 -left-36 size-[34rem] rounded-full border-[52px] border-secondary/10" />
        <Header landing />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-10 sm:px-8 sm:pb-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-20 lg:px-10 lg:pt-16">
          <div className="text-right">
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-[-.035em] text-white sm:text-7xl lg:text-[5.5rem]">
              با هم
              <br />
              <span className="text-secondary">لینوکس نصب کنیم.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#d7e8fa] sm:text-xl">
              <bdi lang="en">Install Fest</bdi> یه دورهمیه برای اینکه لپ‌تاپت رو
              بیاری، سؤال‌هات رو بپرسی و اگر خواستی، لینوکس رو با کمک هم نصب
              کنیم. چه تازه‌کاری، چه قبلاً با لینوکس کار کردی، ما اینجا
              منتظرتیم.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WorkshopCartAction
                id={INSTALL_FEST_PRESENTATION_ID}
                unavailable={false}
                featured={false}
                labels={{
                  add: "افزودن Install Fest به سبد خرید",
                  purchased: "ثبت‌نام شده",
                }}
                className="!mt-0 !w-full !rounded-2xl !bg-secondary !px-6 !py-4 !text-primary hover:!bg-[#e58210] sm:!w-auto"
              />
              <a
                className={`inline-flex min-h-12 items-center justify-center font-bold text-white underline decoration-secondary decoration-2 underline-offset-8 hover:text-secondary ${focus}`}
                href="#ready"
              >
                قبلش چی کار کنم؟
              </a>
            </div>
            <p id="registration-note" className="mt-3 text-sm text-indigo">
              شرکت توی <bdi lang="en">Install Fest</bdi> رایگانه، ولی برای ورود
              باید ثبت‌نام کنی.
            </p>
          </div>

          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            dir="ltr"
            aria-label="Install Fest event details"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-indigo/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl bg-[#071b45] shadow-[0_24px_60px_rgba(0,0,0,.28)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                <span className="size-3 rounded-full bg-[#f66b61]" />
                <span className="size-3 rounded-full bg-secondary" />
                <span className="size-3 rounded-full bg-indigo" />
                <span className="ms-2 text-sm text-[#c9dcf0]">
                  install-fest.sh
                </span>
              </div>
              <div className="space-y-5 px-6 py-7 text-left font-mono text-sm leading-7 sm:px-8 sm:py-9">
                <p className="text-secondary">$ cat install-fest.txt</p>
                <div className="border-y border-white/10 py-5 text-[#e6efff]">
                  <p>
                    <span className="text-indigo">event:</span> Install Fest
                  </p>
                  <p>
                    <span className="text-indigo">when:</span> Wed, 22 Mehr ·
                    17:30–20:30
                  </p>
                  <p>
                    <span className="text-indigo">where:</span> Amirkabir
                    University
                  </p>
                  <p className="ps-[4.5rem]">CE Industry Building</p>
                  <p>
                    <span className="text-indigo">entry:</span> free · all
                    levels welcome
                  </p>
                  <p>
                    <span className="text-indigo">registration:</span> required
                  </p>
                </div>
                <p className="text-indigo">
                  $ see you there
                  <span className="terminal-cursor text-secondary">_</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-18 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-28">
          <h2 className="text-4xl font-black leading-tight tracking-[-.03em] sm:text-5xl">
            توی <bdi lang="en">Install Fest</bdi> چه کار می‌کنیم؟
          </h2>
          <div className="max-w-2xl text-lg leading-9 text-dark-gray">
            <p>
              می‌خوای لینوکس رو امتحان کنی، ولی نمی‌دونی از کجا شروع کنی؟ یا
              مدت‌هاست باهاش کار می‌کنی و دلت می‌خواد تجربه‌ات رو با بقیه درمیون
              بذاری؟ هر دو اینجا خوش اومدین.
            </p>
            <p className="mt-5">
              اول یه ارائه کوتاه داریم تا راه‌های نصب رو مرور کنیم. بعدش با هم
              درباره توزیع‌ها گپ می‌زنیم و هر کس خواست، لینوکس رو روی VM، دوئال
              بوت یا به روش مناسب لپ‌تاپش نصب می‌کنه.
            </p>
          </div>
        </section>

        <section
          id="everyone"
          className="relative isolate overflow-hidden bg-primary px-6 py-18 text-text-white sm:px-8 lg:px-10 lg:py-28"
        >
          <div className="pointer-events-none absolute -left-24 top-0 size-[28rem] rounded-full border-[38px] border-indigo/15" />
          <div className="pointer-events-none absolute -bottom-48 right-[15%] size-[32rem] rounded-full border-[44px] border-secondary/10" />
          <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
            <div>
              <h2 className="max-w-lg text-4xl font-black leading-tight tracking-[-.03em] sm:text-5xl">
                هر کسی یه جایی از مسیر لینوکسه.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-9 text-[#d7e8fa]">
                مهم نیست تا امروز چقدر با لینوکس سر و کار داشتی؛ این دورهمی
                جاییه برای شروع کردن، انتخاب کردن و کمک کردن به هم.
              </p>
            </div>

            <div className="border-t border-indigo/30">
              <article className="grid gap-5 border-b border-indigo/30 py-7 sm:grid-cols-[4rem_1fr] sm:gap-7">
                <HiComputerDesktop
                  aria-hidden="true"
                  className="size-10 text-secondary"
                />
                <div>
                  <h3 className="text-2xl font-black">
                    بار اوله که میای سمت لینوکس
                  </h3>
                  <p className="mt-2 max-w-xl leading-8 text-[#d7e8fa]">
                    لازم نیست از قبل چیزی بلد باشی. از قدم اول با هم جلو می‌ریم.
                  </p>
                </div>
              </article>
              <article className="grid gap-5 border-b border-indigo/30 py-7 sm:grid-cols-[4rem_1fr] sm:gap-7">
                <HiUserGroup
                  aria-hidden="true"
                  className="size-10 text-secondary"
                />
                <div>
                  <h3 className="text-2xl font-black">
                    می‌خوای ببینی کدوم توزیع به کارت میاد
                  </h3>
                  <p className="mt-2 max-w-xl leading-8 text-[#d7e8fa]">
                    درباره گزینه‌ها گپ می‌زنیم تا انتخاب‌کردن برات ساده‌تر بشه.
                  </p>
                </div>
              </article>
              <article className="grid gap-5 py-7 sm:grid-cols-[4rem_1fr] sm:gap-7">
                <HiCheckCircle
                  aria-hidden="true"
                  className="size-10 text-secondary"
                />
                <div>
                  <h3 className="text-2xl font-black">
                    قبلاً با لینوکس کار کردی
                  </h3>
                  <p className="mt-2 max-w-xl leading-8 text-[#d7e8fa]">
                    تجربه‌ات می‌تونه گره کار یکی دیگه رو باز کنه. بیا گپ بزنیم و
                    از هم یاد بگیریم.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="ready"
          className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-18 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:items-start lg:gap-20 lg:px-10 lg:py-28"
        >
          <div>
            <h2 className="text-4xl font-black leading-tight tracking-[-.03em] sm:text-5xl">
              قبلش یه نگاه بنداز.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-9 text-dark-gray">
              برای کسایی که تازه شروع می‌کنن، یه هندبوک داریم که کمک می‌کنه
              توزیع مناسب‌تری انتخاب کنی و بدونی قبل از نصب چه چیزهایی لازمه.
              لازم نیست همه‌چیز رو از قبل بلد باشی.
            </p>
          </div>
          <aside className="rounded-2xl bg-primary p-6 text-text-white shadow-[0_18px_38px_rgba(11,13,49,.18)] sm:p-8">
            <p className="text-2xl font-black">
              قبل از <bdi lang="en">Install Fest</bdi>
            </p>
            <ul className="mt-5 space-y-4 leading-8 text-[#d7e8fa]">
              <li className="flex gap-3">
                <HiCheckCircle
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-secondary"
                />
                از فایل‌های مهمت بکاپ بگیر.
              </li>
              <li className="flex gap-3">
                <HiCheckCircle
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-secondary"
                />
                هندبوک رو بخون تا انتخاب توزیع برات راحت‌تر بشه.
              </li>
              <li className="flex gap-3">
                <HiCheckCircle
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-secondary"
                />
                لپ‌تاپ و شارژرت رو با خودت بیار.
              </li>
            </ul>
          </aside>
        </section>

        <section className="bg-secondary px-6 py-16 text-primary sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                لینوکس بهونه‌ست؛
                <br />
                از هم یاد می‌گیریم و دوست پیدا می‌کنیم.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8">
                رایگانه و همه می‌تونن بیان.
              </p>
            </div>
            <WorkshopCartAction
              id={INSTALL_FEST_PRESENTATION_ID}
              unavailable={false}
              featured={false}
              labels={{
                add: "افزودن Install Fest به سبد خرید",
                purchased: "ثبت‌نام شده",
              }}
              className="!mt-0 !w-full !rounded-2xl !bg-primary !px-6 !py-4 !text-white hover:!bg-[#081a40] sm:!w-auto"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InstallFest;
