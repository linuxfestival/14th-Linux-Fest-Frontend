export interface UserDto {
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    detail: string;
}