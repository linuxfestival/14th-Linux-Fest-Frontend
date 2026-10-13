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
const containsSkyroomCredentials = (url?: string) =>
  url?.includes("/api/users/skyroom/") ?? false;

// Endpoints that establish a session themselves. A 401 from one of these must
// never trigger another refresh attempt or a "please log in" redirect.
const AUTH_ENDPOINTS = ["api/token/access/", "api/token/refresh/"];

const isAuthEndpoint = (url?: string) =>
  Boolean(url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint)));

// Single-flight refresh. While one refresh is in flight every concurrent 401
// awaits the same promise instead of spending the (possibly rotating) refresh
// token several times and logging the user out.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = Cookies.get("refresh_token");
  if (!refresh) return null;

  const [{ default: store }, { refreshThunk }] = await Promise.all([
    import("../store.ts"),
    import("../core/auth/auth.thunk.ts"),
  ]);

  const result = await store.dispatch(refreshThunk({ refresh }));
  if (refreshThunk.rejected.match(result)) return null;

  const payload = result.payload as RefreshTokenResponse | undefined;
  const access = payload?.access;
  if (!access) return null;

  Cookies.set("access_token", access, {
    secure: true,
    sameSite: "Strict",
  }); // Store new token

  // When the backend rotates refresh tokens, the old one gets blacklisted, so
  // the newest refresh token must be persisted or the next refresh will fail
  // (that is what fills up Django's blacklisted-tokens table).
  if (payload?.refresh) {
    Cookies.set("refresh_token", payload.refresh, {
      secure: true,
      sameSite: "Strict",
    });
  }

  return access;
};

api.interceptors.response.use(
  (response) => {
    if (!containsSkyroomCredentials(response.config.url)) {
      logger.debug(
        `response for ${response.config.url} ${JSON.stringify(response)}`,
      );
    }
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
    const url: string | undefined = originalRequest?.url;

    if (error.response?.status === 401 && !isAuthEndpoint(url)) {
      // API factories are created while the store's modules initialize. Load
      // their authentication dependencies only when a request needs recovery
      // to avoid the makeCall -> store -> cart/auth API initialization cycle.
      const [{ default: store }, { logout }] = await Promise.all([
        import("../store.ts"),
        import("../core/auth/auth.slice.ts"),
      ]);

      try {
        refreshPromise =
          refreshPromise ??
          refreshAccessToken().finally(() => {
            refreshPromise = null;
          });

        const access = await refreshPromise;

        if (access && originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${access}`;

          // Retry the original request with the new token
          return api(originalRequest);
        }

        // No refresh token available: the session is already gone.
        throw error;
      } catch (refreshError) {
        const hadSession = Boolean(
          Cookies.get("refresh_token") || Cookies.get("access_token"),
        );
        store.dispatch(logout());
        if (hadSession) {
          toast.error("نیاز دارید تا وارد شوید!");
          const { default: router } = await import("../routes.tsx");
          router.navigate("/login");
        }
        return Promise.reject(refreshError);
      }
    }

    if (!containsSkyroomCredentials(originalRequest?.url)) logger.error(error.response);
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
