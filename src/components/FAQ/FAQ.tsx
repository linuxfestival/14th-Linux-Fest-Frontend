import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { type RootState, useAppDispatch } from "../../store";
import { getFAQThunk } from "../../core/users/users.thunk";

const answerClass =
  "mt-3 max-w-prose break-words text-base leading-8 text-dark-gray [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:rounded-sm [&_a]:font-bold [&_a]:text-orange-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-primary [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-2 [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto";

const FAQ = () => {
  const dispatch = useAppDispatch();
  const faqs = useSelector((state: RootState) => state.users.faqs);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    void dispatch(getFAQThunk()).then(result => {
      if (active) {
        setLoadState(getFAQThunk.fulfilled.match(result) ? "ready" : "error");
      }
    });
    return () => { active = false; };
  }, [dispatch, retry]);

  return (
    <div className="min-h-dvh bg-text-white text-primary" dir="rtl">
      <Helmet>
        <title>لینوکس‌فست | سوالات متداول</title>
      </Helmet>
      <Header />
      <main className="mx-auto min-h-[70dvh] w-full max-w-4xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <h1 className="text-3xl font-black leading-snug sm:text-4xl">
          سوالات متداول
        </h1>
        <p className="mt-3 text-base leading-8 text-dark-gray">
          پاسخ پرسش‌های رایج درباره لینوکس‌فست.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-primary/15 bg-white sm:mt-10">
          {loadState === "loading" ? (
            <div role="status" aria-label="در حال دریافت سوالات">
              <span className="sr-only">در حال دریافت سوالات…</span>
              <div aria-hidden="true">
                {[0, 1, 2].map(index => (
                  <div key={index} className="space-y-4 border-b border-primary/15 p-6 last:border-b-0 sm:p-8">
                    <div className="h-5 w-2/3 rounded bg-primary/10 motion-safe:animate-pulse" />
                    <div className="h-4 w-full rounded bg-primary/5 motion-safe:animate-pulse" />
                    <div className="h-4 w-4/5 rounded bg-primary/5 motion-safe:animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : loadState === "error" ? (
            <div role="alert" className="p-6 sm:p-8">
              <p className="font-bold">دریافت سوالات انجام نشد.</p>
              <button
                type="button"
                onClick={() => { setLoadState("loading"); setRetry(value => value + 1); }}
                className="mt-4 min-h-11 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-primary hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                تلاش دوباره
              </button>
            </div>
          ) : faqs.length ? (
            faqs.map((faq, index) => (
              <article key={`${faq.question}-${index}`} className="border-b border-primary/15 p-6 last:border-b-0 sm:p-8">
                <h2 className="break-words text-lg font-bold leading-8 sm:text-xl">
                  {faq.question}
                </h2>
                <div className={answerClass} dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </article>
            ))
          ) : (
            <p className="p-6 text-sm leading-7 text-dark-gray sm:p-8">
              هنوز سوالی منتشر نشده است.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
