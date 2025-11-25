import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { CasesPage } from "@/features/Cases/Cases";

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={HK_ROUTES.private.CASES.BASE} replace />}
        />
        <Route path={HK_ROUTES.private.CASES.BASE} element={<CasesPage />} />
      </Routes>
    </AppLayout>
  );
}
