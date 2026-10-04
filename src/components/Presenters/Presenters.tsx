import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { HiArrowLeft, HiUsers } from "react-icons/hi2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { PresenterCard } from "./PresenterCard";
import { type RootState, useAppDispatch } from "../../store";
import { getAllPresentersThunk } from "../../core/presentations/presentations.thunk";

const Presenters = () => {
  const dispatch = useAppDispatch();
  const presenters = useSelector(
    (state: RootState) => state.presentation.presenters,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    dispatch(getAllPresentersThunk()).then((result) => {
      if (!active) return;
      setLoadError(result.meta.requestStatus === "rejected");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [dispatch, retry]);

  return (
    <div
      className="flex min-h-dvh flex-col bg-text-white text-primary"
      dir="rtl"
    >
      <Helmet>
        <title>لینوکس‌فست | ارائه‌دهندگان</title>
        <meta
          name="description"
          content="با ارائه‌دهندگان ارائه‌های لینوکس‌فست آشنا شوید."
        />
      </Helmet>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 border-b border-primary/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-snug sm:text-4xl">
              ارائه‌دهندگان
            </h1>
          </div>
          <Link
            to="/workshops"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-bold text-orange-ink underline-offset-4 hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            دیدن ارائه‌ها
            <HiArrowLeft aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {loading ? (
          <div role="status" aria-label="در حال دریافت ارائه‌دهندگان">
            <span className="sr-only">در حال دریافت ارائه‌دهندگان…</span>
            <div
              aria-hidden="true"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[0, 1, 2].map((value) => (
                <div
                  key={value}
                  className="overflow-hidden rounded-xl bg-white motion-safe:animate-pulse"
                >
                  <div className="h-48 bg-indigo/20" />
                  <div className="space-y-4 p-6">
                    <div className="h-6 w-2/3 rounded bg-primary/10" />
                    <div className="h-4 rounded bg-primary/10" />
                    <div className="h-4 w-3/4 rounded bg-primary/10" />
                    <div className="h-11 rounded bg-primary/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : loadError ? (
          <section
            role="alert"
            className="rounded-xl bg-white px-6 py-16 text-center"
          >
            <h2 className="text-xl font-extrabold">
              دریافت ارائه‌دهندگان انجام نشد.
            </h2>
            <p className="mt-3 text-sm leading-7 text-dark-gray">
              اتصال اینترنت را بررسی کن و دوباره تلاش کن.
            </p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-6 min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              تلاش دوباره
            </button>
          </section>
        ) : presenters?.length ? (
          <>
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {presenters.map((presenter, index) => (
                <PresenterCard
                  key={`${presenter.email}-${index}`}
                  avatar={presenter.avatar}
                  name={`${presenter.first_name} ${presenter.last_name}`}
                  description={presenter.description}
                  email={presenter.email}
                  linkedin={presenter.linkedin}
                />
              ))}
            </div>
          </>
        ) : (
          <section className="flex flex-col items-center rounded-xl bg-white px-6 py-16 text-center">
            <HiUsers
              aria-hidden="true"
              className="mb-5 size-10 text-dark-gray"
            />
            <h2 className="text-xl font-extrabold">
              ارائه‌دهندگان به‌زودی معرفی می‌شوند.
            </h2>
            <p className="mt-3 text-sm leading-7 text-dark-gray">
              برای آشنایی با ارائه‌ها، فهرست ارائه‌ها را ببین.
            </p>
            <Link
              to="/workshops"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              دیدن ارائه‌ها
              <HiArrowLeft aria-hidden="true" className="size-4" />
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Presenters;
