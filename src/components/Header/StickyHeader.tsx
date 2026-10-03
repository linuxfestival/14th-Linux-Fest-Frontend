import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiArrowLeft, HiBars3, HiXMark, HiUser } from "react-icons/hi2";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import ShoppingCart from "./components/ShoppingCart";
import logo from "../../assets/logo.png";

const navigation = [
  { to: "/", label: "خانه" },
  { to: "/workshops", label: "ارائه‌ها" },
  { to: "/presenters", label: "ارائه‌دهندگان" },
  { to: "/faq", label: "سوالات متداول" },
  { to: "/staff", label: "دست‌اندرکاران" },
];
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary";
const signupClass = `min-h-11 items-center justify-center rounded-lg bg-secondary px-5 text-sm font-extrabold text-primary transition-colors hover:bg-[#e58210] ${focus}`;

const StickyHeader = ({ sticky = true }: { sticky?: boolean }) => {
  const authenticated = useSelector(selectIsAuthenticated);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const wideScreen = window.matchMedia("(min-width: 1024px)");
    const close = () => setOpen(false);
    wideScreen.addEventListener("change", close);
    return () => wideScreen.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const frame = requestAnimationFrame(() =>
      (
        menu.current?.querySelector<HTMLAnchorElement>(
          'a[aria-current="page"]',
        ) ?? menu.current?.querySelector<HTMLAnchorElement>("a")
      )?.focus(),
    );
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header
      ref={header}
      dir="rtl"
      aria-label="سربرگ سایت"
      onBlur={(event) => {
        if (
          open &&
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget as Node)
        )
          setOpen(false);
      }}
      className={`${sticky ? "fixed" : "absolute"} inset-x-0 top-0 z-50 text-text-white sm:inset-x-6 sm:top-4 lg:inset-x-8`}
    >
      <div className="mx-auto max-w-7xl bg-primary shadow-[0_8px_28px_rgba(11,13,49,0.16)] sm:rounded-xl">
        <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-6 lg:gap-6">
          <Link
            to="/"
            aria-label="صفحه اصلی لینوکس‌فست"
            className={`flex shrink-0 items-center gap-2 rounded-md ${focus}`}
          >
            <img
              src={logo}
              width={40}
              height={40}
              className="size-10 object-contain"
              alt="نشان لینوکس‌فست"
            />
            <span className="text-lg font-black sm:text-xl">لینوکس‌فست</span>
          </Link>
          <nav
            aria-label="ناوبری اصلی"
            className="hidden items-center gap-1 lg:flex xl:gap-3"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-3 text-sm font-medium transition-colors ${focus} ${isActive ? "bg-white/5 text-secondary after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-secondary" : "text-text-gray hover:bg-white/5 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {authenticated ? (
              <>
                <ShoppingCart className="mx-1" />
                <Link
                  to="/profile/edit"
                  aria-label="حساب کاربری"
                  className={`hidden size-11 items-center justify-center rounded-lg text-text-gray hover:bg-white/10 hover:text-white sm:inline-flex ${focus}`}
                >
                  <HiUser className="size-5" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden min-h-11 items-center rounded-lg px-3 text-sm font-bold text-text-gray hover:bg-white/5 hover:text-white sm:inline-flex ${focus}`}
                >
                  ورود
                </Link>
                <Link
                  to="/signup"
                  className={`hidden lg:inline-flex ${signupClass}`}
                >
                  ثبت نام
                </Link>
              </>
            )}
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              aria-expanded={open}
              aria-controls="sticky-mobile-navigation"
              className={`inline-flex size-11 items-center justify-center rounded-lg text-indigo hover:bg-white/10 lg:hidden ${focus}`}
            >
              {open ? (
                <HiXMark className="size-6" aria-hidden="true" />
              ) : (
                <HiBars3 className="size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {open && (
          <div
            ref={menu}
            id="sticky-mobile-navigation"
            className="max-h-[calc(100dvh-7rem)] overflow-y-auto border-t border-indigo/20 px-5 pb-5 pt-3 lg:hidden"
          >
            <nav aria-label="ناوبری موبایل" className="flex flex-col gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => {
                    setOpen(false);
                    toggle.current?.focus();
                  }}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center justify-between rounded-lg px-3 py-3 text-base font-bold ${focus} ${isActive ? "bg-white/5 text-secondary" : "text-text-gray hover:bg-white/5 hover:text-white"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <HiArrowLeft className="size-5" aria-hidden="true" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            {authenticated && (
              <Link
                to="/profile/edit"
                onClick={() => setOpen(false)}
                className={`mt-4 flex min-h-12 items-center gap-3 border-t border-indigo/20 px-3 pt-4 text-sm font-bold text-indigo ${focus}`}
              >
                <HiUser className="size-5" aria-hidden="true" />
                حساب کاربری
              </Link>
            )}
            {!authenticated && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-indigo/20 pt-4">
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className={`inline-flex ${signupClass}`}
                >
                  ثبت نام
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={`inline-flex min-h-11 items-center justify-center rounded-lg border border-indigo/40 text-sm font-bold text-white hover:bg-white/5 ${focus}`}
                >
                  ورود
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default StickyHeader;
