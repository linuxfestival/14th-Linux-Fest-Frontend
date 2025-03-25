import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  date: number;
  instructor: string;
}

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
  items: CartItem[];
  totalAmount: number;
  step: CartPage;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  step: CartPage.Cart,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }
      state.totalAmount += action.payload.price;
    },
    removeItem(state, action: PayloadAction<string>) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalAmount -= item.price;
        state.items.splice(itemIndex, 1);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
    setPage(state, action: PayloadAction<CartPage>) {
      state.step = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
