import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiMapPin,
  HiUser,
  HiUsers,
  HiCheckCircle,
  HiShoppingBag,
} from "react-icons/hi2";
import { FaLinkedin } from "react-icons/fa";
import {
  PresentationService,
  type PresentationDto,
} from "../../core/presentations/presentations.dto";
import { toWorkshopItem } from "../WorkshopsList/workshops.adapter";
import { digitsToPersian } from "../../utils/digitsToPersian";

interface Props {
  presentation: PresentationDto;
  inCart: boolean;
  authenticated: boolean;
  pending: boolean;
  onUpdateCart: () => void;
}

const richTextClass =
  "max-w-none break-words text-sm leading-8 text-dark-gray sm:text-base [&_p+p]:mt-4 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-bold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-1 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-orange-ink [&_img]:h-auto [&_img]:max-w-full [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-text-white [&_pre]:p-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto";

const WorkshopDetails = ({
  presentation,
  inCart,
  authenticated,
  pending,
  onUpdateCart,
}: Props) => {
  const item = toWorkshopItem(presentation);
  const [language, setLanguage] = useState<"fa" | "en">(
    presentation.fa_description ? "fa" : "en",
  );
  const full = item.remaining <= 0;
  const unavailable = full || !item.registrationActive;
  const format =
    item.service === PresentationService.TALK
      ? "ارائه و گفت‌وگو"
      : item.service === PresentationService.PACKAGE
        ? "پکیج یادگیری"
        : "کارگاه عملی";
  const dateTime = (date: Date) =>
    new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  const multiDay =
    new Date(presentation.end).getTime() -
      new Date(presentation.start).getTime() >
    24 * 60 * 60 * 1000;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
      <section
        aria-labelledby="program-title"
        className="min-w-0 rounded-xl bg-primary p-6 text-white sm:p-8 lg:p-10"
      >
        <h1
          id="program-title"
          dir={presentation.fa_title ? "rtl" : "ltr"}
          className="break-words text-3xl font-black leading-snug sm:text-4xl lg:text-5xl"
        >
          {item.title}
        </h1>
        {item.englishTitle && item.englishTitle !== item.title && (
          <p
            dir="ltr"
            className="mt-4 text-right text-base leading-7 text-indigo"
          >
            {item.englishTitle}
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="rounded-md bg-secondary px-3 py-2 font-bold text-primary">
            {format}
          </span>
          <span className="flex items-center gap-2 text-text-gray">
            <HiCalendarDays aria-hidden="true" className="size-4 shrink-0" />
            {item.dateLabel}
          </span>
          <span className="flex items-center gap-2 text-text-gray">
            <HiUser aria-hidden="true" className="size-4 shrink-0" />
            {item.presenter || "ارائه‌دهنده اعلام نشده"}
          </span>
        </div>
        {item.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-indigo/25 pt-5 text-xs text-indigo">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </section>

      <aside
        aria-label="اطلاعات ثبت‌نام"
        className="min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-white lg:sticky lg:top-28 lg:col-start-2 lg:row-span-3"
      >
        <div
          className={`flex h-44 items-center justify-center sm:h-52 ${item.imageTone}`}
        >
          <img
            src={item.image}
            alt={item.imageAlt}
            className="h-36 w-4/5 object-contain sm:h-44"
          />
        </div>
        <div className="p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">اطلاعات ارائه</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <HiCalendarDays
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-dark-gray"
              />
              <div>
                <dt className="text-dark-gray">شروع ارائه</dt>
                <dd className="mt-1 font-bold leading-6">
                  {dateTime(presentation.start)}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiClock
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-dark-gray"
              />
              <div>
                <dt className="text-dark-gray">پایان ارائه</dt>
                <dd className="mt-1 font-bold leading-6">
                  {dateTime(presentation.end)}
                </dd>
              </div>
            </div>
            {(presentation.id === 17 || presentation.id === 15) && (
              <p className="rounded-lg bg-text-white p-3 text-xs leading-6 text-dark-gray">
                زمان پایان روز اول کارگاه، ۱۹:۰۰ و زمان شروع روز دوم ساعت ۹:۰۰
                است.
              </p>
            )}
            <div className="flex items-start gap-3">
              <HiMapPin
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-dark-gray"
              />
              <div>
                <dt className="text-dark-gray">نوع برگزاری</dt>
                <dd className="mt-1 font-bold">
                  {item.service === PresentationService.TALK
                    ? "آنلاین"
                    : "حضوری"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiUsers
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-dark-gray"
              />
              <div>
                <dt className="text-dark-gray">ظرفیت باقی‌مانده</dt>
                <dd className="mt-1 font-bold">
                  {digitsToPersian(String(item.remaining))} از{" "}
                  {digitsToPersian(String(presentation.capacity))} نفر
                </dd>
              </div>
            </div>
          </dl>
          {multiDay && (
            <p className="mt-4 text-xs leading-6 text-dark-gray">
              این ارائه در چند روز برگزار می‌شود؛ زمان شروع و پایان را بررسی کن.
            </p>
          )}
          <div className="mt-6 border-t border-primary/15 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-dark-gray">هزینه ثبت‌نام</span>
              <p className="text-2xl font-black">
                {item.price === 0 ? (
                  "رایگان"
                ) : (
                  <>
                    {digitsToPersian((item.price / 1000).toString())}
                    <span className="ms-1 text-xs font-normal text-dark-gray">
                      هزار تومان
                    </span>
                  </>
                )}
              </p>
            </div>
            <p className="mt-3 text-xs text-dark-gray">
              {full
                ? "ظرفیت این ارائه تکمیل شده است."
                : !item.registrationActive
                  ? "ثبت‌نام این ارائه بسته است."
                  : "ثبت‌نام این ارائه باز است."}
            </p>
            {inCart && (
              <p
                role="status"
                className="mt-4 flex items-center gap-2 text-sm font-bold text-dark-gray"
              >
                <HiCheckCircle aria-hidden="true" className="size-5" />
                این ارائه در سبد خرید توست.
              </p>
            )}
            <button
              type="button"
              onClick={onUpdateCart}
              disabled={pending || (unavailable && !inCart)}
              aria-busy={pending}
              className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${inCart ? "bg-primary text-white hover:bg-dark-gray" : "bg-secondary text-primary hover:bg-[#e58210]"}`}
            >
              <HiShoppingBag aria-hidden="true" className="size-5" />
              {pending
                ? "در حال به‌روزرسانی…"
                : inCart
                  ? "حذف از سبد خرید"
                  : unavailable
                    ? "ثبت‌نام در دسترس نیست"
                    : "اضافه به سبد خرید"}
            </button>
            {inCart ? (
              <Link
                to="/profile/cart/list"
                className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold text-dark-gray hover:bg-text-white focus-visible:outline-2 focus-visible:outline-primary"
              >
                مشاهده سبد خرید
                <HiArrowLeft aria-hidden="true" className="size-4" />
              </Link>
            ) : (
              !authenticated &&
              !unavailable && (
                <p className="mt-4 text-center text-xs leading-6 text-dark-gray">
                  برای ثبت‌نام،{" "}
                  <Link
                    to="/login"
                    className="font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    وارد حساب کاربری شو.
                  </Link>
                </p>
              )
            )}
          </div>
        </div>
      </aside>

      <section
        aria-labelledby="description-title"
        className="min-w-0 rounded-xl bg-white p-6 sm:p-8 lg:col-start-1"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-primary/15 pb-5">
          <h2 id="description-title" className="text-xl font-black sm:text-2xl">
            درباره این ارائه
          </h2>
          {presentation.fa_description && presentation.en_description && (
            <div
              role="group"
              aria-label="زبان توضیحات"
              className="flex gap-1 rounded-lg bg-text-white p-1"
            >
              {(
                [
                  ["fa", "فارسی"],
                  ["en", "English"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  lang={value}
                  aria-pressed={language === value}
                  onClick={() => setLanguage(value)}
                  className={`min-h-10 rounded-md px-4 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${language === value ? "bg-primary text-white" : "text-dark-gray hover:bg-indigo/20"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {presentation.fa_description || presentation.en_description ? (
          <div
            dir={language === "fa" ? "rtl" : "ltr"}
            lang={language}
            className={richTextClass}
            dangerouslySetInnerHTML={{
              __html:
                language === "fa"
                  ? presentation.fa_description
                  : presentation.en_description,
            }}
          />
        ) : (
          <p className="text-sm leading-8 text-dark-gray">
            توضیحات این ارائه هنوز منتشر نشده است.
          </p>
        )}
      </section>

      <section
        aria-labelledby="presenters-title"
        className="min-w-0 lg:col-start-1"
      >
        <h2
          id="presenters-title"
          className="mb-5 text-xl font-black sm:text-2xl"
        >
          با ارائه‌دهندگان آشنا شو
        </h2>
        {presentation.presenters.length ? (
          <div className="divide-y divide-primary/15 rounded-xl bg-white px-6 sm:px-8">
            {presentation.presenters.map((presenter, index) => (
              <div key={`${presenter.email}-${index}`} className="py-6 sm:py-8">
                <div className="flex items-center gap-4">
                  <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo/20 sm:size-20">
                    <HiUser
                      aria-hidden="true"
                      className="size-8 text-dark-gray"
                    />
                    {presenter.avatar ? (
                      <img
                        src={presenter.avatar}
                        alt={`${presenter.first_name} ${presenter.last_name}`}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-extrabold">
                      {presenter.first_name} {presenter.last_name}
                    </h3>
                    {presenter.linkedin && (
                      <a
                        href={presenter.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-10 items-center gap-2 rounded-sm text-xs text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <FaLinkedin aria-hidden="true" className="size-4" />
                        پروفایل لینکدین
                        <span className="sr-only"> (در پنجره جدید)</span>
                      </a>
                    )}
                  </div>
                </div>
                {presenter.description && (
                  <div
                    dir="auto"
                    className={`mt-5 ${richTextClass}`}
                    dangerouslySetInnerHTML={{ __html: presenter.description }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-6 text-sm text-dark-gray">
            ارائه‌دهندگان این ارائه به‌زودی معرفی می‌شوند.
          </p>
        )}
      </section>
    </div>
  );
};

export default WorkshopDetails;
