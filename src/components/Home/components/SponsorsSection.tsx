import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import sponsor from "../../../assets/sponsor.png";
import "./SponsorsSection.css";

const SponsorsSection = () => (
  <section
    aria-labelledby="sponsor-heading"
    className="sponsor-section px-6 py-16 text-primary sm:px-8 md:py-20 lg:px-10"
    dir="rtl"
  >
    <div className="relative mx-auto max-w-7xl">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <div className="text-right">
          <h2
            id="sponsor-heading"
            className="m-0 text-4xl font-black leading-snug text-balance sm:text-5xl lg:text-6xl"
          >
            با همراهی <em className="not-italic text-secondary">حامی ما</em>
          </h2>
          <p className="mb-0 mt-5 text-base leading-8 text-dark-gray">
            برگزاری این رویداد بدون حمایت مالی و معنوی حامیان ما امکان‌پذیر
            نبود. از همراهی و اعتماد شما سپاسگزاریم.
          </p>
          <Link
            to="/sponsor"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-text-white no-underline transition-colors hover:bg-dark-gray active:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            پیام حامی
            <HiArrowLeft className="size-5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-4 min-h-36 items-center justify-center border-t border-dark-gray/20 pt-10 text-center md:min-h-48 md:border-t-0 md:border-s md:ps-16 md:pt-0 lg:ps-24">
          <img
            className="max-h-16 w-auto md:max-h-24"
            src={sponsor}
            alt="لوگوی همکاران سیستم"
            loading="lazy"
          />
          <p className="m-0 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-relaxed text-dark-gray">
            همکاران سیستم
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default SponsorsSection;
