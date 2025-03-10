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
            <Link to="https://aut.ac.ir/" target={"_blank"}>
              <img src={aut} alt="aut logo"/>
            </Link>

              <img src={anjoman} alt="anjoman logo"/>
            <Link to="https://divar.ir/" target={"_blank"}>
              <img src={sponsor} alt="sponsor logo"/>
            </Link>
          </div>
          <p className="mt-4 w-full text-center" >
            دیوار و انجمن علمی دانشگاه صنعتی امیرکبیر (پلی تکنیک تهران)
          </p>
          <div className="flex gap-4 mt-12">
            <Link to="https://t.me/linuxfest" target={"_blank"}>
              <Telegram/>
            </Link>
            <Link to="https://www.instagram.com/linuxfest.aut/" target={"_blank"}>
              <Instagram/>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center items-center gap-2">
          <h1 className="text-4xl font-bold text-white">داکر</h1>
          <Link to="/" className="text-xl text-text-gray">
            ارائه x
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه y
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه z
          </Link>
        </div>

        <div className="hidden lg:flex flex-col justify-center items-center gap-2">
          <h1 className="text-4xl font-bold text-white">مقدماتی</h1>
          <Link to="/" className="text-xl text-text-gray">
            ارائه x
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه y
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه z
          </Link>
        </div>

        <div className="hidden lg:flex flex-col justify-center items-center gap-2">
          <h1 className="text-4xl font-bold text-white">پیشرفته</h1>
          <Link to="/" className="text-xl text-text-gray">
            ارائه x
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه y
          </Link>
          <Link to="/" className="text-xl text-text-gray">
            ارائه z
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
                style={{cursor: "pointer"}}
                //@ts-ignore
                code="4nCyEMqgOWcxyAcI9OKFBiBEfbzaL1qc"
            />
            <img
                src="/enamad.png"
                alt=""
                width={100}
                style={{borderRadius: "12px"}}
            />
          </a>
        </div>
      </div>
  );
};

export default Footer;
