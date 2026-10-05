import { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiArrowRightOnRectangle, HiHome, HiXMark } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../store";
import { logout } from "../../core/auth/auth.slice";
import Logo from "../../assets/logo.png";
import { dashboardNavigation } from "./navigation";
const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.users.user);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen) {
      dialog?.close();
      return;
    }
    const elements = [document.documentElement, document.body];
    const overflow = elements.map((element) => element.style.overflow);
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    elements.forEach((element) => {
      element.style.overflow = "hidden";
    });
    return () => {
      dialog?.close();
      elements.forEach((element, index) => {
        element.style.overflow = overflow[index];
      });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);
  const content = (mobile: boolean) => (
    <div className="flex min-h-dvh flex-col p-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="mb-9 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-secondary"
        >
          <img src={Logo} alt="" className="size-10 object-contain" />
          <span className="text-lg font-black">لینوکس‌فست</span>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="بستن منوی حساب کاربری"
            className="flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-secondary"
          >
            <HiXMark aria-hidden="true" className="size-5" />
          </button>
        )}
      </div>
      <nav aria-label="حساب کاربری" className="space-y-2">
        {dashboardNavigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={mobile ? toggleSidebar : undefined}
            className={({ isActive }) =>
              `flex min-h-12 items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${isActive ? "bg-secondary text-primary" : "text-indigo hover:bg-white/10 hover:text-white"}`
            }
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-10">
        <div className="mb-4 border-b border-white/15 pb-5">
          <p className="break-words text-sm font-bold">
            {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
              "حساب کاربری"}
          </p>
          <p className="mt-1 break-all text-xs leading-6 text-indigo" dir="ltr">
            {user?.email}
          </p>
        </div>
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm text-indigo hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-secondary"
        >
          <HiHome aria-hidden="true" className="size-5" />
          بازگشت به خانه
        </Link>
        <button
          type="button"
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
          className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm text-indigo hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-secondary"
        >
          <HiArrowRightOnRectangle aria-hidden="true" className="size-5" />
          خروج از حساب
        </button>
      </div>
    </div>
  );
  return (
    <>
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 overflow-y-auto bg-primary text-white lg:block">
        {content(false)}
      </aside>
      <dialog
        ref={dialogRef}
        id="dashboard-navigation"
        aria-label="منوی حساب کاربری"
        onCancel={toggleSidebar}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-[85vw] max-w-80 overflow-y-auto overscroll-contain border-0 bg-primary p-0 text-white backdrop:bg-primary/60 lg:hidden"
      >
        {content(true)}
      </dialog>
    </>
  );
};
export default Sidebar;
