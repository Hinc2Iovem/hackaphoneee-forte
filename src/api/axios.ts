import { AUTH_URL, BASE_URL } from "@/lib/env";
import axios from "axios";

type AuthResponse = {
  access: string;
  refresh?: string | null;
};

export const axiosLoginCustomized = axios.create({
  baseURL: `${AUTH_URL}/api`,
  withCredentials: true,
});

export const axiosCustomized = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export const axiosRaw = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAuthTokens(
  tokens: { access?: string; refresh?: string } | null
) {
  accessToken = tokens?.access ?? null;
  refreshToken = tokens?.refresh ?? null;
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
}

axiosCustomized.interceptors.request.use((config: any) => {
  if (accessToken && !config._retry) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosCustomized.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    console.log("[AXIOS] error", status, originalRequest?.url);

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      console.log("[AXIOS] already retried -> skip");
      return Promise.reject(error);
    }

    if (!refreshToken) {
      console.log("[AXIOS] no refresh -> skip");
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      console.log("[AXIOS] start refresh");
      refreshPromise = (async () => {
        try {
          const resp = await axiosRaw.post<AuthResponse>("/auth/refresh/", {
            refresh: refreshToken,
          });

          console.log("[AXIOS] refresh OK", resp.data);

          accessToken = resp.data.access;
          if (resp.data.refresh) {
            refreshToken = resp.data.refresh;
          }

          return accessToken!;
        } catch (e) {
          console.log("[AXIOS] refresh FAILED", e);
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
