import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store";
import { selectIsAuthenticated } from "../../../core/auth/auth.selector";
import { selectCartState, selectIsItemPurchased, selectItemInCartById } from "../../../core/cart/cart.selector";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
  removeBundleFromCartThunk,
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
  const { bundles, loading, error } = useSelector(selectCartState);
  const bundleSelection = bundles.find(selection => selection.id === cartItem?.bundle_selection);
  const bundled = cartItem?.bundle_selection != null;
  const purchased = useSelector(selectIsItemPurchased(id));
  const [pending, setPending] = useState(false);

  const updateCart = async () => {
    if (purchased || pending || loading || error) return;
    if (bundled && !bundleSelection) {
      toast.info("برای حذف این برنامه، کل بسته را از سبد خرید حذف کنید.");
      return;
    }
    if (!authenticated) {
      toast.info("برای افزودن به سبد خرید باید وارد شوید");
      return;
    }
    setPending(true);
    try {
      const result = cartItem
        ? bundleSelection
          ? await dispatch(removeBundleFromCartThunk(bundleSelection.bundle.id))
          : await dispatch(removeItemFromCartThunk(cartItem.presentation.id))
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
      disabled={purchased || pending || loading || error || (unavailable && !cartItem)}
      aria-busy={pending}
      data-featured={featured}
      data-state={purchased ? "purchased" : cartItem ? "in-cart" : unavailable ? "unavailable" : "available"}
      className="presentation-cart-action mt-4 w-full rounded-lg px-4 py-3 text-sm font-extrabold transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray"
    >
      {purchased
        ? "خریداری شده"
        : pending
        ? "در حال به‌روزرسانی…"
        : cartItem
          ? bundled ? "حذف کل بسته از سبد خرید" : "حذف از سبد خرید"
          : unavailable
            ? "ثبت‌نام در دسترس نیست"
            : "اضافه به سبد خرید"}
    </button>
  );
};

export default WorkshopCartAction;
