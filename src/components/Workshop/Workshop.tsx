import { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentPresentation } from "../../core/presentations/presentations.selector";
import { useAppDispatch } from "../../store";
import { getPresentationByIDThunk } from "../../core/presentations/presentations.thunk";
import {
  IoCloseOutline,
  IoInformation,
  IoPeople,
  IoPricetag,
  IoPricetagOutline,
  IoTime,
} from "react-icons/io5";
import { IconType } from "react-icons/lib";
import Button, { ButtonSizes } from "../Common/Button/Button";
import clsx from "clsx";
import {
  selectIsItemExistInCart,
  selectItemInCartById,
} from "../../core/cart/cart.selector";
import { toast } from "react-toastify";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
} from "../../core/cart/cart.thunk";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import Divider from "../Divider/Divider";
import { createPortal } from "react-dom";
import { digitsToPersian } from "../../utils/digitsToPersian";
import {
  PresentationDto,
  PresentationService,
} from "../../core/presentations/presentations.dto";
import { FaLaptop, FaLinkedin } from "react-icons/fa";
import { Tag } from "../Common/Button/Tag";
import Skeleton, { SkeletonVariants } from "../Skeleton/Skeleton";
import { Tooltip } from "react-tooltip";
import { Helmet } from "react-helmet-async";
import { title } from "process";

const Workshop = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const presentation = useSelector(selectCurrentPresentation);
  const existInCart = useSelector(selectIsItemExistInCart(Number(id)));
  const selectItemInCart = useSelector(selectItemInCartById(Number(id)));
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [persianDescription, setPersianDescription] = useState(false);

  const addToCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("برای افزودن به سبد خرید باید وارد شوید");
      return;
    }
    setButtonLoading(true);
    await dispatch(addItemToCartThunk(presentation?.id ?? 0));
    await dispatch(getCartThunk());
    setButtonLoading(false);
  }, [dispatch, presentation?.id]);

  const removeFromCart = useCallback(async () => {
    if (!selectItemInCart) return;
    setButtonLoading(true);
    await dispatch(removeItemFromCartThunk(selectItemInCart?.id));
    await dispatch(getCartThunk());
    setButtonLoading(false);
  }, [dispatch, selectItemInCart]);

  if (!id) return <Navigate to="/workshops" />;

  useEffect(() => {
    if (!presentation || String(presentation.id) !== id)
      dispatch(getPresentationByIDThunk(id));
  }, []);

  if (!presentation || String(presentation.id) !== id)
    return <WorkshopSkeleton />;

  return (
    <>
      <Helmet>
        <title>لینوکس فست | {presentation.en_title}</title>
        <meta name="description" content={presentation.en_description} />
        <meta
          name="keywords"
          content={presentation.tags.map((tag) => tag.name)?.join(", ")}
        />
        <meta
          property="og:title"
          content={`لینوکس فست | ${presentation.en_title}`}
        />
        <meta property="og:description" content={presentation.en_description} />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:site_name" content="لینوکس فست" />
        <link rel="canonical" href={`https://linux-fest.ir/workshop/${id}`} />
      </Helmet>

      <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center h-max bg-primary">
        <Header sticky={false} />

        <div className="w-full h-[58vh] sm:h-[50vh] flex justify-between items-center gap-4 bg-[#272d35] pt-36 px-16 xl:px-48">
          <h1 className="font-bold text-3xl lg:text-5xl w-full text-center md:w-1/2">
            {presentation.en_title}
          </h1>
          <InfoCard presentation={presentation} className="hidden md:flex" />
        </div>

        <InfoCard
          presentation={presentation}
          className="flex md:hidden static"
        />

        <div className="w-full flex flex-row-reverse justify-between gap-8 pt-8 pb-16 px-16 xl:px-48">
          <div className="hidden md:block w-1/3 min-w-[350px] lg:min-w-[400px]" />
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-2xl lg:text-4xl font-bold">توضیحات ارائه:</h1>
            <div
              className={clsx("text-xl lg:text-2xl text-text-gray mt-2")}
              dir={persianDescription ? "rtl" : "ltr"}
              dangerouslySetInnerHTML={{
                __html: persianDescription
                  ? presentation.fa_description
                  : presentation.en_description,
              }}
            />
            <p
              className="text-md text-indigo w-full mt-2 cursor-pointer"
              onClick={() => setPersianDescription(!persianDescription)}
            >
              {persianDescription ? "ترجمه به انگلیسی" : "ترجمه به فارسی"}
            </p>
            <Button
              size={ButtonSizes.SMALL}
              disabled={presentation.remained_capacity === 0}
              loading={buttonLoading}
              className={clsx(
                "text-lg lg:text-xl !px-4 text-white hover:bg-indigo-dark transition-all rounded-md mt-8",
                { ["!bg-indigo"]: !existInCart }
              )}
              onClick={existInCart ? removeFromCart : addToCart}
            >
              {existInCart ? "حذف از سبد خرید" : "اضافه به سبد خرید"}
            </Button>
          </div>
        </div>

        <Divider title="ارائه دهندگان" />
        <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-4 mt-4 px-4 pt-8 pb-12">
          {presentation.presenters.map((presenter) => (
            <PresenterCard
              key={presenter.last_name}
              avatar={presenter.avatar}
              name={`${presenter.first_name} ${presenter.last_name}`}
              description={presenter.description}
              linkedin={presenter.linkedin}
            />
          ))}
        </div>

        <div className="w-full flex justify-center items-center gap-4 px-8 md:px-32 py-8 mb-8 bg-bg-secondary ">
          <h1 className="text-4xl font-bold min-w-max">همین حالا</h1>
          <Button
            size={ButtonSizes.SMALL}
            disabled={presentation.remained_capacity === 0}
            loading={buttonLoading}
            className={clsx(
              "text-4xl !px-4 text-white hover:bg-indigo-dark transition-all rounded-md ",
              { ["!bg-indigo"]: !existInCart }
            )}
            onClick={existInCart ? removeFromCart : addToCart}
          >
            {existInCart
              ? "از کلیک کردن رو این دکمه پیشمون شو"
              : "به سبد خرید اضافه کن"}
          </Button>
        </div>

        <Footer />
      </div>
    </>
  );
};

