import React, { useState, useEffect } from "react";
import { digitsToPersian } from "../../../utils/digitsToPersian";

interface ContestTimerProps {
  timestamp: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ContestTimer: React.FC<ContestTimerProps> = ({ timestamp }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null
  );
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const difference = new Date(timestamp).getTime() - now;

      if (difference <= 0) {
        setExpired(true);
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  if (expired) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="bg-[#2c2c2c] rounded-2xl px-8 py-6 text-center">
          <h2 className="text-4xl font-bold text-[#FFDD03] mb-4">
            زمان به پایان رسید
          </h2>
          <p className="text-text-gray text-2xl">مسابقه آغاز شده است!</p>
        </div>
      </div>
    );
  }

  if (!timeRemaining) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="bg-[#2c2c2c] rounded-2xl p-8">
          <div className="animate-pulse text-3xl text-text-gray">
            در حال بارگذاری...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center py-10 px-6">
      <div className="bg-[#2c2c2c] rounded-2xl p-2 sm:p-4 md:p-8 shadow-lg shadow-secondary/10 w-full max-w-4xl">
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
          زمان باقیمانده تا شروع مسابقه
        </h2>

        <div className="flex flex-row-reverse justify-center items-center gap-2 md:gap-6 flex-wrap">
          <div className="flex flex-col justify-center items-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-primary rounded-2xl flex justify-center items-center shadow-md shadow-black/30 border border-white/5">
              <span className="text-xl sm:text-3xl md:text-5xl font-bold text-[#FFDD03]">
                {digitsToPersian(timeRemaining.days.toString())}
              </span>
            </div>
            <span className="text-text-gray mt-2 text-xl">روز</span>
          </div>

          <div className="text-2xl md:text-4xl font-bold text-white/20">:</div>

          <div className="flex flex-col justify-center items-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-primary rounded-2xl flex justify-center items-center shadow-md shadow-black/30 border border-white/5">
              <span className="text-xl sm:text-3xl md:text-5xl font-bold text-[#FFDD03]">
                {digitsToPersian(
                  timeRemaining.hours.toString().padStart(2, "0")
                )}
              </span>
            </div>
            <span className="text-text-gray mt-2 text-xl">ساعت</span>
          </div>

          <div className="text-2xl md:text-4xl font-bold text-white/20">:</div>

          <div className="flex flex-col justify-center items-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-primary rounded-2xl flex justify-center items-center shadow-md shadow-black/30 border border-white/5">
              <span className="text-xl sm:text-3xl md:text-5xl font-bold text-secondary">
                {digitsToPersian(
                  timeRemaining.minutes.toString().padStart(2, "0")
                )}
              </span>
            </div>
            <span className="text-text-gray mt-2 text-xl">دقیقه</span>
          </div>

          <div className="text-2xl md:text-4xl font-bold text-white/20">:</div>

          <div className="flex flex-col justify-center items-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-primary rounded-2xl flex justify-center items-center shadow-md shadow-black/30 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 animate-pulse rounded-2xl"></div>
              <span className="text-xl sm:text-3xl md:text-5xl font-bold text-secondary relative z-10">
                {/* <span className="text-5xl font-bold text-[#15FAB4] relative z-10"> */}
                {digitsToPersian(
                  timeRemaining.seconds.toString().padStart(2, "0")
                )}
              </span>
            </div>
            <span className="text-text-gray mt-2 text-xl">ثانیه</span>
          </div>
        </div>

        <p className="text-center text-white/50 mt-8 text-xl">
          صبر نکن، همین الان ثبت نام کن
        </p>
      </div>
    </div>
  );
};

export default ContestTimer;
