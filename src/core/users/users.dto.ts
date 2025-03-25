export interface UserDto {
    email: string;
    first_name: string;
    last_name: string;
    avatar?: string;
}

export interface UpdateUserRequest {
    email: string;
    first_name: string;
    last_name: string;
    avatar?: File;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    [key: string]: string[] | string;
}

export interface FAQDto {
    question: string;
    answer: string;
}