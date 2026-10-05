import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";
import strings from "./locales/locales";
import { logger } from "./logger";
import Cookies from "js-cookie";
import type { RefreshTokenResponse } from "../core/auth/auth.dto.ts";

// here we will do the main makeCall
// the point is to handle all request failure errors and detect any axios error to provide error for all possible errors in easiest way

type methods = "GET" | "POST" | "DELETE" | "UPDATE" | "PUT";

export const makeCall = <T, K>(
  path: string | ((params: Record<string, string | number>) => string),
  method: methods = "GET",
  useAuth = false,
): ((
  body?: T,
  params?: Record<string, string | number>,
) => Promise<AxiosResponse<K>>) => {
  return (body?: T, params?: Record<string, string | number>) => {
    const resolvedPath = typeof path === "function" ? path(params || {}) : path;

    const config: AxiosRequestConfig = {};

    if (useAuth) {
      const token = Cookies.get("access_token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    switch (method) {
      case "GET":
        return api.get<K>(resolvedPath, config);
      case "POST":
        return api.post<K>(resolvedPath, body, config);
      case "PUT":
        return api.put<K>(resolvedPath, body, config);
      case "DELETE":
        return api.delete<K>(resolvedPath, config);
      case "UPDATE":
        return api.patch<K>(resolvedPath, body, config);
      default:
        throw new Error("Invalid HTTP method");
    }
  };
};

const api = axios.create({
  baseURL:
    window.__RUNTIME_CONFIG__?.API_BASE_URL ||
    import.meta.env.VITE_BASE_URL ||
    "",
});
axiosRetry(api, {
  retries: 2,
  shouldResetTimeout: true,
});

const finalizedErrors = new WeakSet<object>();

api.interceptors.response.use(
  (response) => {
    logger.debug(
      `response for ${response.config.url} ${JSON.stringify(response)}`,
    );
    return response;
  },
  async (error) => {
    // axios-retry settles first. Its nested requests can pass the same final
    // error through this interceptor again while their promises unwind.
    if (error && typeof error === "object") {
      if (finalizedErrors.has(error)) return Promise.reject(error);
      finalizedErrors.add(error);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401) {
      // API factories are created while the store's modules initialize. Load
      // their authentication dependencies only when a request needs recovery
      // to avoid the makeCall -> store -> cart/auth API initialization cycle.
      const [{ default: store }, { refreshThunk }, { logout }] =
        await Promise.all([
          import("../store.ts"),
          import("../core/auth/auth.thunk.ts"),
          import("../core/auth/auth.slice.ts"),
        ]);
      try {
        if (originalRequest.url?.includes("api/token/")) {
          throw error;
        }

        const result = await store.dispatch(
          refreshThunk({
            refresh: Cookies.get("refresh_token") ?? "asdf",
          }),
        );

        const { access } = result.payload as RefreshTokenResponse;

        if (access) {
          Cookies.set("access_token", access, {
            secure: true,
            sameSite: "Strict",
          }); // Store new token
          originalRequest.headers.Authorization = `Bearer ${access}`;

          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (!originalRequest.url?.includes("api/token/access/"))
          toast.error("نیاز دارید تا وارد شوید!");
        store.dispatch(logout());
        const { default: router } = await import("../routes.tsx");
        router.navigate("/login");
        return Promise.reject(refreshError);
      }
    }

    logger.error(error.response);
    return Promise.reject(error);
  },
);
axios.interceptors.request.use(
  (config) => {
    logger.debug(`request for ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);
export default api;

export const getErrorCode = <Errors extends number>(
  error: unknown,
): Errors | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const errorCode = (axiosError.response?.data as { error_code?: number } | undefined)
      ?.error_code;
    if (errorCode) {
      return errorCode as Errors;
    }
  }
  toast.info(strings.errors.connectionError, { toastId: "connection-id" });
  return -1 as Errors;
};
