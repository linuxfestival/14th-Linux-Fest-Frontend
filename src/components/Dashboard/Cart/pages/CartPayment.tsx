import React, { useEffect } from "react";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import SelectableCard from "../components/SelectableCard";
import Button from "../../../Common/Button/Button";

const CartPayment = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Checkout));
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
        <h1 className="text-4xl font-bold mb-6 mt-4">محصول اضافه</h1>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full px-4">
          <SelectableCard
            title="عنوان"
            description="120 هزار تومان"
            active={false}
            image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
            onClick={() => {}}
          />
          <SelectableCard
            title="عنوان"
            description="120 هزار تومان"
            active={false}
            image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
            onClick={() => {}}
          />
          <SelectableCard
            title="عنوان"
            description="120 هزار تومان"
            active={false}
            image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
            onClick={() => {}}
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 mt-12">روش های پرداخت</h1>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full px-4">
          <SelectableCard
            title="پرداخت با زرین پال"
            active={false}
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Uj1aeKDQmxRlusgFJjEdbtg0ZwnN5XP0IA&s"
            onClick={() => {}}
          />
        </div>
      </div>
      <Button>پرداخت</Button>
    </>
  );
};

export default CartPayment;
