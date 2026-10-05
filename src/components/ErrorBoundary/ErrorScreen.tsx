import type { ReactNode } from "react";
import Logo from "../../assets/logo.png";

export default function ErrorScreen({ title, description, illustration, children }: {
  title: string;
  description: string;
  illustration?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-text-white text-primary" dir="rtl">
      <header className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <a href="/" aria-label="صفحه اصلی لینوکس‌فست" className="inline-flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary">
            <img src={Logo} alt="" className="size-9 object-contain" />
          </span>
          <span className="text-lg font-black">لینوکس‌فست</span>
        </a>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-6 text-center sm:px-8">
        {illustration}
        <h1 className="text-3xl font-black leading-snug sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-prose text-base leading-8 text-dark-gray">{description}</p>
        <div className="mt-8 w-full">{children}</div>
      </main>
    </div>
  );
}
