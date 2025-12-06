import { useState } from "react";

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
import { useNavigate, useParams } from "react-router-dom";
import useReviewDocument from "../Cases/hooks/useReviewDocument";
import useUploadDocx from "../Cases/hooks/useUploadDocx";
import useLlmEditDocument from "../Cases/hooks/useLlmEditDocument";
import { useQueryClient } from "@tanstack/react-query";
import { casesQK } from "@/features/Cases/hooks/casesQueryKeys";
import { DocumentVersionsPanel } from "./DocumentsVersionsPanel";

type GeneratedDocumentFile = EnsureDocumentsResponse["files"][number];

export const CAN_LLM_EDIT_TYPES = new Set<string>([
  "vision",
  "scope",
  "bpmn",
  "context_diagram",
  "uml_use_case_diagram",
  "sequence_diagram",
  "erd",
  "state_diagram",
]);

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

function normalizeUrl(url?: string | null) {
  if (!url) return "";
  return url.split("?")[0].split("#")[0].toLowerCase();
}

function isImageUrl(url?: string | null) {
  const clean = normalizeUrl(url);

  return /\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?|heic|ico)$/i.test(clean);
}

function isDocFileUrl(url?: string | null) {
  const clean = normalizeUrl(url);
  return /\.(docx?|pdf)$/i.test(clean);
}

