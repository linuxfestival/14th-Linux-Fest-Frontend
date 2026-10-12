import { Link } from "react-router-dom";
import { HiArrowLeft, HiSquares2X2 } from "react-icons/hi2";

const BundlesBanner = () => (
  <section aria-labelledby="bundles-banner-heading" className="mb-10 overflow-hidden rounded-xl bg-primary p-6 text-white sm:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <div className="flex items-start gap-4 sm:gap-5">
        <HiSquares2X2 aria-hidden="true" className="mt-1 hidden size-14 shrink-0 text-secondary sm:block" />
        <div className="min-w-0">
          <h2 id="bundles-banner-heading" className="text-2xl font-black leading-snug sm:text-3xl">
            چند برنامه، <span className="text-secondary">یک انتخاب.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-text-gray">
            بسته‌ها رو ببین و ارائه‌ها و کارگاه‌ها رو با یک قیمت مشخص، یکجا انتخاب کن.
          </p>
        </div>
      </div>
      <Link to="/bundles" className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-lg bg-secondary px-5 py-3 text-sm font-extrabold text-primary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary max-sm:w-full lg:px-6">
        دیدن بسته‌ها
        <HiArrowLeft aria-hidden="true" className="size-5 transition-transform motion-safe:group-hover:-translate-x-1" />
      </Link>
    </div>
  </section>
);

export default BundlesBanner;
