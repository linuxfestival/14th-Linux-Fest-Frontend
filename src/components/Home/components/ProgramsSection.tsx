import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiCalendarDays } from "react-icons/hi2";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Programming from "../../../assets/programming-vec.png";
import { digitsToPersian } from "../../../utils/digitsToPersian";

const programTabs = ["چهارشنبه‌ 22 مهر", "پنج‌شنبه‌ 23 مهر", "جمعه‌ 24 مهر"];
const programs = [
  {
    title: "اینستال فست (install fest)",
    category: "چهارشنبه‌ 22 مهر",
    detail: "جزئیات بیشتر به زودی اطلاع رسانی می‌شود.",
    icon: HiCalendarDays,
  },
  {
    title: "ارائه 1",
    category: "پنج‌شنبه‌ 23 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "پنج‌شنبه‌ 23 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "پنج‌شنبه‌ 23 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "جمعه‌ 24 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "جمعه‌ 24 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "جمعه‌ 24 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "جمعه‌ 24 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
  {
    title: "ارائه 1",
    category: "جمعه‌ 24 مهر",
    detail: "9:15 - 10:45",
    icon: PiMicrophoneStageFill,
  },
];

const ProgramsSection = () => {
  const [activeProgramTab, setActiveProgramTab] = useState(programTabs[0]);
  const visiblePrograms = useMemo(
    () => programs.filter((program) => program.category === activeProgramTab),
    [activeProgramTab],
  );

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-primary px-6 py-16 text-text-white sm:px-8 md:py-20 lg:px-10"
      dir="rtl"
    >
      <img
        className="pointer-events-none absolute -bottom-16 left-0 -z-10 hidden w-[30rem] opacity-10 mix-blend-screen saturate-0 brightness-200 lg:block"
        src={Programming}
        alt=""
        loading="lazy"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl">
        <h2
          id="programs-heading"
          className="max-w-4xl text-3xl font-black leading-snug text-balance sm:text-4xl lg:text-5xl lg:leading-snug"
        >
          مسیر بعدی کنجکاوی‌ات را{" "}
          <em className="not-italic text-secondary">پیدا کن.</em>
        </h2>
        <nav
          className="mt-8 grid grid-cols-3 gap-2 border-b border-indigo/30 pb-4 sm:mt-10 sm:flex sm:gap-3 sm:pb-5"
          aria-label="انتخاب روز ارائه‌ها"
        >
          {programTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveProgramTab(tab)}
              aria-pressed={activeProgramTab === tab}
              aria-controls="programs-list"
              className={`min-h-12 min-w-0 rounded-xl px-2 py-3 text-sm font-bold leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:px-6 sm:text-base ${activeProgramTab === tab ? "bg-secondary text-primary" : "bg-white/5 text-text-gray hover:bg-white/10 hover:text-text-white active:bg-white/15"}`}
            >
              <span className="block whitespace-nowrap sm:inline">
                {tab.split(/ (?=\d)/)[0]}
              </span>{" "}
              <span className="block whitespace-nowrap sm:inline">
                {digitsToPersian(tab.split(/ (?=\d)/)[1])}
              </span>
            </button>
          ))}
        </nav>
        <div id="programs-list" className="w-full">
          {visiblePrograms.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {visiblePrograms.map((program, index) => {
                const ProgramIcon = program.icon;
                return (
                  <li
                    key={`${program.category}-${index}`}
                    className="border-b border-indigo/25"
                  >
                    <Link
                      className="group grid w-full grid-cols-[1.5rem_minmax(0,1fr)_1.5rem] items-center gap-x-3 gap-y-2 rounded-lg px-2 py-5 text-text-white no-underline transition-colors hover:bg-white/5 active:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,20rem)_1.5rem] sm:gap-x-5 sm:px-4 sm:py-6"
                      to="/workshops"
                    >
                      <ProgramIcon
                        className="size-6 text-indigo"
                        aria-hidden="true"
                      />
                      <b
                        className="min-w-0 text-base leading-7 sm:text-lg"
                        dir="auto"
                      >
                        {digitsToPersian(program.title)}
                      </b>
                      <span
                        className="col-start-2 row-start-2 text-sm leading-7 text-text-gray tabular-nums sm:col-start-3 sm:row-start-1 sm:justify-self-end"
                        dir="auto"
                      >
                        {digitsToPersian(program.detail)}
                      </span>
                      <HiArrowLeft
                        className="col-start-3 row-start-1 size-5 text-indigo transition-colors group-hover:text-secondary sm:col-start-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-10 text-sm text-text-gray">
              ارائه‌ای در این دسته ثبت نشده است.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
