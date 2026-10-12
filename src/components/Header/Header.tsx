import { useEffect, useLayoutEffect, useRef, useState } from "react";
import logoDark from "../../assets/logo_dark.png";
import logoLight from "../../assets/logo_light.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button, { ButtonSizes, ButtonVariants } from "../Common/Button/Button";
import { IoClose, IoMenu, IoPerson } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import ShoppingCart from "./components/ShoppingCart";
import clsx from "clsx";
import StickyHeader from "./StickyHeader";
import { isNavigationActive, siteNavigation } from "./navigation";

interface Props {
  sticky?: boolean;
  contestStyle?: boolean;
  landing?: boolean;
  landingOnLight?: boolean;
}

const COMMUNITY_DAY_NOTICE_DISMISSED =
  "linux-fest-community-day-notice-dismissed";

const CommunityDayRegistrationNotice = ({
  onDismiss,
}: {
  onDismiss: () => void;
}) => (
  <aside
    role="status"
    aria-label="ثبت‌نام روز جامعه آغاز شده است"
    className="fixed inset-x-0 top-0 z-[60] bg-secondary text-primary shadow-[0_6px_18px_rgba(23,33,60,.16)]"
    dir="rtl"
  >
    <div className="mx-auto flex min-h-12 w-full max-w-7xl items-center justify-center gap-3 px-4 text-sm font-bold sm:justify-between sm:px-8 lg:px-10">
      <p>ثبت‌نام روز جامعه شروع شد!</p>
      <div className="flex items-center gap-2">
        <Link
          to="/community-day"
          className="inline-flex min-h-9 items-center rounded-lg bg-primary px-3 text-xs font-extrabold text-white transition-colors hover:bg-[#234e86] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 sm:text-sm"
        >
          همین حالا
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="بستن اطلاعیه ثبت‌نام روز جامعه"
          className="inline-flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <IoClose className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </aside>
);

