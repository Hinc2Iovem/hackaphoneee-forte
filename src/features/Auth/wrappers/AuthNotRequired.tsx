import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function AuthNotRequired() {
  const { user } = useAuth();

  if (user && !user.loggedOut && user.accessToken) {
    return <Navigate to="/cases" replace />;
  }

  return <Outlet />;
}
