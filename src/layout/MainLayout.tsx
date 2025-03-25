import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Edit from "../components/Dashboard/Edit/Edit.tsx";
import PanelHeader from "../components/PanelHeader/PanelHeader.tsx";
import ProfileWorkshops from "../components/Dashboard/ProfileWorkshops/ProfileWorkshops.tsx";
import Billings from "../components/Dashboard/Billings/Billings.tsx";
import CartLayout from "../components/Dashboard/Cart/CartLayout.tsx";

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
      case "/profile/cart":
        return <CartLayout />;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />
      <div className="w-full flex flex-col h-[100dvh] justify-center items-center md:p-[80px]">
        <PanelHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col justify-center items-center bg-bg-secondary h-full p-6 md:rounded-lg py-10 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
