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
    updateTotalAmount(state) {
      state.totalAmount = state.items.reduce((acc, cur) => acc + cur.presentation.cost, 0);
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
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(addItemToCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeItemFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromCartThunk.fulfilled, (state) => {
        state.count--;
        state.loading = false;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(removeItemFromCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.count = action.payload.filter(el => el.payment_state !== "COMPLETED").length;
        state.loading = false;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(getCartThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
