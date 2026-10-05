import { useEffect, useLayoutEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import Button, { ButtonSizes, ButtonVariants } from "../Common/Button/Button";
import { IoClose, IoMenu, IoPerson } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import ShoppingCart from "./components/ShoppingCart";
import clsx from "clsx";
import StickyHeader from "./StickyHeader";

interface Props {
  sticky?: boolean;
  contestStyle?: boolean;
  landing?: boolean;
}

const LegacyHeader = ({
  sticky = true,
  contestStyle = false,
  landing = false,
}: Props) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const close = () => setMenuOpen(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const dialog = menu.current;
    const toggle = menuToggle.current;
    // The top layer escapes the hero's stacking context and fixed ancestors.
    dialog?.showModal();
    const elements = [document.documentElement, document.body];
    const previousOverflow = elements.map((element) => element.style.overflow);
    elements.forEach((element) => {
      element.style.overflow = "hidden";
    });
    return () => {
      dialog?.close();
      elements.forEach((element, index) => {
        element.style.overflow = previousOverflow[index];
      });
      if (toggle?.isConnected) toggle.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  return (
    <div
      className={clsx(
        landing
          ? "relative z-5 mx-auto flex w-[calc(100%-2rem)] max-w-7xl flex-row-reverse items-center justify-between bg-transparent p-0 text-text-white md:w-[calc(100%-4rem)] md:py-5"
          : "top-0 left-0 z-5 flex w-full flex-row-reverse items-center justify-between bg-light-gray text-text-white p-[10px] lg:left-1/2 lg:top-[25px] lg:w-3/4 lg:-translate-x-1/2 lg:rounded-[26px]",
        { ["fixed"]: sticky && !landing, ["absolute"]: !sticky && !landing },
        {
          ["!w-full !bg-transparent !shadow-none px-16"]: contestStyle,
          ["[&>nav]:!gap-8 [&>nav]:!text-[.92rem] [&>nav_a:first-child]:hidden [&_.bg-secondary]:!bg-secondary [&_.bg-secondary]:!font-extrabold [&_.bg-secondary]:!text-primary [&_img]:!size-10 [&_img]:!object-contain [&_p]:!text-2xl [&_p]:!font-black"]:
            landing,
          ["shadow-md"]: !contestStyle,
        },
      )}
    >
      <div className="hidden lg:flex flex-row-reverse justify-start items-center gap-[10px] w-max xl:w-1/4 max-w-[250px]">
        {isAuthenticated ? (
          <>
            <ShoppingCart className="mx-2" />
            <Link
              to="/profile/edit"
              aria-label="حساب کاربری"
              className="flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <IoPerson size={30} aria-hidden="true" />
            </Link>
          </>
        ) : (
          !contestStyle && (
            <>
              <Link to="/signup" className="!w-full">
                <Button size={ButtonSizes.MEDIUM} className="!w-full">
                  ساخت حساب
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size={ButtonSizes.MEDIUM}
                  variant={ButtonVariants.OUTLINE}
                >
                  ورود
                </Button>
              </Link>
            </>
          )
        )}
      </div>
      <nav
        className="hidden items-center gap-4 text-lg font-medium lg:flex"
        aria-label="ناوبری اصلی"
      >
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/"}
        >
          خانه
        </Link>
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/workshops"}
        >
          ارائه‌ها
        </Link>
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/faq"}
        >
          سوالات متداول
        </Link>
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/presenters"}
        >
          ارائه‌دهندگان
        </Link>
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/staff"}
        >
          دست‌اندرکاران
        </Link>
      </nav>

      <button
        ref={menuToggle}
        type="button"
        className="inline-flex size-12 items-center justify-center rounded-lg text-text-white outline-offset-4 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-secondary lg:hidden"
        onClick={toggleMenu}
        aria-label="باز کردن منو"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
      >
        <IoMenu size={34} aria-hidden="true" />
      </button>

      {menuOpen && (
        <dialog
          ref={menu}
          id="mobile-navigation"
          aria-label="منوی سایت"
          onCancel={() => setMenuOpen(false)}
          onClose={() => setMenuOpen(false)}
          dir="rtl"
          data-lenis-prevent
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-primary p-6 text-text-white outline-none sm:p-8 [&_nav_a]:flex [&_nav_a]:min-h-14 [&_nav_a]:items-center [&_nav_a]:rounded-lg [&_nav_a]:px-4 [&_nav_a]:hover:bg-white/5 [&_nav_a]:hover:text-secondary [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-secondary"
        >
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
            <div className="mb-8 flex items-center justify-between border-b border-indigo/20 pb-5">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-xl font-black"
              >
                <img src={logo} width={40} height={40} alt="نشان لینوکس‌فست" />
                <span>لینوکس‌فست</span>
              </Link>
              <button
                type="button"
                autoFocus
                className="inline-flex size-12 items-center justify-center rounded-lg text-indigo hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                onClick={() => setMenuOpen(false)}
                aria-label="بستن منو"
              >
                <IoClose size={28} aria-hidden="true" />
              </button>
            </div>
            <nav
              className="mb-8 flex flex-col gap-1 text-lg font-bold"
              aria-label="ناوبری موبایل"
            >
              <Link to={"/"} onClick={toggleMenu}>
                خانه
              </Link>
              <Link to={"/workshops"} onClick={toggleMenu}>
                ارائه‌ها
              </Link>
              <Link to={"/faq"} onClick={toggleMenu}>
                سوالات متداول
              </Link>
              <Link to={"/presenters"} onClick={toggleMenu}>
                ارائه‌دهندگان
              </Link>
              <Link to={"/staff"} onClick={toggleMenu}>
                دست اندرکاران
              </Link>
            </nav>
            <div className="mt-auto flex w-full items-center gap-4 border-t border-indigo/20 pt-6 [&>a]:flex-1">
              {isAuthenticated ? (
                <>
                  <ShoppingCart className="mx-2" />
                  <Link
                    to="/profile/edit"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-lg text-indigo hover:bg-white/5"
                  >
                    <IoPerson size={24} aria-hidden="true" />
                    حساب کاربری
                  </Link>
                </>
              ) : (
                !contestStyle && (
                  <>
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <Button size={ButtonSizes.MEDIUM} className="!w-full">
                        ساخت حساب
                      </Button>
                    </Link>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button
                        size={ButtonSizes.MEDIUM}
                        variant={ButtonVariants.OUTLINE}
                        className="!w-full"
                      >
                        ورود
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </dialog>
      )}

      <Link
        to={"/"}
        className="flex justify-center items-center gap-0 xl:gap-[10px]"
        aria-label="صفحه اصلی لینوکس‌فست"
      >
        <img src={logo} width={50} height={50} alt="نشان لینوکس‌فست" />
        <p className="hidden xl:block text-2xl font-medium">لینوکس‌فست</p>
      </Link>
    </div>
  );
};

const Header = (props: Props) =>
  props.landing || props.contestStyle ? (
    <LegacyHeader {...props} />
  ) : (
    <StickyHeader sticky={props.sticky} />
  );

export default Header;
