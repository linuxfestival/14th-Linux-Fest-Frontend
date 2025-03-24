import {makeCall} from "../../utils/makeCall.ts";
import {ChangePasswordRequest, ChangePasswordResponse, UserDto} from "./users.dto.ts";

export const getUserByPhone = makeCall<void, UserDto>(
    (params) => `/api/users/${params.phone_number}/`,
    "GET"
);

export const updateUser = makeCall<UserDto, UserDto>(
    (params) => `/api/users/${params.phone_number}/`,
    "PUT"
);

export const changePassword = makeCall<ChangePasswordRequest, ChangePasswordResponse>(
    "/api/users/change_password/",
    "POST"
);
