import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addItemToCartThunk,
  addBundleToCartThunk,
  removeBundleFromCartThunk,
  getAccessoriesListThunk,
  getCartThunk,
  getCouponStatusThunk,
  removeItemFromCartThunk,
} from "./cart.thunk";
import { CartItemDto } from "./cart.types";
import type { BundleSelectionDto } from "../bundles/bundles.types";
import { calculateCartPrice, standaloneCartItems } from "./cart.pricing";
import { CouponStatus, AccessoryDto } from "./cart.api.ts";
import { logout } from "../auth/auth.slice.ts";

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
  bundles: BundleSelectionDto[];
  error: boolean;
  requestId?: string;
  count: number;
  totalAmount: number;
  step: CartPage;
  loading?: boolean;
  couponStatus?: CouponStatus;
  discountedAmount?: number;
  accessoryLoading: boolean;
  accessoryList: AccessoryDto[];
  selectedAccessories: AccessoryDto["id"][];
}

const initialState: CartState = {
  items: [],
  bundles: [],
  error: false,
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
      state.bundles = [];
      state.count = 0;
      state.couponStatus = undefined;
      state.requestId = undefined;
      state.totalAmount = 0;
      state.selectedAccessories = [];
      state.discountedAmount = 0;
    },
    updateTotalAmount(state) {
      const accessoryTotal = state.accessoryList
        .filter(el => state.selectedAccessories.includes(el.id))
        .reduce((total, item) => total + Number(item.price), 0);
      const price = calculateCartPrice(state.items, state.bundles, accessoryTotal,
        state.couponStatus?.is_valid ? state.couponStatus.percentage : 0);
      state.totalAmount = price.totalAmount;
      state.discountedAmount = state.couponStatus?.is_valid ? price.discountedAmount : undefined;
      state.count = standaloneCartItems(state.items).length + state.bundles.length;
    },
    clearCoupon(state) {
      state.couponStatus = undefined;
      state.discountedAmount = undefined;
    },
    setPage(state, action: PayloadAction<CartPage>) {
      state.step = action.payload;
    },
    addAccessory(state, action: PayloadAction<AccessoryDto["id"]>) {
      const exist = state.selectedAccessories.some(
        (accessoryID) => accessoryID == action.payload
      );

      if (!exist) {
        state.selectedAccessories.push(action.payload);
      }

      cartSlice.caseReducers.updateTotalAmount(state);
    },
    removeAccessory(state, action: PayloadAction<AccessoryDto["id"]>) {
      state.selectedAccessories = state.selectedAccessories.filter(
        (accessoryID) => accessoryID !== action.payload
      );
      cartSlice.caseReducers.updateTotalAmount(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCartThunk.fulfilled, (state) => {
        state.loading = false;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(logout, () => initialState)
      .addCase(addItemToCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeItemFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItemFromCartThunk.fulfilled, (state) => {
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
        state.loading = false;
        state.couponStatus = action.payload;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(removeItemFromCartThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCartThunk.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.requestId = action.meta.requestId;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.items = action.payload.items;
        state.bundles = action.payload.bundles;
        state.couponStatus = undefined;
        state.discountedAmount = undefined;
        state.loading = false;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.error = true;
        state.loading = false;
      })
      .addCase(getAccessoriesListThunk.pending, (state) => {
        state.accessoryLoading = true;
      })
      .addCase(getAccessoriesListThunk.fulfilled, (state, action) => {
        state.accessoryLoading = false;
        state.accessoryList = action.payload;
        cartSlice.caseReducers.updateTotalAmount(state);
      })
      .addCase(getAccessoriesListThunk.rejected, (state) => {
        state.accessoryLoading = false;
      })
      .addMatcher(
        action => [addBundleToCartThunk.pending.type, removeBundleFromCartThunk.pending.type].includes(action.type),
        state => { state.loading = true; }
      )
      .addMatcher(
        action => [addBundleToCartThunk.fulfilled.type, addBundleToCartThunk.rejected.type, removeBundleFromCartThunk.fulfilled.type, removeBundleFromCartThunk.rejected.type].includes(action.type),
        state => { state.loading = false; }
      );
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
