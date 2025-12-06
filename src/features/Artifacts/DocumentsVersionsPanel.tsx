import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { toastError, toastSuccess } from "@/components/shared/toasts";
import ArtifactsSpinner from "@/features/NewCase/components/ArtifactsLoading";
import { formatDateTime } from "@/lib/formatDateTime";
import { useDocumentVersions } from "../Cases/hooks/useDocumentVersions";
import { useUseDocumentVersion } from "../Cases/hooks/useMakeCurrentDocumentVersion";
import type { DocumentVersion } from "@/types/ArtifactTypes";

interface DocumentVersionsPanelProps {
  documentId: string;
}

function formatReason(reason: string | null): string {
  if (!reason) return "Генерация";
  if (reason === "generation") return "Генерация";
  if (reason === "llm_edit") return "Правка через AI";
  if (reason === "diagram_edit") return "Правка диаграммы";
  if (reason === "restore_version") return "Откат к версии";
  return reason;
}

export function DocumentVersionsPanel({
  documentId,
}: DocumentVersionsPanelProps) {
  const {
    data: versions,
    isLoading,
    isError,
  } = useDocumentVersions(documentId);
  const useVersionMutation = useUseDocumentVersion(documentId);
  const [pendingVersion, setPendingVersion] = useState<DocumentVersion | null>(
    null
  );

  const handleMakeCurrent = (version: DocumentVersion) => {
    setPendingVersion(version);
  };

  const confirmMakeCurrent = async () => {
    if (!pendingVersion) return;
    try {
      await useVersionMutation.mutateAsync({ versionId: pendingVersion.id });
      toastSuccess(`Версия v${pendingVersion.version} сделана текущей`);
    } catch (e) {
      console.error(e);
      toastError("Не удалось применить версию. Попробуйте ещё раз.");
    } finally {
      setPendingVersion(null);
    }
  };

  return (
    <Card className="border-none shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base md:text-lg">История версий</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <ArtifactsSpinner title="Загрузка версий…" />
          </div>
        )}

        {isError && !isLoading && (
          <p className="text-sm text-red-500">
            Не удалось загрузить историю версий.
          </p>
        )}

        {!isLoading && !isError && (!versions || versions.length === 0) && (
          <p className="text-sm text-gray-500">
            Для этого документа ещё нет версий.
          </p>
        )}

        {!isLoading && !isError && versions && versions.length > 0 && (
          <ul className="space-y-2">
            {versions.map((v, index) => {
              const isLatest = index === 0;
              return (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded-lg border border-[#ECE8F0] bg-[#FBFAFC] px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        v{v.version}
                      </span>
                      {isLatest && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          Текущая
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#6E6A71]">
                      {formatDateTime(v.created_at)}
                    </span>
                    <span className="text-xs text-[#A39DA7]">
                      Причина: {formatReason(v.reason)}
                    </span>
                    <span className="text-xs text-[#3B3640] line-clamp-1">
                      {v.title}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLatest || useVersionMutation.isPending}
                    onClick={() => handleMakeCurrent(v)}
                  >
                    Сделать текущей
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      <AlertDialog
        open={!!pendingVersion}
        onOpenChange={(open) => {
          if (!open) setPendingVersion(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Откат к версии v{pendingVersion?.version}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Текущий документ будет полностью заменён содержимым выбранной
              версии. DOCX/диаграмма будут перегенерированы. Продолжить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMakeCurrent}>
              Да, сделать текущей
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
