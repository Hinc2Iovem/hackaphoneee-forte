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
      BASE: "/cases",
      NEW: "/cases/new",
      FOLLOW_UP: "/cases/:caseId/followup",
      FOLLOW_UP_VALUE: (caseId: string) => `/cases/${caseId}/followup`,
      NEW_VALUE: (step: string) => `/cases/new/${step}`,
      EDIT_INITIAL: "/cases/:caseId/edit-initial",
      EDIT_INITIAL_VALUE: (caseId: string) => `/cases/${caseId}/edit-initial`,
    },
  },
};
