import { createAsyncThunk } from "@reduxjs/toolkit";
import {loginWithUsernamePassword, LoginRequest, SignupRequest, signup, SignupResponse} from "./auth.api";
import { AuthErrorCodes, AuthErrorMessages } from "./auth.errors";
import {AxiosResponse} from "axios";



export const loginThunk = createAsyncThunk(
  "auth/login",
  async (request: LoginRequest, { rejectWithValue }) => {
    try {
      const apiCallResponse = await loginWithUsernamePassword(request);
      return apiCallResponse.data;
    } catch (error: any) {
      const errorMessage = error?.message as AuthErrorCodes;

      if (errorMessage && AuthErrorMessages[errorMessage]) {
        return rejectWithValue(AuthErrorMessages[errorMessage]);
      } else {
        return rejectWithValue(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  }
);

export const signupThunk = createAsyncThunk(
    "auth/signup",
    async (request: SignupRequest, { rejectWithValue }) => {
      try {
        // Ensure passwords match before making an API call


        // Call the API to register the user
        const response: AxiosResponse<SignupResponse> = await signup(request);

        return response.data;
      } catch (error: any) {
        const errorMessage = error.message as AuthErrorCodes;

        if (errorMessage && AuthErrorMessages[errorMessage]) {
          return rejectWithValue(AuthErrorMessages[errorMessage]);
        } else {
          return rejectWithValue("An unexpected error occurred. Please try again.");
        }
      }
    }
);

// now we can call this thunk via dispatch() in every component and handle every thing from there
// we can pass onSuccess or onError as thunk argument and call them in thunk after api call
// or we can use const res = await dispatch(loginThunk) and wrap it in try {} catch {} to handle errors
// and do the stuff we should do after user logged in

