import React, { useCallback } from "react";
import { IoPerson, IoTime } from "react-icons/io5";
import { Tag, TagVariants } from "../../Common/Button/Tag";
import Button, { ButtonSizes } from "../../Common/Button/Button";
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
  selectIsLoadingCart,
  selectItemInCartById,
} from "../../../core/cart/cart.selector.ts";
import Skeleton, { SkeletonVariants } from "../../Skeleton/Skeleton";
import { selectIsPresentationLoading } from "../../../core/presentations/presentations.selector.ts";
import { selectIsAuthenticated } from "../../../core/auth/auth.selector.ts";

interface WorkshopCardProps {
  id: number;
  title?: string;
  description?: string;
  dateTime?: string;
  instructor?: string;
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
  instructor,
  price,
  tags,
  showAddToCart,
  presentation,
}) => {
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

  return (
    <div
      className="rounded-xl bg-[#2C2C2C] w-[320px] h-max shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
      dir="rtl"
    >
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
        className="w-full h-[120px] object-cover"
      />
      {tags && (
        <div className="w-full flex flex-wrap gap-2 mt-2 px-4">
          {tags.map((tag, index) => (
            <Tag key={index} text={tag.text} variant={tag.variant} />
          ))}
        </div>
      )}
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
          "w-full flex justify-start items-center gap-2 mt-2 px-4"
        )}
      >
        <IoPerson size={18} className="text-indigo" />
        <p className="text-white">{instructor}</p>
      </div>
      <div className="w-full flex flex-row-reverse justify-between items-center gap-2 my-4 px-4">
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
          {price / 1000} هزار تومان
        </p>
      </div>
    </div>
  );
};

export const WorkshopCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-[#2C2C2C] w-[320px] h-max shadow-lg overflow-hidden">
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
      <div className="w-full flex flex-row-reverse justify-between items-center gap-2 my-4 px-4">
        <Skeleton width={100} height={32} />
        <Skeleton width={80} height={24} />
      </div>
    </div>
  );
};

export default WorkshopCard;
