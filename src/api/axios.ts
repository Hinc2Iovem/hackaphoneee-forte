import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { AUTH_URL, BASE_URL } from "@/lib/env";
import type { HKRolesTypes } from "@/consts/HK_ROLES";

export type AuthResponse = {
  access: string;
  refresh: string;
  user: {
    name: string;
    email: string;
    id: string;
    role: HKRolesTypes;
  };
};

export type AuthTokens = {
  access: string | null;
  refresh: string | null;
};

export const axiosAuth = axios.create({
  baseURL: `${AUTH_URL}/api`,
  withCredentials: true,
});

export const axiosCustomized = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export const axiosApiRaw = axios.create({
  baseURL: axiosCustomized.defaults.baseURL,
  withCredentials: axiosCustomized.defaults.withCredentials,
  timeout: axiosCustomized.defaults.timeout ?? 30000,
});

let access: string | null = null;
let refresh: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAuthTokens(tokens: AuthTokens) {
  access = tokens.access ?? null;
  refresh = tokens.refresh ?? null;
}

export function getAuthTokens(): AuthTokens {
  return { access, refresh };
}

export function clearAuthTokens() {
  access = null;
  refresh = null;
}

axiosCustomized.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
    if (access && !config._retry) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  }
);

axiosCustomized.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isAuthCall =
      originalRequest.baseURL?.startsWith(`${AUTH_URL}`) ||
      originalRequest.url?.startsWith("/auth");

    const shouldAttemptRefresh =
      !isAuthCall &&
      !originalRequest._retry &&
      (status === 401 || status === 403);

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    if (!refresh) {
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const resp = await axiosAuth.post<AuthResponse>("/auth/refresh", {
            refresh,
          });

          const newAccess = resp.data.access;
          const newRefresh = resp.data.refresh ?? refresh;

          access = newAccess;
          refresh = newRefresh;

          return newAccess;
        } catch (e) {
          clearAuthTokens();
          throw e;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      const newAccess = await refreshPromise;

      originalRequest._retry = true;
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return axiosCustomized(originalRequest);
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

axiosAuth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const isLoginOrRefresh =
    config.url?.startsWith("/auth/login") ||
    config.url?.startsWith("/auth/refresh");

  if (!isLoginOrRefresh && access) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});
