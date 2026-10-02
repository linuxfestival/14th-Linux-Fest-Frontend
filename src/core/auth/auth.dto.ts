export type LoginRequest = { email: string; password: string };

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginResponse extends AuthTokens {
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    is_first_login: boolean;
}

export interface SignupRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface SignupResponse {
    "first_name": string;
    "last_name": string;
    "email": string;
    "phone_number": string;
    "verification_required": boolean;
    "is_first_login": boolean;
    "tokens"?: AuthTokens;
}

export interface EmailRequest {
    email: string;
}

export interface VerifyEmailRequest extends EmailRequest {
    code: string;
}

export interface VerifyEmailResponse {
    detail: string;
    tokens: AuthTokens;
    phone_number: string;
    is_first_login: boolean;
}

export interface PasswordResetConfirmRequest extends VerifyEmailRequest {
    new_password: string;
}

export interface OnboardingRequest {
    heard_about_us: string;
    university?: string;
    hamkaran_announcement_consent: boolean;
}

export interface OnboardingResponse extends OnboardingRequest {
    is_first_login: boolean;
}

export interface RefreshTokenRequest {
    refresh: string;
}

export interface RefreshTokenResponse {
    access: string;
}
