import "./HeroSection.css";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import Header from "../../Header/Header";
import Penguin from "../../../assets/images/pinguin.png";
import HeroDots from "./HeroDots";

const HeroSection = () => (
  <section
    className="select-none landing-hero-dots relative isolate flex min-h-[95dvh] flex-col overflow-hidden bg-primary text-text-white"
  >
    <HeroDots />
    <Header landing />
    <div
      className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-6 py-8 sm:px-8 md:min-h-[32rem] md:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] md:gap-12 md:py-10 lg:px-10 lg:py-8"
      dir="ltr"
    >
      <div
        className="order-2 relative flex min-h-[18rem] items-center justify-center md:order-1 md:min-h-[28rem]"
        aria-label="تصویر لینوکس فست"
      >
        <img
          className="relative z-1 w-full max-w-[22rem] object-contain drop-shadow-[-14px_20px_12px_rgba(0,0,0,.28)] sm:max-w-[30rem] md:max-w-[32rem]"
          src={Penguin}
          alt="پنگوئن لینوکس"
        />
        <div className="absolute right-0 bottom-0 z-3 w-64 border border-[#d6e7fc] bg-[#081a40e6] px-4 py-3 text-[#eaf5ff] shadow-[-12px_15px_24px_rgba(0,0,0,.2)] [direction:ltr] sm:w-72 md:bottom-auto md:top-1/2 md:translate-y-3/4">
          <div className="mb-3 flex gap-1.5">
            <i className="size-2.5 rounded-full border border-secondary bg-secondary" />
            <i className="size-2.5 rounded-full border border-indigo" />
            <i className="size-2.5 rounded-full border border-indigo" />
          </div>
          <p className="m-0 font-mono text-sm">$ whoami</p>
          <p className="m-0 font-mono text-sm">
            &gt; curious. creative. open
            <span className="terminal-cursor font-black text-secondary">_</span>
          </p>
        </div>
      </div>
      <div className="order-1 text-right md:order-2" dir="rtl">
        <p className="mb-3 text-sm font-medium text-[#e6efff] sm:mb-4 sm:text-base">
          دانشگاه صنعتی امیرکبیر · تهران
        </p>
        <h1 className="m-0 text-[4rem] font-black leading-[.92] tracking-[-.08em] text-white sm:text-[6rem] md:text-[6.5rem] lg:text-[8rem] xl:text-[8.5rem] 2xl:text-[9rem]">
          لینوکس
          <br />
          <em className="not-italic text-secondary">
            فست
            <span
              className="terminal-cursor ms-2 inline-block -translate-y-[.08em] text-[.56em] tracking-normal"
              dir="ltr"
              aria-hidden="true"
            >
              _
            </span>
          </em>
        </h1>
        <p className="mt-4 max-w-[34rem] text-base leading-8 text-[#d7e8fa] lg:text-lg">
          لینوکس بهونه‌ست، از هم یاد می‌گیریم و دوست پیدا می‌کنیم.
        </p>
        <div className="mt-7 flex flex-col-reverse items-stretch gap-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-x-8 sm:gap-y-5">
          <Link
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3.5 font-extrabold text-primary transition-colors hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:w-auto sm:py-3"
            to="/workshops"
          >
            مشاهده ارائه‌ها
            <HiArrowLeft aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
