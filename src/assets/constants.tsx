import React from "react";
import Logout from "../components/Common/icons/Logout";


type SidebarButtonType = {
  label: string;
  icon: React.ReactElement;
  path: string;
  colorClass?: string;
};

export const sidebarData: SidebarButtonType[] = [
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test1",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test2",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test3",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test4",
  },
];
