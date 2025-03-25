import React, { useEffect } from "react";
import CartItem from "../components/CartItem";
import Button from "../../../Common/Button/Button";
import { useDispatch } from "react-redux";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { useNavigate } from "react-router-dom";

const CartsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
  });

  const nextLevel = () => {
    navigate("/profile/cart/checkout");
  };

  return (
    <>
      <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold mb-6">
        سبد خرید
      </h1>
      <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
      </div>
      <Button onClick={nextLevel}>مرحله بعد</Button>
    </>
  );
};

export default CartsList;
