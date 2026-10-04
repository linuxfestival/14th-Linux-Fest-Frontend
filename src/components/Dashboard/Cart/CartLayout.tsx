import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import { getCartThunk } from "../../../core/cart/cart.thunk";
import { DashboardLoading, DashboardPanel } from "../DashboardUI";
import { secondaryActionClass } from "../dashboard.styles";
const CartLayout = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [retry, setRetry] = useState(0);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    let active = true;
    void dispatch(getCartThunk()).then((result) => {
      if (active)
        setLoadState(getCartThunk.fulfilled.match(result) ? "ready" : "error");
    });
    return () => {
      active = false;
    };
  }, [dispatch, retry]);
  if (pathname === "/profile/cart")
    return <Navigate to="/profile/cart/list" replace />;
  const checkout = pathname.endsWith("checkout");
  return (
    <div className="space-y-7">
      <nav
        aria-label="مراحل خرید"
        className="flex flex-wrap items-center gap-4 border-b border-primary/15 pb-5 text-sm"
      >
        <Link
          to="/profile/cart/list"
          aria-current={!checkout ? "step" : undefined}
          className={`flex min-h-11 items-center gap-2 rounded-lg px-3 font-bold focus-visible:outline-2 focus-visible:outline-primary ${!checkout ? "bg-secondary/15 text-orange-ink" : "text-dark-gray"}`}
        >
          <span>۱</span>سبد خرید
        </Link>
        <span aria-hidden="true" className="text-primary/30">
          /
        </span>
        <span
          aria-current={checkout ? "step" : undefined}
          className={`rounded-lg px-3 py-3 font-bold ${checkout ? "bg-secondary/15 text-orange-ink" : "text-dark-gray"}`}
        >
          ۲. تکمیل خرید
        </span>
      </nav>
      {loadState === "loading" ? (
        <DashboardLoading />
      ) : loadState === "error" ? (
        <DashboardPanel>
          <p role="alert" className="text-sm text-ubuntu-red">
            دریافت سبد خرید ناموفق بود.
          </p>
          <button
            type="button"
            className={`${secondaryActionClass} mt-4`}
            onClick={() => {
              setLoadState("loading");
              setRetry((value) => value + 1);
            }}
          >
            تلاش دوباره
          </button>
        </DashboardPanel>
      ) : (
        <Outlet />
      )}
    </div>
  );
};
export default CartLayout;
