import Menu from "../Common/icons/Menu";
import SidebarLogo from "../Common/icons/SidebarLogo";
// import { Menu } from "lucide-react";

const PanelHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="w-full flex justify-between items-center h-16 bg-bg-secondary text-white px-4 md:hidden">
      <button onClick={toggleSidebar} className="p-2">
        <Menu />
      </button>
    </header>
  );
};

export default PanelHeader;
