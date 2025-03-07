import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginWithUsernamePassword, LoginRequest } from "./auth.api";
import { AuthErrorCodes, AuthErrorMessages } from "./auth.errors";

const loginThunk = createAsyncThunk(
  "auth/login",
  async (request: LoginRequest, { rejectWithValue }) => {
    try {
      const apiCallResponse = await loginWithUsernamePassword({
        username: request.username,
        password: request.password,
      });
      return apiCallResponse.data.successful;
    } catch (error: any) {
      const errorMessage = error.message as AuthErrorCodes;

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

// now we can call this thunk via dispatch() in every component and handle every thing from there
// we can pass onSuccess or onError as thunk argument and call them in thunk after api call
// or we can use const res = await dispatch(loginThunk) and wrap it in try {} catch {} to handle errors
// and do the stuff we should do after user logged in

export default loginThunk;
