import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { AUTH_URL, BASE_URL } from "@/lib/env";
import type { HKRolesTypes } from "@/consts/HK_ROLES";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  role: HKRolesTypes;
  userId: string;
  username: string;
};

export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export const axiosAuth = axios.create({
  baseURL: `${AUTH_URL}/api`,
  // withCredentials: true,
});

export const axiosCustomized = axios.create({
  baseURL: `${BASE_URL}/api`,
  // withCredentials: true,
});

export const axiosApiRaw = axios.create({
  baseURL: axiosCustomized.defaults.baseURL,
  // withCredentials: axiosCustomized.defaults.withCredentials,
  timeout: axiosCustomized.defaults.timeout ?? 30000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAuthTokens(tokens: AuthTokens) {
  accessToken = tokens.accessToken ?? null;
  refreshToken = tokens.refreshToken ?? null;
}

export function getAuthTokens(): AuthTokens {
  return { accessToken, refreshToken };
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
}

axiosCustomized.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
    if (accessToken && !config._retry) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
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

    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const resp = await axiosAuth.post<AuthResponse>("/auth/refresh", {
            refreshToken,
          });

          const newAccess = resp.data.accessToken;
          const newRefresh = resp.data.refreshToken ?? refreshToken;

          accessToken = newAccess;
          refreshToken = newRefresh;

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

  if (!isLoginOrRefresh && accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
