import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./components/Home/Home";
import Workshops from "./components/Workshops/Workshops.tsx";
import ComingSoon from "./components/ComingSoon/ComingSoon.tsx";
import Staff from "./components/Staff/Staff.tsx";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import FAQ from "./components/FAQ/FAQ.tsx";
import PaymentStatus from "./components/PaymentStatus/PaymentStatus.tsx";
import NotFound from "./components/notFound/NotFound.tsx";
import Edit from "./components/Dashboard/Edit/Edit.tsx";
import ProfileWorkshops from "./components/Dashboard/ProfileWorkshops/ProfileWorkshops.tsx";
import Billings from "./components/Dashboard/Billings/Billings.tsx";
import CartLayout from "./components/Dashboard/Cart/CartLayout.tsx";
import CartsList from "./components/Dashboard/Cart/pages/CartsList.tsx";
import CartPayment from "./components/Dashboard/Cart/pages/CartPayment.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "profile/*",
    element: <MainLayout />,
    children: [
      {
        path: "edit",
        element: <Edit />,
      },
      {
        path: "workshops",
        element: <ProfileWorkshops />,
      },
      {
        path: "billing",
        element: <Billings />,
      },
      {
        path: "cart",
        element: <CartLayout />,
        children: [
          {
            path: "list",
            element: <CartsList />,
          },
          {
            path: "checkout",
            element: <CartPayment />,
          },
        ],
      },
    ],
  },
  {
    path: "payment/success/:transactionID",
    element: <PaymentStatus successful />,
  },
  {
    path: "payment/fail/:transactionID",
    element: <PaymentStatus />,
  },
  {
    path: "workshops",
    element: <Workshops />,
  },
  {
    path: "login",
    element: <ComingSoon />,
  },
  {
    path: "signup",
    element: <ComingSoon />,
  },
  {
    path: "faq",
    element: <FAQ />,
  },
  {
    path: "staff",
    element: <Staff />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
