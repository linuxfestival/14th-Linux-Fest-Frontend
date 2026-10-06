import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiCalendarDays, HiWrenchScrewdriver } from "react-icons/hi2";
import { PiMicrophoneStageFill } from "react-icons/pi";
import Programming from "../../../assets/programming-vec.png";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import { useAppDispatch } from "../../../store";
import { getAllPresentationsThunk } from "../../../core/presentations/presentations.thunk";
import { selectPresentationsState } from "../../../core/presentations/presentations.selector";
import { PresentationService } from "../../../core/presentations/presentations.dto";
import { toWorkshopItem } from "../../WorkshopsList/workshops.adapter";

const ProgramsSection = () => {
  const dispatch = useAppDispatch();
  const { list, loadedFirstTime, loading } = useSelector(selectPresentationsState);
  const [loadError, setLoadError] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    if (!loadedFirstTime) {
      dispatch(getAllPresentationsThunk()).then((result) =>
        setLoadError(result.meta.requestStatus === "rejected"),
      );
    }
  }, [dispatch, loadedFirstTime]);

  const programs = useMemo(
    () => list.map(toWorkshopItem).sort((a, b) => a.start.localeCompare(b.start)),
    [list],
  );
  const programTabs = useMemo(
    () => [...new Map(programs.map((program) => [program.day, program.dateLabel])).entries()],
    [programs],
  );
  const activeProgramTab = programTabs.some(([day]) => day === selectedDay)
    ? selectedDay
    : programTabs[0]?.[0];
  const visiblePrograms = programs.filter((program) => program.day === activeProgramTab);

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
        {programTabs.length > 0 && (
          <nav
            className="mt-8 flex flex-wrap gap-2 border-b border-indigo/30 pb-4 sm:mt-10 sm:gap-3 sm:pb-5"
            aria-label="انتخاب روز ارائه‌ها"
          >
            {programTabs.map(([day, label]) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                aria-pressed={activeProgramTab === day}
                aria-controls="programs-list"
                className={`min-h-12 min-w-0 rounded-xl px-2 py-3 text-sm font-bold leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:px-6 sm:text-base ${activeProgramTab === day ? "bg-secondary text-primary" : "bg-white/5 text-text-gray hover:bg-white/10 hover:text-text-white active:bg-white/15"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
        <div id="programs-list" className="w-full">
          {loading || (!loadedFirstTime && !loadError) ? (
            <p role="status" className="py-10 text-sm text-text-gray">
              در حال دریافت ارائه‌ها…
            </p>
          ) : loadError && !loadedFirstTime ? (
            <div role="alert" className="py-10">
              <p className="text-sm leading-7 text-text-gray">
                دریافت ارائه‌ها انجام نشد. دوباره تلاش کن.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadError(false);
                  dispatch(getAllPresentationsThunk()).then((result) =>
                    setLoadError(result.meta.requestStatus === "rejected"),
                  );
                }}
                className="mt-4 min-h-11 rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
              >
                تلاش دوباره
              </button>
            </div>
          ) : visiblePrograms.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {visiblePrograms.map((program) => {
                const ProgramIcon = program.service === PresentationService.WORKSHOP
                  ? HiWrenchScrewdriver
                  : program.service === PresentationService.TALK
                    ? PiMicrophoneStageFill
                    : HiCalendarDays;
                return (
                  <li
                    key={program.id}
                    className="border-b border-indigo/25"
                  >
                    <Link
                      className="group grid w-full grid-cols-[1.5rem_minmax(0,1fr)_1.5rem] items-center gap-x-3 gap-y-2 rounded-lg px-2 py-5 text-text-white no-underline transition-colors hover:bg-white/5 active:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,20rem)_1.5rem] sm:gap-x-5 sm:px-4 sm:py-6"
                      to={`/workshop/${program.id}`}
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
                        {program.time}
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
              ارائه‌ها به‌زودی اینجا هستند.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
