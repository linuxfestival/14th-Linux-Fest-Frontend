import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./core/auth/auth.slice";
import cart from "./core/cart/cart.slice";
import users from "./core/users/users.store";
import presentations from "./core/presentations/presentations.store";
import payment from "./core/payment/payment.store";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  auth,
  cart,
  presentation: presentations,
  users,
  payment
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
