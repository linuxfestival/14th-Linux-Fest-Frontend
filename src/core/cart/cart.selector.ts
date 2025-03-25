import { RootState } from "../../store";
import { createSelector } from "@reduxjs/toolkit";
import { CartState } from "./cart.slice";

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.items
);

export const selectCartTotalAmount = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.totalAmount
);

export const selectCartStep = createSelector(
  selectCartState,
  (cartState: CartState) => cartState.step
);
