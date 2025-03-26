import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  addItemToCart,
  AddItemToCartResponse,
  removeItemFromCart,
  RemoveItemFromCartResponse,
} from "./cart.api";
import { getCartPresentations } from "./cart.api";
import { CartItemDto } from "./cart.types";
import { toast } from "react-toastify";

export const addItemToCartThunk = createAsyncThunk(
  "cart/add_item",
  async (id: number, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<AddItemToCartResponse> =
        await addItemToCart(null, { id });
      toast.success("با موفقیت به سبد خرید اضافه شد");
      return response.data;
    } catch (error: any) {
      if (error.response) toast.error(error.response.data.detail);
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
export const getCartThunk = createAsyncThunk(
  "cart/get_cart",
  async (_, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<CartItemDto[]> =
        await getCartPresentations();
      return response.data;
    } catch (error: any) {
      toast.error("خطا در دریافت اطلاعات");
      return rejectWithValue(error);
    }
  }
);
