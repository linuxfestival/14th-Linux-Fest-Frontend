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

const WorkshopCard = () => {
  return (
    <div className="rounded-xl bg-light-gray w-[300px] h-max" dir="rtl">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
        className="w-[300px] h-[80px] rounded-t-xl"
      />
      <div className="w-full flex flex-wrap gap-2 mt-1 px-4">
        <Tag text="آسان" variant={TagVariants.GREEN} />
        <Tag text="متوسط" variant={TagVariants.YELLOW} />
        <Tag text="سخت" variant={TagVariants.RED} />
        <Tag text="لینوکس" variant={TagVariants.INDIGO} />
        <Tag text="اوپن سورس" variant={TagVariants.INDIGO} />
        <Tag text="Dev Ops" variant={TagVariants.INDIGO} />
        <Tag text="python" variant={TagVariants.INDIGO} />
      </div>
      <div className="flex flex-col justify-center items-start mt-4 px-4">
        <h1 className="text-3xl font-bold">عنوان</h1>
        <p className="w-full text-md text-text-gray line-clamp-3 mt-1">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
          استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
          ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
          کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی
          در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می
          طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی
          الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این
          صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و
          شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای
          اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده
          قرار گیرد.
        </p>
      </div>

      <div className="w-full flex justify-start items-start gap-2 mt-4 px-4">
        <IoTime size={18} />
        <p className="text-sm" dir="ltr">
          ۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰
        </p>
      </div>
      <div className="w-full flex justify-start items-start gap-2 mt-2 px-4">
        <IoPerson size={18} />
        <p>امیرحسین عقیقی</p>
      </div>

      <div className="w-full flex flex-row-reverse justify-between items-center gap-2 my-4 px-2">
        <Button size={ButtonSizes.SMALL} className="text-sm !px-2">
          افزودن به سبد خرید
        </Button>
        <p>44 هزار تومان</p>
      </div>
    </div>
  );
};

export default WorkshopCard;
