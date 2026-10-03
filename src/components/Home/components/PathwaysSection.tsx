import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import Microphone from "../../../assets/images/mic.png";
import TerminalIllustration from "../../../assets/images/terminal.png";
import UsbIllustration from "../../../assets/images/usb.png";

const pathways = [
  {
    title: "ارائه‌ و گفت‌وگو",
    copy: "ارائه های تخصصی و گفت‌وگو با متخصصین و علاقه‌مندان جامعه متن‌باز.",
    image: Microphone,
    imageAlt: "تصویر میکروفون",
  },
  {
    title: "کارگاه‌های عملی",
    copy: "یادگیری و انجام پروژه‌های عملی در کارگاه‌های تخصصی و عمومی.",
    image: TerminalIllustration,
    imageAlt: "تصویر ترمینال",
  },
  {
    title: "جشن نصب",
    copy: "لپ‌تاپت رو بیار تا به کمک هم لینوکس نصب کنیم!",
    image: UsbIllustration,
    imageAlt: "تصویر پنگوئن و فلش نصب",
  },
];
// const linkClass =
//   "inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-8 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary";

const PathwaysSection = () => (
  <section
    className="bg-[radial-gradient(circle_at_20%_54%,#e2f6ff,transparent_24%),#f7fbfc] px-6 py-16 sm:px-8 md:py-20 lg:px-10"
    dir="rtl"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-right text-base font-bold leading-7">
        لینوکس بهونه است!
        <strong className="mt-1 block text-[clamp(2rem,4vw,4rem)] leading-[.95] tracking-[-.07em]">
          اینجا ما{" "}
          <em className="not-italic text-orange-ink">
            یاد میگیریم و دوستای جدید پیدا می کنیم
          </em>{" "}
        </strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {pathways.map(({ title, copy, image, imageAlt }, index) => (
          <article
            key={title}
            className={`flex min-h-72 flex-col items-center border-b border-[#53719c] py-8 text-right last:border-b-0 md:border-b-0 md:border-l md:px-8 md:py-6 ${index === pathways.length - 1 ? "md:border-l-0" : ""}`}
          >
            <img
              className="mb-5 h-28 w-40 object-contain object-right md:h-32 md:w-44"
              src={image}
              alt={imageAlt}
            />
            <h2 className="m-0 text-2xl font-black">{title}</h2>
            <p className="mt-3 max-w-[28ch] text-base leading-7">{copy}</p>
            {/* <Link
              className={`${linkClass} mt-auto decoration-primary hover:text-dark-gray`}
              to="/workshops"
            >
              بیشتر بدانید
              <HiArrowLeft />
            </Link> */}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default PathwaysSection;
