import {
  HiCalendarDays,
  HiCreditCard,
  HiShoppingBag,
  HiUserCircle,
  HiVideoCamera,
} from "react-icons/hi2";
export const dashboardNavigation = [
  { label: "اطلاعات شخصی", path: "/profile/edit", icon: HiUserCircle },
  { label: "کارگاه‌های من", path: "/profile/workshops", icon: HiCalendarDays },
  { label: "اسکای‌روم", path: "/profile/skyroom", icon: HiVideoCamera },
  { label: "سبد خرید", path: "/profile/cart", icon: HiShoppingBag },
  { label: "پرداخت‌ها", path: "/profile/billing", icon: HiCreditCard },
];
