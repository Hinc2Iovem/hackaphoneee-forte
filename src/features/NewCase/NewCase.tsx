import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  CaseInitialStep,
  type CaseInitialAnswers,
} from "./steps/CaseInitialStep";
import { CaseThirdStep } from "./steps/CaseThirdStep";

const DRAFT_KEY = "hk_new_case_draft";

type CaseDraft = {
  title: string;
  answers: CaseInitialAnswers;
};

export function NewCase() {
  const [draft, setDraft] = useState<CaseDraft | null>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CaseDraft;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!draft) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  function handleSaveLocal(data: {
    title: string;
    answers: CaseInitialAnswers;
  }) {
    setDraft(data);
  }

  function clearDraft() {
    setDraft(null);
  }

  return (
    <Routes>
      <Route
        path=""
        element={
          <CaseInitialStep
            initialTitle={draft?.title}
            initialAnswers={draft?.answers}
            onSaveLocal={handleSaveLocal}
          />
        }
      />

      <Route
        path=":caseId/artifacts"
        element={
          <CaseThirdStep answers={draft?.answers} onFinished={clearDraft} />
        }
      />

      <Route path="*" element={<Navigate to="/cases/new" replace />} />
    </Routes>
  );
}
