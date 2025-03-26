import React, { useEffect } from "react";
import { MdShoppingCart } from "react-icons/md";
import digitsToPersian from "../../../utils/digitsToPersian";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartItemsCount,
} from "../../../core/cart/cart.selector";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAppDispatch } from "../../../store";
import { getCartThunk } from "../../../core/cart/cart.thunk";

interface Props {
  className?: string;
}

const ShoppingCart = ({ className }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartItemsCount);

  useEffect(() => {
    dispatch(getCartThunk());
  }, []);

  return (
    <div
      className={clsx("relative cursor-pointer", className)}
      onClick={() => navigate("/profile/cart/list")}
    >
      <div className="absolute -top-2 -right-2 bg-secondary text-sm text-white rounded-full w-5 h-5 flex justify-center items-center m-0">
        {digitsToPersian(String(cartCount))}
      </div>
      <MdShoppingCart size={32} />
    </div>
  );
};

export default ShoppingCart;
