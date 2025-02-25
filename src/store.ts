import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import auth from "./core/auth/auth.store";

const rootReducer = combineReducers({
  auth: auth,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
