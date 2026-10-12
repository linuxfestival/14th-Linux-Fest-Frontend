import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError, AxiosResponse } from "axios";
import {
  addItemToCart,
  AddItemToCartResponse,
  CouponStatus,
  getAccessoriesList,
  getCartPresentations,
  getCouponStatus,
  removeItemFromCart,
  RemoveItemFromCartResponse,
} from "./cart.api";
import { getBundleCart, addBundleToCart, removeBundleFromCart } from "../bundles/bundles.api";
import { cartErrorText } from "./cart.errors";
import { toast } from "react-toastify";

export const addItemToCartThunk = createAsyncThunk(
  "cart/add_item",
  async (id: number, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<AddItemToCartResponse> =
        await addItemToCart(null, { id });
      toast.success("با موفقیت به سبد خرید اضافه شد");
      return response.data;
    } catch (error: unknown) {
      toast.error(cartErrorText(error));
      return rejectWithValue(cartErrorText(error));
    }
  }
);
export const removeItemFromCartThunk = createAsyncThunk(
  "cart/remove_item",
  async (id: number, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<RemoveItemFromCartResponse> =
        await removeItemFromCart(null, { id });
      toast.info("با موفقیت از سبد خرید حذف شد");
      return response.data;
    } catch (error: unknown) {
      toast.error(cartErrorText(error));
      return rejectWithValue(cartErrorText(error));
    }
  }
);
export const getCartThunk = createAsyncThunk(
  "cart/get_cart",
  async (_, { rejectWithValue }) => {
    try {
      const [presentations, bundles] = await Promise.all([getCartPresentations(), getBundleCart()]);
      return { items: presentations.data, bundles: bundles.data };
    } catch (error: unknown) {
      toast.error("خطا در دریافت اطلاعات");
      return rejectWithValue(cartErrorText(error));
    }
  }
);

export const getCouponStatusThunk = createAsyncThunk(
  "coupon/status",
  async (coupon: string, { rejectWithValue }) => {
    try {
      if (!coupon) return;
      const response: AxiosResponse<CouponStatus> = await getCouponStatus(
        null,
        { coupon }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data : cartErrorText(error));
    }
  }
);

export const getAccessoriesListThunk = createAsyncThunk(
  "cart/accessoryList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAccessoriesList();

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(cartErrorText(error));
    }
  }
);


export const addBundleToCartThunk = createAsyncThunk(
  "cart/add_bundle",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await addBundleToCart(undefined, { id });
      await dispatch(getCartThunk()).unwrap();
      toast.success("بسته به سبد خرید اضافه شد");
    } catch (error: unknown) {
      const message = cartErrorText(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const removeBundleFromCartThunk = createAsyncThunk(
  "cart/remove_bundle",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await removeBundleFromCart(undefined, { id });
      await dispatch(getCartThunk()).unwrap();
      toast.info("بسته از سبد خرید حذف شد");
    } catch (error: unknown) {
      const message = cartErrorText(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
