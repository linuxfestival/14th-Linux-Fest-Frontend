import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";

const BundlesSection = () => (
  <section aria-labelledby="home-bundles-heading" className="bg-secondary px-6 py-12 text-primary sm:px-8 sm:py-16 lg:px-10" dir="rtl">
    <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,.75fr)] lg:gap-16">
      <h2 id="home-bundles-heading" className="text-4xl font-black leading-snug text-balance sm:text-5xl lg:text-6xl">
        چند تجربه،<br />یک بسته.
      </h2>
      <div>
        <p className="max-w-xl text-base leading-8 sm:text-lg sm:leading-9">
          بسته‌ها، چند ارائه و کارگاه رو کنار هم قرار می‌دن. برنامه‌های هر بسته رو ببین و همه رو با یک قیمت مشخص انتخاب کن.
        </p>
        <Link to="/bundles" className="group mt-6 inline-flex min-h-12 items-center justify-center gap-4 rounded-lg bg-primary px-6 py-4 text-sm font-extrabold text-white transition-colors hover:bg-dark-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:w-full">
          دیدن بسته‌ها
          <HiArrowLeft aria-hidden="true" className="size-5 transition-transform motion-safe:group-hover:-translate-x-1" />
        </Link>
      </div>
    </div>
  </section>
);

export default BundlesSection;
