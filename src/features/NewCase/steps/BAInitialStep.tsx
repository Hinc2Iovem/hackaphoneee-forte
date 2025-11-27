import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import { CASE_INITIAL_QUESTIONS } from "@/features/NewCase/consts/CASE_INITIAL_QUESTIONS";
import ArtifactsSpinner from "@/features/NewCase/components/ArtifactsLoading";

export function BACaseBriefPage() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();

  const { data: caseDetail, isLoading, isError } = useGetCaseDetail(caseId);

  const questionsCount = CASE_INITIAL_QUESTIONS.length;

  const goBackToBoard = () => {
    navigate(HK_ROUTES.private.CASES.SHARED.BASE);
  };

  const goToArtifacts = () => {
    if (!caseId) return;
    navigate(
      HK_ROUTES.private.ARTIFACTS.ANALYTIC.GENERATED.replace(":caseId", caseId)
    );
  };

  const goToFollowup = () => {
    if (!caseId) return;
    navigate(HK_ROUTES.private.CASES.ANALYTIC.FOLLOW_UP_VALUE(caseId));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32 space-y-8">
        <button
          type="button"
          onClick={goBackToBoard}
          className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>К доске</span>
        </button>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <div className="max-w-xs w-full">
              <ArtifactsSpinner />
            </div>
          </div>
        ) : isError || !caseDetail ? (
          <p className="mt-8 text-sm text-red-500">
            Не удалось загрузить бриф по этому кейсу.
          </p>
        ) : (
          <>
            <div className="space-y-2 mt-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1B1F]">
                {caseDetail.title}
              </h1>
              <p className="text-sm text-[#888085]">
                Бриф из {questionsCount} вопросов
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {CASE_INITIAL_QUESTIONS.map((field, idx) => {
                const answer =
                  caseDetail.initial_answers?.[field.key] ?? "Ответ не указан";

                return (
                  <div
                    key={field.key}
                    className="flex h-80 flex-col rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    <div className="mb-3 min-h-10 flex items-start">
                      <p className="text-sm font-semibold text-[#1B1B1F] leading-snug">
                        {idx + 1}. {field.label}
                      </p>
                    </div>

                    <div className="flex-1 rounded-xl bg-[#F7F6F8] px-3 py-3 text-sm text-[#1B1B1F] whitespace-pre-line overflow-y-auto scrollbar-thin">
                      {answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {!isLoading && !isError && caseDetail && (
        <div className="sticky bottom-0 left-0 right-0 border-t border-[#E3E1E8] bg-[#F7F6F8]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={goToArtifacts}
              className="h-11 rounded-lg border border-[#E3E1E8] bg-white px-6 text-sm font-medium text-[#1B1B1F] hover:bg-[#F1EFF4]"
            >
              <span>Сформированные артефакты</span>
              <span className="material-symbols-outlined ml-1 text-base">
                arrow_forward
              </span>
            </Button>

            <Button
              type="button"
              onClick={goToFollowup}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#A31551] px-8 text-sm font-semibold text-white hover:bg-[#8F1246]"
            >
              <span>Уточняющий диалог</span>
              <span className="material-symbols-outlined text-base">chat</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
