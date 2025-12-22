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
import { GeneratedArtifactsListPage } from "@/features/Artifacts/GeneratedArtifactsListPage";
import { GeneratedArtifactDetailPage } from "@/features/Artifacts/GeneratedArtifactDetailPage";
import { BACaseBriefPage } from "@/features/NewCase/steps/BAInitialStep";
import { AnalyticArtifactsStep } from "@/features/NewCase/steps/BAArtifactsStep";
import { AnalyticFollowupChat } from "@/features/NewCase/BAFollowupChat";
import { AnalyticGeneratedArtifactsListPage } from "@/features/Artifacts/BAAnalyticGenerateedArtifactsListPage";
import { AnalyticGeneratedArtifactDetailPage } from "@/features/Artifacts/AnalyticGeneratedArtifactDetailPage";

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
            element={
              <Navigate to={HK_ROUTES.private.CASES.SHARED.BASE} replace />
            }
          />
          <Route
            path={HK_ROUTES.private.CASES.SHARED.BASE}
            element={<CasesPage />}
          />

          <Route
            path="*"
            element={
              <Navigate to={HK_ROUTES.private.CASES.SHARED.BASE} replace />
            }
          />
        </Route>

        <Route element={<RequireAuth allowedRoles={["CLIENT"]} />}>
          <Route
            path={HK_ROUTES.private.ARTIFACTS.CLIENT.GENERATED}
            element={<GeneratedArtifactsListPage />}
          />
          <Route
            path={HK_ROUTES.private.ARTIFACTS.CLIENT.DETAILED}
            element={<GeneratedArtifactDetailPage />}
          />
          <Route
            path={HK_ROUTES.private.CASES.CLIENT.EDIT_INITIAL}
            element={<EditCaseInitialStep />}
          />
          <Route path="/client/cases/new/*" element={<NewCase />} />
          <Route
            path={HK_ROUTES.private.CASES.CLIENT.FOLLOW_UP}
            element={<FollowupChat />}
          />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={["ANALYTIC", "AUTHORITY"]} />}
        >
          <Route
            path={HK_ROUTES.private.CASES.ANALYTIC.INITIAL_STEP}
            element={<BACaseBriefPage />}
          />
          <Route
            path={HK_ROUTES.private.ARTIFACTS.ANALYTIC.BASE}
            element={<AnalyticArtifactsStep />}
          />
          <Route
            path={HK_ROUTES.private.CASES.ANALYTIC.FOLLOW_UP}
            element={<AnalyticFollowupChat />}
          />
          <Route
            path={HK_ROUTES.private.ARTIFACTS.ANALYTIC.GENERATED}
            element={<AnalyticGeneratedArtifactsListPage />}
          />
          <Route
            path={HK_ROUTES.private.ARTIFACTS.ANALYTIC.DETAILED}
            element={<AnalyticGeneratedArtifactDetailPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
