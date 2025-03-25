import React from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsAuthLoading,
} from "../core/auth/auth.selector";
import { Outlet } from "react-router-dom";
import NotFound from "../components/notFound/NotFound";
import loadingLottie from "../assets/lottie/loading.json";
import Lottie from "lottie-react";

const AuthLayout = () => {
  const loading = useSelector(selectIsAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh]">
        <Lottie animationData={loadingLottie} className="h-[200px]" />
        <h1 className="font-bold text-xl">در حال انتقال به صفحه مورد نظر</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default AuthLayout;
