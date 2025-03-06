import { useCallback } from "react";
import { sidebarData } from "../../assets/constants";
import SidebarButton from "./SidebarButton";
import Logout from "../Common/icons/Logout";

const Sidebar = () => {
  const handleButtonClick = useCallback((action: string) => {
    console.log(`${action} clicked`);
  }, []);

  return (
    <div className="flex flex-col items-stretch bg-gray-900 text-white p-5 w-64 space-y-4 h-full">
      {sidebarData.map((button, index) => (
        <SidebarButton
          key={index}
          label={button.label}
          icon={button.icon}
          onClick={() => handleButtonClick(button.path)}
          className={button.colorClass}
        />
      ))}
      <div>
        <SidebarButton
          label="Siktir"
          onClick={() => handleButtonClick("test")}
          icon={<Logout />}
          className="bg-[#9B2C3B] hover:bg-[#7a1e2b]"
        />
      </div>
    </div>
  );
};

export default Sidebar;
