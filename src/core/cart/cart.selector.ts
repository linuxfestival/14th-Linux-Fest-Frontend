import { RootState } from "../../store";
import { createSelector } from "@reduxjs/toolkit";
import { CartState } from "./cart.slice";

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.items
);

export const selectCartItemsCount = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.count
);

export const selectIsItemExistInCart = (itemId: number) =>
  createSelector(selectCartItems, (items) =>
    items.some((item) => {
      return item.presentation.id === itemId;
    })
  );

export const selectItemInCartById = (itemId: number) =>
  createSelector(selectCartItems, (items) =>
    items.find((item) => {
      return item.presentation.id === itemId;
    })
  );

export const selectIsLoadingCart = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.loading
);

export const selectCartTotalAmount = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.totalAmount
);

export const selectCartStep = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.step
);

export const selectAccessoryLoading = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.accessoryLoading
);

export const selectAccessoryList = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.accessoryList
);
