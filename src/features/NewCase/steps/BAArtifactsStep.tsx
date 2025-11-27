import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import { ARTIFACTS, type Artifact } from "../consts/CASE_INITIAL_QUESTIONS";
import NewCaseHeader from "../components/NewCaseHeader";
import ArtifactsLoading from "../components/ArtifactsLoading";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AnalyticArtifactsStep() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const { data: caseDetail, isLoading, isError } = useGetCaseDetail(caseId!);

  if (isLoading || !caseDetail) {
    return <ArtifactsLoading />;
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-600">
        Не удалось загрузить данные кейса.
      </div>
    );
  }

  const selectedCodes = caseDetail.selected_document_types ?? [];

  const artifacts = ARTIFACTS;
  const documentArtifacts = artifacts.filter((a) => a.group !== "diagram");
  const diagramArtifacts = artifacts.filter((a) => a.group === "diagram");

  const renderArtifactCard = (a: Artifact) => {
    const isActive = selectedCodes.includes(a.code);

    return (
      <div
        key={a.code}
        className={`flex h-[120px] flex-col justify-between rounded-2xl border px-4 py-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
          isActive
            ? "border-[#A31551] bg-[#FFE6EE]"
            : "border-[#F1EFF4] bg-[#F7F6F8]"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <div
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md ${
                isActive ? "bg-[#A31551]" : "bg-[#F1EFF4]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] leading-none ${
                  isActive ? "text-white" : "text-[#A31551]"
                }`}
              >
                {a.icon}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#1B1B1F] leading-snug">
              {a.label}
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex size-5 items-center justify-center rounded-full border border-[#E3E1E8] bg-white text-[11px] text-[#888085]"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                ?
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="end"
              className="max-w-xs text-xs leading-snug text-[#1B1B1F] bg-white"
            >
              {a.description}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex justify-end">
          <div
            className={`flex size-6 items-center justify-center rounded-md border-2 ${
              isActive
                ? "border-[#A31551] bg-[#A31551] text-white"
                : "border-[#E3E1E8] bg-white"
            }`}
          >
            {isActive && (
              <span className="material-symbols-outlined text-[18px] leading-none">
                check
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32 space-y-10">
        <NewCaseHeader
          stepTitle="Шаг 2 из 3: Выбранные артефакты"
          completionWidth="w-2/3"
        />

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1B1F]">
            Артефакты, выбранные клиентом
          </h1>
          <p className="text-sm text-[#888085]">
            Ниже отображаются документы и диаграммы, которые выбрал клиент для
            генерации по своему запросу.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#1B1B1F]">Документы</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {documentArtifacts.map(renderArtifactCard)}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#1B1B1F]">Диаграммы</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {diagramArtifacts.map(renderArtifactCard)}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-[#E3E1E8] bg-[#F7F6F8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                HK_ROUTES.private.CASES.ANALYTIC.INITIAL_STEP.replace(
                  ":caseId",
                  caseId || ""
                )
              )
            }
            className="h-11 rounded-lg border border-[#E3E1E8] bg-white px-6 text-sm font-medium text-[#1B1B1F] hover:bg-[#F1EFF4]"
          >
            <span className="material-symbols-outlined text-xl mr-1">
              arrow_back
            </span>
            <span>Назад</span>
          </Button>

          <Button
            type="button"
            onClick={() =>
              navigate(
                HK_ROUTES.private.CASES.ANALYTIC.FOLLOW_UP_VALUE(caseId || "")
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#A31551] px-8 text-sm font-semibold text-white hover:bg-[#8F1246]"
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
