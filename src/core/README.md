# Core Structure

This project is organized into several sections, each containing specific types of files. Below is an example of how the files are structured:

- core
  |
  --- auth
  |
  --- auth.thunk.ts
  --- auth.store.ts
  --- auth.errors.ts
  --- auth.api.ts

## Sections

### Stores

Stores contain the state management logic for the application. They define how the state is updated in response to actions.

### Errors

Errors are used to define and manage error codes and their corresponding messages. This helps in maintaining consistency and clarity throughout the application.

Each error code is defined as an enum, and the error messages are stored in an object with keys corresponding to the error codes.

Example:

```typescript
// auth.errors.ts
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
```

This structure ensures that error handling is consistent and easily maintainable.

### API Calls

API calls are used to interact with external services. They define the functions that make HTTP requests and handle responses using makeCall function in utils folder.

Each section should have its own folder containing the relevant files for that section.
