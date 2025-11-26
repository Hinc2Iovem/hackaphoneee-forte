import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { CasesPage } from "@/features/Cases/Cases";
import { NewCase } from "@/features/NewCase/NewCase";
import { FollowupChat } from "@/features/NewCase/FollowupChat";

export function AppRouter() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={HK_ROUTES.private.CASES.BASE} replace />}
        />
        <Route path={HK_ROUTES.private.CASES.BASE} element={<CasesPage />} />
        <Route path="/cases/new/*" element={<NewCase />} />
        <Route
          path={HK_ROUTES.private.CASES.FOLLOW_UP}
          element={<FollowupChat />}
        />
      </Routes>
    </AppLayout>
  );
}
