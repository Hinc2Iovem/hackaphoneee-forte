import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCaseDetail } from "../Cases/hooks/useGetCaseDetail";
import { useGetNextFollowupQuestion } from "../Cases/hooks/useGetNextFollowUpQuestion";
import { useGetAnswerFollowupQuestion } from "../Cases/hooks/useGetAnswerFollowupQuestion";

export function FollowupChat() {
  const { caseId } = useParams<{ caseId: string }>();
  const { data: caseDetail } = useGetCaseDetail(caseId!);
  const { data: nextQuestion, isLoading } = useGetNextFollowupQuestion(caseId!);
  const { mutateAsync, isPending } = useGetAnswerFollowupQuestion(caseId!);
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nextQuestion?.question_id || !answer.trim()) return;

    await mutateAsync({
      question_id: nextQuestion.question_id,
      answer: answer.trim(),
    });

    setAnswer("");
  }

  const finished = nextQuestion?.is_finished;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
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
            className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-col gap-3"
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

      <aside className="w-full lg:w-[30%] max-w-sm flex flex-col gap-4">
        <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-2">Резюме брифа</h2>
          {caseDetail?.initial_answers ? (
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(caseDetail.initial_answers).map(
                ([key, value]) => (
                  <li key={key}>
                    <span className="font-semibold">{key}:</span> {value}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">
              Ответы на стартовые вопросы пока не заполнены.
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold mb-2">Выбранные артефакты</h2>
          {caseDetail?.selected_document_types?.length ? (
            <ul className="space-y-1 text-xs">
              {caseDetail.selected_document_types.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    description
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">
              Артефакты ещё не выбраны (либо сохранение не прошло).
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
