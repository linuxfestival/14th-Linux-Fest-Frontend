import { useEffect } from "react";
import { MdShoppingCart } from "react-icons/md";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import { useSelector } from "react-redux";
import { selectCartItemsCount } from "../../../core/cart/cart.selector";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useAppDispatch } from "../../../store";
import { getCartThunk } from "../../../core/cart/cart.thunk";

interface Props {
  className?: string;
}

const ShoppingCart = ({ className }: Props) => {
  const dispatch = useAppDispatch();
  const cartCount = useSelector(selectCartItemsCount);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  return (
    <Link
      to="/profile/cart/list"
      aria-label={`سبد خرید، ${digitsToPersian(String(cartCount))} ارائه`}
      className={clsx(
        "relative inline-flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -top-1 -right-1 bg-secondary text-xs font-bold text-primary rounded-full min-w-5 h-5 px-1 flex justify-center items-center m-0"
      >
        {digitsToPersian(String(cartCount))}
      </div>
      <MdShoppingCart size={24} aria-hidden="true" />
    </Link>
  );
};

export default ShoppingCart;
