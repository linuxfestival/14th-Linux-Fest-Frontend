import { Link } from "react-router-dom";
import AutLogo from "../../../assets/aut.png";
import AnjomanLogo from "../../../assets/anjoman.png";
import DivarLogo from "../../../assets/sponsor.png";

const sponsors = [
  {
    name: "دانشگاه صنعتی امیرکبیر",
    logo: AutLogo,
    to: "https://aut.ac.ir/",
  },
  {
    name: "انجمن علمی",
    logo: AnjomanLogo,
  },
  {
    name: "دیوار",
    logo: DivarLogo,
    to: "https://divar.ir/",
  },
];

const SponsorsSection = () => (
  <section className="bg-text-white px-6 py-16 text-primary sm:px-8 md:py-20 lg:px-10" dir="rtl">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 border-b border-[#53719c] pb-8 text-right sm:flex-row sm:items-end">
        <h2 className="m-0 text-[clamp(2.5rem,5vw,5rem)] font-black leading-[.95] tracking-[-.06em]">
          با همراهی <em className="not-italic text-orange-ink">حامیان</em>
        </h2>
        <p className="m-0 max-w-[28ch] text-base leading-7 text-dark-gray">
          لینوکس‌فست با حمایت جامعه و همراهانش برگزار می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#53719c] md:grid-cols-3 md:divide-x md:divide-y-0 md:[direction:ltr]">
        {sponsors.map(({ name, logo, to }) => {
          const content = (
            <>
              <img className="h-20 w-36 object-contain" src={logo} alt={name} />
              <span className="mt-5 text-sm font-bold text-dark-gray">{name}</span>
            </>
          );

          return to ? (
            <Link
              className="flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center no-underline outline-offset-4 transition-colors hover:bg-[#e2f6ff] focus-visible:outline-2 focus-visible:outline-secondary md:[direction:rtl]"
              key={name}
              to={to}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </Link>
          ) : (
            <div
              className="flex min-h-48 flex-col items-center justify-center px-6 py-8 text-center md:[direction:rtl]"
              key={name}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
