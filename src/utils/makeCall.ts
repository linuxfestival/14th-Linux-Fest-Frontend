import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "react-toastify";
import strings from "./locales/locales";
import { logger } from "./logger";
import { from, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

//here we will do the main makeCall
// the point is to handle all request failure errors and detect any axios error to provide error for all possible errors in easiest way

type methods = "GET" | "POST" | "DELETE" | "UPDATE" | "PUT";

export const makeCall = <T, K>(
  path: string,
  method: methods = "GET",
  body?: T
): Observable<K> => {
  const request = () => {
    switch (method) {
      case "GET":
        return api.get<K>(path);
      case "POST":
        return api.post<K>(path, body);
      case "PUT":
        return api.put<K>(path, body);
      case "DELETE":
        return api.delete<K>(path);
      case "UPDATE":
        return api.patch<K>(path, body);
      default:
        throw new Error("Invalid HTTP method");
    }
  };

  return from(request().then((response) => response.data)).pipe(
    catchError((error) => {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast.error(strings.errors.connectionError);
        }
        // Handle Axios error
        logger.error(`Axios error: ${error.message}`);
        throw error;
      } else {
        // Handle non-Axios error
        logger.error(`Unexpected error: ${error}`);
        throw error;
      }
    })
  );
};

const api = axios.create({ baseURL: import.meta.env.BASE_URL });
axiosRetry(api, {
  retries: 10,
  shouldResetTimeout: true,
});

axios.interceptors.response.use(
  (response) => {
    logger.debug(
      `response for ${response.config.url} ${JSON.stringify(response)}`
    );
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
      return Promise.resolve();
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

export default axios;

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
