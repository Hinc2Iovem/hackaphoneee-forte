export const HK_ROUTES = {
  private: {
    CASES: {
      BASE: "/cases",
      NEW: "/cases/new",
      FOLLOW_UP: "/cases/:caseId/followup",
      FOLLOW_UP_VALUE: (caseId: string) => `/cases/${caseId}/followup`,
      NEW_VALUE: (step: string) => `/cases/new/${step}`,
    },
  },
};
