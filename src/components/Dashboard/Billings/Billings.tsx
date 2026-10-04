import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiArrowLeft, HiDocumentText } from "react-icons/hi2";
import { type RootState, useAppDispatch } from "../../../store";
import { getPaymentListThunk } from "../../../core/payment/payment.thunk";
import type { PaymentDto } from "../../../core/payment/payment.dto";
import BillingModal from "./components/BillingModal";
import {
  DashboardEmpty,
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
  PaymentBadge,
} from "../DashboardUI";
import { dateText, priceText, secondaryActionClass } from "../dashboard.styles";
const Billings = () => {
  const dispatch = useAppDispatch();
  const { payments, loading, error } = useSelector(
    (state: RootState) => state.payment,
  );
  const [selected, setSelected] = useState<PaymentDto | null>(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    void dispatch(getPaymentListThunk());
  }, [dispatch]);
  const pages = Math.max(1, Math.ceil(payments.length / 5));
  const currentPage = Math.min(page, pages);
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.info("شناسه تراکنش کپی شد.");
    } catch {
      toast.error("کپی انجام نشد؛ شناسه را دستی کپی کنید.");
    }
  };
  return (
    <DashboardPage
      title="پرداخت‌ها"
      description="وضعیت پرداخت‌ها و رسید خریدهای خود را بررسی کنید."
    >
      {loading ? (
        <DashboardLoading />
      ) : error ? (
        <DashboardPanel>
          <p role="alert" className="text-sm text-ubuntu-red">
            دریافت پرداخت‌ها ناموفق بود.
          </p>
          <button
            type="button"
            className={`${secondaryActionClass} mt-4`}
            onClick={() => void dispatch(getPaymentListThunk())}
          >
            تلاش دوباره
          </button>
        </DashboardPanel>
      ) : payments.length === 0 ? (
        <DashboardPanel>
          <DashboardEmpty
            title="هنوز پرداختی ثبت نشده"
            description="پس از خرید، وضعیت پرداخت و جزئیات رسید در این بخش در دسترس خواهد بود."
          />
        </DashboardPanel>
      ) : (
        <>
          <div className="space-y-3">
            {payments
              .slice((currentPage - 1) * 5, currentPage * 5)
              .map((payment) => (
                <button
                  type="button"
                  key={payment.id}
                  onClick={() => setSelected(payment)}
                  className="flex w-full flex-wrap items-center gap-4 rounded-xl border border-primary/15 bg-white p-5 text-right hover:border-primary/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo/15 text-dark-gray">
                    <HiDocumentText aria-hidden="true" className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold">
                      {priceText(payment.total_price)}{" "}
                      <span className="text-xs font-normal">تومان</span>
                    </span>
                    <span className="mt-1 block text-xs leading-6 text-dark-gray">
                      {dateText(payment.created_date)}
                    </span>
                  </span>
                  <PaymentBadge state={payment.payment_state} />
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-ink">
                    مشاهده رسید
                    <HiArrowLeft aria-hidden="true" className="size-4" />
                  </span>
                </button>
              ))}
          </div>
          <nav
            aria-label="صفحه‌بندی پرداخت‌ها"
            className="flex items-center justify-center gap-4"
          >
            <button
              type="button"
              className={secondaryActionClass}
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              قبلی
            </button>
            <span className="text-xs text-dark-gray">
              {priceText(currentPage)} از {priceText(pages)}
            </span>
            <button
              type="button"
              className={secondaryActionClass}
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              بعدی
            </button>
          </nav>
        </>
      )}
      {selected && (
        <BillingModal
          payment={selected}
          onClose={() => setSelected(null)}
          onCopy={(value) => void copy(value)}
        />
      )}
    </DashboardPage>
  );
};
export default Billings;
