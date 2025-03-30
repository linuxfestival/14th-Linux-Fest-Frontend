import React, { useEffect, useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { useGoftino } from "../hooks/useGoftino";

const MainLayout = () => {
  // useEffect(() => {
  //   const handleGoftinoReady = () => {
  //     //@ts-ignore
  //     const goftino = Goftino;

  //     console.log("salam be goftino");
  //     if (goftino) {
  //     }
  //   };

  //   window.addEventListener("goftino_ready", handleGoftinoReady);

  //   return () => {
  //     window.removeEventListener("goftino_ready", handleGoftinoReady);
  //   };
  // }, []);
  useGoftino();

  return <Outlet />;
};

export default MainLayout;
