import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const paragraph = "mt-3 max-w-prose text-base leading-8 text-dark-gray";
const heading = "text-xl font-extrabold leading-9 sm:text-2xl";
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const EventFormat = () => (
  <div className="min-h-dvh bg-text-white text-primary" dir="rtl">
    <Header />
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
      <h1 className="text-3xl font-black leading-snug sm:text-5xl">
        لینوکس‌فست چه شکلیه؟
      </h1>
      <p className={`${paragraph} mt-5`}>
        سه روز برای یاد گرفتن، امتحان کردن و آشنا شدن با هم. از ارائه‌های آنلاین
        و جشن نصب تا کارگاه‌های عملی و دورهمی جمعه؛ اینجا ببین هر بخش چطور
        برگزار می‌شه و قبل از شرکت چه چیزهایی رو باید بررسی کنی.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        <nav
          aria-label="روزهای رویداد"
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {[
              ["wednesday", "چهارشنبه"],
              ["thursday", "پنج‌شنبه"],
              ["friday", "جمعه"],
            ].map(([id, day]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`flex min-h-11 items-center rounded-lg px-4 py-3 font-bold underline decoration-primary/25 underline-offset-8 hover:bg-primary/5 hover:decoration-primary ${focus}`}
                >
                  {day}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <section
            id="wednesday"
            aria-labelledby="wednesday-heading"
            className="scroll-mt-32 border-t border-primary/20 pt-6"
          >
            <h2
              id="wednesday-heading"
              className="text-3xl font-black leading-snug"
            >
              چهارشنبه
            </h2>
            <article className="mt-7">
              <h3 className={heading}>ارائه‌های آنلاین</h3>
              <p className={paragraph}>
                چهارشنبه، ارائه‌های آنلاین درباره لینوکس، متن‌باز و موضوع‌های
                فنی مرتبط داریم. ارائه‌دهندگان بین‌المللی هم در این بخش حضور
                دارن و جلسه‌ها ممکنه به فارسی یا انگلیسی باشن.
              </p>
              <p className={paragraph}>
                پیش‌زمینه لازم به موضوع هر جلسه بستگی داره. قبل از انتخاب،
                توضیحات همون ارائه رو بخون تا ببینی زبان و سطحش با چیزی که
                دنبالش هستی جور درمیاد یا نه.
              </p>
            </article>
            <article className="mt-9">
              <h3 className={heading}>جشن نصب لینوکس</h3>
              <p className={paragraph}>
                «جشن نصب» یا <bdi lang="en">Install Fest</bdi> جاییه که می‌تونی
                برای نصب لینوکس روی کامپیوترت از بقیه کمک بگیری. اگر با لینوکس
                آشنا نیستی، می‌تونی سوال‌هات رو بپرسی و با علاقه‌مندان لینوکس و
                متن‌باز گپ بزنی.
              </p>
              <p className="mt-5 max-w-prose rounded-xl bg-indigo/15 px-5 py-4 text-base leading-8 text-primary">
                قصد نصب لینوکس داری؟ قبل از اومدن، راهنمای آمادگی جشن نصب رو
                بررسی کن تا بدونی چه چیزهایی رو باید از قبل آماده کنی.
              </p>
            </article>
          </section>

          <section
            id="thursday"
            aria-labelledby="thursday-heading"
            className="mt-14 scroll-mt-32 border-t border-primary/20 pt-6"
          >
            <h2
              id="thursday-heading"
              className="text-3xl font-black leading-snug"
            >
              پنج‌شنبه
            </h2>
            <article className="mt-7">
              <h3 className={heading}>ارائه‌های فنی</h3>
              <p className={paragraph}>
                هر ارائه روی یک موضوع مشخص تمرکز می‌کنه. ارائه‌دهنده موضوع رو
                توضیح می‌ده و تو با گوش دادن و دنبال کردن بحث، درباره‌اش یاد
                می‌گیری. بعضی جلسه‌ها به دانش قبلی نیاز دارن؛ همه ارائه‌ها از
                مقدمات شروع نمی‌کنن.
              </p>
            </article>
            <article className="mt-9">
              <h3 className={heading}>کارگاه‌های عملی</h3>
              <p className={paragraph}>
                در کارگاه، خودت هم دست به کار می‌شی و چیزهایی رو امتحان می‌کنی.
                تفاوتش با ارائه همینه: در ارائه بیشتر شنونده‌ای و بحث رو دنبال
                می‌کنی؛ در کارگاه، انجام دادن بخشی از یادگیریه.
              </p>
              <p className={paragraph}>
                قبل از ثبت‌نام، صفحه هر کارگاه رو بخون. پیش‌نیازها، تجهیزات لازم
                و کارهایی که باید از قبل انجام بدی به همون کارگاه بستگی دارن.
              </p>
            </article>
            <Link
              to="/workshops"
              className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm py-2 font-bold text-orange-ink underline underline-offset-8 hover:text-primary ${focus}`}
            >
              مشاهده ارائه‌ها و کارگاه‌ها
              <HiArrowLeft aria-hidden="true" />
            </Link>
          </section>

          <section
            id="friday"
            aria-labelledby="friday-heading"
            className="mt-14 scroll-mt-32 border-t border-primary/20 pt-6"
          >
            <h2
              id="friday-heading"
              className="text-3xl font-black leading-snug"
            >
              جمعه
            </h2>
            <h3 className={`${heading} mt-7`}>دورهمی علاقه‌مندان لینوکس و متن‌باز</h3>
            <p className={paragraph}>
              جمعه از حدود ظهر تا شب دور هم جمع می‌شیم: ارائه‌های کوتاه‌تر
              می‌شنویم، با پروژه‌ها آشنا می‌شیم و قصه‌ها و تجربه‌هامون رو با هم
              به اشتراک می‌ذاریم. موضوع‌ها گسترده‌تر از یک تخصص فنی هستن و
              لزوماً فنی نیستن.
            </p>
            <p className={paragraph}>
              حال‌وهوای این بخش از دورهمی‌های گروه‌های کاربران لینوکس الهام
              گرفته: آدم‌ها همدیگه رو می‌بینن، گوش می‌دن، سوال می‌پرسن و
              تجربه‌هاشون رو ردوبدل می‌کنن. این دورهمی هم بخشی از لینوکس‌فسته؛
              فرصتی برای گفت‌وگو و آشنا شدن با هم.
            </p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default EventFormat;
