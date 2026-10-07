import { makeCall } from "../../utils/makeCall";
import { CartItemDto } from "./cart.types";

export interface AddItemToCartResponse {
  detail: string;
}

export interface RemoveItemFromCartResponse {
  detail: string;
}

export interface CouponStatus {
  percentage: number;
  is_valid: boolean;
  eligible_presentations: number[];
  preserve_capacity: boolean;
}

export interface AccessoryDto {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
  is_active: boolean;
}
export type GetAccessoriesListRequest = void;
export type GetAccessoriesListResponse = AccessoryDto[];

export const addItemToCart = makeCall<null, AddItemToCartResponse>(
  (params) => `/api/presentations/${params.id}/add_participation/`,
  "POST",
  true
);

export const removeItemFromCart = makeCall<null, RemoveItemFromCartResponse>(
  (params) => `/api/presentations/${params.id}/remove_participation/`,
  "DELETE",
  true
);
export const getCartPresentations = makeCall<void, CartItemDto[]>(
  "/api/presentations/cart/",
  "GET",
  true
);

export const getCouponStatus = makeCall<null, CouponStatus>(
  (params) => `/api/coupon/${params.coupon}/`,
  "GET",
  true
);

export const getAccessoriesList = makeCall<
  GetAccessoriesListRequest,
  GetAccessoriesListResponse
>("/api/accessory/", "GET");
