import React from "react";
import aut from "../../assets/aut.png";
import anjoman from "../../assets/anjoman.png";
import sponsor from "../../assets/sponsor.png";
import Telegram from "../Icons/Telegram";
import Instagram from "../Icons/Instagram";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full flex flex-col gap-10 md:gap-0 md:flex-row justify-around py-10 px-20 bg-light-gray">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex gap-8">
          <img src={aut} alt="aut logo" />
          <img src={anjoman} alt="anjoman logo" />
          <img src={sponsor} alt="sponsor logo" />
        </div>
        <p className="mt-4 w-full text-center">
          دیوار و انجمن علمی دانشگاه صنعتی امیرکبیر (پلی تکنیک تهران)
        </p>
        <div className="flex gap-4 mt-12">
          <Telegram />
          <Instagram />
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center gap-2">
        <h1 className="text-4xl font-bold text-white">خانه</h1>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center gap-2">
        <h1 className="text-4xl font-bold text-white">خانه</h1>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center gap-2">
        <h1 className="text-4xl font-bold text-white">خانه</h1>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
        <Link to="/" className="text-xl text-text-gray">
          ارائه ها
        </Link>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <a
          referrerPolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=3005496&Code=4nCyEMqgOWcxyAcI9OKFBiBEfbzaL1qc"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=3005496&Code=4nCyEMqgOWcxyAcI9OKFBiBEfbzaL1qc"
            alt=""
            style={{ cursor: "pointer" }}
            //@ts-ignore
            code="4nCyEMqgOWcxyAcI9OKFBiBEfbzaL1qc"
          />
          <img
            src="/enamad.png"
            alt=""
            width={100}
            style={{ borderRadius: "12px" }}
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
