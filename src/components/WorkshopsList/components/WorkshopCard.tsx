import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiUser,
  HiVideoCamera,
  HiMapPin,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import { PresentationService } from "../../../core/presentations/presentations.dto";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import type { WorkshopItem } from "../workshops.adapter";
import WorkshopCartAction from "./WorkshopCartAction";

interface Props {
  item: WorkshopItem;
}

const WorkshopCard = ({ item }: Props) => {
  const full = item.remaining === 0;
  const featured = item.service === PresentationService.PACKAGE;
  const workshop = item.service === PresentationService.WORKSHOP;

  let label = "پکیج";
  if (!featured) {
    label = item.service === PresentationService.TALK ? "ارائه" : "کارگاه عملی";
  }

  const isOnline = () => {
    return item.tags.find((tag) => tag === "Online");
  };

  const getTagClass = (tag: string) => {
    switch (tag) {
      case "Online":
        return "bg-dark-gray text-white";
      case "In-Person":
        return "bg-secondary text-primary";
      case "Beginner":
        return "bg-green-800 text-green-100";
      case "Intermediate":
        return "bg-blue-800 text-blue-100";
      case "Advanced":
        return "bg-red-800 text-red-100";
      default:
        return "bg-dark-gray text-white";
    }
  };

  const actionClass =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray";

  return (
    <article
      className={`group flex min-w-0 flex-col overflow-hidden rounded-xl ${
        featured
          ? "bg-primary text-white md:col-span-2 md:grid md:grid-cols-[.75fr_1.25fr] xl:col-span-3"
          : workshop
          ? "border border-secondary/40 bg-white text-primary"
          : "border border-primary/15 bg-white text-primary"
      }`}
    >
      <div
        className={`relative flex h-44 items-center justify-center overflow-hidden ${
          featured
            ? "bg-dark-gray md:h-full md:min-h-72"
            : workshop
            ? "bg-secondary/15"
            : item.imageTone
        }`}
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className={`w-4/5 object-contain transition-transform duration-300 motion-safe:group-hover:scale-105 ${
            featured ? "h-36 md:h-64" : "h-36"
          }`}
        />
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-extrabold ${
            featured || workshop
              ? "bg-secondary text-primary"
              : "bg-white text-primary"
          }`}
        >
          {workshop && (
            <HiWrenchScrewdriver
              className="size-4 shrink-0"
              aria-hidden="true"
            />
          )}
          {label}
        </span>
        {full && (
          <span className="absolute bottom-3 left-3 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white">
            ظرفیت تکمیل
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          {/* {item.level && (
            <>
              <span className={featured ? "text-indigo" : "text-dark-gray"}>
                {item.level}
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span className={featured ? "text-indigo" : "text-dark-gray"}>
            {item.tags.join(" / ")}
          </span> */}
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center justify-center rounded-full px-4 py-1 pt-1.5 font-bold ${getTagClass(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-black leading-9" dir="auto">
          {item.title}
        </h3>
        {item.englishTitle && item.englishTitle !== item.title && (
          <p
            dir="ltr"
            className={`mt-1 text-right text-sm font-medium ${
              featured ? "text-indigo" : "text-dark-gray"
            }`}
          >
            {item.englishTitle}
          </p>
        )}
        <p
          className={`mt-3 line-clamp-2 text-sm leading-7 ${
            featured ? "text-text-gray" : "text-dark-gray"
          }`}
          dir="auto"
        >
          {item.description}
        </p>
        <dl
          className={`mt-5 grid grid-cols-2 gap-x-3 gap-y-3 text-xs sm:text-sm ${
            featured ? "text-text-gray" : "text-dark-gray"
          }`}
        >
          <div className="flex items-center gap-2">
            <dt>
              <HiCalendarDays className="size-4" aria-label="روز برگزاری" />
            </dt>
            <dd>{item.dateLabel}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>
              <HiClock className="size-4" aria-label="زمان برگزاری" />
            </dt>
            <dd>{item.time}</dd>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <dt>
              <HiUser className="size-4" aria-label="ارائه‌دهنده" />
            </dt>
            <dd>{item.presenter}</dd>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <dt>
              {item.service === PresentationService.TALK ? (
                <HiVideoCamera className="size-4" aria-label="نوع برگزاری" />
              ) : (
                <HiMapPin className="size-4" aria-label="نوع برگزاری" />
              )}
            </dt>
            <dd>
              {item.tags.includes("Online")
                ? "آنلاین"
                : "حضوری · دانشگاه امیرکبیر"}
            </dd>
          </div>
        </dl>
        <div
          className={`mt-6 flex flex-1 flex-wrap items-end justify-between gap-3`}
        >
          <div
            className={`flex w-full flex-wrap items-center justify-between gap-3 border-t pt-5 ${
              featured ? "border-indigo/30" : "border-primary/15"
            }`}
          >
            <div>
              <p className="text-lg font-extrabold">
                {item.price === 0 ? (
                  "رایگان"
                ) : (
                  <>
                    {digitsToPersian((item.price / 1000).toString())}
                    <span
                      className={`ms-1 text-xs font-normal ${
                        featured ? "text-text-gray" : "text-dark-gray"
                      }`}
                    >
                      هزار تومان
                    </span>
                  </>
                )}
              </p>
              <p
                className={`mt-1 text-xs ${
                  featured ? "text-indigo" : "text-dark-gray"
                }`}
              >
                {full
                  ? "ظرفیت تکمیل شده"
                  : !item.registrationActive
                  ? "ثبت‌نام بسته است"
                  : `${digitsToPersian(item.remaining.toString())} جای خالی`}
              </p>
            </div>
            <Link
              to={`/workshop/${item.id}`}
              className={`${actionClass} ${
                featured
                  ? "bg-secondary text-primary hover:bg-[#e58210]"
                  : "bg-text-white text-primary hover:bg-indigo/25"
              }`}
            >
              {workshop ? "جزئیات کارگاه" : "جزئیات ارائه"}
              <HiArrowLeft aria-hidden="true" />
            </Link>
          </div>
        </div>
        <WorkshopCartAction
          id={item.id}
          unavailable={full || !item.registrationActive}
          featured={featured}
        />
      </div>
    </article>
  );
};

export default WorkshopCard;
