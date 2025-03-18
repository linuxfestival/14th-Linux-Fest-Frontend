import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import Edit from "../components/Dashboard/Edit/Edit.tsx";
import PanelHeader from "../components/Header/PanelHeader.tsx";
import ProfileWorkshops from "../components/Dashboard/ProfileWorkshops/ProfileWorkshops.tsx";
import Billings from "../components/Dashboard/Billings/Billings.tsx";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderMainSection = () => {
    switch (location.pathname) {
      case "/profile/edit":
        return <Edit />;
      case "/profile/workshops":
        return <ProfileWorkshops />;
      case "/profile/billing":
        return <Billings />;
    }
  };
  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />
      <div className="w-full flex flex-col h-[100dvh] justify-center items-center p-[80px]">
        <PanelHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col justify-center items-center bg-bg-secondary h-full p-6 md:rounded-lg py-10 w-full">
          {renderMainSection()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
