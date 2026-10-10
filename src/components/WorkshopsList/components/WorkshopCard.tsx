import { Link } from "react-router-dom";
import { HiArrowLeft, HiCalendarDays, HiClock, HiVideoCamera, HiMapPin, HiCommandLine, HiMicrophone, HiSquares2X2 } from "react-icons/hi2";
import { PresentationService } from "../../../core/presentations/presentations.dto";
import { digitsToPersian } from "../../../utils/digitsToPersian";
import type { WorkshopItem } from "../workshops.adapter";
import WorkshopCartAction from "./WorkshopCartAction";
import PresentationTags from "./PresentationTags";
import PresenterAvatar from "../../Presenters/PresenterAvatar";

const WorkshopCard = ({ item }: { item: WorkshopItem }) => {
  const full = item.remaining === 0;
  const featured = item.service === PresentationService.PACKAGE;
  const workshop = item.service === PresentationService.WORKSHOP;
  const Icon = featured ? HiSquares2X2 : workshop ? HiCommandLine : HiMicrophone;
  const label = featured ? "پکیج" : workshop ? "کارگاه عملی" : "ارائه";
  const online = item.tags.includes("Online");
  const inPerson = item.tags.includes("In-Person");
  const tags = item.tags.filter((tag) => tag !== "Online" && tag !== "In-Person");
  const description = item.description.trim();
  const secondary = featured ? "text-text-gray" : "text-dark-gray";

  return (
    <article className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border transition-colors ${featured ? "border-primary bg-primary text-white md:col-span-2 xl:col-span-3" : workshop ? "border-secondary/45 bg-secondary/5 text-primary hover:border-orange-ink/60" : "border-primary/15 bg-white text-primary hover:border-dark-gray/45"}`}>
      {item.hasArtwork && <img src={item.image} alt={item.imageAlt} loading="lazy" className="h-32 w-full bg-indigo/15 object-contain p-3 sm:h-40" />}
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className={`mb-4 flex items-center justify-between gap-3 ${featured ? "text-secondary" : workshop ? "text-orange-ink" : "text-dark-gray"}`}>
          <span className="inline-flex items-center gap-2 text-xs font-extrabold"><Icon className="size-6" aria-hidden="true" />{label}</span>
          {full && <span className={`text-xs font-bold ${secondary}`}>ظرفیت تکمیل</span>}
        </div>
        <h2 className="text-[1.375rem] font-black leading-8 sm:text-2xl sm:leading-9" dir="auto">
          <Link to={`/workshop/${item.id}`} className="rounded-sm underline-offset-8 decoration-secondary decoration-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">{item.title}</Link>
        </h2>
        {item.englishTitle && item.englishTitle !== item.title && <p dir="ltr" className={`mt-1 text-right text-xs sm:text-sm ${secondary}`}>{item.englishTitle}</p>}
        {item.presenters.length > 0 && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 sm:mt-4" aria-label="ارائه‌دهنده">
          {item.presenters.map((presenter, index) => <span key={`${presenter.name}-${index}`} className="flex min-w-0 max-w-full items-center gap-2.5"><PresenterAvatar key={presenter.avatar} avatar={presenter.avatar} name={presenter.name} className="size-10" /><span className={`min-w-0 break-words text-sm font-bold ${secondary}`} dir="auto">{presenter.name}</span></span>)}
        </div>}
        {description && description !== "-" && <p dir="auto" className={`mt-3 line-clamp-2 text-sm leading-7 sm:mt-4 ${secondary}`}>{description}</p>}
        {tags.length > 0 && <div className="mt-3"><PresentationTags tags={tags} featured={featured} /></div>}
        <dl className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-6 tabular-nums sm:mt-5 ${secondary}`}>
          <div className="flex items-center gap-1.5"><dt><HiCalendarDays className="size-4" aria-label="روز برگزاری" /></dt><dd>{item.dateLabel}</dd></div>
          <div className="flex items-center gap-1.5"><dt><HiClock className="size-4" aria-label="زمان برگزاری" /></dt><dd>{item.time}</dd></div>
          {(online || inPerson) && <div className="flex items-center gap-1.5"><dt>{online ? <HiVideoCamera className="size-4" aria-label="نوع برگزاری" /> : <HiMapPin className="size-4" aria-label="نوع برگزاری" />}</dt><dd>{online ? "آنلاین" : "حضوری"}</dd></div>}
        </dl>
        <div className="mt-auto pt-4 sm:pt-5">
          <div className={`flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${featured ? "border-indigo/30" : "border-primary/15"}`}>
            <div>
              <p className="text-lg font-extrabold tabular-nums">{item.price === 0 ? "رایگان" : <>{digitsToPersian((item.price / 1000).toString())}<span className={`ms-1 text-xs font-normal ${secondary}`}>هزار تومان</span></>}</p>
              <p className={`mt-1 text-xs ${secondary}`}>{full ? "ظرفیت تکمیل شده" : !item.registrationActive ? "ثبت‌نام بسته است" : `${digitsToPersian(item.remaining.toString())} جای خالی`}</p>
            </div>
            <Link to={`/workshop/${item.id}`} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${featured ? "text-indigo" : "text-dark-gray"}`}>
              {workshop ? "جزئیات کارگاه" : featured ? "جزئیات پکیج" : "جزئیات ارائه"}<HiArrowLeft aria-hidden="true" className="size-4 transition-transform motion-safe:group-hover:-translate-x-1" />
            </Link>
          </div>
          <WorkshopCartAction id={item.id} unavailable={full || !item.registrationActive} featured={featured} />
        </div>
      </div>
    </article>
  );
};

export default WorkshopCard;
