import React from "react";
import Camera from "./components/Common/icons/Camera.tsx";
import { GrCreditCard, GrWorkshop } from "react-icons/gr";
import { MdOutlineSupportAgent } from "react-icons/md";
import ShoppingCart from "./components/Header/components/ShoppingCart.tsx";

type SidebarButtonType = {
  label: string;
  icon: React.ReactElement;
  path: string;
  colorClass?: string;
};

export const sidebarData: SidebarButtonType[] = [
  {
    label: "اطلاعات شخصی",
    icon: <Camera />,
    path: "/profile/edit",
  },
  {
    label: "سبد خرید",
    icon: <ShoppingCart />,
    path: "/profile/cart/list",
  },
  {
    label: "کارگاه های من",
    icon: <GrWorkshop size={24} />,
    path: "/profile/workshops",
  },
  {
    label: "پرداخت ها",
    icon: <GrCreditCard size={24} />,
    path: "/profile/billing",
  },
  // {
  //   label: "پشتیبانی",
  //   icon: <MdOutlineSupportAgent size={24} />,
  //   path: "/profile/support",
  // },
];

export interface PageInformationOptions {
  title: string;
  description?: string;
  keywords?: string[];
}

export const PageMetaInformation: Record<string, PageInformationOptions> = {
  ["/"]: {
    title: "خانه",
    description: "چهاردهمین جشنواره علاقه‌مندان لینوکس و متن‌باز",
    keywords: [
      "لینوکس فست",
      "خانه",
      "جشنواره لینوکس",
      "متن‌باز",
      "دانشگاه امیرکبیر",
      "انجمن علمی",
      "پلی تکنیک تهران",
      "لینوکس ایران",
    ],
  },
  ["/sponsor"]: {
    title: "پیام همکاران سیستم",
    description:
      "پیام همکاران سیستم، حامی لینوکس‌فست، و آشنایی با تیم توسعه نرم‌افزار آن‌ها.",
  },
  ["/workshops"]: {
    title: "ارائه ها",
    description: "ارائه های چهاردهمین جشنواره لینوکس و متن‌باز را کشف کنید",
    keywords: [
      "کارگاه لینوکس",
      "ارائه لینوکس",
      "آموزش متن‌باز",
      "جشنواره لینوکس",
      "لینوکس فست",
      "کارگاه آموزشی",
      "ارائه آموزشی",
    ],
  },
  ["/event-format"]: {
    title: "قالب رویداد",
    description:
      "با ارائه‌های آنلاین چهارشنبه، جشن نصب لینوکس، ارائه‌های فنی و کارگاه‌های پنج‌شنبه و دورهمی جمعه لینوکس‌فست آشنا شوید.",
  },
  ["/faq"]: {
    title: "سوالات متداول",
    description: "سوالات متداول درباره جشنواره لینوکس",
    keywords: [
      "سوالات متداول لینوکس",
      "پشتیبانی جشنواره",
      "لینوکس فست",
      "متن‌باز",
      "پرسش و پاسخ",
    ],
  },
  ["/presenters"]: {
    title: "ارائه‌دهندگان",
    description:
      "با ارائه‌دهندگان چهاردهمین جشنواره لینوکس و متن‌باز آشنا شوید",
    keywords: [
      "ارائه‌دهندگان جشنواره",
      "سخنرانان لینوکس",
      "لینوکس فست",
      "متن‌باز",
      "جشنواره لینوکس",
    ],
  },
  ["/staff"]: {
    title: "کارکنان",
    description: "با کارکنان پشت صحنه جشنواره لینوکس آشنا شوید",
    keywords: [
      "کارکنان جشنواره",
      "پشت صحنه لینوکس",
      "لینوکس فست",
      "متن‌باز",
      "جشنواره لینوکس",
    ],
  },
  ["/login"]: {
    title: "ورود",
    description: "وارد حساب کاربری خود شوید",
    keywords: [
      "ورود به حساب",
      "لینوکس فست",
      "حساب کاربری",
      "جشنواره لینوکس",
      "متن‌باز",
    ],
  },
  ["/signup"]: {
    title: "ثبت‌نام",
    description: "برای جشنواره لینوکس ثبت‌نام کنید",
    keywords: [
      "ثبت‌نام جشنواره",
      "لینوکس فست",
      "کاربران لینوکس",
      "جشنواره لینوکس",
      "متن‌باز",
    ],
  },
  ["/profile/edit"]: {
    title: "ویرایش پروفایل",
    description: "پروفایل خود را ویرایش کنید",
  },
  ["/profile/cart/list"]: {
    title: "سبد خرید",
    description: "سبد خرید خود را مشاهده کنید",
  },
  ["/profile/cart/checkout"]: {
    title: "سبد خرید",
    description: "سبد خرید خود را مشاهده کنید",
  },
  ["/profile/workshops"]: {
    title: "کارگاه های من",
    description: "کارگاه های ثبت نام شده خود را مشاهده کنید",
  },
  ["/profile/billing"]: {
    title: "پرداخت ها",
    description: "پرداخت های خود را مشاهده کنید",
  },
  ["/profile/support"]: {
    title: "پشتیبانی",
    description: "با پشتیبانی جشنواره تماس بگیرید",
  },
};
