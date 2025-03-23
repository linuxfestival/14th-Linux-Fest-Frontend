import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginThunk, signupThunk } from "./auth.thunk";
import {LoginResponse, SignupResponse} from "./auth.api.ts";

interface AuthState {
  isAuthenticated: boolean;
  user?: {
    access: string;
    refresh: string;
  } | null;
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
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // Handle login
        .addCase(loginThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        })
        .addCase(loginThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(signupThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signupThunk.fulfilled, (state) => {
          state.loading = false;
          state.isAuthenticated = true;
        })
        .addCase(signupThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;