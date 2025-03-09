import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import Settings from "../components/dashboard/Settings";
import PanelHeader from "../components/Header/PanelHeader.tsx";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderMainSection = () => {
    switch (location.pathname) {
      case "/settings":
        return <Settings />;
    }
  };
  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />
      <div className="w-full flex flex-col">
        <PanelHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        {renderMainSection()}
      </div>
    </div>
  );
};

export default MainLayout;
