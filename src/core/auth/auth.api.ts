import { makeCall } from "../../utils/makeCall";
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    SignupRequest,
    SignupResponse,
    EmailRequest,
    OnboardingRequest,
    OnboardingResponse,
    PasswordResetConfirmRequest,
    VerifyEmailRequest,
    VerifyEmailResponse,
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

export const resendActivation = makeCall<EmailRequest, {detail: string}>(
    "/api/users/resend_activation/",
    "POST",
)

export const verifyEmail = makeCall<VerifyEmailRequest, VerifyEmailResponse>(
    "/api/users/activate/",
    "POST",
)

export const requestPasswordReset = makeCall<EmailRequest, {detail: string}>(
    "/api/users/password_reset_request/",
    "POST",
)

export const confirmPasswordReset = makeCall<PasswordResetConfirmRequest, {detail: string}>(
    "/api/users/password_reset_confirm/",
    "POST",
)

export const getOnboarding = makeCall<never, OnboardingResponse>(
    "/api/users/onboarding/",
    "GET",
    true,
)

export const saveOnboarding = makeCall<OnboardingRequest, OnboardingResponse>(
    "/api/users/onboarding/",
    "POST",
    true,
)
