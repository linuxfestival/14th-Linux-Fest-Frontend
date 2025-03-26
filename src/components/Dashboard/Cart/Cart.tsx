import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions, CartPage } from "../../../core/cart/cart.slice";
import { Outlet } from "react-router-dom";
import { getCartThunk } from "../../../core/cart/cart.thunk";
import { useAppDispatch } from "../../../store";

const CartLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
    dispatch(getCartThunk());
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-4xl font-bold mb-6">سبد خرید</h1>
      <Outlet />
    </div>
  );
};

export default CartLayout;
