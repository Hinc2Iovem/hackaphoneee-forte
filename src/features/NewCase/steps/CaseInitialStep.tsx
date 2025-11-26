import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateCase } from "@/features/Cases/hooks/useCreateCase";
import { useUpdateCase } from "@/features/Cases/hooks/useUpdateCase";
import { CASE_INITIAL_QUESTIONS } from "../consts/CASE_INITIAL_QUESTIONS";

export type CaseInitialAnswers = Record<string, string>;

interface Props {
  initialTitle?: string;
  initialAnswers?: CaseInitialAnswers;
  onSaveLocal?: (data: { title: string; answers: CaseInitialAnswers }) => void;
}

const SS_KEY = "hk_new_case_step1";

type Step1Store = {
  caseId?: string;
  title?: string;
  answers?: CaseInitialAnswers;
  backendCase?: unknown;
};

export function CaseInitialStep({
  initialTitle = "",
  initialAnswers,
  onSaveLocal,
}: Props) {
  const { caseId: caseIdFromUrl } = useParams<{ caseId?: string }>();

  const [caseId, setCaseId] = useState<string | null>(caseIdFromUrl ?? null);
  const [title, setTitle] = useState(initialTitle);
  const [answers, setAnswers] = useState<CaseInitialAnswers>(
    initialAnswers ??
      Object.fromEntries(CASE_INITIAL_QUESTIONS.map((f) => [f.key, ""]))
  );

  const { mutateAsync: createCase, isPending: isCreating } = useCreateCase();
  const { mutateAsync: updateCase, isPending: isUpdating } = useUpdateCase();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialAnswers || initialTitle) return;

    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Step1Store;

      if (!caseIdFromUrl && parsed.caseId) {
        setCaseId(parsed.caseId);
      }
      if (!title && parsed.title) {
        setTitle(parsed.title);
      }
      if (parsed.answers) {
        setAnswers((prev) => ({ ...prev, ...parsed.answers }));
      }
    } catch (e) {
      console.warn("[CaseInitialStep] failed to read sessionStorage", e);
    }
  }, [initialAnswers, initialTitle, caseIdFromUrl]);

  useEffect(() => {
    try {
      const payload: Step1Store = {
        caseId: caseId ?? undefined,
        title,
        answers,
      };
      sessionStorage.setItem(SS_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("[CaseInitialStep] failed to write sessionStorage", e);
    }
  }, [caseId, title, answers]);

  function updateField(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const allQuestionsFilled = CASE_INITIAL_QUESTIONS.every((f) =>
    (answers[f.key] ?? "").trim()
  );
  const isMutating = isCreating || isUpdating;
  const canSubmit = !!title.trim() && allQuestionsFilled && !isMutating;

  async function handleNext() {
    if (!canSubmit) return;

    const trimmedTitle = title.trim();
    onSaveLocal?.({ title: trimmedTitle, answers });

    const existingId = caseIdFromUrl ?? caseId ?? null;

    if (existingId) {
      const updated = await updateCase({
        id: existingId,
        data: { title: trimmedTitle },
      });

      setCaseId(updated.id);

      sessionStorage.setItem(
        SS_KEY,
        JSON.stringify({
          caseId: updated.id,
          title: trimmedTitle,
          answers,
          backendCase: updated,
        } as Step1Store)
      );

      navigate(`/cases/new/${updated.id}/artifacts`);
    } else {
      const session = await createCase({ title: trimmedTitle });

      setCaseId(session.id);

      sessionStorage.setItem(
        SS_KEY,
        JSON.stringify({
          caseId: session.id,
          title: trimmedTitle,
          answers,
          backendCase: session,
        } as Step1Store)
      );

      navigate(`/cases/new/${session.id}/artifacts`);
    }
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <span className="text-primary hover:underline">Создание запроса</span>
          <span className="text-gray-400">/</span>
          <span className="text-text-light dark:text-text-dark">
            Шаг 1: Основная информация
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-4xl font-black tracking-tight text-text-light dark:text-text-dark">
            Создание нового запроса
          </h1>
        </div>
      </div>

      <div>
        <label className="flex flex-col">
          <p className="pb-2 text-base font-medium text-text-light dark:text-text-dark">
            Название бизнес-проекта
          </p>
          <Input
            placeholder="Например, Запуск новой кредитной карты для молодежи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full max-w-2xl rounded-lg border border-border-light bg-card-light p-4 text-base font-normal text-text-light placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-card-dark dark:text-text-dark dark:placeholder:text-gray-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CASE_INITIAL_QUESTIONS.map((field) => (
          <div
            key={field.key}
            className="flex flex-col rounded-xl border border-border-light bg-card-light p-5 shadow-sm transition-shadow hover:shadow-md dark:border-border-dark dark:bg-card-dark"
          >
            <label className="flex h-full flex-col">
              <p className="pb-2 text-base font-semibold text-text-light dark:text-text-dark">
                {field.label}
              </p>
              <Textarea
                placeholder="Введите ответ"
                value={answers[field.key] ?? ""}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="grow w-full resize-none rounded-lg border border-border-light bg-background-light p-3 text-sm text-text-light placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-gray-500"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/80 dark:border-border-dark dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            className="bg-secondary-button-light text-text-light hover:bg-gray-300 dark:bg-secondary-button-dark dark:text-text-dark dark:hover:bg-opacity-80"
          >
            Назад
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!canSubmit}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-white transition-colors hover:bg-opacity-90"
          >
            <span>Далее</span>
            <span className="material-symbols-outlined text-xl">
              arrow_forward
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
