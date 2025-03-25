import React, { useEffect } from "react";
import CartItem from "./components/CartItem";
import Button from "../../Common/Button/Button";
import { useDispatch } from "react-redux";
import { cartActions, CartPage } from "../../../core/cart/cart.slice";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";

const CartLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-4xl font-bold mb-6">سبد خرید</h1>
      <Outlet />
    </div>
  );
};

export default CartLayout;
