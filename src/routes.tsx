import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./components/Home/Home";
import Workshops from "./components/Workshops/Workshops.tsx";
import ComingSoon from "./components/ComingSoon/ComingSoon.tsx";
import Staff from "./components/Staff/Staff.tsx";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

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
    element: <ComingSoon />,
  },
  {
    path: "staff",
    element: <Staff />,
  },
]);

export default router;
