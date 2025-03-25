import { RootState } from "../../store";
import { createSelector } from "@reduxjs/toolkit";
import { AuthState } from "./auth.slice";

const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.isAuthenticated
);
