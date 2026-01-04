import type { HKRolesTypes } from "@/consts/HK_ROLES";

export type StoredAuth = {
  access: string;
  refresh: string;
  loggedOut: boolean;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  role: HKRolesTypes;
};

export const AUTH_SESSION_STORAGE_KEY = "hk-auth";

export function saveAuthToSession(value: StoredAuth) {
  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(value));
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
