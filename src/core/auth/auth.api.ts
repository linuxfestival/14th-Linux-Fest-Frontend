import { makeCall } from "../../utils/makeCall";

export type LoginRequest = { username: string; password: string };

export type LoginResponse = { successful: boolean };

export const loginWithUsernamePassword = makeCall<LoginRequest, LoginResponse>(
  "/login",
  "POST"
);
