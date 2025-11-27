import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCaseDetail } from "../Cases/hooks/useGetCaseDetail";
import ArtifactsSidebar from "./components/FollowupArtifactSidebar";
import BriefSidebar from "./components/FollowupBriefSidebar";
import type { CaseDetailTypes } from "@/types/CaseTypes";
import NewCaseHeader from "./components/NewCaseHeader";
import { Button } from "@/components/ui/button";

type AnsweredFollowup = NonNullable<
  NonNullable<CaseDetailTypes>["followup_questions"]
>[number];

export function AnalyticFollowupChat() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const { data: caseDetail, isLoading: isCaseLoading } = useGetCaseDetail(
    caseId!
  );

  const followups = (caseDetail?.followup_questions ?? [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index);

  const answeredFollowups: AnsweredFollowup[] = followups.filter(
    (q) => q.answer_text
  );

  const totalQuestions = followups.length;
  const answeredQuestions = answeredFollowups.length;

  let dataSufficiencyPercent =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  if (dataSufficiencyPercent < 0) dataSufficiencyPercent = 0;
  if (dataSufficiencyPercent > 100) dataSufficiencyPercent = 100;

  const title = caseDetail?.title ?? "Уточняющий диалог по бизнес-кейсу";

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-[40px]">
        <NewCaseHeader
          stepTitle="Шаг 3 из 3: Уточняющий диалог"
          completionWidth="w-full"
        />

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1B1F]">
            {title}
          </h1>
          <p className="text-sm text-[#888085]">Уточняющий диалог (просмотр)</p>
        </div>
      </div>

      <div className="flex w-full flex-col lg:flex-row gap-6 md:min-h-[520px]">
        <div className="flex-1 rounded-2xl bg-card p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col">
          {isCaseLoading && (
            <div className="text-sm text-[#888085]">Загружаем диалог…</div>
          )}

          {!isCaseLoading && followups.length === 0 && (
            <div className="text-sm text-[#888085]">
              Уточняющих вопросов для этого кейса пока нет.
            </div>
          )}

          {!isCaseLoading && followups.length > 0 && (
            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {followups.map((q) => (
                <div key={q.id} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EFF4] text-[11px] font-semibold text-[#A31551]">
                      AI
                    </div>
                    <div className="max-w-[75%] rounded-2xl bg-[#F1EFF4] px-3 py-2 text-sm text-[#1B1B1F]">
                      {q.text}
                    </div>
                  </div>

                  {q.answer_text && (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl bg-[#A31551] px-3 py-2 text-sm text-white">
                        {q.answer_text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="w-full lg:w-[35%] lg:max-w-sm h-full max-h-screen flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <BriefSidebar
            caseDetail={caseDetail}
            caseId={caseId}
            onEditInitial={() =>
              navigate(
                HK_ROUTES.private.CASES.ANALYTIC.INITIAL_STEP.replace(
                  ":caseId",
                  caseId || ""
                )
              )
            }
          />

          <ArtifactsSidebar
            caseDetail={caseDetail}
            dataSufficiencyPercent={dataSufficiencyPercent}
            onEditArtifacts={() =>
              navigate(
                HK_ROUTES.private.ARTIFACTS.ANALYTIC.BASE_VALUE(caseId || "")
              )
            }
          />
        </aside>
      </div>

      <div className="flex w-full justify-between gap-4 pt-2 border-t border-[#E3E1E8] mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(
              HK_ROUTES.private.ARTIFACTS.ANALYTIC.BASE_VALUE(caseId || "")
            )
          }
          className="h-11 rounded-lg border border-[#E3E1E8] bg-white px-6 text-sm font-medium text-[#1B1B1F] hover:bg-[#F1EFF4]"
        >
          Назад
        </Button>

        <Button
          type="button"
          onClick={() =>
            navigate(
              HK_ROUTES.private.ARTIFACTS.ANALYTIC.GENERATED.replace(
                ":caseId",
                caseId || ""
              )
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#A31551] px-8 text-sm font-semibold text-white hover:bg-[#8F1246]"
        >
          <span>Перейти к документам</span>
          <span className="material-symbols-outlined text-xl">
            arrow_forward
          </span>
        </Button>
      </div>
    </section>
  );
}
