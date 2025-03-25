import {makeCall} from "../../utils/makeCall.ts";
import {ChangePasswordRequest, ChangePasswordResponse, FAQDto, UpdateUserRequest, UserDto} from "./users.dto.ts";

export const getUserByPhone = makeCall<null, UserDto>(
    (params) => `/api/users/${params.phone_number}/`,
    "GET",
    true
);

export const updateUser = makeCall<FormData, UserDto>(
    (params) => `/api/users/${params.phone_number}/`,
    "PUT",
    true
);

export const changePassword = makeCall<ChangePasswordRequest, ChangePasswordResponse>(
    "/api/users/change_password/",
    "POST",
    true
);

export const getFAQ = makeCall<void, FAQDto[]>(
    "/api/faq/",
    "GET"
)