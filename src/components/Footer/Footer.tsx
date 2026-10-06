import React from "react";
import { Link } from "react-router-dom";
import aut from "../../assets/aut.png";
import anjoman from "../../assets/anjoman.png";
import sponsor from "../../assets/systemgroup.svg";
import Telegram from "../Icons/Telegram";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";

const Footer = () => (
  <footer className="bg-dark-gray text-text-white" dir="rtl">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="grid gap-8 border-b border-indigo/35 pb-6 lg:grid-cols-2 lg:gap-10 lg:pb-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-right">
          <div className="flex items-center gap-4">
            <Link
              className="rounded-md bg-text-white p-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-secondary"
              to="https://aut.ac.ir/"
              target="_blank"
              rel="noreferrer"
              aria-label="دانشگاه صنعتی امیرکبیر"
            >
              <img
                className="size-10 object-contain"
                src={aut}
                width="40"
                height="40"
                loading="lazy"
                alt="نشان دانشگاه صنعتی امیرکبیر"
              />
            </Link>
            <Link
              to={"https://ceit-ssc.ir"}
              target="_blank"
              rel="noreferrer"
              aria-label="انجمن علمی مهندسی کامپیوتر"
            >
              <img
                className="size-14 rounded-md bg-text-white p-2 object-contain"
                src={anjoman}
                width="56"
                height="56"
                loading="lazy"
                alt="نشان انجمن علمی مهندسی کامپیوتر"
              />
            </Link>
          </div>
          <Link
            to="http://sgmg.ir/sg-developers"
            target="_blank"
            rel="noreferrer"
            aria-label="حامی لینوکس فست، همکاران سیستم"
            className="mt-3 flex items-center gap-3"
          >
            <img
              className="h-10 w-24 rounded-md bg-text-white p-2 object-contain"
              src={sponsor}
              width="96"
              height="40"
              loading="lazy"
              alt="نشان همکاران سیستم"
            />
            <p className="m-0 text-sm leading-6 text-text-gray">
              حامی:{" "}
              <span className="font-bold text-text-white">همکاران سیستم</span>
            </p>
          </Link>
          <div
            className="mt-4 flex items-center gap-3"
            role="group"
            aria-label="شبکه‌های اجتماعی"
          >
            <Link
              className="flex size-11 items-center justify-center rounded-full outline-offset-4 transition-colors hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-secondary"
              to="https://t.me/linuxfest"
              target="_blank"
              rel="noreferrer"
              aria-label="تلگرام لینوکس‌فست"
            >
              <Telegram className="size-10" />
            </Link>
            <Link
              className="flex size-11 items-center justify-center rounded-full outline-offset-4 transition-colors hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-secondary [&>svg]:size-10"
              to="https://x.com/LinuxFestival"
              target="_blank"
              rel="noreferrer"
              aria-label="اکس لینوکس‌فست"
            >
              <Twitter />
            </Link>
            <Link
              className="flex size-11 items-center justify-center rounded-full outline-offset-4 transition-colors hover:bg-indigo/15 focus-visible:outline-2 focus-visible:outline-secondary"
              to="https://www.instagram.com/linuxfest.aut/"
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام لینوکس‌فست"
            >
              <Instagram className="size-10" />
            </Link>
          </div>
        </div>

        <nav
          className="min-w-0 flex flex-col text-center lg:text-right"
          aria-label="درباره رویداد"
        >
          <h2 className="mb-2 text-lg font-black text-text-white sm:text-xl">
            درباره رویداد
          </h2>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm text-sm text-text-gray underline-offset-4 transition-colors hover:text-text-white hover:underline focus-visible:outline-2 focus-visible:outline-secondary"
            to="/event-format"
          >
            قالب رویداد
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm text-sm text-text-gray underline-offset-4 transition-colors hover:text-text-white hover:underline focus-visible:outline-2 focus-visible:outline-secondary"
            to="/faq"
          >
            سوالات متداول
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm text-sm text-text-gray underline-offset-4 transition-colors hover:text-text-white hover:underline focus-visible:outline-2 focus-visible:outline-secondary"
            to="/presenters"
          >
            ارائه دهندگان
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-sm px-1 py-2 text-sm text-text-gray underline-offset-4 transition-colors hover:text-text-white hover:underline focus-visible:outline-2 focus-visible:outline-secondary"
            to="/staff"
          >
            دست‌اندرکاران
          </Link>
        </nav>
      </div>

      <div className="pt-5 text-center text-xs text-text-gray lg:text-right">
        <p className="m-0">لینوکس‌فست · دانشگاه صنعتی امیرکبیر</p>
      </div>
    </div>
  </footer>
);

export default Footer;
