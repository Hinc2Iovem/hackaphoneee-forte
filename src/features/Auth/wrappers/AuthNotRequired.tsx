import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { HK_ROUTES } from "@/consts/HK_ROUTES";

export function AuthNotRequired() {
  const { user, ready } = useAuth();
  if (!ready) return null;

  const isLoggedIn = !!user && !user.loggedOut;

  if (isLoggedIn) {
    return <Navigate to={HK_ROUTES.private.CASES.SHARED.BASE} replace />;
  }

  return <Outlet />;
}
