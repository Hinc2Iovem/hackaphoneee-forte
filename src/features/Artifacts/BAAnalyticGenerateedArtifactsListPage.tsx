import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import { useEnsureCaseDocuments } from "@/features/Cases/hooks/useGetCaseDocuments";
import type { DocumentStatusVariation } from "./mock-data";
import ArtifactsSpinner from "@/features/NewCase/components/ArtifactsLoading";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

function StatusBadge({ status }: { status: DocumentStatusVariation }) {
  const config: Record<
    DocumentStatusVariation,
    { label: string; className: string }
  > = {
    approved_by_ba: {
      label: "Принят сотрудником",
      className: "bg-emerald-50 text-emerald-700",
    },
    rejected_by_ba: {
      label: "Не принят сотрудником",
      className: "bg-rose-50 text-rose-700",
    },
    draft: {
      label: "На проверке",
      className: "bg-amber-50 text-amber-700",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function AnalyticGeneratedArtifactsListPage() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();

  const { data: caseDetail } = useGetCaseDetail(caseId);
  const { data, isLoading, isError } = useEnsureCaseDocuments(caseId);

  const artifacts = data?.files ?? [];

  const handleOpen = (artifactId: string) => {
    if (!caseId) return;
    navigate(
      HK_ROUTES.private.ARTIFACTS.ANALYTIC.DETAILED_VALUE(caseId, artifactId)
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        <button
          type="button"
          onClick={() => navigate(HK_ROUTES.private.CASES.SHARED.BASE)}
          className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>К доске</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1B1B1F]">
            {caseDetail?.title ?? data?.case_title ?? "Кейс"}
          </h1>
          <p className="text-xs text-[#888085]">Сформированные артефакты</p>
        </div>

        {isLoading && (
          <div className="pt-6">
            <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-10 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
              <ArtifactsSpinner title="Генерация артефактов…" />
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="pt-4 text-sm text-red-500">
            Не удалось загрузить артефакты. Попробуйте обновить страницу позже.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-3 pt-4">
            {artifacts.length === 0 ? (
              <p className="text-sm text-gray-500">
                Для этого кейса пока нет сгенерированных документов.
              </p>
            ) : (
              artifacts.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => handleOpen(art.id)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-5 py-4 text-left text-sm md:text-base text-[#1B1B1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:bg-[#FDF7FA]"
                >
                  <div className="flex flex-col gap-1">
                    <span>{art.title}</span>
                    <span className="text-[11px] text-[#888085] uppercase tracking-[0.12em]">
                      {art.doc_type}
                    </span>
                  </div>
                  <StatusBadge status={art.status ?? "draft"} />
                </button>
              ))
            )}
          </div>
        )}

        {caseId && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  HK_ROUTES.private.CASES.ANALYTIC.INITIAL_STEP.replace(
                    ":caseId",
                    caseId
                  )
                )
              }
              className="h-10 rounded-lg border border-[#E3E1E8] bg-white px-4 text-xs md:text-sm font-medium text-[#1B1B1F] hover:bg-[#F1EFF4]"
            >
              Бриф из 8 вопросов
            </Button>

            <Button
              type="button"
              onClick={() =>
                navigate(
                  HK_ROUTES.private.CASES.ANALYTIC.FOLLOW_UP_VALUE(caseId)
                )
              }
              className="h-10 rounded-lg bg-[#EAD0E0] px-4 text-xs md:text-sm font-medium text-[#1B1B1F] hover:bg-[#e2c0d4]"
            >
              Уточняющий диалог
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
