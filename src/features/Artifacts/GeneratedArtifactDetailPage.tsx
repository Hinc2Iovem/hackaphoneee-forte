import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import {
  useEnsureCaseDocuments,
  type EnsureDocumentsResponse,
} from "@/features/Cases/hooks/useGetCaseDocuments";
import type { DocumentStatusVariation } from "@/features/Artifacts/mock-data";
import ArtifactsSpinner from "@/features/NewCase/components/ArtifactsLoading";
import { HK_ROUTES } from "@/consts/HK_ROUTES";

type GeneratedDocumentFile = EnsureDocumentsResponse["files"][number];

function StatusPill({ status }: { status: DocumentStatusVariation }) {
  const config: Record<
    DocumentStatusVariation,
    { label: string; className: string }
  > = {
    approved_by_ba: {
      label: "Принят",
      className: "bg-emerald-50 text-emerald-700",
    },
    rejected_by_ba: {
      label: "Не принят",
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

export function GeneratedArtifactDetailPage() {
  const navigate = useNavigate();
  const { caseId, artifactId } = useParams<{
    caseId: string;
    artifactId: string;
  }>();

  const { data: caseDetail } = useGetCaseDetail(caseId);
  const { data, isLoading, isError } = useEnsureCaseDocuments(caseId);

  const artifacts = data?.files ?? [];
  const selected: GeneratedDocumentFile | undefined =
    artifacts.find((a) => a.id === artifactId) ?? artifacts[0];

  const handleSelectFromSidebar = (id: string) => {
    if (!caseId) return;
    navigate(HK_ROUTES.private.ARTIFACTS.CLIENT.DETAILED_VALUE(caseId, id));
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-10 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <ArtifactsSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !selected) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <button
            type="button"
            onClick={() =>
              navigate(
                caseId
                  ? HK_ROUTES.private.ARTIFACTS.CLIENT.GENERATED_VALUE(caseId)
                  : HK_ROUTES.private.CASES.SHARED.BASE
              )
            }
            className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline mb-4"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span>Назад</span>
          </button>
          <p className="text-sm text-red-500">Не удалось загрузить документ.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        <button
          type="button"
          onClick={() =>
            navigate(
              HK_ROUTES.private.ARTIFACTS.CLIENT.GENERATED_VALUE(caseId || "")
            )
          }
          className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>К артефактам</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1B1B1F]">
            {caseDetail?.title ?? data?.case_title ?? "Кейс"}
          </h1>
          <p className="text-xs text-[#888085]">Редактирование артефактов</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px,minmax(0,1fr),160px]">
          <aside className="rounded-2xl bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="mb-3 px-2 text-xs font-semibold text-[#888085]">
              Список артефактов
            </div>
            <div className="space-y-2">
              {artifacts.map((art) => {
                const isActive = art.id === selected.id;
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => handleSelectFromSidebar(art.id)}
                    className={`w-full rounded-xl px-3 py-3 text-left text-xs md:text-sm transition ${
                      isActive
                        ? "border border-[#A31551] bg-[#FFE6EE] text-[#1B1B1F]"
                        : "border border-transparent bg-[#F7F6F8] text-[#1B1B1F] hover:border-[#A31551]/40"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span>{art.title}</span>
                      <span className="text-[10px] text-[#888085] uppercase tracking-[0.16em]">
                        {art.doc_type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col">
            <header className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base md:text-lg font-semibold text-[#1B1B1F]">
                  {selected.title}
                </h2>
                <StatusPill status={selected.status ?? "draft"} />
              </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-[#E3E1E8] bg-[#F7F6F8] px-4 py-6 text-center">
              <p className="text-sm text-[#55505A]">
                Предпросмотр DOCX в браузере недоступен.
              </p>
              <p className="mt-1 text-xs text-[#888085]">
                Скачайте файл, чтобы открыть его в Word, Google Docs или другом
                редакторе документов.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={selected.docx_url}
                download
                className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#A31551] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F1246]"
              >
                <span className="material-symbols-outlined mr-1 text-sm">
                  download
                </span>
                <span>Скачать DOCX</span>
              </a>

              <a
                href={selected.docx_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#E3E1E8] bg-white px-3 py-2 text-xs font-medium text-[#55505A] hover:bg-[#F7F6F8]"
              >
                <span className="material-symbols-outlined mr-1 text-sm">
                  open_in_new
                </span>
                <span>Открыть в новой вкладке</span>
              </a>
            </div>
          </section>

          <aside className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border border-rose-200 cursor-pointer bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Не принимать
            </Button>

            <Button
              type="button"
              className="h-10 rounded-lg bg-emerald-600 cursor-pointer text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Принять
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
