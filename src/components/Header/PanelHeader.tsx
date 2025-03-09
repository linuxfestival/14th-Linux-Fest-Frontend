import Menu from "../Common/icons/Menu";
import SidebarLogo from "../Common/icons/SidebarLogo";
// import { Menu } from "lucide-react";

const PanelHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="w-full flex justify-between items-center h-16 bg-bg-sidebar text-white px-4 md:hidden">
      <button onClick={toggleSidebar} className="p-2">
        <Menu />
      </button>
      <div className="flex items-center gap-2 w-full justify-center">
        <SidebarLogo />
        <p className="font-bold text-xl">لینوکس فست</p>
      </div>
    </header>
  );
};

export default PanelHeader;
