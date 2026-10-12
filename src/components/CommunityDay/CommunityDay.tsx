import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiCamera,
  HiGift,
  HiMapPin,
  HiTicket,
  HiUserGroup,
} from "react-icons/hi2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import WorkshopCartAction from "../WorkshopsList/components/WorkshopCartAction";
import { useAppDispatch } from "../../store";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import { getCartThunk } from "../../core/cart/cart.thunk";
import arianAhmadi from "../../assets/community/arian-ahmidi.jpg";
import mohammadMoslemi from "../../assets/community/mohammad-moslemi.jpg";
import erfanAlimohammadi from "../../assets/community/erfan-alimohammadi.jpg";
import mohammadParvin from "../../assets/community/mohammad-parvin.jpg";
import arianEbrahimpour from "../../assets/community/arian-ebrahimpour.jpg";
import mostafaMeshkati from "../../assets/community/mostafa-meshkati.jpg";
import tux from "../../assets/community/tux.png";
import "./CommunityDay.css";
import { digitsToPersian } from "../../utils/digitsToPersian";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const MARQUEE_COPIES = [0, 1, 2];
const COMMUNITY_DAY_PRESENTATION_ID = 24;

const talks = [
  {
    speaker: "محمد پروین",
    title: "Open source tools for Vibe coding",
    detail:
      "ابزارهای متن‌بازی که می‌توانند در مسیر Vibe coding همراه یک تیم و ایده‌هایش باشند.",
    time: "13:30 - 14:15",
    image: mohammadParvin,
  },
  {
    speaker: "آرین ابراهیم‌پور",
    title: "نجات اپن‌سورس در دنیای بعد از AI",
    detail:
      "گفت‌وگویی درباره‌ی جای متن‌باز در جهانی که AI شکل ساختن و استفاده از نرم‌افزار را تغییر می‌دهد.",
    time: "14:15 - 15:00",
    image: arianEbrahimpour,
  },
  {
    speaker: "سید مصطفی مشکاتی",
    title:
      "تجربه‌ی سرو مدل‌های open-weight: گلوگاه‌ها کجا بودن و چطور ردشون کردیم",
    detail:
      "از تجربه‌ی سرو مدل‌های open-weight در دیوار و عبور از گلوگاه‌های واقعی می‌شنویم.",
    time: "15:30 - 16:15",
    image: mostafaMeshkati,
  },
  {
    speaker: "آرین احمدی",
    title: "چطور به کامپیوترهای ذغالی فرصت دوباره دادیم؟",
    detail:
      "از جان دوباره دادن به کامپیوترهای قدیمی می‌شنویم؛ تجربه‌ای درباره‌ی فرصت‌هایی که هنوز تمام نشده‌اند.",
    time: "16:15 - 17:00",
    image: arianAhmadi,
  },
  {
    speaker: "محمد مسلمی",
    title: "از کدنویس به معمار: چگونه AI نقش‌های شغلی IT را بازتعریف می‌کند.",
    detail:
      "نگاهی به تغییر نقش‌های شغلی IT در دوره‌ای که ابزارهای هوش مصنوعی هر روز نزدیک‌تر می‌شوند.",
    time: "17:30 - 18:15",
    image: mohammadMoslemi,
  },
  {
    speaker: "عرفان علی‌محمدی",
    title: "Quantitative Finance",
    detail:
      "یک ارائه درباره‌ی Quantitative Finance و جایی که داده، مدل و تصمیم‌گیری به هم می‌رسند.",
    time: "18:15 - 19:00",
    image: erfanAlimohammadi,
  },
];

