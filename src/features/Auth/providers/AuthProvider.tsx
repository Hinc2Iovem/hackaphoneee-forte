import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  loadAuthFromSession,
  saveAuthToSession,
  type StoredAuth,
} from "../service/authSessionStorage";
import {
  axiosAuth,
  clearAuthTokens,
  setAuthTokens,
  type AuthResponse,
} from "@/api/axios";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextValue = {
  user: StoredAuth | null;
  ready: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<StoredAuth | null>(() => {
    const persisted = loadAuthFromSession();
    return persisted ?? null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const persisted = loadAuthFromSession();
      if (persisted?.refresh) {
        try {
          const resp = await axiosAuth.post<AuthResponse>("/auth/refresh/", {
            refresh: persisted.refresh,
          });

          const fresh: StoredAuth = {
            ...resp.data?.user,
            access: resp.data.access,
            refresh: resp.data.refresh,
            userId: resp.data?.user?.id,
            username: resp.data?.user?.name,
            fullName: resp.data?.user?.name,
            loggedOut: false,
          };
          setUser(fresh);
          setAuthTokens({
            access: fresh.access,
            refresh: fresh.refresh,
          });
          saveAuthToSession(fresh);
        } catch {
          clearAuthSession();
          setUser(null);
          clearAuthTokens();
        }
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (user && !user.loggedOut) {
      setAuthTokens({
        access: user.access,
        refresh: user.refresh,
      });
      saveAuthToSession(user);
    } else {
      clearAuthTokens();
      clearAuthSession();
    }
  }, [user]);

  async function login(payload: { email: string; password: string }) {
    const resp = await axiosAuth.post<AuthResponse>("/auth/login/", payload);

    const auth: StoredAuth = {
      ...resp.data?.user,
      access: resp.data.access,
      refresh: resp.data.refresh,
      userId: resp.data?.user?.id,
      username: resp.data?.user?.name,
      fullName: resp.data?.user?.name,
      loggedOut: false,
    };
    setUser(auth);
    setAuthTokens({
      access: auth.access,
      refresh: auth.refresh,
    });
    saveAuthToSession(auth);
  }

  async function logout() {
    if (user?.refresh) {
      try {
        await axiosAuth.post("/auth/logout/", {
          refresh: user.refresh,
        });
        queryClient.clear();
      } catch {}
    }
    queryClient.clear();
    setUser(null);
    clearAuthTokens();
    clearAuthSession();
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
