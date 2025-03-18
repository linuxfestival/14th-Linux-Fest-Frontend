import React from "react";
import Camera from "./components/Common/icons/Camera.tsx";
import { GrCreditCard, GrWorkshop } from "react-icons/gr";
import { MdOutlineSupportAgent } from "react-icons/md";

type SidebarButtonType = {
  label: string;
  icon: React.ReactElement;
  path: string;
  colorClass?: string;
};

export const sidebarData: SidebarButtonType[] = [
  {
    label: "اطلاعات شخصی",
    icon: <Camera />,
    path: "/profile/edit",
  },
  {
    label: "کارگاه های من",
    icon: <GrWorkshop size={24} />,
    path: "/profile/workshops",
  },
  {
    label: "پرداخت ها",
    icon: <GrCreditCard size={24} />,
    path: "/profile/billing",
  },
  {
    label: "پشتیبانی",
    icon: <MdOutlineSupportAgent size={24} />,
    path: "/profile/support",
  },
];
