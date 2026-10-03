import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Button, { ButtonSizes, ButtonVariants } from "../Common/Button/Button";
import { IoClose, IoMenu, IoPerson } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import ShoppingCart from "./components/ShoppingCart";
import clsx from "clsx";

interface Props {
  sticky?: boolean;
  contestStyle?: boolean;
  landing?: boolean;
}

const Header = ({
  sticky = true,
  contestStyle = false,
  landing = false,
}: Props) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.overflow = menuOpen ? "hidden" : "auto";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      root.style.overflow = "auto";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div
      className={clsx(
        landing
          ? "relative z-5 mx-auto flex w-[calc(100%-2rem)] max-w-7xl flex-row-reverse items-center justify-between bg-transparent p-0 text-text-white md:w-[calc(100%-4rem)] md:py-5"
          : "top-0 left-0 z-5 flex w-full flex-row-reverse items-center justify-between bg-light-gray p-[10px] lg:left-1/2 lg:top-[25px] lg:w-3/4 lg:-translate-x-1/2 lg:rounded-[26px]",
        { ["fixed"]: sticky && !landing, ["absolute"]: !sticky && !landing },
        {
          ["!w-full !bg-transparent !shadow-none px-16"]: contestStyle,
          ["[&_nav]:!gap-8 [&_nav]:!text-[.92rem] [&_nav_a:first-child]:hidden [&_.bg-secondary]:!bg-secondary [&_.bg-secondary]:!font-extrabold [&_.bg-secondary]:!text-primary [&_img]:!size-10 [&_img]:!object-contain [&_p]:!text-2xl [&_p]:!font-black"]:
            landing,
          ["shadow-md"]: !contestStyle,
        },
      )}
    >
      <div className="hidden lg:flex flex-row-reverse justify-start items-center gap-[10px] w-max xl:w-1/4 max-w-[250px]">
        {isAuthenticated ? (
          <>
            <ShoppingCart className="mx-2" />
            <IoPerson
              size={30}
              className="cursor-pointer"
              onClick={() => navigate("/profile/edit")}
            />
          </>
        ) : (
          !contestStyle && (
            <>
              <Link to="/signup" className="!w-full">
                <Button size={ButtonSizes.MEDIUM} className="!w-full">
                  ثبت نام
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
          برنامه‌ها
        </Link>
        <Link
          className="border-b-2 border-transparent py-1 transition-colors hover:border-secondary hover:text-secondary focus-visible:outline-2 focus-visible:outline-secondary"
          to={"/contest"}
        >
          مسابقه
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
        type="button"
        className="visible rounded-sm p-2 text-text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-secondary lg:hidden"
        onClick={toggleMenu}
        aria-label="باز کردن منو"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
      >
        <IoMenu size={34} aria-hidden="true" />
      </button>

      {menuOpen && (
        <div className="fixed inset-0 z-10 flex h-full w-full flex-col items-center justify-center bg-light-gray lg:hidden">
          <nav
            id="mobile-navigation"
            className="flex flex-col gap-5 text-lg font-medium text-center"
            aria-label="ناوبری موبایل"
          >
            <Link to={"/"} onClick={toggleMenu}>
              خانه
            </Link>
            <Link to={"/workshops"} onClick={toggleMenu}>
              برنامه‌ها
            </Link>
            <Link to={"/contest"} onClick={toggleMenu}>
              مسابقه
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
          <div className="w-2/3 flex flex-col items-center gap-2 mt-10">
            {isAuthenticated ? (
              <>
                <ShoppingCart className="mx-2" />
                <IoPerson
                  size={30}
                  className="cursor-pointer"
                  onClick={() => navigate("/profile/edit")}
                />
              </>
            ) : (
              !contestStyle && (
                <>
                  <Link to="/signup" className="!w-full">
                    <Button size={ButtonSizes.MEDIUM} className="!w-full">
                      ثبت نام
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

          <button
            type="button"
            className="mt-10 rounded-sm p-3 outline-offset-4 focus-visible:outline-2 focus-visible:outline-secondary"
            onClick={() => setMenuOpen(false)}
            aria-label="بستن منو"
          >
            <IoClose size={24} aria-hidden="true" />
          </button>
        </div>
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

export default Header;
