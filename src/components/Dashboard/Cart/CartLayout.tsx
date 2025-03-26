import { useDispatch, useSelector } from "react-redux";
import { CartSteps } from "../../../core/cart/cart.slice";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { selectCartStep } from "../../../core/cart/cart.selector";

const CartLayout = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCartStep);
  const { pathname } = useLocation();

  if (pathname === "/profile/cart") {
    return <Navigate to="/profile/cart/list" />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <div className="w-3/4">
        <Breadcrumb steps={CartSteps} currentStep={currentStep} />
      </div>
      <Outlet />
    </div>
  );
};

export default CartLayout;