const CommunityDay = () => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(selectIsAuthenticated);
  const [activeTalk, setActiveTalk] = useState(0);
  const timelineItems = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const items = timelineItems.current.filter(
      (item): item is HTMLButtonElement => item !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target instanceof HTMLElement)
          setActiveTalk(Number(visible.target.dataset.index));
      },
      { rootMargin: "-38% 0px -46% 0px", threshold: [0.1, 0.35, 0.7] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (authenticated)
      void dispatch(getCartThunk({ suppressErrorToast: true }));
  }, [authenticated, dispatch]);

  const active = talks[activeTalk];

  return (
    <div
      className="community-day min-h-dvh bg-[#f4efe4] text-primary"
      dir="rtl"
    >
      <section className="community-hero isolate overflow-hidden text-primary">
        <Header landing landingOnLight />
        <div className="community-hero__year" aria-hidden="true">
          15
        </div>
        <div className="community-hero__layout mx-auto w-full max-w-7xl px-6 pb-12 pt-12 sm:px-8 lg:px-10 lg:pb-18 lg:pt-18">
          <div className="community-hero__copy">
            <div className="community-hero__headline">
              <p className="text-base font-bold tracking-wide">
                جمعه، ۲۴ مهر ۱۴۰۵ · ۱۳:۰۰ تا ۱۹:۰۰
              </p>
              <h1>
                روز
                <br />
                <span style={{ color: "#f2a11b" }}>جامعه</span>
              </h1>
              <p className="community-hero__intro">
                دورهمی برای افراد علاقه‌مند به نرم‌افزار آزاد و متن‌باز، با
                ارائه‌های کوتاه و فرصت شبکه‌سازی.
              </p>
            </div>
            <div className="community-hero__cta">
              <div className="community-hero__actions mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <WorkshopCartAction
                  id={COMMUNITY_DAY_PRESENTATION_ID}
                  unavailable={false}
                  featured={false}
                  redirectTo="/profile/cart/list"
                  labels={{
                    add: "خرید بلیت",
                    inCart: "مشاهده سبد خرید",
                    purchased: "ثبت‌نام شده",
                  }}
                  icon={<HiTicket className="size-5" aria-hidden="true" />}
                  className={`community-ticket ${focus} !mt-0 !w-full !rounded-full sm:!w-auto`}
                />
                <a
                  href="#lineup"
                  className={`community-hero__lineup-link inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-8 hover:text-white ${focus}`}
                >
                  ارائه‌دهندگان{" "}
                  <HiArrowLeft className="size-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div
            className="community-hero__collage"
            aria-label="تصاویر موقت ارائه‌دهندگان"
          >
            <img src={tux} alt="" className="community-hero__mascot" />
          </div>
        </div>
        <div className="community-hero__marquee" aria-hidden="true" dir="ltr">
          <div className="community-hero__marquee-track">
            {MARQUEE_COPIES.map((copy) => (
              <div
                className="community-hero__marquee-group"
                key={copy}
                dir="ltr"
              >
                LINUXFEST · COMMUNITY DAY · 15TH EDITION · LINUXFEST · COMMUNITY
                DAY ·
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>
        <section className="community-invitation px-6 py-18 sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <h2>یک روز به یاد ماندنی!</h2>
            <p>
              بین هر دو ارائه، زمان کوتاهی برای شبکه‌سازی، بازی‌های کوچک و
              فوتوبوث داریم. آخر روز هم یک یادگاری کوچک با خودت می‌بری.
            </p>
          </div>
        </section>

        <section
          id="schedule"
          className="community-schedule bg-[#17213c] px-6 py-18 text-[#f7f1e5] sm:px-8 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="community-schedule__heading">
              <h2>ارائه‌های روز جامعه</h2>
            </div>
            <div className="community-schedule__layout mt-14 lg:mt-18">
              <aside
                className="community-talk-detail lg:sticky lg:top-28 lg:self-start"
                aria-live="polite"
              >
                <div className="community-talk-detail__image-wrap">
                  <img
                    key={active.image}
                    src={active.image}
                    alt={`تصویر موقت ${active.speaker}`}
                    className="community-talk-detail__image"
                  />
                  <span>ارائه {digitsToPersian(activeTalk + 1)} از ۶</span>
                </div>
                <div className="community-talk-detail__body">
                  <p className="font-bold text-[#f2a11b]">{active.speaker}</p>
                  <h3>{active.title}</h3>
                  <p>{active.detail}</p>
                </div>
              </aside>
              <ol className="community-talk-list" aria-label="فهرست ارائه‌ها">
                {talks.map((talk, index) => (
                  <li key={talk.speaker}>
                    <button
                      ref={(element) => {
                        timelineItems.current[index] = element;
                      }}
                      data-index={index}
                      type="button"
                      onClick={() => setActiveTalk(index)}
                      onFocus={() => setActiveTalk(index)}
                      onMouseEnter={() => setActiveTalk(index)}
                      aria-current={activeTalk === index ? "step" : undefined}
                      className={activeTalk === index ? "is-active" : ""}
                    >
                      <span className="community-talk-list__number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="community-talk-list__content">
                        <strong>{talk.title}</strong>
                        <small>{talk.speaker}</small>
                      </span>
                      <span className="community-talk-list__time" dir="ltr">
                        {digitsToPersian(talk.time)}
                      </span>
                    </button>
                  </li>
                ))}
                <li className="community-finale">
                  <HiGift aria-hidden="true" /> اختتامیه و پایان
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section
          id="lineup"
          className="community-lineup px-6 py-18 sm:px-8 lg:px-10 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="community-lineup__head">
              <h2>ارائه‌دهندگان</h2>
            </div>
            <div className="community-lineup__grid">
              {talks.map((talk, index) => (
                <article key={talk.speaker}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <img
                    src={talk.image}
                    alt={`تصویر ${talk.speaker}`}
                    loading="lazy"
                  />
                  <div>
                    <h3>{talk.speaker}</h3>
                    <p>{talk.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="community-location px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <h2>جمعه عصر، پلی‌تکنیک تهران.</h2>
              <p>۱۳:۰۰ تا ۱۹:۰۰ · دانشگاه صنعتی امیرکبیر</p>
            </div>
            <div className="community-location__facts">
              <p>
                <HiCalendarDays aria-hidden="true" /> جمعه، ۲۴ مهر ۱۴۰۵
              </p>
              <p>
                <HiMapPin aria-hidden="true" /> دانشگاه صنعتی امیرکبیر، سالن
                مولانا
              </p>
              <WorkshopCartAction
                id={COMMUNITY_DAY_PRESENTATION_ID}
                unavailable={false}
                featured={false}
                redirectTo="/profile/cart/list"
                labels={{
                  add: "خرید بلیت",
                  inCart: "مشاهده سبد خرید",
                  purchased: "ثبت‌نام شده",
                }}
                icon={<HiTicket className="size-5" aria-hidden="true" />}
                className="community-location__ticket !mt-7 !w-auto !rounded-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityDay;
