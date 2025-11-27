export const HK_ROUTES = {
  public: {
    LOGIN: {
      BASE: "/auth/login",
    },
  },
  private: {
    REGISTER: {
      BASE: "/auth/admin-register",
    },
    CASES: {
      SHARED: {
        BASE: "/cases",
      },
      CLIENT: {
        NEW: "/client/cases/new",
        FOLLOW_UP: "/client/cases/:caseId/followup",
        FOLLOW_UP_VALUE: (caseId: string) => `/client/cases/${caseId}/followup`,
        NEW_VALUE: (step: string) => `/client/cases/new/${step}`,
        EDIT_INITIAL: "/client/cases/:caseId/edit-initial",
        EDIT_INITIAL_VALUE: (caseId: string) =>
          `/client/cases/${caseId}/edit-initial`,
      },
      ANALYTIC: {
        INITIAL_STEP: "/analytic/cases/:caseId/initial",
        FOLLOW_UP: "/analytic/cases/:caseId/followup",
        FOLLOW_UP_VALUE: (caseId: string) =>
          `/analytic/cases/${caseId}/followup`,
        NEW_VALUE: (step: string) => `/analytic/cases/new/${step}`,
        EDIT_INITIAL: "/analytic/cases/:caseId/edit-initial",
        EDIT_INITIAL_VALUE: (caseId: string) =>
          `/analytic/cases/${caseId}/edit-initial`,
      },
    },
    ARTIFACTS: {
      CLIENT: {
        BASE: "/client/cases/new/:caseId/artifacts",
        GENERATED: "/client/cases/:caseId/artifacts",
        DETAILED: "/client/cases/:caseId/artifacts/:artifactId",
        BASE_VALUE: (caseId: string) => `/client/cases/new/${caseId}/artifacts`,
        GENERATED_VALUE: (caseId: string) =>
          `/client/cases/${caseId}/artifacts`,
        DETAILED_VALUE: (caseId: string, artifactId: string) =>
          `/client/cases/${caseId}/artifacts/${artifactId}`,
      },
      ANALYTIC: {
        BASE: "/analytic/cases/new/:caseId/artifacts",
        GENERATED: "/analytic/cases/:caseId/artifacts",
        DETAILED: "/analytic/cases/:caseId/artifacts/:artifactId",
        BASE_VALUE: (caseId: string) =>
          `/analytic/cases/new/${caseId}/artifacts`,
        DETAILED_VALUE: (caseId: string, artifactId: string) =>
          `/analytic/cases/${caseId}/artifacts/${artifactId}`,
      },
    },
  },
};
