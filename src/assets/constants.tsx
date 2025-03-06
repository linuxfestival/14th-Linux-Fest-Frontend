import React from "react";
import Logout from "../components/Common/icons/Logout";


type SidebarButtonType = {
  label: string;
  icon: React.ReactElement;
  path: string;
  colorClass: string;
};

export const sidebarData: SidebarButtonType[] = [
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test1",
    colorClass: "bg-[#9B2C3B] hover:bg-[#7a1e2b]",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test2",
    colorClass: "bg-[#9B2C3B] hover:bg-[#7a1e2b]",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test3",
    colorClass: "bg-[#9B2C3B] hover:bg-[#7a1e2b]",
  },
  {
    label: "متن پیشفرض",
    icon: <Logout />,
    path: "test4",
    colorClass: "bg-[#9B2C3B] hover:bg-[#7a1e2b]",
  },
  // {
  //   label: "متن پیشفرض",
  //   icon: <Logout />,
  //   path: "test5",
  //   colorClass: "bg-[#E53E3E] hover:bg-[#c53030]",
  // },
];
