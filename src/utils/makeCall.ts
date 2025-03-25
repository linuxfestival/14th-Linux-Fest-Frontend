import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";
import strings from "./locales/locales";
import { logger } from "./logger";
import router from "../routes.tsx";
import Cookies from "js-cookie";
import { refreshThunk } from "../core/auth/auth.thunk.ts";
import store from "../store.ts";
import { RefreshTokenResponse } from "../core/auth/auth.dto.ts";
import { logout } from "../core/auth/auth.slice.ts";

// here we will do the main makeCall
// the point is to handle all request failure errors and detect any axios error to provide error for all possible errors in easiest way

type methods = "GET" | "POST" | "DELETE" | "UPDATE" | "PUT";

export const makeCall = <T, K>(
  path: string | ((params: Record<string, string | number>) => string),
  method: methods = "GET",
  useAuth = false
): ((
  body?: T,
  params?: Record<string, string | number>
) => Promise<AxiosResponse<K, any>>) => {
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

const api = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });
axiosRetry(api, {
  retries: 10,
  shouldResetTimeout: true,
});

api.interceptors.response.use(
  (response) => {
    logger.debug(
      `response for ${response.config.url} ${JSON.stringify(response)}`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        if (originalRequest.url?.includes("api/token/refresh/")) {
          throw error;
        }

        const result = await store.dispatch(
          refreshThunk({
            refresh: Cookies.get("refresh_token") ?? "",
          })
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
        toast.error("نیاز دارید تا وارد شوید!")
        store.dispatch(logout());
        router.navigate("/login");
        return Promise.reject(refreshError);
      }
    }

    logger.error(error.response);
    return Promise.reject(error);
  }
);
axios.interceptors.request.use(
  (config) => {
    logger.debug(`request for ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;

export const getErrorCode = <Errors extends number>(
  error: any
): Errors | undefined => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const errorCode = (axiosError.response?.data as { error_code: number })
      .error_code;
    if (errorCode) {
      return errorCode as Errors;
    }
  }
  toast.info(strings.errors.connectionError, { toastId: "connection-id" });
  return -1 as Errors;
};
