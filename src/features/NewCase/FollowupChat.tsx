import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAnswerFollowupQuestion } from "../Cases/hooks/useGetAnswerFollowupQuestion";
import { useGetCaseDetail } from "../Cases/hooks/useGetCaseDetail";
import { useGetNextFollowupQuestion } from "../Cases/hooks/useGetNextFollowUpQuestion";
import ArtifactsSidebar from "./components/FollowupArtifactSidebar";
import BriefSidebar from "./components/FollowupBriefSidebar";
import ChatPanel from "./components/FollowupChatPannel";
import type { CaseDetailTypes } from "@/types/CaseTypes";
import NewCaseHeader from "./components/NewCaseHeader";

type AnsweredFollowup = NonNullable<
  NonNullable<CaseDetailTypes>["followup_questions"]
>[number];

export function FollowupChat() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const { data: caseDetail, isLoading: isCaseLoading } = useGetCaseDetail(
    caseId!
  );
  const { data: nextQuestion, isLoading: isNextLoading } =
    useGetNextFollowupQuestion(caseId!);
  const { mutateAsync, isPending } = useGetAnswerFollowupQuestion(caseId!);

  const finished = !!nextQuestion?.is_finished;

  const totalQuestionsFromNext = nextQuestion?.total_questions ?? 0;
  const totalQuestionsFromDetail =
    caseDetail?.followup_questions?.length ?? undefined;
  const totalQuestions =
    totalQuestionsFromDetail ?? totalQuestionsFromNext ?? 0;

  const answeredFollowups: AnsweredFollowup[] = [
    ...(caseDetail?.followup_questions ?? []),
  ]
    .filter((q) => q.answer_text)
    .sort((a, b) => a.order_index - b.order_index);

  const answeredQuestions = answeredFollowups.length;

  let dataSufficiencyPercent =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  if (dataSufficiencyPercent < 0) dataSufficiencyPercent = 0;
  if (dataSufficiencyPercent > 100) dataSufficiencyPercent = 100;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-[40px]">
        <NewCaseHeader
          stepTitle="Шаг 3 из 3: Уточняющий диалог"
          completionWidth="w-full"
        />
      </div>
      <div className="flex w-full flex-col lg:flex-row gap-6 md:min-h-[520px]">
        <ChatPanel
          caseDetail={caseDetail}
          isCaseLoading={isCaseLoading}
          nextQuestion={nextQuestion}
          isNextLoading={isNextLoading}
          finished={finished}
          totalQuestions={totalQuestions}
          answeredFollowups={answeredFollowups}
          answeredQuestions={answeredQuestions}
          isSubmitting={isPending}
          onSubmitAnswer={async (answer, questionId) => {
            await mutateAsync({
              question_id: String(questionId),
              answer,
            });
          }}
        />
        <aside className="w-full lg:w-[35%] lg:max-w-sm h-full max-h-screen flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <BriefSidebar
            caseDetail={caseDetail}
            caseId={caseId}
            onEditInitial={() =>
              navigate(
                HK_ROUTES.private.CASES.CLIENT.EDIT_INITIAL_VALUE(caseId!)
              )
            }
          />

          <ArtifactsSidebar
            caseDetail={caseDetail}
            dataSufficiencyPercent={dataSufficiencyPercent}
            onEditArtifacts={() =>
              navigate(`/client/cases/new/${caseId}/artifacts`)
            }
          />
        </aside>
      </div>
    </section>
  );
}
