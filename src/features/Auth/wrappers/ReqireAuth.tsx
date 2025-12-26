import type { HKRolesTypes } from "@/consts/HK_ROLES";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

type RequireAuthProps = {
  allowedRoles?: HKRolesTypes[];
};

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { user, ready } = useAuth();
  const location = useLocation();

  console.log("user: ", user);
  if (!ready) return null;

  const hasUser = !!user && !user.loggedOut;
  const role = user?.role;

  if (!hasUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    role &&
    !allowedRoles.includes(role as "CLIENT")
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
