import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { HK_ROUTES } from "@/consts/HK_ROUTES";

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={HK_ROUTES.private.CASES.BASE} replace />}
        />
      </Routes>
    </AppLayout>
  );
}
