import { Button } from "@/components/ui/button";
import { useSaveInitialAnswers } from "@/features/Cases/hooks/useSaveInitialAnswers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ARTIFACTS } from "../consts/CASE_INITIAL_QUESTIONS";
import type { CaseInitialAnswers } from "./CaseInitialStep";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";

interface Props {
  answers: CaseInitialAnswers | undefined;
  onFinished?: () => void;
}

export function CaseThirdStep({ answers: answersProp, onFinished }: Props) {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { data: caseDetail } = useGetCaseDetail(caseId!, {
    enabled: !answersProp,
  });
  const { mutateAsync, isPending } = useSaveInitialAnswers(caseId!);

  const storageKey = caseId
    ? `hk_new_case_step2_${caseId}`
    : "hk_new_case_step2";

  const effectiveAnswers: CaseInitialAnswers | null =
    answersProp ??
    caseDetail?.initial_answers ??
    (() => {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as {
          answers?: CaseInitialAnswers;
        };
        return parsed.answers ?? null;
      } catch {
        return null;
      }
    })();

  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { selected?: string[] };
      return parsed.selected ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (caseDetail?.selected_document_types?.length && selected.length === 0) {
      setSelected(caseDetail.selected_document_types);
    }
  }, [caseDetail?.selected_document_types, selected.length]);

  useEffect(() => {
    try {
      if (!effectiveAnswers) return;
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          answers: effectiveAnswers,
          selected,
        })
      );
    } catch (e) {
      console.warn("[CaseThirdStep] failed to write sessionStorage", e);
    }
  }, [effectiveAnswers, selected, storageKey]);

  function toggle(code: string) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  async function handleFinish() {
    if (!effectiveAnswers) return;

    await mutateAsync({
      initial_answers: effectiveAnswers,
      selected_document_types: selected,
    });

    onFinished?.();
    navigate(`/cases/${caseId}/followup`);
  }

  if (!effectiveAnswers) {
    return <div className="p-4 text-sm">Загружаем данные кейса…</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-32">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">Шаг 2 из 3: Выбор артефактов</p>
        <h1 className="text-3xl font-black tracking-tight">
          Выберите артефакты для генерации
        </h1>
        <p className="text-sm text-gray-600">
          Укажите, какие документы и диаграммы должен подготовить AI-ассистент.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTIFACTS.map((a) => {
          const isActive = selected.includes(a.code);
          return (
            <button
              key={a.code}
              type="button"
              onClick={() => toggle(a.code)}
              className={`flex flex-col gap-4 p-5 h-full rounded-xl border-2 shadow-sm transition-all text-left ${
                isActive
                  ? "border-accent bg-card-light/90 dark:bg-card-dark"
                  : "border-transparent bg-card-light dark:bg-card-dark hover:border-accent/50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl!">
                    {a.icon}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "border-gray-300"
                  }`}
                >
                  {isActive && (
                    <span className="material-symbols-outlined text-base!">
                      check
                    </span>
                  )}
                </div>
              </div>
              <p className="text-base font-bold">{a.label}</p>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex justify-between px-4 py-4 gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={!selected.length || isPending}
          >
            Сохранить и перейти к уточняющим вопросам
          </Button>
        </div>
      </div>
    </div>
  );
}
