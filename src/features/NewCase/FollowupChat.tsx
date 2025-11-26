import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCaseDetail } from "../Cases/hooks/useGetCaseDetail";
import { useGetNextFollowupQuestion } from "../Cases/hooks/useGetNextFollowUpQuestion";
import { useGetAnswerFollowupQuestion } from "../Cases/hooks/useGetAnswerFollowupQuestion";
import {
  ARTIFACT_META,
  INITIAL_ANSWER_LABELS,
} from "./consts/CASE_INITIAL_QUESTIONS";

export function FollowupChat() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const { data: caseDetail } = useGetCaseDetail(caseId!);
  const { data: nextQuestion, isLoading } = useGetNextFollowupQuestion(caseId!);
  const { mutateAsync, isPending } = useGetAnswerFollowupQuestion(caseId!);

  const [answer, setAnswer] = useState("");

  const finished = nextQuestion?.is_finished;
  const currentIndex = (nextQuestion?.order_index ?? 0) + 1;
  const totalQuestionsFromNext = nextQuestion?.total_questions ?? 0;
  const totalQuestionsFromDetail =
    caseDetail?.followup_questions?.length ?? undefined;

  const totalQuestions =
    totalQuestionsFromDetail ?? totalQuestionsFromNext ?? 0;

  let answeredQuestions = 0;

  if (caseDetail?.followup_questions) {
    answeredQuestions = caseDetail.followup_questions.filter(
      (q) => q.status !== "pending" && q.answer_text
    ).length;
  } else if (nextQuestion) {
    if (nextQuestion.is_finished) {
      answeredQuestions = totalQuestions;
    } else {
      if (nextQuestion.order_index)
        answeredQuestions = nextQuestion.order_index;
    }
  }

  let dataSufficiencyPercent =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  if (dataSufficiencyPercent < 0) dataSufficiencyPercent = 0;
  if (dataSufficiencyPercent > 100) dataSufficiencyPercent = 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nextQuestion?.question_id || !answer.trim()) return;

    await mutateAsync({
      question_id: nextQuestion.question_id,
      answer: answer.trim(),
    });

    setAnswer("");
  }

  return (
    <div className="flex h-full w-full flex-col lg:flex-row gap-6">
      <section className="flex-1 flex flex-col bg-white dark:bg-[#2c282f] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <div>
            <h1 className="text-lg font-semibold">
              {caseDetail?.title ?? "Кейс"}
            </h1>
            <p className="text-xs text-gray-500">
              Уточняющие вопросы перед генерацией документов
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/cases/new/${caseId}/artifacts`)}
          >
            Настроить артефакты
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {finished ? (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Все уточняющие вопросы по этому кейсу уже заданы и сохранены.
              Можно переходить к генерации документов.
            </div>
          ) : isLoading || !nextQuestion ? (
            <div className="text-sm text-gray-500">Загружаем вопрос…</div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-2">
                Вопрос {nextQuestion.order_index! + 1} из{" "}
                {nextQuestion.total_questions}
              </div>
              <div className="rounded-lg bg-[#EAE6FF] dark:bg-primary/20 px-4 py-3 text-sm">
                {nextQuestion.text}
              </div>
            </>
          )}
        </div>

        {!finished && (
          <form
            onSubmit={handleSubmit}
            className="border-t w-full border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-col gap-3"
          >
            <Textarea
              placeholder="Введите ваш ответ…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-20"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isPending || !nextQuestion?.question_id || !answer.trim()
                }
              >
                Отправить ответ
                <span className="material-symbols-outlined">send</span>
              </Button>
            </div>
          </form>
        )}
      </section>

      <aside className="w-full lg:w-[35%] max-w-sm h-full flex flex-col gap-4">
        <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-3">Резюме брифа</h2>
          {caseDetail?.initial_answers ? (
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(caseDetail.initial_answers).map(
                ([key, value]) => {
                  const label = INITIAL_ANSWER_LABELS[key] ?? key;
                  return (
                    <li key={key} className="flex flex-col">
                      <span className="font-semibold text-[12px] text-gray-700">
                        {label}:
                      </span>
                      <span>{value}</span>
                    </li>
                  );
                }
              )}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">
              Ответы на стартовые вопросы пока не заполнены.
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-3">Выбранные артефакты</h2>
          {caseDetail?.selected_document_types?.length ? (
            <ul className="space-y-2 text-xs">
              {caseDetail.selected_document_types.map((code) => {
                const meta = ARTIFACT_META[code] ?? {
                  icon: "description",
                  label: code,
                };
                return (
                  <li key={code} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      {meta.icon}
                    </span>
                    <span>{meta.label}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">
              Артефакты ещё не выбраны (либо сохранение не прошло).
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Достаточность данных</h2>
            <span className="text-sm font-bold text-teal-500">
              {dataSufficiencyPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${dataSufficiencyPercent}%`,
                background: "linear-gradient(90deg, #8A2BE2, #00CED1)",
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
