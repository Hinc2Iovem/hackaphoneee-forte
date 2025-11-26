import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { CasesPage } from "@/features/Cases/Cases";
import { NewCase } from "@/features/NewCase/NewCase";
import { FollowupChat } from "@/features/NewCase/FollowupChat";
import { EditCaseInitialStep } from "@/features/NewCase/EditCaseInitialStep";
import { AuthNotRequired } from "@/features/Auth/wrappers/AuthNotRequired";
import { LoginPage } from "@/features/Auth/Login";
import { AdminRegisterPage } from "@/features/Auth/AdminRegisterPage";
import { RequireAuth } from "@/features/Auth/wrappers/ReqireAuth";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={HK_ROUTES.private.CASES.BASE} replace />}
      />

      <Route element={<AuthNotRequired />}>
        <Route path={HK_ROUTES.public.LOGIN.BASE} element={<LoginPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route element={<RequireAuth />}>
          <Route
            path={HK_ROUTES.private.REGISTER.BASE}
            element={<AdminRegisterPage />}
          />
          <Route path={HK_ROUTES.private.CASES.BASE} element={<CasesPage />} />
          <Route path="/cases/new/*" element={<NewCase />} />
          <Route
            path={HK_ROUTES.private.CASES.FOLLOW_UP}
            element={<FollowupChat />}
          />
          <Route
            path={HK_ROUTES.private.CASES.EDIT_INITIAL}
            element={<EditCaseInitialStep />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
