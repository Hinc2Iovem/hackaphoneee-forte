import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import type { useGetNextFollowupQuestion } from "@/features/Cases/hooks/useGetNextFollowUpQuestion";
import { useState } from "react";

type CaseDetail = ReturnType<typeof useGetCaseDetail>["data"];
type NextQuestion = ReturnType<typeof useGetNextFollowupQuestion>["data"];
type AnsweredFollowup = NonNullable<
  NonNullable<CaseDetail>["followup_questions"]
>[number];

export default function ChatPanel({
  caseDetail,
  isCaseLoading,
  nextQuestion,
  isNextLoading,
  finished,
  totalQuestions,
  answeredFollowups,
  answeredQuestions,
  onSubmitAnswer,
  isSubmitting,
}: {
  caseDetail: CaseDetail;
  isCaseLoading: boolean;
  nextQuestion: NextQuestion;
  isNextLoading: boolean;
  finished: boolean;
  totalQuestions: number;
  answeredFollowups: AnsweredFollowup[];
  answeredQuestions: number;
  onSubmitAnswer: (
    answer: string,
    questionId: string | number
  ) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [answer, setAnswer] = useState("");

  const canSend =
    !!nextQuestion?.question_id && !!answer.trim() && !isSubmitting;

  async function submitAnswer() {
    if (!canSend || !nextQuestion?.question_id) return;
    await onSubmitAnswer(answer.trim(), nextQuestion.question_id);
    setAnswer("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitAnswer();
  }

  return (
    <section className="flex-1 flex flex-col bg-white dark:bg-[#2c282f] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-screen">
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">
            {caseDetail?.title ?? "Кейс"}
          </h1>
          <p className="text-xs text-gray-500">
            Уточняющие вопросы перед генерацией документов
          </p>
          {totalQuestions > 0 && (
            <p className="mt-1 text-[11px] text-gray-400">
              {answeredQuestions} из {totalQuestions} вопросов уже проработаны
            </p>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {isCaseLoading ? (
          <div className="text-sm text-gray-500">Загружаем диалог…</div>
        ) : answeredFollowups.length === 0 && !nextQuestion ? (
          <div className="text-sm text-gray-500">
            Уточняющих вопросов пока нет.
          </div>
        ) : (
          <>
            {answeredFollowups.map((q) => (
              <div key={q.id} className="space-y-2">
                <div className="flex items-end gap-3 max-w-2xl">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 shrink-0"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRGGNn-6QEAFS6XfVpYXp5M2yIvJpgSQu8I76vKuCzVVjTSCAwGrDZievu5DxmjzIt-Alo6lo1m9j7GAikGRsr9vypB13kq3Ujo_vS_2Vs8WyAQidJiWwy3SQtpRDAx5jqSv8B36DYRXTYEMAUa_7SKkM2KG27HnBL2N9pcc1Ng1mcfCqUqZuC-BRIE4jsXgFLI1TENo5t_YZ2AWUMFQDjubGLDqa2Ps74176rSxyAu-DvSFqybk_k6duQ4dIVchzJ5j5ulUJ8jbmN")',
                    }}
                  />
                  <div className="flex flex-1 flex-col gap-1 items-start">
                    <p className="text-gray-600 dark:text-gray-400 text-[13px] font-medium">
                      AI Assistant
                    </p>
                    <div className="text-base font-normal leading-relaxed flex max-w-xl rounded-lg rounded-bl-none px-4 py-3 bg-[#EAE6FF] dark:bg-primary/20 text-gray-800 dark:text-gray-200">
                      {q.text}
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3 justify-end max-w-2xl ml-auto">
                  <div className="flex flex-1 flex-col gap-1 items-end">
                    <p className="text-gray-600 dark:text-gray-400 text-[13px] font-medium text-right">
                      Вы
                    </p>
                    <div className="text-base font-normal leading-relaxed flex max-w-xl rounded-lg rounded-br-none px-4 py-3 bg-[#F0F2F5] dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {q.answer_text}
                    </div>
                  </div>
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 shrink-0"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVl2MI3v_kwVO_vDIviqI_cLVzkht3qZquAcsS2X5GucwtJGz-dm1S2Ch44PCHUoYvFv0k_GtgdpI1bPAcqtz0FbAvnErb-gW_n8fcdnSh0ttp09fctJtkoCiqwhjTREqh05wTeUzOBV4JfaZWmoZmwMzICc5PDZpv7f7v21tXPawEiruBZCHgqf6PFAdPr-a_wMHgf5s2re6twvzZgzKxIAi5EfQNKyMq27K_C-iBuHasks5UfYCLYwr-aoUbSTtzy5qAuatP9k3k")',
                    }}
                  />
                </div>
              </div>
            ))}

            {!finished && nextQuestion && (
              <div className="space-y-2">
                <div className="flex items-end gap-3 max-w-2xl">
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 shrink-0"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRGGNn-6QEAFS6XfVpYXp5M2yIvJpgSQu8I76vKuCzVVjTSCAwGrDZievu5DxmjzIt-Alo6lo1m9j7GAikGRsr9vypB13kq3Ujo_vS_2Vs8WyAQidJiWwy3SQtpRDAx5jqSv8B36DYRXTYEMAUa_7SKkM2KG27HnBL2N9pcc1Ng1mcfCqUqZuC-BRIE4jsXgFLI1TENo5t_YZ2AWUMFQDjubGLDqa2Ps74176rSxyAu-DvSFqybk_k6duQ4dIVchzJ5j5ulUJ8jbmN")',
                    }}
                  />
                  <div className="flex flex-1 flex-col gap-1 items-start">
                    <p className="text-gray-600 dark:text-gray-400 text-[13px] font-medium">
                      AI Assistant
                    </p>
                    <div className="text-base font-normal leading-relaxed flex max-w-xl rounded-lg rounded-bl-none px-4 py-3 bg-[#EAE6FF] dark:bg-primary/20 text-gray-800 dark:text-gray-200">
                      {nextQuestion.text}
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Вопрос{" "}
                      {typeof nextQuestion.order_index === "number"
                        ? nextQuestion.order_index + 1
                        : 1}{" "}
                      из {totalQuestions || "…"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {finished && (
              <div className="pt-4 text-xs text-gray-500">
                Все уточняющие вопросы по этому кейсу уже заданы и сохранены.
                Можно переходить к генерации документов.
              </div>
            )}
          </>
        )}
      </div>

      {!finished && (
        <form
          onSubmit={handleSubmit}
          className="border-t w-full border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-col gap-3"
        >
          {isNextLoading && (
            <p className="text-[11px] text-gray-400">
              Загружаем следующий вопрос…
            </p>
          )}
          <Textarea
            placeholder="Введите ваш ответ…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitAnswer();
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isSubmitting || !nextQuestion?.question_id || !answer.trim()
              }
            >
              Отправить ответ
              <span className="material-symbols-outlined">send</span>
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
