import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Sidebar from "../components/sidebar/Sidebar";
import PanelHeader from "../components/PanelHeader/PanelHeader";
import { type RootState, useAppDispatch } from "../store";
import { getUserByPhoneThunk } from "../core/users/users.thunk";
const ProfileLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { userPhoneNumber, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  useEffect(() => {
    if (userPhoneNumber) {
      void dispatch(getUserByPhoneThunk(userPhoneNumber));
    }
  }, [dispatch, userPhoneNumber]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const close = () => {
      if (media.matches) setSidebarOpen(false);
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  if (!isAuthenticated && !Cookies.get("access_token"))
    return <Navigate to="/login" replace />;
  if (pathname === "/profile" || pathname === "/profile/")
    return <Navigate to="/profile/edit" replace />;
  return (
    <div className="min-h-dvh bg-text-white text-primary" dir="rtl">
      <a
        href="#dashboard-content"
        className="fixed top-3 right-3 z-50 -translate-y-20 rounded-lg bg-secondary px-4 py-3 font-bold focus:translate-y-0"
      >
        رفتن به محتوای صفحه
      </a>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
      />
      <div className="min-w-0 lg:mr-64">
        <PanelHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        <main
          id="dashboard-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl px-5 py-7 outline-none sm:px-8 sm:py-9 lg:px-10"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default ProfileLayout;
