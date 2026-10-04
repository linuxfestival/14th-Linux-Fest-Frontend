import { Link, useLocation } from "react-router-dom";
import { HiArrowLeft, HiBars3 } from "react-icons/hi2";
import { dashboardNavigation } from "../sidebar/navigation";
const PanelHeader = ({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) => {
  const { pathname } = useLocation();
  const title =
    dashboardNavigation.find((item) => pathname.startsWith(item.path))?.label ??
    "حساب کاربری";
  return (
    <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-3 border-b border-primary/10 bg-white px-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="باز کردن منوی حساب کاربری"
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-navigation"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
        >
          <HiBars3 aria-hidden="true" className="size-6" />
        </button>
        <p className="truncate text-sm font-bold">
          <span className="hidden sm:inline">
            حساب کاربری{" "}
            <span aria-hidden="true" className="mx-2 text-primary/30">
              /
            </span>
          </span>
          <span className="text-dark-gray">{title}</span>
        </p>
      </div>
      <Link
        to="/workshops"
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold text-orange-ink hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-primary sm:text-sm"
      >
        ارائه‌ها
        <HiArrowLeft aria-hidden="true" className="size-4" />
      </Link>
    </header>
  );
};
export default PanelHeader;
