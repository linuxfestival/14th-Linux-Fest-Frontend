import { makeCall } from "../../utils/makeCall";
import { CartItemDto } from "./cart.types";

export interface AddItemToCartResponse {
  detail: string;
}

export interface RemoveItemFromCartResponse {
  detail: string;
}

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
