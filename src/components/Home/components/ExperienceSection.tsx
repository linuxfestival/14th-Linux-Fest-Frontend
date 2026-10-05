import "./ExperienceSection.css";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

const experiences = [
  {
    title: "۱۵ سال کنار هم، با لینوکس",
    copy: "از روزهایی که لینوکس رو روی سی‌دی دست‌به‌دست می‌کردیم تا امروز که بیشتر از همیشه، همه‌جا می‌بینیمش؛ امسال برای پانزدهمین سال لینوکس‌فست رو برگزار می‌کنیم. دور هم جمع می‌شیم تا از هم یاد بگیریم، تجربه‌هامون رو به اشتراک بذاریم و دوست‌های تازه پیدا کنیم.",
    image: "/assets/event.png",
    imageAlt: "ارائه‌دهندگان روی صحنه لینوکس‌فست در کنار نمایشگر کد",
    width: 1280,
    height: 853,
    links: [
      { label: "قالب رویداد", to: "/event-format" },
      { label: "زمان‌بندی رویداد", to: "#programs" },
    ],
  },
  {
    title: "جلسه‌های عمیق فنی",
    copy: "اینجا وقت داریم از آشنایی اولیه با یک موضوع جلوتر بریم و سر از جزئیاتش دربیاریم. با هم یاد می‌گیریم، چیزهای تازه می‌بینیم و با فناوری‌هایی آشنا می‌شیم که شاید تا امروز سراغشون نرفته بودیم. فرصتی برای پرسیدن، بحث کردن و دقیق‌تر فهمیدنِ چیزهایی که برامون جالبن.",
    image: "/assets/agha-reza.png",
    imageAlt: "ارائه‌دهنده پشت تریبون در یکی از ارائه‌های لینوکس‌فست",
    width: 1280,
    height: 853,
    links: [{ label: "مشاهده ارائه‌ها", to: "/workshops" }],
  },
  {
    title: "روز کامیونیتی",
    englishTitle: "Community Day",
    copy: "این بار دور هم جمع می‌شیم تا ببینیم توی دنیای لینوکس و متن‌باز چه خبره و بقیه مشغول چه کارهایی هستن. ارائه‌های ۴۵ دقیقه‌ای فرصتی‌ان برای شنیدن تجربه‌ها، آشنا شدن با ایده‌های تازه و دنبال کردن اتفاقات جدیده. لابه‌لای این گفت‌وگوها هم گپ می‌زنیم، دوست پیدا می‌کنیم و کمی تفریح می‌کنیم.",
    image: "/assets/conference.png",
    imageAlt: "شرکت‌کنندگان لینوکس‌فست در سالن همایش",
    width: 1280,
    height: 853,
    links: [{ label: "پرسش‌های متداول", to: "/faq" }],
  },
];

const ExperienceSection = () => (
  <section
    className="experience-wash experience-montage bg-text-white px-6 py-14 text-primary sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    dir="rtl"
    aria-labelledby="experience-heading"
  >
    <div className="mx-auto max-w-7xl">
      {experiences.map((experience, index) => (
        <article
          key={experience.title}
          className="grid grid-cols-1 items-center gap-8 border-b border-primary/15 py-12 first:pt-0 last:border-b-0 last:pb-0 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20 xl:gap-20"
        >
          <div
            className={`min-w-0 montage-photo ${index % 2 === 1 ? "lg:order-2" : ""}`}
          >
            <img
              className="h-auto w-full rounded-xl"
              src={experience.image}
              alt={experience.imageAlt}
              width={experience.width}
              height={experience.height}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0 text-right">
            <h2
              id={index === 0 ? "experience-heading" : undefined}
              className="text-3xl font-black leading-snug text-balance sm:text-4xl xl:text-[2.75rem]"
            >
              {experience.title}
              {experience.englishTitle && (
                <span
                  className="mt-2 block text-xl font-bold leading-normal text-dark-gray sm:text-2xl"
                  dir="ltr"
                  lang="en"
                >
                  {experience.englishTitle}
                </span>
              )}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-pretty text-dark-gray sm:text-lg sm:leading-9">
              {experience.copy}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {experience.links.map((link, linkIndex) => {
                const className = `inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border px-5 py-3 text-base font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${linkIndex === 0 ? "border-transparent bg-secondary text-primary hover:bg-secondary/85 active:bg-secondary/75" : "border-primary text-primary hover:bg-primary hover:text-text-white active:bg-dark-gray active:text-text-white"}`;

                return link.to.startsWith("#") ? (
                  <a key={link.to} href={link.to} className={className}>
                    {link.label}
                    <HiArrowLeft
                      className="size-5 shrink-0"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <Link key={link.to} to={link.to} className={className}>
                    {link.label}
                    <HiArrowLeft
                      className="size-5 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ExperienceSection;
