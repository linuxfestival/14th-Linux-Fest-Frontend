import React from "react";
import Logout from "../components/Common/icons/Logout";
import Camera from "../components/Common/icons/Camera.tsx";


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
    path: "test1",
  },
  {
    label: "سبد خرید",
    icon: <Logout />,
    path: "test2",
  },
  {
    label: "کارگاه ها",
    icon: <Logout />,
    path: "test3",
  },
];
