import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../../store";
import { getCartThunk } from "../../../core/cart/cart.thunk";
import RegisteredWorkshop from "./Components/RegisteredWorkshop";
import {
  DashboardEmpty,
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
} from "../DashboardUI";
import { secondaryActionClass } from "../dashboard.styles";
const ProfileWorkshops = () => {
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    void dispatch(getCartThunk()).then((result) => {
      if (active) {
        setReady(true);
        setError(!getCartThunk.fulfilled.match(result));
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch, retry]);
  const registered = items.filter((item) => item.payment_state === "COMPLETED");
  return (
    <DashboardPage
      title="کارگاه‌های من"
      description="ارائه‌هایی که ثبت‌نام و پرداختشان تکمیل شده، اینجا نمایش داده می‌شوند."
    >
      {loading || !ready ? (
        <DashboardLoading />
      ) : error ? (
        <DashboardPanel>
          <p role="alert" className="text-sm text-ubuntu-red">
            دریافت ارائه‌ها ناموفق بود.
          </p>
          <button
            type="button"
            className={`${secondaryActionClass} mt-4`}
            onClick={() => {
              setReady(false);
              setRetry((value) => value + 1);
            }}
          >
            تلاش دوباره
          </button>
        </DashboardPanel>
      ) : registered.length ? (
        <div className="grid gap-4">
          {registered.map(({ id, presentation }) => (
            <RegisteredWorkshop
              key={id}
              id={presentation.id}
              title={presentation.fa_title || presentation.en_title}
              time={new Date(presentation.start)}
              end={new Date(presentation.end)}
              image={presentation.morkopoloyor}
            />
          ))}
        </div>
      ) : (
        <DashboardPanel>
          <DashboardEmpty
            title="هنوز ارائه‌ای ثبت‌نام نکرده‌اید"
            description="ارائه‌های جشنواره را ببینید و کارگاه یا ارائه مورد علاقه‌تان را انتخاب کنید."
          />
        </DashboardPanel>
      )}
    </DashboardPage>
  );
};
export default ProfileWorkshops;
