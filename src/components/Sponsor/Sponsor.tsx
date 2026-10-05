import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../Home/components/SponsorsSection.css";

const Sponsor = () => (
  <div className="sponsor-section min-h-dvh text-primary" dir="rtl">
    <Header />
    <main className="mx-auto w-full max-w-[calc(75ch+4rem)] px-6 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
      <Link
        to="/"
        className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-bold text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <HiArrowRight className="size-5" aria-hidden="true" />
        بازگشت به خانه
      </Link>
      <div className="flex flex-col m-0 max-w-max text-orange-ink text-3xl font-black leading-snug text-balance sm:text-5xl">
        <p>همکاران سیستم</p>
        <p className="text-primary text-lg sm:text-xl mt-2">
          حامی این دوره از لینوکس فست
        </p>
      </div>
      <blockquote
        aria-label="پیام همکاران سیستم"
        cite="http://sgmg.ir/sg-developers"
        className="mx-0 mb-0 mt-4 border-t border-dark-gray/20 pt-8 sm:mt-5 sm:pt-10"
      >
        <div className="space-y-6 text-base leading-9 text-dark-gray">
          <p>
            شرکت اطلاعات مدیریت، یا همون کارخانه تولید نرم‌افزار همکاران سیستم،
            جاییه که بیش از ۴۰۰ نفر از برنامه‌نویس‌ها، متخصصان تست و تحلیل و
            آدم‌های فنی مختلف، هر روز با مسئله‌های واقعی توسعه نرم‌افزار سروکله
            می‌زنن. محصولاتی که این تیم‌ها توسعه می‌دن، امروز در بیش از ۱۰۰ هزار
            کسب‌وکار استفاده می‌شن و همین باعث می‌شه با چالش‌های فنی مختلفی از
            طراحی و معماری نرم‌افزار گرفته تا توسعه، تست و مقیاس‌پذیری روبه‌رو
            باشیم.
          </p>
          <p>
            برای ما، کار کردن با نرم‌افزار فقط نوشتن کد و تحویل یک محصول نیست.
            یاد گرفتن، تجربه کردن، امتحان کردن راه‌های مختلف و به اشتراک گذاشتن
            چیزهایی که در این مسیر یاد می‌گیریم، بخش مهمی از کارمونه. برای همین
            همیشه از بودن در کنار آدم‌های فنی و فرصت‌هایی که باعث می‌شن با آدم‌های
            علاقه‌مند به تکنولوژی و توسعه نرم‌افزار آشنا بشیم، استقبال می‌کنیم.
          </p>
          <p>
            خوشحالیم که این بار در <bdi dir="ltr">Linux Fest</bdi> دانشگاه صنعتی
            امیرکبیر کنار شما هستیم و امیدواریم این رویداد فرصتی باشه برای
            آشنایی، گپ‌وگفت و ردوبدل کردن تجربه بین آدم‌هایی که دنیای نرم‌افزار
            رو جدی دنبال می‌کنن.
          </p>
          <p>
            اگر دوست دارید بیشتر با تیم توسعه نرم‌افزار همکاران سیستم و
            حوزه‌هایی که توشون فعالیت می‌کنیم آشنا بشید، سری به ما بزنید:
            <a
              href="http://sgmg.ir/sg-developers"
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="mt-3 flex min-h-11 w-fit items-center rounded-sm font-bold text-orange-ink underline decoration-orange-ink/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              sgmg.ir/sg-developers
            </a>
          </p>
        </div>
      </blockquote>
    </main>
    <Footer />
  </div>
);

export default Sponsor;
