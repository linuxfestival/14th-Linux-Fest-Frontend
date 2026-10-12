export const siteNavigation = [
  { to: "/", label: "خانه" },
  { to: "/workshops", label: "ارائه‌ها" },
  { to: "/faq", label: "سوالات متداول" },
  { to: "/presenters", label: "ارائه‌دهندگان" },
  { to: "/staff", label: "استف" },
  { to: "/#sponsor", label: "پیام حامی" },
];

export const isNavigationActive = (
  to: string,
  pathname: string,
  hash: string,
) =>
  to.includes("#") || to === "/"
    ? to === `${pathname}${hash}`
    : pathname === to || pathname.startsWith(`${to}/`);
