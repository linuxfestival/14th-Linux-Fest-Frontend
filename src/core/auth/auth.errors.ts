export enum AuthErrorCodes {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
}

export const AuthErrorMessages = {
  [AuthErrorCodes.INVALID_CREDENTIALS]: "The provided credentials are invalid.",
  [AuthErrorCodes.USER_NOT_FOUND]: "No user found with the provided details.",
  [AuthErrorCodes.TOKEN_EXPIRED]: "The authentication token has expired.",
};
