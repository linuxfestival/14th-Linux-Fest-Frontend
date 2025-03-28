import React, { useCallback } from "react";
import { GrTrash } from "react-icons/gr";
import { IoPerson, IoTime } from "react-icons/io5";
import { digitsToLatin } from "../../../../utils/digitsToPersian";
import { toLocalPrice } from "../../../../utils/toLocalPrice";
import { useSelector } from "react-redux";
import { selectItemInCartById } from "../../../../core/cart/cart.selector";
import {
  getCartThunk,
  removeItemFromCartThunk,
} from "../../../../core/cart/cart.thunk";
import { useAppDispatch } from "../../../../store";

interface CartItemProps {
  id: number;
  title: string;
  instructor: string;
  dateTime: string;
  price: number;
  currency: string;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  instructor,
  dateTime,
  price,
  currency,
}) => {
  const dispatch = useAppDispatch();
  const selectItemInCart = useSelector(selectItemInCartById(id));

  const removeFromCart = useCallback(async () => {
    if (!selectItemInCart) return;
    await dispatch(removeItemFromCartThunk(selectItemInCart?.id));
    await dispatch(getCartThunk());
  }, [dispatch, selectItemInCart]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full bg-[#2C2C2C] md:px-4 md:py-2 rounded-lg shadow-lg md:h-[100px] max-w-3/4">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
        className="block md:hidden lg:block min-w-1/6 min-h-[100px] md:min-w-1/4 h-full object-cover rounded-md"
      />
      <div className="flex flex-col justify-center items-start gap-1 w-full p-4">
        <h1 className="text-xl md:text-lg font-bold w-full md:w-max text-center">
          {title}
        </h1>
        <div className="flex flex-col md:flex-row gap-4"></div>
        <div className="flex items-center gap-1 text-text-gray mt-1 md:mt-0">
          <IoPerson />
          <p className="text-sm md:text-md">{instructor}</p>
        </div>
        <div className="flex items-center gap-1 text-text-gray">
          <IoTime />
          <p className="text-sm md:text-md" dir="ltr">
            {dateTime}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end w-full md:w-max px-4 pb-2 md:px-0 md:pb-0 min-w-max gap-5">
        <GrTrash
          size={16}
          onClick={removeFromCart}
          className="text-red-400 cursor-pointer"
        />
        <h1 className="text-3xl md:text-3xl lg:text-2xl font-bold">
          {digitsToLatin(toLocalPrice(price))}
          <span className="text-sm"> {currency}</span>
        </h1>
      </div>
    </div>
  );
};

export default CartItem;
