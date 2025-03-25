import React from "react";
import { MdShoppingCart } from "react-icons/md";
import digitsToPersian from "../../../utils/digitsToPersian";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../../core/cart/cart.selector";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface Props {
  className?: string;
}

const ShoppingCart = ({ className }: Props) => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartCount = cartItems.length > 9 ? "9+" : String(cartItems.length);

  return (
    <div
      className={clsx("relative cursor-pointer", className)}
      onClick={() => navigate("/profile/cart/list")}
    >
      <div className="absolute -top-2 -right-2 bg-secondary text-sm text-white rounded-full w-5 h-5 flex justify-center items-center m-0">
        {digitsToPersian(cartCount)}
      </div>
      <MdShoppingCart size={32} />
    </div>
  );
};

export default ShoppingCart;
