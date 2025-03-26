import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addItemToCartThunk,
  getAccessoriesListThunk,
  getCartThunk,
  getCouponStatusThunk,
  removeItemFromCartThunk,
} from "./cart.thunk";
import { CartItemDto } from "./cart.types";
import { selectPresentationById } from "../presentations/presentations.selector";
import { CouponStatus, Accessory } from "./cart.api.ts";

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
  couponStatus?: CouponStatus;
  discountedAmount?: number;
  accessoryLoading: boolean;
  accessoryList: Accessory[];
  selectedAccessories: Accessory["id"][];
}

const initialState: CartState = {
  items: [],
  count: 0,
  totalAmount: 0,
  step: CartPage.Cart,
  loading: false,
  accessoryLoading: false,
  accessoryList: [],
  selectedAccessories: [],
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
      state.totalAmount = state.items.reduce(
        (acc, cur) => acc + cur.presentation.cost,
        0
      );
      if (state.couponStatus != null && state.couponStatus.is_valid)
        state.discountedAmount =
          ((100 - state.couponStatus.percentage) / 100) * state.totalAmount;
    },
    setPage(state, action: PayloadAction<CartPage>) {
      state.step = action.payload;
    },
    addAccessory(state, action: PayloadAction<Accessory["id"]>) {
      const exist = state.selectedAccessories.some(
        (accessoryID) => accessoryID == action.payload
      );

      if (!exist) {
        state.selectedAccessories.push(action.payload);
      }
    },
    removeAccessory(state, action: PayloadAction<Accessory["id"]>) {
      state.selectedAccessories = state.selectedAccessories.filter(
        (accessoryID) => accessoryID !== action.payload
      );
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
      .addCase(getCouponStatusThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCouponStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCouponStatusThunk.fulfilled, (state, action) => {
        state.couponStatus = action.payload;
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
        state.count = action.payload.filter(
          (el) => el.payment_state !== "COMPLETED"
        ).length;
        state.loading = false;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(getCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAccessoriesListThunk.pending, (state) => {
        state.accessoryLoading = true;
      })
      .addCase(getAccessoriesListThunk.fulfilled, (state, action) => {
        state.accessoryLoading = false;
        console.log("!@! wtf");
        state.accessoryList = action.payload;
      })
      .addCase(getAccessoriesListThunk.rejected, (state) => {
        state.accessoryLoading = false;
      });
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
