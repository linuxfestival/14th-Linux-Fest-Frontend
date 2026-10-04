import { HiClipboardDocument } from "react-icons/hi2";
import type { PaymentDto } from "../../../../core/payment/payment.dto";
import { DashboardDialog, PaymentBadge } from "../../DashboardUI";
import {
  dateText,
  priceText,
  secondaryActionClass,
} from "../../dashboard.styles";
const BillingModal = ({
  payment,
  onClose,
  onCopy,
}: {
  payment: PaymentDto;
  onClose: () => void;
  onCopy: (id: string) => void;
}) => (
  <DashboardDialog title="رسید پرداخت" onClose={onClose}>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 pb-5">
      <p className="text-2xl font-black">
        {priceText(payment.total_price)}{" "}
        <span className="text-sm font-normal">تومان</span>
      </p>
      <PaymentBadge state={payment.payment_state} />
    </div>
    <dl className="mt-5 space-y-4 text-sm">
      <div>
        <dt className="text-xs text-dark-gray">زمان پرداخت</dt>
        <dd className="mt-1 leading-7">{dateText(payment.created_date)}</dd>
      </div>
      <div>
        <dt className="text-xs text-dark-gray">شناسه تراکنش</dt>
        <dd
          className="mt-2 break-all rounded-lg bg-text-white p-3 text-xs leading-6"
          dir="ltr"
        >
          {payment.authority || "—"}
        </dd>
      </div>
    </dl>
    <button
      type="button"
      disabled={!payment.authority}
      onClick={() => onCopy(payment.authority)}
      className={`${secondaryActionClass} mt-3`}
    >
      <HiClipboardDocument aria-hidden="true" className="size-4" />
      کپی شناسه
    </button>
    <h3 className="mt-6 border-t border-primary/15 pt-5 text-sm font-bold">
      ارائه‌های این پرداخت
    </h3>
    <ul className="mt-3 space-y-2 text-sm leading-7">
      {payment.participations.map((item) => (
        <li key={item.id}>
          {item.presentation.fa_title || item.presentation.en_title}
        </li>
      ))}
      {!payment.participations.length && (
        <li className="text-dark-gray">ارائه‌ای در این رسید ثبت نشده است.</li>
      )}
    </ul>
  </DashboardDialog>
);
export default BillingModal;