export function AnalyticGeneratedArtifactDetailPage() {
  const navigate = useNavigate();
  const { caseId, artifactId } = useParams<{
    caseId: string;
    artifactId: string;
  }>();
  const queryClient = useQueryClient();

  const { data: caseDetail, refetch: caseDetailsRefetch } =
    useGetCaseDetail(caseId);
  const { data, isLoading, isError, refetch } = useEnsureCaseDocuments(caseId);

  const artifacts = data?.files ?? [];
  const selected: GeneratedDocumentFile | undefined =
    artifacts.find((a) => a.id === artifactId) ?? artifacts[0];

  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");

  const reviewMutation = useReviewDocument(selected?.id);
  const uploadMutation = useUploadDocx(selected?.id);
  const llmEditMutation = useLlmEditDocument();

  const handleSelectFromSidebar = (id: string) => {
    if (!caseId) return;
    navigate(HK_ROUTES.private.ARTIFACTS.ANALYTIC.DETAILED_VALUE(caseId, id));
  };

  const handleAfterMutation = async () => {
    await Promise.all([refetch(), caseDetailsRefetch()]);
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
      queryClient.invalidateQueries({ queryKey: casesQK.all });
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

  const handleLlmEdit = async () => {
    if (!selected?.id || !instructions.trim()) return;

    try {
      await llmEditMutation.mutateAsync({
        documentId: selected.id,
        instructions: instructions.trim(),
      });
      toastSuccess("Документ обновлён с помощью AI");
      setInstructions("");
      await handleAfterMutation();
    } catch (e) {
      console.error(e);
      toastError("Не удалось отредактировать документ");
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!llmEditMutation.isPending && instructions.trim()) {
        void handleLlmEdit();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-10 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
            <ArtifactsSpinner title="Генерация артефактов…" />
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

  const hasDiagramField = !!selected.diagram_url;
  const docxIsImage = isImageUrl(selected.docx_url);
  const docxIsDocFile = isDocFileUrl(selected.docx_url);

  const hasImage = hasDiagramField || docxIsImage;
  const imageUrl =
    selected.diagram_url || (docxIsImage ? selected.docx_url! : undefined);

  const hasDocFile = !!selected.docx_url && docxIsDocFile;

  const canLlmEdit =
    !!selected.doc_type && CAN_LLM_EDIT_TYPES.has(selected.doc_type);
  const isBusy = llmEditMutation.isPending;

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

          <section className="relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:p-6">
            {isBusy && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="w-full max-w-xs">
                  <ArtifactsSpinner title="Генерация артефактов…" />
                </div>
              </div>
            )}

            <header className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base md:text-lg font-semibold text-[#1B1B1F]">
                  {selected.title}
                </h2>
                <StatusPill status={selected.status ?? "draft"} />
              </div>
            </header>

            {hasImage && !hasDocFile && imageUrl ? (
              <div className="flex flex-1 items-center justify-center rounded-xl border border-[#E3E1E8] bg-[#F7F6F8] px-4 py-6">
                <img
                  src={imageUrl}
                  alt={selected.title}
                  className="max-h-[520px] w-full rounded-lg bg-white object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#E3E1E8] bg-[#F7F6F8] px-4 py-6 text-center">
                <p className="text-sm text-[#55505A]">
                  Предпросмотр файла в браузере недоступен.
                </p>
                <p className="mt-1 text-xs text-[#888085]">
                  Скачайте файл, чтобы открыть его в Word, Google Docs,
                  PDF-читалке или другом редакторе.
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {hasDocFile && selected.docx_url && (
                <>
                  <a
                    href={selected.docx_url}
                    download
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#A31551] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F1246]"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">
                      download
                    </span>
                    <span>Скачать файл</span>
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
                </>
              )}

              {hasImage && imageUrl && (
                <>
                  <a
                    href={imageUrl}
                    download
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#A31551] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8F1246]"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">
                      download
                    </span>
                    <span>Скачать диаграмму</span>
                  </a>

                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#E3E1E8] bg-white px-3 py-2 text-xs font-medium text-[#55505A] hover:bg-[#F7F6F8]"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">
                      open_in_new
                    </span>
                    <span>Открыть диаграмму</span>
                  </a>
                </>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleReview("rejected_by_ba")}
                disabled={reviewMutation.isPending}
                className="h-10 cursor-pointer rounded-lg border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
              >
                Не принимать
              </Button>

              <Button
                type="button"
                onClick={() => handleReview("approved_by_ba")}
                disabled={reviewMutation.isPending}
                className="h-10 cursor-pointer rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                Принять
              </Button>
            </div>

            <DocumentVersionsPanel documentId={selected.id} />

            <div className="rounded-2xl border border-[#E3E1E8] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <p className="mb-1 text-xs font-semibold text-[#1B1B1F]">
                Правки через AI
              </p>
              <p className="mb-2 text-[11px] text-[#888085]">
                Для текстовых артефактов{" "}
                <span className="font-mono text-[10px]">vision</span>,{" "}
                <span className="font-mono text-[10px]">scope</span> и диаграмм
                (например, BPMN, контекст, Use Case) можно запросить{" "}
                <span className="font-semibold">повторную генерацию</span> по
                инструкции.
              </p>

              {canLlmEdit ? (
                <>
                  <p className="mb-2 flex items-start gap-1 text-[11px] text-[#C05621]">
                    <span className="material-symbols-outlined text-[14px] leading-4">
                      warning
                    </span>
                    <span>
                      После применения правок содержимое текущего артефакта
                      будет перезаписано, но{" "}
                      <span className="font-semibold">
                        предыдущие версии сохраняются
                      </span>{" "}
                      и их можно выбрать в блоке{" "}
                      <span className="font-semibold">«История версий»</span>{" "}
                      выше.
                    </span>
                  </p>

                  <textarea
                    className="mb-2 min-h-[200px] w-full rounded-md border border-[#E3E1E8] bg-white px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    rows={4}
                    placeholder='Например: "Перегенерируй диаграмму: добавь сущность Loyalty API и покажи интеграцию с CRM"'
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                  />

                  <Button
                    type="button"
                    onClick={handleLlmEdit}
                    disabled={!instructions.trim() || llmEditMutation.isPending}
                    className="h-9 w-full cursor-pointer rounded-lg text-xs font-semibold"
                  >
                    {llmEditMutation.isPending
                      ? "Перегенерируем артефакт…"
                      : "Отправить инструкцию AI"}
                  </Button>
                </>
              ) : (
                <p className="mt-1 text-[11px] text-[#B0A8B4]">
                  Для этого типа артефакта AI-перегенерация пока недоступна.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className="mb-1 text-sm font-semibold text-[#1B1B1F]">
                Заменить артефакт вручную
              </h3>
              <p className="mb-3 text-xs text-[#888085]">
                Загрузите свою версию файла (DOCX / PDF / PNG / JPG), чтобы
                заменить сгенерированный документ или диаграмму.
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
                  accept=".doc,.docx,.pdf,.png,.jpg,.jpeg,.gif,.webp"
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
