import { useEffect } from "react";
import CartItem from "../components/CartItem";
import Button from "../../../Common/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { useNavigate } from "react-router-dom";
import { selectCartItems } from "../../../../core/cart/cart.selector";
import Lottie from "lottie-react";
import shoppingCartLottie from "../../../../assets/lottie/shoppingCart.json";

const CartsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsList = useSelector(selectCartItems).filter((item) => item.payment_state !== "COMPLETED");

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
        {itemsList.length > 0 ? (
          itemsList.map(({ presentation }, index) => (
            <CartItem
              id={presentation.id}
              title={presentation?.en_title}
              price={presentation.cost}
              instructor={presentation.presenters
                .map((el) => `${el.first_name} ${el.last_name}`)
                .join(" و ")}
              currency="تومان"
              dateTime={new Date(presentation.start).toLocaleString("fa")}
              key={index}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Lottie animationData={shoppingCartLottie} className="max-h-80" />
            <p className="font-bold text-2xl mt-4">سبد خرید شما خالی است</p>
          </div>
        )}
      </div>
      {itemsList.length > 0 && <Button onClick={nextLevel}>مرحله بعد</Button>}
    </>
  );
};

export default CartsList;
