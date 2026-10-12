import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BundlesList from "../WorkshopsList/components/BundlesList";
import { useAppDispatch } from "../../store";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import { getCartThunk } from "../../core/cart/cart.thunk";

const Bundles = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (authenticated) dispatch(getCartThunk());
  }, [dispatch, authenticated]);

  return (
    <>
      <main className="min-h-dvh bg-text-white text-primary" dir="rtl">
        <Header />
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-32 lg:px-10">
          <Link to="/workshops" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <HiArrowRight aria-hidden="true" className="size-4" />
            همه ارائه‌ها و کارگاه‌ها
          </Link>
          <header className="mb-10 border-b border-primary/15 pb-8 sm:mb-12 sm:pb-10">
            <h1 className="text-4xl font-black leading-snug sm:text-6xl lg:text-7xl"><span className="text-orange-ink">بسته‌ها</span></h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-dark-gray sm:text-base sm:leading-8">
              ارائه‌ها و کارگاه‌های داخل هر بسته رو ببین و با یک خرید، در همهٔ اون‌ها شرکت کن. برنامه‌ها، زمان برگزاری و قیمت هر بسته همین‌جا مشخصه.
            </p>
          </header>
          <h2 className="mb-6 text-2xl font-black sm:text-3xl">بسته‌ات رو انتخاب کن.</h2>
          <BundlesList />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Bundles;
