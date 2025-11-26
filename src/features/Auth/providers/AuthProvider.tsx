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

type AuthContextValue = {
  user: StoredAuth | null;
  ready: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredAuth | null>(null);
  const [ready, setReady] = useState(false);

  // bootstrap + try refresh
  useEffect(() => {
    (async () => {
      const persisted = loadAuthFromSession();
      if (persisted?.refreshToken) {
        try {
          const resp = await axiosAuth.post<AuthResponse>("/auth/refresh", {
            refreshToken: persisted.refreshToken,
          });

          const fresh: StoredAuth = { ...resp.data, loggedOut: false };
          setUser(fresh);
          setAuthTokens({
            accessToken: fresh.accessToken,
            refreshToken: fresh.refreshToken,
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
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
      saveAuthToSession(user);
    } else {
      clearAuthTokens();
      clearAuthSession();
    }
  }, [user]);

  async function login(payload: { email: string; password: string }) {
    const resp = await axiosAuth.post<AuthResponse>("/auth/login", payload);

    const auth: StoredAuth = { ...resp.data, loggedOut: false };
    setUser(auth);
    setAuthTokens({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    });
    saveAuthToSession(auth);
  }

  async function logout() {
    if (user?.refreshToken) {
      try {
        await axiosAuth.post("/auth/logout", {
          refreshToken: user.refreshToken,
        });
      } catch {}
    }
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
