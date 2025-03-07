import { useCallback } from "react";
import { sidebarData } from "../../assets/constants";
import SidebarButton from "./SidebarButton";
import Logout from "../Common/icons/Logout";
import SidebarLogo from "../Common/icons/SidebarLogo";

const Sidebar = () => {
  const handleButtonClick = useCallback((action: string) => {
    console.log(`${action} clicked`);
  }, []);

  return (
    <div className="flex flex-col justify-between bg-bg-sidebar text-white p-5 w-64 space-y-4 h-[100vh]">
      <div className="flex flex-col items-center gap-[10px]">
        <div className="flex w-full justify-between items-center">
          <SidebarLogo />
          <p className="font-bold text-xl">لینوکس فست</p>
        </div>
        {sidebarData.map((button, index) => (
          <SidebarButton
            key={index}
            label={button.label}
            icon={button.icon}
            onClick={() => handleButtonClick(button.path)}
            className="hover:bg-secondary"
          />
        ))}
      </div>
      <SidebarButton
        label="Siktir"
        onClick={() => handleButtonClick("test")}
        icon={<Logout />}
        className="bg-secondary hover:bg-[#7a1e2b]"
      />
    </div>
  );
};

export default Sidebar;
