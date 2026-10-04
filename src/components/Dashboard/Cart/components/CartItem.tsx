import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiCalendarDays, HiTrash, HiUser } from "react-icons/hi2";
import { useAppDispatch } from "../../../../store";
import {
  getCartThunk,
  removeItemFromCartThunk,
} from "../../../../core/cart/cart.thunk";
import { selectCartState } from "../../../../core/cart/cart.selector";
import fallback from "../../../../assets/images/terminal.png";

import { priceText } from "../../dashboard.styles";
const CartItem = ({
  id,
  title,
  instructor,
  dateTime,
  price,
  currency,
  image,
}: {
  id: number;
  title: string;
  instructor: string;
  dateTime: string;
  price: number;
  currency: string;
  image?: string;
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useSelector(selectCartState);
  const [removing, setRemoving] = useState(false);
  const remove = async () => {
    if (loading || removing) return;
    setRemoving(true);
    const result = await dispatch(removeItemFromCartThunk(id));
    if (removeItemFromCartThunk.fulfilled.match(result))
      await dispatch(getCartThunk());
    else toast.error("حذف ارائه ناموفق بود. دوباره تلاش کنید.");
    setRemoving(false);
  };
  return (
    <article className="min-w-0 rounded-xl border border-primary/15 bg-white p-5">
      <div className="flex items-start gap-4">
        <img
          src={image || fallback}
          alt=""
          onError={(event) => {
            event.currentTarget.src = fallback;
          }}
          className="hidden size-20 shrink-0 rounded-lg bg-indigo/15 object-contain sm:block"
        />
        <div className="min-w-0 flex-1">
          <Link
            to={`/workshop/${id}`}
            className="block break-words rounded-sm text-base font-bold leading-7 hover:text-orange-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            {title}
          </Link>
          <p className="mt-2 flex items-start gap-2 text-xs leading-6 text-dark-gray">
            <HiUser aria-hidden="true" className="mt-1 size-4 shrink-0" />
            {instructor || "ارائه‌دهنده اعلام نشده"}
          </p>
          <p className="mt-1 flex items-start gap-2 text-xs leading-6 text-dark-gray">
            <HiCalendarDays
              aria-hidden="true"
              className="mt-1 size-4 shrink-0"
            />
            {dateTime}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-3">
        <p className="text-lg font-bold">
          {priceText(price)}{" "}
          <span className="text-xs font-normal text-dark-gray">{currency}</span>
        </p>
        <button
          type="button"
          disabled={loading || removing}
          onClick={() => void remove()}
          aria-label={`حذف ${title} از سبد خرید`}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-bold text-ubuntu-red hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
        >
          <HiTrash aria-hidden="true" className="size-4" />
          {removing ? "در حال حذف…" : "حذف از سبد"}
        </button>
      </div>
    </article>
  );
};
export default CartItem;
