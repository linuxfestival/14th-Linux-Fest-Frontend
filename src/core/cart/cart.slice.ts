import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addItemToCartThunk,
  getCartThunk,
  removeItemFromCartThunk,
} from "./cart.thunk";
import { CartItemDto } from "./cart.types";
import { selectPresentationById } from "../presentations/presentations.selector";

export enum CartPage {
  Cart = 1,
  Checkout,
}

export const CartSteps = [
  { id: 1, label: "مشاهده سبد خرید", path: "/profile/cart/list" },
  { id: 2, label: "انتخاب روش پرداخت", path: "/profile/cart/checkout" },
  { id: 3, label: "پرداخت", path: "/" },
];

export interface CartState {
  items: CartItemDto[];
  count: number;
  totalAmount: number;
  step: CartPage;
  loading?: boolean;
}

const initialState: CartState = {
  items: [],
  count: 0,
  totalAmount: 0,
  step: CartPage.Cart,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
    setPage(state, action: PayloadAction<CartPage>) {
      state.step = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCartThunk.fulfilled, (state) => {
        state.count++;
        state.loading = false;
      })
      .addCase(addItemToCartThunk.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(removeItemFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromCartThunk.fulfilled, (state) => {
        state.count--;
        state.loading = false;
      })
      .addCase(removeItemFromCartThunk.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.count = action.payload.length;
        state.loading = false;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
