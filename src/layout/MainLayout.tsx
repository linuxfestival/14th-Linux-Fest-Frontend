import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import PanelHeader from "../components/PanelHeader/PanelHeader.tsx";
import { RootState, useAppDispatch } from "../store.ts";
import { getUserByPhoneThunk } from "../core/users/users.thunk.ts";
import { useSelector } from "react-redux";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { userPhoneNumber } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("thingy in useeffect: ", userPhoneNumber);
    if (userPhoneNumber) dispatch(getUserByPhoneThunk(userPhoneNumber));
  }, [dispatch, userPhoneNumber]);

  return (
    <div className="flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => {
          setSidebarOpen(false);
        }}
      />
      <div className="w-full flex flex-col h-[100dvh]  justify-center items-center md:p-[80px]">
        <PanelHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col justify-center items-center bg-bg-secondary h-full p-6 md:rounded-lg py-10 w-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
