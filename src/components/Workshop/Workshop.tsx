import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useAppDispatch } from "../../store";
import { selectCurrentPresentation } from "../../core/presentations/presentations.selector";
import { getPresentationByIDThunk } from "../../core/presentations/presentations.thunk";
import { selectIsItemPurchased, selectItemInCartById } from "../../core/cart/cart.selector";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
} from "../../core/cart/cart.thunk";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import WorkshopDetails from "./WorkshopDetails";

// Preserve the existing presenter component used by the presenters route.
export { PresenterCard } from "./PresenterCard";

const Workshop = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const presentation = useSelector(selectCurrentPresentation);
  const cartItem = useSelector(selectItemInCartById(Number(id)));
  const purchased = useSelector(selectIsItemPurchased(Number(id)));
  const authenticated = useSelector(selectIsAuthenticated);
  const [pending, setPending] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const validId = !!id && /^\d+$/.test(id) && Number(id) > 0;
  const current =
    validId && presentation && String(presentation.id) === id
      ? presentation
      : null;

  useEffect(() => {
    let active = true;
    setLoadError(false);
    if (validId && id) {
      dispatch(getPresentationByIDThunk(id)).then((result) => {
        if (active) setLoadError(result.meta.requestStatus === "rejected");
      });
    }
    return () => {
      active = false;
    };
  }, [dispatch, id, validId, retry]);

  useEffect(() => {
    if (authenticated) dispatch(getCartThunk());
  }, [dispatch, authenticated]);

  const updateCart = async () => {
    if (purchased || pending) return;
    if (!authenticated) {
      toast.info("برای افزودن به سبد خرید باید وارد شوید");
      return;
    }
    if (!current || pending) return;
    setPending(true);
    try {
      const result = cartItem
        ? await dispatch(removeItemFromCartThunk(cartItem.id))
        : await dispatch(addItemToCartThunk(current.id));
      if (result.meta.requestStatus === "fulfilled")
        await dispatch(getCartThunk());
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-dvh bg-text-white text-primary" dir="rtl">
      <Helmet>
        <title>
          لینوکس‌فست |{" "}
          {current?.fa_title || current?.en_title || "جزئیات ارائه"}
        </title>
        {current && (
          <meta
            name="description"
            content={current.fa_description.replace(/<[^>]*>/g, " ")}
          />
        )}
        {current && (
          <meta
            name="keywords"
            content={current.tags.map((tag) => tag.name).join(", ")}
          />
        )}
        <link rel="canonical" href={`https://linux-fest.ir/workshop/${id}`} />
        {current && (
          <meta
            property="og:title"
            content={`لینوکس‌فست | ${current.fa_title || current.en_title}`}
          />
        )}
        {current && (
          <meta
            property="og:description"
            content={current.fa_description.replace(/<[^>]*>/g, " ")}
          />
        )}
        <meta
          property="og:image"
          content={current?.morkopoloyor || "/favicon.ico"}
        />
        <meta property="og:site_name" content="لینوکس‌فست" />
      </Helmet>
      <Header />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
        <nav
          aria-label="مسیر صفحه"
          className="mb-6 flex items-center gap-2 text-sm text-dark-gray"
        >
          <Link
            to="/workshops"
            className="rounded-sm py-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            همه ارائه‌ها
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">جزئیات ارائه</span>
        </nav>
        {!validId || loadError ? (
          <section
            role="alert"
            className="rounded-xl bg-white px-6 py-16 text-center"
          >
            <h1 className="text-2xl font-black">
              {validId ? "دریافت ارائه انجام نشد." : "این ارائه پیدا نشد."}
            </h1>
            <p className="mt-3 text-sm leading-7 text-dark-gray">
              {validId
                ? "اتصال اینترنت را بررسی کن و دوباره تلاش کن."
                : "برای انتخاب ارائه، به فهرست ارائه‌ها برگرد."}
            </p>
            {validId && (
              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
                className="mt-6 min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                تلاش دوباره
              </button>
            )}
            <Link
              to="/workshops"
              className="mx-3 mt-6 inline-flex min-h-11 items-center rounded-lg px-4 font-bold text-dark-gray underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
            >
              بازگشت به ارائه‌ها
            </Link>
          </section>
        ) : current ? (
          <WorkshopDetails
            key={current.id}
            presentation={current}
            inCart={!!cartItem && !purchased}
            purchased={purchased}
            authenticated={authenticated}
            pending={pending}
            onUpdateCart={updateCart}
          />
        ) : (
          <div
            role="status"
            aria-label="در حال دریافت ارائه"
            className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
          >
            <div className="space-y-6" aria-hidden="true">
              <div className="h-64 rounded-xl bg-primary/10 motion-safe:animate-pulse" />
              <div className="h-52 rounded-xl bg-white motion-safe:animate-pulse" />
            </div>
            <div
              aria-hidden="true"
              className="h-96 rounded-xl bg-primary/10 motion-safe:animate-pulse"
            />
            <span className="sr-only">در حال دریافت ارائه…</span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Workshop;
