import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiComputerDesktop,
  HiVideoCamera,
  HiMapPin,
  HiCommandLine,
  HiMicrophone,
  HiSquares2X2,
  HiTicket,
  HiUserGroup,
} from "react-icons/hi2";
import { PresentationService } from "../../../core/presentations/presentations.dto";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import type { WorkshopItem } from "../workshops.adapter";
import WorkshopCartAction from "./WorkshopCartAction";
import PresentationTags from "./PresentationTags";
import PresenterAvatar from "../../Presenters/PresenterAvatar";

const WorkshopCard = ({ item }: { item: WorkshopItem }) => {
  const full = item.remaining === 0;
  const isInstallFest =
    item.id === 23 && item.service === PresentationService.PACKAGE;
  const isCommunityDay =
    item.id === 24 && item.service === PresentationService.PACKAGE;
  const featured =
    item.service === PresentationService.PACKAGE && !isInstallFest;
  const workshop = item.service === PresentationService.WORKSHOP;
  const Icon =
    featured || isInstallFest
      ? HiSquares2X2
      : workshop
        ? HiCommandLine
        : HiMicrophone;
  const label = isInstallFest
    ? "Install Fest"
    : isCommunityDay
      ? "روز جامعه"
      : featured
        ? "پکیج"
        : workshop
          ? "کارگاه عملی"
          : "ارائه";
  const online = item.tags.includes("Online");
  const inPerson = item.tags.includes("In-Person");
  const tags = item.tags.filter(
    (tag) => tag !== "Online" && tag !== "In-Person",
  );
  const description = item.description.trim();
  const secondary = featured ? "text-text-gray" : "text-dark-gray";
  const detailsPath = isInstallFest
    ? "/install-fest"
    : isCommunityDay
      ? "/community-day"
      : `/workshop/${item.id}`;

  const kireKhar10roozenakhabidam = (x: number) => {
    // if (x <= 20) return Math.max(x - 5, 0);
    // if (x <= 50) return Math.max(x - 17, 15);

    // return Math.max(x - 22, 33);
    return x;
  };

  if (isCommunityDay) {
    return (
      <article className="group relative isolate overflow-hidden rounded-2xl bg-[#111a35] text-[#fff8eb] shadow-[0_18px_38px_rgba(17,26,53,.2)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_26px_48px_rgba(17,26,53,.3)] md:col-span-2 xl:col-span-3">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border-[26px] border-[#f2a11b]/25" />
        <div className="pointer-events-none absolute -bottom-28 left-[38%] size-64 rounded-full bg-[#f2a11b]/10 blur-3xl" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-12 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-extrabold text-[#f7bc4d]">
              <span className="inline-flex items-center gap-2">
                <HiUserGroup className="size-5" aria-hidden="true" />
                روز جامعه
              </span>
              <span className="h-1 w-1 rounded-full bg-[#f7bc4d]/70" />
              <bdi lang="en" className="tracking-wide">
                Community Day
              </bdi>
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-.03em] sm:text-5xl">
              یک روز برای آدم‌های جامعه‌ی لینوکس
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#d8e0f0] sm:text-base">
              دورهمی‌ای برای اشتراک تجربه، ارائه‌های کوتاه و آشنایی با آدم‌هایی
              که مثل تو به لینوکس و متن‌باز علاقه دارند.
            </p>
          </div>

          <div className="border-t border-[#fff8eb]/20 pt-6 lg:border-t-0 lg:border-r lg:pr-8 lg:pt-0">
            <dl className="space-y-3 text-sm font-bold text-[#d8e0f0] tabular-nums">
              <div className="flex items-center gap-2">
                <HiCalendarDays
                  className="size-5 text-[#f7bc4d]"
                  aria-hidden="true"
                />
                <dd>{item.dateLabel}</dd>
              </div>
              <div className="flex items-center gap-2">
                <HiClock className="size-5 text-[#f7bc4d]" aria-hidden="true" />
                <dd>{item.time}</dd>
              </div>
              <div className="flex items-center gap-2">
                <HiMapPin
                  className="size-5 text-[#f7bc4d]"
                  aria-hidden="true"
                />
                <dd>دانشگاه صنعتی امیرکبیر</dd>
              </div>
            </dl>
            <div className="mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-lg font-black tabular-nums text-[#fff8eb]">
                  {item.price === 0
                    ? "رایگان"
                    : `${digitsToPersian((item.price / 1000).toString())} هزار تومان`}
                </p>
              </div>
              <Link
                to={detailsPath}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#f7bc4d] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7bc4d]"
              >
                جزئیات روز
                <HiArrowLeft
                  className="size-4 transition-transform motion-safe:group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <WorkshopCartAction
              id={item.id}
              unavailable={full || !item.registrationActive}
              featured
              labels={{
                add: "خرید بلیت روز جامعه",
                purchased: "ثبت‌نام شده",
              }}
              icon={<HiTicket className="size-5" aria-hidden="true" />}
              className="!mt-5 !inline-flex !min-h-12 !items-center !justify-center !gap-2 !rounded-xl !bg-[#f2a11b] !text-primary hover:!bg-[#f7bc4d] focus-visible:!outline-[#f7bc4d]"
            />
          </div>
        </div>
      </article>
    );
  }

  if (isInstallFest) {
    return (
      <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-secondary/70 bg-[#fff6e8] text-primary transition-colors hover:border-orange-ink">
        <div className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full border-[18px] border-secondary/15" />
        <div className="relative flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold text-orange-ink">
              <HiComputerDesktop className="size-5" aria-hidden="true" />
              <bdi lang="en">Install Fest</bdi>
            </span>
            <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-extrabold text-orange-ink">
              رایگان
            </span>
          </div>

          <h2
            className="mt-7 text-3xl font-black leading-tight sm:text-4xl"
            dir="ltr"
          >
            <Link
              to="/install-fest"
              className="rounded-sm underline-offset-8 decoration-secondary decoration-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              Install Fest
            </Link>
          </h2>
          <p className="mt-3 max-w-md text-base leading-8 text-dark-gray">
            لپ‌تاپت رو بیار تا با هم لینوکس نصب کنیم و گپ بزنیم.
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-y border-secondary/30 py-4 text-xs leading-6 text-dark-gray tabular-nums">
            <div className="flex items-center gap-1.5">
              <dt>
                <HiCalendarDays className="size-4" aria-label="روز برگزاری" />
              </dt>
              <dd>{item.dateLabel}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>
                <HiClock className="size-4" aria-label="زمان برگزاری" />
              </dt>
              <dd>{item.time}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>
                <HiMapPin className="size-4" aria-label="نوع برگزاری" />
              </dt>
              <dd>حضوری</dd>
            </div>
          </dl>

          <div className="mt-auto pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-extrabold">
                {full
                  ? "ظرفیت تکمیل شده"
                  : !item.registrationActive
                    ? "ثبت‌نام بسته است"
                    : `${digitsToPersian(kireKhar10roozenakhabidam(item.remaining).toString())} جای خالی`}
              </p>
              <Link
                to="/install-fest"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                درباره <bdi lang="en">Install Fest</bdi>
                <HiArrowLeft
                  aria-hidden="true"
                  className="size-4 transition-transform motion-safe:group-hover:-translate-x-1"
                />
              </Link>
            </div>
            <WorkshopCartAction
              id={item.id}
              unavailable={full || !item.registrationActive}
              featured={false}
              labels={{
                add: "افزودن Install Fest به سبد خرید",
                purchased: "ثبت‌نام شده",
              }}
              className="!bg-primary !text-white hover:!bg-dark-gray"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border transition-colors ${featured ? "border-primary bg-primary text-white md:col-span-2 xl:col-span-3" : isInstallFest ? "border-secondary/70 bg-[#fff7e9] text-primary hover:border-orange-ink" : workshop ? "border-secondary/45 bg-secondary/5 text-primary hover:border-orange-ink/60" : "border-primary/15 bg-white text-primary hover:border-dark-gray/45"}`}
    >
      {item.hasArtwork && (
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-32 w-full bg-indigo/15 object-contain p-3 sm:h-40"
        />
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div
          className={`mb-4 flex items-center justify-between gap-3 ${featured ? "text-secondary" : isInstallFest || workshop ? "text-orange-ink" : "text-dark-gray"}`}
        >
          <span className="inline-flex items-center gap-2 text-xs font-extrabold">
            <Icon className="size-6" aria-hidden="true" />
            {label}
          </span>
          {full && (
            <span className={`text-xs font-bold ${secondary}`}>
              ظرفیت تکمیل
            </span>
          )}
        </div>
        <h2
          className="text-[1.375rem] font-black leading-8 sm:text-2xl sm:leading-9"
          dir="auto"
        >
          <Link
            to={detailsPath}
            className="rounded-sm underline-offset-8 decoration-secondary decoration-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            {item.title}
          </Link>
        </h2>
        {item.englishTitle && item.englishTitle !== item.title && (
          <p
            dir="ltr"
            className={`mt-1 text-right text-xs sm:text-sm ${secondary}`}
          >
            {item.englishTitle}
          </p>
        )}
        {item.presenters.length > 0 && (
          <div
            className="mt-3 flex flex-wrap gap-x-4 gap-y-2 sm:mt-4"
            aria-label="ارائه‌دهنده"
          >
            {item.presenters.map((presenter, index) => (
              <span
                key={`${presenter.name}-${index}`}
                className="flex min-w-0 max-w-full items-center gap-2.5"
              >
                <PresenterAvatar
                  key={presenter.avatar}
                  avatar={presenter.avatar}
                  name={presenter.name}
                  className="size-10"
                />
                <span
                  className={`min-w-0 break-words text-sm font-bold ${secondary}`}
                  dir="auto"
                >
                  {presenter.name}
                </span>
              </span>
            ))}
          </div>
        )}
        {description && description !== "-" && (
          <p
            dir="auto"
            className={`mt-3 line-clamp-2 text-sm leading-7 sm:mt-4 ${secondary}`}
          >
            {description}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-3">
            <PresentationTags tags={tags} featured={featured} />
          </div>
        )}
        <dl
          className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-6 tabular-nums sm:mt-5 ${secondary}`}
        >
          <div className="flex items-center gap-1.5">
            <dt>
              <HiCalendarDays className="size-4" aria-label="روز برگزاری" />
            </dt>
            <dd>{item.dateLabel}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt>
              <HiClock className="size-4" aria-label="زمان برگزاری" />
            </dt>
            <dd>{item.time}</dd>
          </div>
          {(online || inPerson) && (
            <div className="flex items-center gap-1.5">
              <dt>
                {online ? (
                  <HiVideoCamera className="size-4" aria-label="نوع برگزاری" />
                ) : (
                  <HiMapPin className="size-4" aria-label="نوع برگزاری" />
                )}
              </dt>
              <dd>{online ? "آنلاین" : "حضوری"}</dd>
            </div>
          )}
        </dl>
        <div className="mt-auto pt-4 sm:pt-5">
          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${featured ? "border-indigo/30" : "border-primary/15"}`}
          >
            <div>
              <p className="text-lg font-extrabold tabular-nums">
                {item.price === 0 ? (
                  "رایگان"
                ) : (
                  <>
                    {digitsToPersian((item.price / 1000).toString())}
                    <span className={`ms-1 text-xs font-normal ${secondary}`}>
                      هزار تومان
                    </span>
                  </>
                )}
              </p>
              <p className={`mt-1 text-xs ${secondary}`}>
                {full
                  ? "ظرفیت تکمیل شده"
                  : !item.registrationActive
                    ? "ثبت‌نام بسته است"
                    : `${digitsToPersian(kireKhar10roozenakhabidam(item.remaining).toString())} جای خالی`}
              </p>
            </div>
            <Link
              to={detailsPath}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${featured ? "text-indigo" : "text-dark-gray"}`}
            >
              {isInstallFest
                ? "درباره Install Fest"
                : isCommunityDay
                  ? "جزئیات روز جامعه"
                  : workshop
                    ? "جزئیات کارگاه"
                    : featured
                      ? "جزئیات پکیج"
                      : "جزئیات ارائه"}
              <HiArrowLeft
                aria-hidden="true"
                className="size-4 transition-transform motion-safe:group-hover:-translate-x-1"
              />
            </Link>
          </div>
          <WorkshopCartAction
            id={item.id}
            unavailable={full || !item.registrationActive}
            featured={featured}
            labels={
              isInstallFest
                ? {
                    add: "افزودن Install Fest به سبد خرید",
                    purchased: "ثبت‌نام شده",
                  }
                : isCommunityDay
                  ? {
                      add: "خرید بلیت روز جامعه",
                      purchased: "ثبت‌نام شده",
                    }
                  : undefined
            }
          />
        </div>
      </div>
    </article>
  );
};

export default WorkshopCard;
