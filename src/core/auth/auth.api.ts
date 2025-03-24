import { makeCall } from "../../utils/makeCall";
import {LoginRequest, LoginResponse, SignupRequest, SignupResponse} from "./auth.dto.ts";



export const loginWithUsernamePassword = makeCall<LoginRequest, LoginResponse>(
  "api/token/",
  "POST"
);

export const signup = makeCall<SignupRequest, SignupResponse>(
    "api/users/signup/",
    "POST",
)