import React, { useCallback, useState } from "react";
import Header from "../Header/Header";
import { useEffect, useRef } from "react";
import MatrixEffect from "./components/MatrixEffect";
import Banner from "../../assets/linuxAndServers.png";
import typingLinux from "../../assets/typingLinux.png";
import { FaAngleDoubleDown } from "react-icons/fa";
import InfoCard from "./components/InfoCard";
import { GrLocation } from "react-icons/gr";
import {
  IoBag,
  IoBagCheck,
  IoCash,
  IoLocation,
  IoLocationSharp,
  IoPeople,
  IoTime,
} from "react-icons/io5";
import { digitsToPersian } from "../../utils/digitsToPersian";
import Divider from "../Divider/Divider";
import { Form, Link } from "react-router-dom";
import InputField from "../Common/Button/Input";
import ContestRegistration from "./components/ContestRegistration";
import ContestTimer from "./components/ContestTimer";
import { RiCashLine } from "react-icons/ri";
import Footer from "../Footer/Footer";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import Button from "../Common/Button/Button";
import { registerCompetitionThunk } from "../../core/payment/payment.thunk";
import { RootState, useAppDispatch } from "../../store";
import { toast } from "react-toastify";

const Contest = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector((state: RootState) => state.payment.loading);

  const registerForContest = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("لطفا ابتدا وارد شوید");
      return;
    }
    dispatch(registerCompetitionThunk());
  }, [isAuthenticated]);

  return (
    <div className="relative w-full flex flex-col justify-center items-center overflow-hidden">
      <Header contestStyle sticky={false} />
      <div className="absolute top-0 left-0 w-full h-[100dvh] z-0">
        <MatrixEffect />
        <div className="absolute -bottom-1 h-1/2 w-full bg-gradient-to-b from-transparent from-0% to-primary to-80%">
          <div className="absolute bottom-5 w-full flex justify-center items-center gap-2 text-center text-2xl text-white/30">
            <FaAngleDoubleDown className="animate-bounce" />
            <p>اطلاعات بیشتر</p>
            <FaAngleDoubleDown className="animate-bounce" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full z-1">
        {/* Hero Section */}
        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 h-[100dvh] px-10">
          <motion.img
            src={Banner}
            className="min-w-[300px] w-7/16"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="text-center sm:text-right text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold flex flex-col gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
              چالش{" "}
              <span className="text-[#FFDD03] drop-shadow-[0_0_8px_rgba(255,221,3,0.25)]">
                DevOps
              </span>{" "}
              و{" "}
              <span className="text-[#15FAB4] drop-shadow-[0_0_8px_rgba(21,250,180,0.25)]">
                لینوکسی
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-4xl text-text-gray mr-4">
              قدرت واقعی ابزارهای Open Source رو نشون بده!
            </p>
          </motion.div>
        </div>

        <div className="relative px-4 md:px-20 flex justify-start items-start xl:items-center pt-8 mt-10 h-max overflow-hidden">
          <motion.div
            className="w-full lg:w-2/3 flex flex-col justify-center item-start lg:items-center relative h-full pb-15 mr-0 md:mr-25"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-3xl lg:text-6xl font-bold text-white mt-16 sm:mt-28 lg:mt-42"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              چرا این مسابقه؟
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl xl:text-3xl text-text-gray w-full lg:w-3/4 mt-4 md:mt-10 lg:text-center md:leading-12 max-w-[700px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              دنیای واقعی DevOps پر از چالش‌های متنوعه: دیباگ کردن یه سرویس در
              حال Crash، مدیریت لاگ‌ها، ساختن اسکریپت‌هایی که زندگی رو آسون کنن،
              و حتی فقط پیدا کردن یه فایل وسط دنیای فایل‌سیستم. تو این مسابقه،
              باید با استفاده از قدرت ابزارهای لینوکس، یه سری مراحل رو یکی‌یکی
              پشت سر بذاری — دقیقاً مثل یه DevOps Engineer واقعی. باهاش حال
              می‌کنی، کلی چیز یاد می‌گیری، و شاید حتی جایزه ببری 😉
            </motion.p>
          </motion.div>
          <img
            src={typingLinux}
            className="hidden lg:block min-w-[350px] w-1/3 z-1"
          />
          <div className="absolute w-full h-full top-0 left-0 bg-[url('/pppointed.png')] bg-contain bg-no-repeat invert-100 bg-top  opacity-25" />
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-4 py-10 px-20">
          <motion.div
            className="w-full flex flex-wrap justify-center items-center gap-4 lg:gap-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <InfoCard
              title="کجا برگزار میشه؟"
              description="دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)"
              icon={IoLocationSharp}
            />
            <InfoCard
              title="کی برگزار میشه؟"
              description={digitsToPersian("23 فروردین - ساعت 17:00 الی 19:00")}
              icon={IoTime}
            />
          </motion.div>
          <motion.div
            className="w-full flex flex-wrap justify-center items-center gap-4 lg:gap-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <InfoCard
              title="چی با خودم بیارم؟"
              description="یه لپ تاپ با لینوکس کافیه!"
              icon={IoBag}
            />
            <InfoCard
              title="گروهیه یا انفرادی ؟"
              description="انفرادی!"
              icon={IoPeople}
            />
          </motion.div>
          <motion.div
            className="w-full flex flex-wrap justify-center items-center gap-4 lg:gap-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InfoCard
              title="هزینه ثبت نام چقدره؟"
              description="پنجاه هزار تومان"
              icon={RiCashLine}
            />
          </motion.div>
        </div>

        <div className="w-full flex flex-wrap justify-center items-center gap-20 py-10 px-20">
          <div className="flex flex-col justify-between items-start text-xl md:text-3xl min-w-[90vw] sm:min-w-[600px] w-full bg-[#2c2c2c] rounded-2xl px-4 py-2 h-[400px]">
            <div className="w-full flex justify-between items-center gap-10 py-8 px-4 h-full">
              <p className="font-bold">🥇 نفر اول:</p>
              <p className="text-text-gray text-left">
                {digitsToPersian("4 میلیون تومان")}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10 py-8 px-4 border-t-2 border-b-2 border-white/15 h-full">
              <p className="font-bold">🥈 نفر دوم:</p>
              <p className="text-text-gray text-left">
                {digitsToPersian("2 میلیون تومان")}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10 py-8 px-4 h-full">
              <p className="font-bold">🥉 نفر سوم:</p>
              <p className="text-text-gray text-left">
                {digitsToPersian("1 میلیون تومان")}
              </p>
            </div>
            <div className="w-full flex justify-between items-center gap-10 py-8 px-4 border-t-2 border-white/15 h-full">
              <p className="font-bold">به قید قرعه</p>
              <p className="text-text-gray text-left">
                {digitsToPersian("10 ماگ با طرح لینوکس فست")}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start text-xl md:text-3xl min-w-[90vw] sm:min-w-[600px] w-full bg-[#2c2c2c] rounded-2xl px-4 py-2 h-[400px]">
            <div className="w-full flex justify-start items-center gap-4 py-8 px-4 h-full">
              <div className="relative p-1 rounded-full bg-secondary/20">
                <p className="w-9 h-9 text-center m-0 bg-secondary rounded-full">
                  {digitsToPersian("1")}
                </p>
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-text-gray text-lg">
                  {digitsToPersian("16:30-17:00")}
                </p>
                <p className="text-2xl text-white font-bold">
                  آمادگی و ورود به محیط مسابقه
                </p>
              </div>
            </div>

            <div className="w-full flex justify-start items-center gap-4 py-8 px-4 border-t-2 border-b-2 border-white/15 h-full">
              <div className="relative p-1 rounded-full bg-secondary/20">
                <p className="w-9 h-9 text-center m-0 bg-secondary rounded-full">
                  {digitsToPersian("2")}
                </p>
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-text-gray text-lg">
                  {digitsToPersian("17:00-19:00")}
                </p>
                <p className="text-2xl text-white font-bold">شروع مسابقه</p>
              </div>
            </div>

            <div className="w-full flex justify-start items-center gap-4 py-8 px-4 h-full">
              <div className="relative p-1 rounded-full bg-secondary/20">
                <p className="w-9 h-9 text-center m-0 bg-secondary rounded-full">
                  {digitsToPersian("3")}
                </p>
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-text-gray text-lg">
                  {digitsToPersian("20:00-19:00")}
                </p>
                <p className="text-2xl text-white font-bold">
                  اختتامیه و تحویل جوایز
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider title="ثبت نام در مسابقه" />
        <ContestTimer timestamp={"2025-04-12T17:00:00+00:00"} />
        {/* <ContestRegistration /> */}
        {!isAuthenticated ? (
            <Link
                to="/login"
                className="block w-full text-center my-20 text-2xl sm:text-3xl lg:text-6xl"
            >
              <span>برای ثبت نام </span>
              <span
                  className="text-secondary"
              >
                وارد
              </span>
              <span> شوید</span>
            </Link>
        ) : (
          <div className="w-full px-20">
            <Button
              loading={loading}
              onClick={registerForContest}
              className="w-full my-20 ml-10 "
            >
              ثبت نام در مسابقه
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Contest;
