import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store";
import { selectIsAuthenticated } from "../../../core/auth/auth.selector";
import { selectItemInCartById } from "../../../core/cart/cart.selector";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
} from "../../../core/cart/cart.thunk";

const WorkshopCartAction = ({
  id,
  unavailable,
  featured,
}: {
  id: number;
  unavailable: boolean;
  featured: boolean;
}) => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(selectIsAuthenticated);
  const cartItem = useSelector(selectItemInCartById(id));
  const [pending, setPending] = useState(false);

  const updateCart = async () => {
    if (!authenticated) {
      toast.info("برای افزودن به سبد خرید باید وارد شوید");
      return;
    }
    setPending(true);
    try {
      const result = cartItem
        ? await dispatch(removeItemFromCartThunk(cartItem.id))
        : await dispatch(addItemToCartThunk(id));
      if (result.meta.requestStatus === "fulfilled")
        await dispatch(getCartThunk());
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={updateCart}
      disabled={pending || (unavailable && !cartItem)}
      aria-busy={pending}
      className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray ${featured ? "bg-secondary text-primary hover:bg-[#e58210]" : "bg-primary text-white hover:bg-dark-gray"}`}
    >
      {pending
        ? "در حال به‌روزرسانی…"
        : cartItem
          ? "حذف از سبد خرید"
          : unavailable
            ? "ثبت‌نام در دسترس نیست"
            : "اضافه به سبد خرید"}
    </button>
  );
};

export default WorkshopCartAction;