interface InfoRowProps {
  icon: IconType;
  title: string;
  value: string;
  info?: string;
}

const InfoRow = ({ icon: Icon, title, value, info }: InfoRowProps) => (
  <div className="w-full flex justify-between items-center py-4 border-b-1 border-text-gray/20 first-of-type:pt-0  last-of-type:pb-0 last-of-type:border-0">
    <div className="w-max flex justify-center items-center gap-2">
      <Icon size={18} className="text-indigo" />
      <p className="text-lg font-bold text-white" dir="rtl">
        {title}
      </p>
    </div>
    <div className="w-max flex justify-center items-center">
      <p className="text-xl text-white" dir="rtl">
        {digitsToPersian(value)}
      </p>
      {info && (
        <div
          className="p-0.5 rounded-md bg-indigo mr-1"
          data-tooltip-id={`tooltip-${title}`}
          data-tooltip-content={info}
        >
          <IoInformation className=" text-primary" />
        </div>
      )}
      <Tooltip
        id={`tooltip-${title}`}
        place="top-start"
        border="1px solid white"
      />
    </div>
  </div>
);

interface InfoCardProps {
  presentation: PresentationDto;
  className?: string;
}

const InfoCard = ({ presentation, className }: InfoCardProps) => {
  return (
    <div
      className={clsx(
        "relative top-44 w-1/4 md:w-1/3 min-w-[350px] lg:min-w-[400px] flex flex-col justify-center items-start mt-4 rounded-xl bg-light-gray z-1",
        className
      )}
    >
      <img
        src={
          presentation?.morkopoloyor !== ""
            ? presentation?.morkopoloyor
            : "https://raw.githubusercontent.com/gist/vschmidt94/7ae2c23fede9f53bf63da4d7ace5fc14/raw/e41ed2bd565a54e90b33209dc820086e93121ab5/retro_gruvbox_linux_wallpaper.svg"
        }
        className="w-full rounded-t-xl"
      />
      <div className="w-full flex flex-col p-4">
        <InfoRow
          icon={IoTime}
          title="زمان برگزاری"
          value={new Date(presentation.start).toLocaleString("fa")}
          info={
            // Replace this shit if you have the time and the energy. I don't
            presentation.id === 17 || presentation.id === 15
              ? "زمان پایان روز اول کارگاه، 19:00 و زمان شروع روز دوم ساعت 9:00 می باشد"
              : undefined
          }
        />
        <InfoRow
          icon={IoTime}
          title="زمان پایان"
          value={new Date(presentation.end).toLocaleString("fa")}
          info={
            // Replace this shit if you have the time and the energy. I don't
            presentation.id === 17 || presentation.id === 15
              ? "زمان پایان روز اول کارگاه، 19:00 و زمان شروع روز دوم ساعت 9:00 می باشد"
              : undefined
          }
        />
        <InfoRow
          icon={IoPricetag}
          title="هزینه"
          value={
            presentation.cost === 0
              ? "رایگان!"
              : `${presentation.cost / 1000} هزار تومان`
          }
        />
        <InfoRow
          icon={IoPeople}
          title="ظرفیت باقیمانده"
          value={`${presentation.remained_capacity} / ${
            presentation.capacity + 25
          }`}
        />
        <InfoRow
          icon={FaLaptop}
          title="نوع برگزاری"
          value={`${
            presentation.service_type === PresentationService.TALK
              ? "آنلاین"
              : "حضوری"
          }`}
        />
        <div className="w-full flex flex-col justify-between items-center py-4 border-b-1 border-text-gray/20 first-of-type:pt-0  last-of-type:pb-0 last-of-type:border-0">
          <div className="w-full flex justify-start items-center gap-2">
            <IoPricetagOutline size={18} className="text-indigo" />
            <p className="text-lg font-bold text-white" dir="rtl">
              تگ ها
            </p>
          </div>

          <div className="w-full flex flex-row-reverse flex-wrap gap-2 mt-2">
            {presentation.tags.map(
              (tag, index) => index <= 10 && <Tag text={tag.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PresenterCardProps {
  avatar: string;
  name: string;
  description: string;
  linkedin?: string;
}

export const PresenterCard = ({
  avatar,
  name,
  description,
  linkedin,
}: PresenterCardProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center px-4 py-4 bg-bg-secondary rounded-xl w-[300px] h-[300px] shadow-xl">
      <img
        src={avatar}
        className="w-[120px] h-[120px] rounded-full object-cover"
      />
      <h1 className="text-xl font-extrabold text-text-gray mt-2">{name}</h1>
      <Button className="!bg-indigo mt-2" onClick={() => setShowModal(true)}>
        اطلاعات بیشتر
      </Button>

      {showModal &&
        createPortal(
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-999">
            <div
              className="fixed w-full h-full bg-black/20 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <div className="w-full sm:w-2/3 md:w-1/2 max-h-[800px] h-max flex flex-col gap-6 bg-bg-secondary px-8 py-8 rounded-xl z-999">
              <div className="w-full flex flex-row-reverse justify-between">
                <IoCloseOutline
                  size={24}
                  className="cursor-pointer mr-4"
                  onClick={() => setShowModal(false)}
                />
                <div className="w-full flex justify-start items-center gap-4 mt-4 px-4">
                  <img
                    src={avatar}
                    className="w-[120px] h-[120px] rounded-full object-cover"
                  />
                  <h1 className="text-2xl font-bold text-white">{name}</h1>
                </div>
              </div>
              <div
                className="w-full h-max mt-4 text-xl text-white text-center"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <div className="flex justify-center gap-4">
                {linkedin && (
                  <Link to={linkedin} target={"_blank"}>
                    <FaLinkedin className="text-secondary" size={50} />
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

const WorkshopSkeleton = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Helmet>
        <title>لینوکس فست | جزئیات ارائه</title>
        <link rel="canonical" href={`https://linux-fest.ir/${pathname}`} />
      </Helmet>
      <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-start h-max bg-primary">
        <Header sticky={false} />
        <div className="w-full h-[58vh] sm:h-[50vh] flex justify-between items-center gap-4 bg-[#272d35] pt-36 px-16 xl:px-48">
          <Skeleton
            variant={SkeletonVariants.TEXT}
            width={400}
            height={60}
            className="w-full text-center md:w-1/2"
          />
          <Skeleton
            variant={SkeletonVariants.RECTANGLE}
            width={350}
            height={200}
            className="relative top-28 w-1/4 md:w-1/3 min-w-[350px] min-h-[400px] lg:min-w-[400px] hidden md:flex flex-col justify-center items-start mt-4 rounded-xl z-1"
          />
        </div>
        <div className="flex flex-col gap-4 px-16 xl:px-48 py-8">
          <Skeleton variant={SkeletonVariants.TEXT} width={200} height={30} />
          <Skeleton
            variant={SkeletonVariants.RECTANGLE}
            width="100%"
            height={200}
          />
        </div>

        <Divider title="ارائه دهندگان" />
        <div className="flex flex-row-reverse flex-wrap justify-center items-center gap-10 mt-4 px-4 pt-8 pb-12">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <Skeleton width={300} height={400} className="rounded-xl" />
            ))}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Workshop;
