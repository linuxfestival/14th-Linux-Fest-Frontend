import React, { useCallback, useState } from "react";
import { IoPerson, IoTime } from "react-icons/io5";
import { Tag, TagVariants } from "../../Common/Button/Tag.tsx";
import Button, { ButtonSizes } from "../../Common/Button/Button.tsx";
import clsx from "clsx";
import { useAppDispatch } from "../../../store.ts";
import { PresentationDto } from "../../../core/presentations/presentations.dto.ts";
import { toast } from "react-toastify";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
} from "../../../core/cart/cart.thunk.ts";
import { useSelector } from "react-redux";
import {
  selectIsItemExistInCart,
  selectItemInCartById,
} from "../../../core/cart/cart.selector.ts";
import Skeleton, { SkeletonVariants } from "../../Skeleton/Skeleton.tsx";
import { selectIsAuthenticated } from "../../../core/auth/auth.selector.ts";
import { useNavigate } from "react-router-dom";
import {digitsToPersian} from "../../../utils/digitsToPersian.ts";
import { FaAngleDoubleDown } from "react-icons/fa";

interface WorkshopCardProps {
  id: number;
  title?: string;
  description: string;
  dateTime?: string;
  price: number;
  tags?: { text: string; variant: TagVariants }[];
  showAddToCart?: boolean;
  presentation?: PresentationDto;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  id,
  title,
  description,
  dateTime,
  price,
  tags,
  showAddToCart,
  presentation,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const existInCart = useSelector(selectIsItemExistInCart(id));
  const selectItemInCart = useSelector(selectItemInCartById(id));
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const addToCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("برای افزودن به سبد خرید باید وارد شوید");
      return;
    }
    await dispatch(addItemToCartThunk(presentation?.id ?? 0));
    await dispatch(getCartThunk());
  }, [dispatch, presentation?.id]);

  const removeFromCart = useCallback(async () => {
    if (!selectItemInCart) return;
    await dispatch(removeItemFromCartThunk(selectItemInCart?.id));
    await dispatch(getCartThunk());
  }, [dispatch, selectItemInCart]);

  const handleClick = () => {
    navigate(`/workshop/${id}`);
  };

  return (
    <>
      <div
        className="flex flex-col rounded-xl bg-[#2C2C2C] w-[320px] h-max shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
        dir="rtl"
        onClick={handleClick}
      >
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
          className="w-full h-[120px] object-cover"
        />
        {tags && tags.length > 0 && (
          <div className="w-full flex flex-wrap gap-2 mt-2 px-4">
            {tags.map((tag, index) => (
              <Tag key={index} text={tag.text} variant={tag.variant} />
            ))}
          </div>
        )}
        <div className="flex flex-col justify-start items-start mt-4 px-4 h-[120px]">
          <h1 className="text-2xl font-bold text-white line-clamp-2" dir="auto">
            {title}
          </h1>
          <div
            className="w-full text-sm text-text-gray line-clamp-3 mt-2"
            dir="auto"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className="w-full flex justify-start items-center gap-2 mt-8 px-4">
          <IoTime size={18} className="text-indigo" />
          <p className="text-sm text-white" dir="ltr">
            {dateTime}
          </p>
        </div>
        <div
          className={clsx(
            "w-full flex justify-start items-center gap-2 mt-2 px-4"
          )}
        >
          <IoPerson size={18} className="text-indigo" />
          <p className="text-white w-full">ارائه دهندگان:</p>
        </div>
        {presentation?.presenters && (
          <div
            className={clsx("relative flex mt-2 px-4 h-[32px]", {
              ["gap-2"]: presentation.presenters.length <= 5,
            })}
          >
            {presentation.presenters.length >= 5 ? (
              <>
                {presentation.presenters.map((presenter, index) => {
                  return (
                    index < 5 && (
                      <img
                        src={presenter.avatar}
                        className="absolute min-w-[32px] h-[32px] rounded-full border-2 border-[#2C2C2C] z-1"
                        style={{ right: `${(index + 1) * 16}px` }}
                      />
                    )
                  );
                })}
                <p
                  className="absolute w-max"
                  style={{
                    right: `${
                      Math.min(8, presentation.presenters.length + 2) * 16
                    }px`,
                  }}
                >
                  {digitsToPersian("بیش از 5 برگزار کننده")}
                </p>
              </>
            ) : (
              presentation.presenters.map((presenter, index) => {
                return (
                  <img
                    src={presenter.avatar}
                    className="w-[32px] h-[32px] rounded-full z-1"
                  />
                );
              })
            )}
          </div>
        )}
        <div className="w-full flex justify-center items-center gap-2 text-center text-indigo my-4">
          <FaAngleDoubleDown className="animate-bounce" />
          <p>اطلاعات بیشتر</p>
          <FaAngleDoubleDown className="animate-bounce" />
        </div>
        <div className="w-full flex flex-row-reverse justify-between items-center gap-2 mb-4 px-4">
          <Button
            size={ButtonSizes.SMALL}
            disabled={!showAddToCart}
            className={clsx(
              "text-sm !px-4 text-white hover:bg-indigo-dark transition-all rounded-md",
              { ["!bg-indigo"]: !existInCart }
            )}
            onClick={existInCart ? removeFromCart : addToCart}
          >
            {existInCart ? "حذف از سبد خرید" : "اضافه به سبد خرید"}
          </Button>
          <p className="text-lg font-bold text-white">
            {price === 0 ? "رایگان!" : `${price / 1000} هزار تومان`}
          </p>
        </div>
      </div>

      {/* {showModal && presentation && (
        <WorkshopModal
          presentation={presentation}
          price={price}
          dateTime={dateTime}
          onClose={() => setShowModal(false)}
        />
      )} */}
    </>
  );
};

export const WorkshopCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl bg-[#2C2C2C] w-[320px] h-[460px] shadow-lg overflow-hidden">
      <Skeleton width={320} height={120} />
      <div className="w-full flex flex-wrap gap-2 mt-2 px-4">
        <Skeleton width={60} height={20} />
        <Skeleton width={60} height={20} />
      </div>
      <div className="flex flex-col justify-center items-start mt-4 px-4">
        <Skeleton width={200} height={24} />
        <Skeleton width={280} height={16} className="mt-2" />
        <Skeleton width={280} height={16} />
        <Skeleton width={200} height={16} />
      </div>
      <div className="w-full flex justify-start items-center gap-2 mt-4 px-4">
        <Skeleton width={18} height={18} variant={SkeletonVariants.CIRCLE} />
        <Skeleton width={100} height={16} />
      </div>
      <div className="w-full flex justify-start items-center gap-2 mt-2 px-4">
        <Skeleton width={18} height={18} variant={SkeletonVariants.CIRCLE} />
        <Skeleton width={120} height={16} />
      </div>
      <div className="w-full flex flex-row-reverse justify-between items-center gap-2 mb-4 mt-auto px-4">
        <Skeleton width={100} height={32} />
        <Skeleton width={80} height={24} />
      </div>
    </div>
  );
};

export default WorkshopCard;
