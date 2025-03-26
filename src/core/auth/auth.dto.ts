export type LoginRequest = { phone_number: string; password: string };

export type LoginResponse = { access: string; refresh: string };

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
    "tokens": {
        "refresh": string,
        "access": string
    }
}

export interface RefreshTokenRequest {
    refresh: string;
}

export interface RefreshTokenResponse {
    access: string;
}