import React from "react";
import { Link } from "react-router-dom";
import aut from "../../assets/aut.png";
import anjoman from "../../assets/anjoman.png";
import sponsor from "../../assets/sponsor.png";
import Telegram from "../Icons/Telegram";
import Instagram from "../Icons/Instagram";
import Twitter from "../Icons/Twitter";

const footerGroups = [
  {
    title: "شروع لینوکس!",
    links: [
      { label: "کارگاه مقدماتی", to: "/workshop/17" },
      { label: "Docker & Kubernetes", to: "/workshop/15" },
    ],
  },
  {
    title: "DevOps",
    links: [
      { label: "کارگاه مقدماتی", to: "/workshop/17" },
      { label: "The GitOps Journey", to: "/workshop/4" },
      { label: "Cloud-Native Monitoring", to: "/workshop/11" },
    ],
  },
  {
    title: "Containerization",
    links: [
      { label: "Docker & Kubernetes", to: "/workshop/15" },
      { label: "Kubernetes Controllers", to: "/workshop/13" },
    ],
  },
];

const Footer = () => (
  <footer className="bg-dark-gray text-text-white" dir="rtl">
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="grid gap-12 border-b border-indigo/35 pb-12 lg:grid-cols-[minmax(15rem,1.35fr)_repeat(3,minmax(0,1fr))] lg:gap-8 lg:pb-14">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-right">
          <div className="flex items-center gap-4">
            <Link to="https://aut.ac.ir/" target="_blank" rel="noreferrer" aria-label="دانشگاه صنعتی امیرکبیر">
              <img className="size-14 object-contain" src={aut} alt="نشان دانشگاه صنعتی امیرکبیر" />
            </Link>
            <img className="size-14 object-contain" src={anjoman} alt="نشان انجمن علمی" />
            <Link to="https://divar.ir/" target="_blank" rel="noreferrer" aria-label="دیوار">
              <img className="size-14 object-contain" src={sponsor} alt="نشان دیوار" />
            </Link>
          </div>
          <p className="mt-5 max-w-[30ch] text-sm leading-7 text-text-gray">دیوار و انجمن علمی دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)</p>
          <div className="mt-6 flex items-center gap-3" aria-label="شبکه‌های اجتماعی">
            <Link className="rounded-full outline-offset-4 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-secondary" to="https://t.me/linuxfest" target="_blank" rel="noreferrer" aria-label="تلگرام لینوکس‌فست"><Telegram className="size-10" /></Link>
            <Link className="rounded-full outline-offset-4 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-secondary" to="https://x.com/LinuxFestival" target="_blank" rel="noreferrer" aria-label="اکس لینوکس‌فست"><Twitter /></Link>
            <Link className="rounded-full outline-offset-4 transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-secondary" to="https://www.instagram.com/linuxfest.aut/" target="_blank" rel="noreferrer" aria-label="اینستاگرام لینوکس‌فست"><Instagram className="size-10" /></Link>
          </div>
        </div>

        {footerGroups.map((group) => (
          <section key={group.title} className="text-center lg:text-right">
            <h2 className="m-0 text-xl font-black text-white">{group.title}</h2>
            <ul className="mt-5 space-y-3 p-0 text-sm text-text-gray" role="list">
              {group.links.map((link) => (
                <li key={link.to}><Link className="underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-secondary" to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center text-xs text-text-gray sm:flex-row sm:text-right">
        <p className="m-0">لینوکس‌فست · دانشگاه صنعتی امیرکبیر</p>
        <a className="rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-secondary" referrerPolicy="origin" target="_blank" rel="noreferrer" href="https://trustseal.enamad.ir/?id=3005496&Code=4nCyEMqgOWcxyAcI9OKFBiBEfbzaL1qc">
          <img className="h-12 w-auto object-contain" src="/enamad.png" alt="نماد اعتماد الکترونیکی" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
