import React from "react";
import {
  IoPerson,
  IoStar,
  IoStarHalf,
  IoStarOutline,
  IoTime,
} from "react-icons/io5";
import { Tag, TagVariants } from "../../Common/Button/Tag";
import Button, { ButtonSizes } from "../../Common/Button/Button";
import clsx from "clsx";

interface WorkshopCardProps {
  title?: string;
  description?: string;
  dateTime?: string;
  instructor?: string;
  price?: string;
  tags?: { text: string; variant: TagVariants }[];
  showAddToCart?: boolean;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  title = "عنوان",
  description = `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ...`,
  dateTime = "۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰",
  instructor = "امیرحسین عقیقی",
  price = "44 هزار تومان",
  tags = [
    { text: "آسان", variant: TagVariants.GREEN },
    { text: "متوسط", variant: TagVariants.YELLOW },
    { text: "سخت", variant: TagVariants.RED },
    { text: "لینوکس", variant: TagVariants.INDIGO },
  ],
  showAddToCart = true,
}) => {
  return (
    <div
      className="rounded-xl bg-[#2C2C2C] w-[320px] h-max shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
      dir="rtl"
    >
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
        className="w-full h-[120px] object-cover"
      />
      <div className="w-full flex flex-wrap gap-2 mt-2 px-4">
        {tags.map((tag, index) => (
          <Tag key={index} text={tag.text} variant={tag.variant} />
        ))}
      </div>
      <div className="flex flex-col justify-center items-start mt-4 px-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="w-full text-sm text-text-gray line-clamp-3 mt-2">
          {description}
        </p>
      </div>
      <div className="w-full flex justify-start items-center gap-2 mt-4 px-4">
        <IoTime size={18} className="text-indigo" />
        <p className="text-sm text-white" dir="ltr">
          {dateTime}
        </p>
      </div>
      <div
        className={clsx(
          "w-full flex justify-start items-center gap-2 mt-2 px-4",
          { ["mb-4"]: !showAddToCart }
        )}
      >
        <IoPerson size={18} className="text-indigo" />
        <p className="text-white">{instructor}</p>
      </div>
      {showAddToCart && (
        <div className="w-full flex flex-row-reverse justify-between items-center gap-2 my-4 px-4">
          <Button
            size={ButtonSizes.SMALL}
            className="text-sm !px-4 bg-indigo text-white hover:bg-indigo-dark transition-all"
          >
            افزودن به سبد خرید
          </Button>
          <p className="text-lg font-bold text-white">{price}</p>
        </div>
      )}
    </div>
  );
};

export default WorkshopCard;
