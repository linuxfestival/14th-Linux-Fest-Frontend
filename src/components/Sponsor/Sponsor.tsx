import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import SponsorMessage from "./SponsorMessage";
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
        <SponsorMessage />
      </blockquote>
    </main>
    <Footer />
  </div>
);

export default Sponsor;
