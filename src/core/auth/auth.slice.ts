import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk, signupThunk } from "./auth.thunk";
import { LoginResponse } from "./auth.dto.ts";
import {UserDto} from "../users/users.dto.ts";
import Cookies from "js-cookie";

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    access: string;
    refresh: string;
  } | null;
  userData?: UserDto,
  userPhoneNumber?: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      console.log("logout user");
      state.user = null;
      state.userPhoneNumber = undefined;
      state.userData = undefined;
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("phone_number");
    },
    initializeUser(state, action: PayloadAction<{access: string; refresh: string; phone_number: string}>) {
      state.isAuthenticated = true;
      console.log("init user");
      state.user = {
        access: action.payload.access,
        refresh: action.payload.refresh,
      };
      state.userPhoneNumber = action.payload.phone_number;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = {
            access: action.payload.access,
            refresh: action.payload.refresh,
          };
          state.userPhoneNumber = action.payload.phone_number;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = Boolean(action.payload.tokens);
        state.user = action.payload.tokens ?? null;
        state.userPhoneNumber = action.payload.tokens
          ? action.payload.phone_number
          : undefined;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, initializeUser } = authSlice.actions;
export default authSlice.reducer;
