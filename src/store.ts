import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./core/auth/auth.slice";
import cart from "./core/cart/cart.slice";
import users from "./core/users/users.store";
import presentations from "./core/presentations/presentations.store";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  auth,
  cart,
  presentation: presentations,
  users: users,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
