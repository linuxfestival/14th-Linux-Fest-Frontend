import { makeCall } from "../../utils/makeCall";
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    SignupRequest,
    SignupResponse
} from "./auth.dto.ts";



export const loginWithUsernamePassword = makeCall<LoginRequest, LoginResponse>(
  "api/token/access/",
  "POST"
);

export const signup = makeCall<SignupRequest, SignupResponse>(
    "api/users/signup/",
    "POST",
)

export const refreshToken = makeCall<RefreshTokenRequest, RefreshTokenResponse>(
    "api/token/refresh/",
    "POST",
    true
)