import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Button, { ButtonSizes, ButtonVariants } from "../Common/Button/Button";
import { IoClose, IoMenu } from "react-icons/io5";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.getElementById("root")!.style.overflow = "hidden";
    } else {
      document.getElementById("root")!.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <div className="fixed top-0 left-0 lg:top-[25px] lg:left-1/2 lg:-translate-x-1/2 p-[10px] w-full lg:w-3/4 flex flex-row-reverse justify-between items-center bg-light-gray rounded-[26px]">
      <div className="hidden lg:flex flex-row-reverse justify-start items-center gap-[10px] w-1/4 max-w-[250px]">
        <Link to="/signup" className="!w-full">
          <Button size={ButtonSizes.MEDIUM} className="!w-full">
            ثبت نام
          </Button>
        </Link>
        <Link to="/login">
          <Button size={ButtonSizes.MEDIUM} variant={ButtonVariants.OUTLINE}>
            ورود
          </Button>
        </Link>
      </div>
      <nav className="hidden lg:flex gap-4 text-lg font-medium">
        <Link to={"/"}>خانه</Link>
        <Link to={"/workshops"}>ارائه ها</Link>
        <Link to={"/faq"}>سوالات متداول</Link>
        <Link to={"/staff"}>دست اندرکاران</Link>
      </nav>

      <IoMenu size={50} className="visible lg:hidden" onClick={toggleMenu} />

      <div
        className={`fixed top-0 left-0 w-full h-full bg-light-gray flex flex-col items-center justify-center lg:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-4 text-lg font-medium text-center">
          <Link to={"/"} onClick={toggleMenu}>
            خانه
          </Link>
          <Link to={"/workshops"} onClick={toggleMenu}>
            ارائه ها
          </Link>
          <Link to={"/faq"} onClick={toggleMenu}>
            سوالات متداول
          </Link>
          <Link to={"/staff"} onClick={toggleMenu}>
            دست اندرکاران
          </Link>
        </nav>
        <div className="w-2/3 flex flex-col items-center gap-2 mt-10">
          <Link to="/signup" className="!text-xl w-max">
            <Button size={ButtonSizes.LARGE} onClick={toggleMenu}>
              ثبت نام
            </Button>
          </Link>
          <Link to="/login" className="font-medium text-xl">
            <Button
              size={ButtonSizes.SMALL}
              variant={ButtonVariants.OUTLINE}
              onClick={toggleMenu}
            >
              ورود
            </Button>
          </Link>
        </div>

        <IoClose
          size={20}
          className="mt-10"
          onClick={() => setMenuOpen(false)}
        />
      </div>

      <div className="flex justify-center items-center gap-[10px]">
        <p className="text-2xl font-medium">لینوکس فست</p>
        <img src={logo} width={50} height={50} />
      </div>
    </div>
  );
};

export default Header;
