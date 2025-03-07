import { useCallback } from "react";
import { sidebarData } from "../../assets/constants";
import SidebarButton from "./SidebarButton";
import Logout from "../Common/icons/Logout";
import SidebarLogo from "../Common/icons/SidebarLogo";
import ArrowRight from "../Common/icons/ArrowRight";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const handleButtonClick = useCallback((action: string) => {
    console.log(`${action} clicked`);
  }, []);

  return (
    <div
      className={`fixed md:relative top-0 right-0 h-full bg-bg-sidebar text-white p-5 w-64 space-y-4 transition-transform transform ${
        isOpen ? "translate-x-0 z-100" : "translate-x-full"
      } md:translate-x-0 md:block`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex w-full justify-between items-center">
            <button onClick={toggleSidebar} className="p-2 md:hidden">
              <ArrowRight />
            </button>
            <SidebarLogo />
            <p className="font-bold">لینوکس فست</p>
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
    </div>
  );
};

export default Sidebar;
