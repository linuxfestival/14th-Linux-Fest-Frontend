import React from "react";
import Header from "../Header/Header";
import Terminal from "./components/Terminal";
import Button, { ButtonSizes } from "../Common/Button/Button";
import Arch from "../Icons/Arch";
import Ubuntu from "../Icons/Ubuntu";
import Fedora from "../Icons/Fedora";
import OpenSource from "../Icons/OpenSource";
import ProgrammingVec from "../../assets/programming-vec.png";
import StaticsCard from "./components/StaticsCard";
import DadashamLinux from "../../assets/dadasham-linus.png";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern py-4">
        <Terminal windowName="Linux Fest" className="relative">
          <div
            className="text-xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl font-bold flex flex-col sm:gap-4 md:gap-8 lg:gap-12 xl:gap-15 text-text-gray"
            dir="rtl"
          >
            <h1>۱۴ امین جشنواره</h1>
            <h1>
              <span className="text-[#FFDD03] drop-shadow-[0px_0px_16px_#FFDD03]">
                لینوکس
              </span>{" "}
              و{" "}
              <span className="text-[#15FAB4]  drop-shadow-[0px_0px_16px_#15FAB4]">
                جامعه متن باز
              </span>
            </h1>
          </div>

          <div className="w-full mt-12 flex flex-col justify-center items-center">
            <Button size={ButtonSizes.LARGE} className="!w-2/3 md:!w-1/3">
              ثبت نام
            </Button>
            <p className="mt-2 w-full text-sm lg:text-lg">از ۲۵ تا ۲۸ اسفند</p>
          </div>

          <Arch
            size={window.innerWidth * 0.08}
            className="absolute top-15 -left-10"
          />
          <Ubuntu
            size={window.innerWidth * 0.08}
            className="absolute top-8 -right-15"
          />
          <Fedora
            size={window.innerWidth * 0.08}
            className="absolute -bottom-2  -right-5"
          />
          <OpenSource
            size={window.innerWidth * 0.08}
            className="absolute -bottom-15 -left-10"
          />
        </Terminal>
        <div className="absolute bottom-0 h-10 w-full bg-gradient-to-b from-transparent to-primary"></div>
      </div>

      {/* What's Linux Fest */}
      <div className="flex items-center gap-10 px-20">
        <div className="flex-1 w-full">
          <img className="w-full h-auto" src={ProgrammingVec} />
        </div>
        <div className="w-full flex-1 flex flex-col gap-5 text-right justify-center items-end">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl w-full">
            لورم ایپسوم
          </h1>
          <p className="w-full text-sm sm:text-md lg::text-xl">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان{" "}
          </p>
          <Button
            size={ButtonSizes.MEDIUM}
            className="hidden sm:visible mt-5 animate-bounce shadow-[0_0_10px_#FA175C]"
          >
            اطلاعات بیشتر
          </Button>
        </div>
      </div>

      {/* Statics */}
      <div className="flex justify-between lg:justify-around gap-10 px-5 md:px-20 my-10 bg-light-gray py-10">
        <StaticsCard title="پروژه‌های اوپن سورس" number={1000000} moreThan />
        <StaticsCard title="توزیع‌های لینوکس" number={600} moreThan />
        <StaticsCard title="کاربران لینوکس" number={30000000} moreThan />
      </div>

      {/* Gofte Haye Dadasham Linux */}
      <div className="flex items-center gap-5 text-right">
        <div className="flex flex-col justify-center items-end py-20 w-full flex-1">
          <div className="flex flex-col items-end w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold">
              لینوس توروالدز
            </h1>
            <p className="text-md text-[#828283] mt-3">خالق لینوکس</p>
          </div>
          <p
            className="relative mt-8 text-sm sm:text-md md:text-lg lg:text-xl text-text-gray w-7/8 flex items-start"
            dir="rtl"
          >
            <span className="absolute right-0 top-0 translate-x-3/4 -translate-y-3/4 text-8xl h-6 text-[#e6e6e663]">
              “
            </span>
            <span className="p-2">
              نرم‌افزار متن‌باز به ما این امکان را می‌دهد که با همکاری و
              اشتراک‌گذاری دانش، نرم‌افزارهای بهتری بسازیم. لینوکس نمونه‌ای از
              این همکاری جهانی است. این سیستم‌عامل به ما نشان داده است که چگونه
              می‌توانیم با هم کار کنیم و به نتایج بزرگی دست یابیم. جامعه متن‌باز
              همیشه در حال رشد و پیشرفت است و این تنها آغاز راه است.
            </span>
            <span className="absolute left-0 bottom-0 -translate-x-3/4 translate-y-3/4 text-8xl h-6 text-[#e6e6e663]">
              ”
            </span>
          </p>
        </div>
        <div className="w-1/3">
          <img className="w-full h-auto" src={DadashamLinux} />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Header */}
      <Header />
    </>
  );
};

export default Home;
