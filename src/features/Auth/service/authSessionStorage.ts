import type { AuthResponse } from "@/api/axios";

export const AUTH_SESSION_STORAGE_KEY = "hk_auth";

export type StoredAuth = AuthResponse & {
  loggedOut: boolean;
};

export function saveAuthToSession(auth: StoredAuth) {
  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(auth));
}

export function loadAuthFromSession(): StoredAuth | null {
  const raw = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
