import SponsorMessage from "../../Sponsor/SponsorMessage";
import sponsor from "../../../assets/sponsor-with-text.png";
import "./SponsorsSection.css";

const SponsorsSection = () => (
  <section
    aria-labelledby="sponsor-heading"
    className="sponsor-section px-6 py-16 text-primary sm:px-8 md:py-20 lg:px-10"
    dir="rtl"
  >
    <div className="relative mx-auto max-w-7xl">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
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
          <blockquote
            aria-label="پیام همکاران سیستم"
            cite="http://sgmg.ir/sg-developers"
            className="mx-0 mb-0 mt-6 max-w-[75ch]"
          >
            <SponsorMessage />
          </blockquote>
        </div>

        <div className="flex min-h-64 flex-col items-center justify-center gap-8 border-t border-dark-gray/20 py-12 text-center lg:min-h-96 lg:self-stretch lg:border-t-0 lg:border-s lg:ps-8">
          <img
            className="max-h-40 w-full max-w-72 object-contain lg:max-h-48 lg:max-w-80"
            src={sponsor}
            alt="لوگوی همکاران سیستم"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

export default SponsorsSection;
