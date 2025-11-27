import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import { useSaveInitialAnswers } from "@/features/Cases/hooks/useSaveInitialAnswers";
import { CASE_INITIAL_QUESTIONS } from "./consts/CASE_INITIAL_QUESTIONS";
import type { CaseInitialAnswers } from "./steps/CaseInitialStep";

export function EditCaseInitialStep() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const { data: caseDetail, isLoading } = useGetCaseDetail(caseId!);

  const { mutateAsync: saveInitial, isPending: isSavingInitial } =
    useSaveInitialAnswers(caseId ?? null);

  const [answers, setAnswers] = useState<CaseInitialAnswers>(
    Object.fromEntries(CASE_INITIAL_QUESTIONS.map((f) => [f.key, ""]))
  );

  useEffect(() => {
    if (!caseDetail) return;

    if (caseDetail.initial_answers) {
      setAnswers((prev) => ({
        ...prev,
        ...caseDetail.initial_answers,
      }));
    }
  }, [caseDetail]);

  function updateField(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const allQuestionsFilled = CASE_INITIAL_QUESTIONS.every((f) =>
    (answers[f.key] ?? "").trim()
  );

  const canSubmit = allQuestionsFilled && !isSavingInitial;

  async function handleSave() {
    if (!caseId || !canSubmit) return;

    await saveInitial({
      initial_answers: answers,
      selected_document_types: caseDetail?.selected_document_types ?? [],
    });

    navigate(`/cases/${caseId}/followup`);
  }

  if (isLoading || !caseDetail) {
    return <div className="p-4 text-sm">Загружаем данные кейса…</div>;
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-black tracking-tight">
          Редактирование брифа
        </h1>
        <p className="text-sm text-gray-600">
          Обновите основную информацию по бизнес-проекту.
        </p>
      </div>

      {/* <div>
        <label className="flex flex-col">
          <p className="pb-2 text-base font-medium">
            Название бизнес-проекта
          </p>
          <Input
            placeholder="Например, Запуск новой кредитной карты для молодежи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full max-w-2xl rounded-lg border border-border-light bg-card-light p-4 text-base"
          />
        </label>
      </div> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CASE_INITIAL_QUESTIONS.map((field) => (
          <div
            key={field.key}
            className="flex flex-col rounded-xl border border-border-light bg-card-light p-5 shadow-sm hover:shadow-md"
          >
            <label className="flex h-full flex-col">
              <p className="pb-2 text-base font-semibold">{field.label}</p>
              <Textarea
                placeholder="Введите ответ"
                value={answers[field.key] ?? ""}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="grow w-full resize-none rounded-lg border border-border-light bg-background-light p-3 text-sm"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSubmit}
            className="flex h-11 items-center justify-center gap-2"
          >
            Сохранить бриф
          </Button>
        </div>
      </div>
    </div>
  );
}
