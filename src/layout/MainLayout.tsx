import React, { useEffect, useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Outlet, useLocation } from "react-router-dom";
import { useGoftino } from "../hooks/useGoftino";

const MainLayout = () => {
  useGoftino();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
};

export default MainLayout;
