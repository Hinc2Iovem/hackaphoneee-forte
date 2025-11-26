import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { AdminRegisterPage } from "@/features/Auth/AdminRegisterPage";
import { LoginPage } from "@/features/Auth/Login";
import { AuthNotRequired } from "@/features/Auth/wrappers/AuthNotRequired";
import { RequireAuth } from "@/features/Auth/wrappers/ReqireAuth";
import { CasesPage } from "@/features/Cases/Cases";
import { EditCaseInitialStep } from "@/features/NewCase/EditCaseInitialStep";
import { FollowupChat } from "@/features/NewCase/FollowupChat";
import { NewCase } from "@/features/NewCase/NewCase";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthNotRequired />}>
        <Route path={HK_ROUTES.public.LOGIN.BASE} element={<LoginPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route element={<RequireAuth allowedRoles={["AUTHORITY"]} />}>
          <Route
            path={HK_ROUTES.private.REGISTER.BASE}
            element={<AdminRegisterPage />}
          />
        </Route>

        <Route element={<RequireAuth />}>
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
          <Route
            path={HK_ROUTES.private.CASES.EDIT_INITIAL}
            element={<EditCaseInitialStep />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
