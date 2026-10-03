import { useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight, HiCalendarDays } from "react-icons/hi2";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Programming from "../../../assets/programming-vec.png";
import { digitsToPersian } from "../../../utils/digitsToPersian";

const programTabs = [
  "همه",
  "چهارشنبه‌ 22 مهر",
  "پنج‌شنبه‌ 23 مهر",
  "جمعه‌ 24 مهر",
];
const programs = [
  {
    title: "آیین افتتاحیه",
    category: "چهارشنبه‌ 22 مهر",
    detail: "جزئیات به‌زودی",
    icon: HiCalendarDays,
  },
  {
    title: "گفت‌وگوهای جامعه",
    category: "چهارشنبه‌ 22 مهر",
    detail: "جزئیات به‌زودی",
    icon: PiMicrophoneStageFill,
  },
];

const ProgramsSection = () => {
  const [activeProgramTab, setActiveProgramTab] = useState("همه");
  const visiblePrograms = programs.filter(
    (program) =>
      activeProgramTab === "همه" || program.category === activeProgramTab,
  );

  return (
    <section
      className="relative overflow-hidden bg-primary px-6 py-16 text-text-white sm:px-8 md:py-20 lg:px-10"
      dir="rtl"
    >
      <img
        className="absolute -bottom-16 -left-12 hidden w-[30rem] opacity-25 mix-blend-screen saturate-0 brightness-200 lg:block"
        src={Programming}
        alt="تصویرسازی برنامه‌نویسی"
      />
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="mb-2 text-sm font-bold text-indigo">برنامه‌ها</p>
        <h2 className="max-w-4xl text-4xl font-black leading-[.95] tracking-[-.06em] sm:text-5xl lg:text-[clamp(3rem,6vw,6rem)]">
          مسیر بعدی کنجکاوی‌ات را{" "}
          <em className="not-italic text-secondary">پیدا کن.</em>
        </h2>
        <nav
          className="mt-10 flex gap-2 overflow-x-auto border-b border-[#b5cff1] sm:gap-4"
          aria-label="دسته‌بندی برنامه‌ها"
        >
          {programTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveProgramTab(tab)}
              aria-pressed={activeProgramTab === tab}
              className={`shrink-0 px-4 py-3 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary ${activeProgramTab === tab ? "bg-secondary text-primary" : "text-[#ddecfb] hover:bg-white/10 hover:text-white"}`}
            >
              {digitsToPersian(tab)}
            </button>
          ))}
        </nav>
        <div className="w-full">
          {visiblePrograms.length > 0 ? (
            visiblePrograms.map((program) => {
              const ProgramIcon = program.icon;
              return (
                <Link
                  key={program.title}
                  className="grid w-full grid-cols-[1.5rem_minmax(0,1fr)_1.5rem] items-center gap-4 border-b border-[#a2bddf] py-5 text-white no-underline transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-secondary sm:grid-cols-[2rem_minmax(0,1fr)_auto_2rem] sm:px-3"
                  to="/workshops"
                >
                  <ProgramIcon className="size-6 text-indigo" />
                  <b className="text-lg">{program.title}</b>
                  <span className="hidden text-sm text-[#c7dbf4] sm:block">
                    {program.detail}
                  </span>
                  <HiArrowRight className="size-6" />
                </Link>
              );
            })
          ) : (
            <p className="py-10 text-sm text-text-gray">
              برنامه‌ای در این دسته ثبت نشده است.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