const LegacyHeader = ({
  sticky = true,
  contestStyle = false,
  landing = false,
  landingOnLight = false,
  registrationNoticeVisible = false,
}: Props & { registrationNoticeVisible?: boolean }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const { pathname, hash } = useLocation();
  const headerLogo = landingOnLight ? logoDark : logoLight;

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
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
          ? `relative z-5 mx-auto flex w-[calc(100%-2rem)] max-w-7xl flex-row-reverse items-center justify-between bg-transparent p-0 ${landingOnLight ? "text-primary" : "text-text-white"} md:w-[calc(100%-4rem)] md:py-5`
          : `${registrationNoticeVisible ? "top-12 lg:top-[73px]" : "top-0 lg:top-[25px]"} left-0 z-5 flex w-full flex-row-reverse items-center justify-between bg-light-gray text-text-white p-[10px] lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:rounded-[26px]`,
        { ["fixed"]: sticky && !landing, ["absolute"]: !sticky && !landing },
        {
          ["!w-full !bg-transparent !shadow-none px-16"]: contestStyle,
          ["[&>nav]:!gap-3 xl:[&>nav]:!gap-6 [&>nav]:!text-[.92rem] [&_.bg-secondary]:!bg-secondary [&_.bg-secondary]:!font-extrabold [&_.bg-secondary]:!text-primary [&_img]:!size-10 [&_img]:!object-contain [&_p]:!text-2xl [&_p]:!font-black"]:
            landing,
          ["shadow-md"]: !contestStyle && !landing,
        },
      )}
    >
      <div className="hidden xl:flex flex-row-reverse justify-start items-center gap-[10px] w-max max-w-[200px]">
        {isAuthenticated ? (
          <>
            <ShoppingCart
              className={clsx(
                "mx-2",
                landingOnLight && "focus-visible:!outline-primary",
              )}
            />
            <Link
              to="/profile/edit"
              aria-label="حساب کاربری"
              className={clsx(
                "flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2",
                landingOnLight
                  ? "hover:bg-primary/10 focus-visible:outline-primary"
                  : "focus-visible:outline-secondary",
              )}
            >
              <IoPerson size={30} aria-hidden="true" />
            </Link>
          </>
        ) : (
          !contestStyle && (
            <>
              <Link to="/signup" className="!w-full">
                <Button
                  size={ButtonSizes.MEDIUM}
                  className={clsx(
                    "!w-full",
                    landingOnLight &&
                      "!bg-primary !text-[#f4efe4] hover:!bg-[#234e86] focus-visible:!outline-primary",
                  )}
                >
                  ساخت حساب
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size={ButtonSizes.MEDIUM}
                  variant={ButtonVariants.OUTLINE}
                  className={clsx(
                    landingOnLight &&
                      "!text-primary hover:!text-primary focus-visible:outline-primary",
                  )}
                >
                  ورود
                </Button>
              </Link>
            </>
          )
        )}
      </div>
      <nav
        className="hidden items-center gap-1 text-sm font-medium xl:flex 2xl:gap-3"
        aria-label="ناوبری اصلی"
      >
        {siteNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-current={
              isNavigationActive(item.to, pathname, hash) ? "page" : false
            }
            end={item.to === "/"}
            className={() =>
              `inline-flex min-h-11 items-center border-b-2 py-1 mx-2 transition-colors focus-visible:outline-2 ${landingOnLight ? "hover:border-primary hover:text-primary focus-visible:outline-primary" : "hover:border-secondary hover:text-secondary focus-visible:outline-secondary"} ${isNavigationActive(item.to, pathname, hash) ? (landingOnLight ? "border-primary text-primary" : "border-secondary text-secondary") : item.to === "/bundles" ? (landingOnLight ? "border-primary/50 font-extrabold text-primary" : "border-secondary/50 font-extrabold text-secondary") : "border-transparent"}`
            }
          >
            <span
              className={
                item.to === "/install-fest"
                  ? "install-fest-nav-label"
                  : undefined
              }
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <button
        ref={menuToggle}
        type="button"
        className={clsx(
          "inline-flex size-12 items-center justify-center rounded-lg outline-offset-4 focus-visible:outline-2 xl:hidden",
          landingOnLight
            ? "text-primary hover:bg-primary/10 focus-visible:outline-primary"
            : "text-text-white hover:bg-white/10 focus-visible:outline-secondary",
        )}
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
                <img
                  src={logoLight}
                  width={40}
                  height={40}
                  alt="نشان لینوکس‌فست"
                />
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
              {siteNavigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  aria-current={
                    isNavigationActive(item.to, pathname, hash) ? "page" : false
                  }
                  end={item.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={() =>
                    isNavigationActive(item.to, pathname, hash)
                      ? "bg-white/5 text-secondary"
                      : item.to === "/bundles"
                        ? "text-secondary"
                        : undefined
                  }
                >
                  <span
                    className={
                      item.to === "/install-fest"
                        ? "install-fest-nav-label"
                        : undefined
                    }
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex w-full items-center gap-4 border-t border-indigo/20 pt-6 [&>a]:flex-1">
              {isAuthenticated ? (
                <>
                  <ShoppingCart className="mx-2 bg-white/5" />
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
        <img src={headerLogo} width={50} height={50} alt="نشان لینوکس‌فست" />
        <p className="hidden xl:block text-2xl font-medium">لینوکس‌فست</p>
      </Link>
    </div>
  );
};

const Header = (props: Props) => {
  const [registrationNoticeDismissed, setRegistrationNoticeDismissed] =
    useState(() => {
      try {
        return window.localStorage.getItem(COMMUNITY_DAY_NOTICE_DISMISSED) === "true";
      } catch {
        return false;
      }
    });
  const registrationNoticeVisible = !registrationNoticeDismissed;
  const dismissRegistrationNotice = () => {
    try {
      window.localStorage.setItem(COMMUNITY_DAY_NOTICE_DISMISSED, "true");
    } catch {
      // Keep the notice dismissed for the current page when storage is unavailable.
    }
    setRegistrationNoticeDismissed(true);
  };

  return (
    <>
      {registrationNoticeVisible && (
        <CommunityDayRegistrationNotice onDismiss={dismissRegistrationNotice} />
      )}
      {registrationNoticeVisible && <div aria-hidden="true" className="h-12" />}
      {props.landing || props.contestStyle ? (
        <LegacyHeader
          {...props}
          registrationNoticeVisible={registrationNoticeVisible}
        />
      ) : (
        <StickyHeader
          sticky={props.sticky}
          registrationNoticeVisible={registrationNoticeVisible}
        />
      )}
    </>
  );
};

export default Header;
