import { useCallback } from "react";
import { sidebarData } from "../../constants";
import SidebarButton from "./SidebarButton";
import Logout from "../Common/icons/Logout";
import SidebarLogo from "../Common/icons/SidebarLogo";
import ArrowRight from "../Common/icons/ArrowRight";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleButtonClick = useCallback((path: string) => {
    navigate(path);
  }, []);

  return (
    <div
      className={`fixed md:relative top-0 right-0 min-h-full flex flex-col bg-bg-sidebar text-white p-5 w-64 space-y-4 transition-transform transform ${
        isOpen ? "translate-x-0 z-100" : "translate-x-full"
      } md:translate-x-0 md:block`}
    >
      <div className="flex flex-col justify-between h-full flex-1">
        <div className="flex flex-col items-center gap-[10px]">
          <div className="flex w-full justify-between items-center">
            <button onClick={toggleSidebar} className="p-2 md:hidden">
              <ArrowRight />
            </button>
            <SidebarLogo />
            <p
              onClick={() => navigate("/")}
              className="font-bold hover:opacity-60 transition-all cursor-pointer text-secondary"
            >
              لینوکس فست
            </p>
          </div>
          {sidebarData.map((button, index) => (
            <SidebarButton
              key={index}
              label={button.label}
              active={button.path === location.pathname}
              icon={button.icon}
              onClick={() => handleButtonClick(button.path)}
              className={clsx({
                ["hover:bg-[#7a1e2b]"]: button.path !== location.pathname,
              })}
            />
          ))}
        </div>
        <SidebarButton
          label="خروج"
          onClick={() => handleButtonClick("test")}
          icon={<Logout />}
          className="bg-red-800 mt-auto hover:bg-[#7a1e2b]"
        />
      </div>
    </div>
  );
};

export default Sidebar;
