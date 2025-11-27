import { toastError, toastSuccess } from "@/components/shared/toasts";
import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import type { DocumentStatusVariation } from "@/features/Artifacts/mock-data";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import {
  useEnsureCaseDocuments,
  type EnsureDocumentsResponse,
} from "@/features/Cases/hooks/useGetCaseDocuments";
import ArtifactsSpinner from "@/features/NewCase/components/ArtifactsLoading";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useReviewDocument from "../Cases/hooks/useReviewDocument";
import useUploadDocx from "../Cases/hooks/useUploadDocx";

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

export function AnalyticGeneratedArtifactDetailPage() {
  const navigate = useNavigate();
  const { caseId, artifactId } = useParams<{
    caseId: string;
    artifactId: string;
  }>();

  const { data: caseDetail } = useGetCaseDetail(caseId);
  const { data, isLoading, isError, refetch } = useEnsureCaseDocuments(caseId);

  const artifacts = data?.files ?? [];
  const selected: GeneratedDocumentFile | undefined =
    artifacts.find((a) => a.id === artifactId) ?? artifacts[0];

  const [uploadingFile, setUploadingFile] = useState<File | null>(null);

  const reviewMutation = useReviewDocument(selected?.id);
  const uploadMutation = useUploadDocx(selected?.id);

  const handleSelectFromSidebar = (id: string) => {
    if (!caseId) return;
    navigate(HK_ROUTES.private.ARTIFACTS.ANALYTIC.DETAILED_VALUE(caseId, id));
  };

  const handleAfterMutation = async () => {
    await refetch();
  };

  const handleReview = async (status: DocumentStatusVariation) => {
    if (!selected?.id) return;
    try {
      await reviewMutation.mutateAsync(status);
      toastSuccess(
        status === "approved_by_ba"
          ? "Документ принят"
          : status === "rejected_by_ba"
          ? "Документ отклонён"
          : "Статус документа обновлён"
      );
      await handleAfterMutation();
    } catch (e) {
      console.error(e);
      toastError("Не удалось обновить статус документа");
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setUploadingFile(file);
  };

  const handleUpload = async () => {
    if (!uploadingFile || !selected?.id) return;
    try {
      await uploadMutation.mutateAsync(uploadingFile);
      toastSuccess("Документ успешно обновлён");
      setUploadingFile(null);
      await handleAfterMutation();
    } catch (e) {
      console.error(e);
      toastError("Не удалось загрузить файл");
    }
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
                  ? HK_ROUTES.private.ARTIFACTS.ANALYTIC.GENERATED.replace(
                      ":caseId",
                      caseId
                    )
                  : HK_ROUTES.private.CASES.SHARED.BASE
              )
            }
            className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-[#A31551] hover:underline"
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
              HK_ROUTES.private.ARTIFACTS.ANALYTIC.GENERATED.replace(
                ":caseId",
                caseId || ""
              )
            )
          }
          className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#A31551] hover:underline"
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
          <p className="text-xs text-[#888085]">
            Редактирование и одобрение артефактов
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px,minmax(0,1fr),260px]">
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
                href={selected.docx_url || ""}
                download
                className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#A31551] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F1246]"
              >
                <span className="material-symbols-outlined mr-1 text-sm">
                  download
                </span>
                <span>Скачать DOCX</span>
              </a>

              <a
                href={selected.docx_url || ""}
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

          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleReview("rejected_by_ba")}
                disabled={reviewMutation.isPending}
                className="h-10 rounded-lg border border-rose-200 cursor-pointer bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                Не принимать
              </Button>

              <Button
                type="button"
                onClick={() => handleReview("approved_by_ba")}
                disabled={reviewMutation.isPending}
                className="h-10 rounded-lg bg-emerald-600 cursor-pointer text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Принять
              </Button>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="mb-1 text-sm font-semibold text-[#1B1B1F]">
                Заменить документ вручную
              </h3>
              <p className="mb-3 text-xs text-[#888085]">
                Загрузите свою версию файла (DOCX / PDF), чтобы заменить
                сгенерированный документ.
              </p>

              <div className="mb-2 text-[11px] text-[#888085]">
                Выберите файл{" "}
                <span className="font-semibold">
                  {uploadingFile ? uploadingFile.name : "Файл не выбран"}
                </span>
              </div>

              <label className="mt-1 flex w-full cursor-pointer flex-col gap-2 rounded-xl bg-[#C56A8A] px-4 py-2 text-center text-xs font-semibold text-white hover:bg-[#B2597C]">
                <span>Загрузить новый файл</span>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <Button
                type="button"
                onClick={handleUpload}
                disabled={!uploadingFile || uploadMutation.isPending}
                className="mt-3 h-9 w-full rounded-lg bg-[#A31551] text-xs font-semibold text-white hover:bg-[#8F1246] disabled:opacity-60"
              >
                {uploadMutation.isPending ? "Загрузка..." : "Сохранить файл"}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
