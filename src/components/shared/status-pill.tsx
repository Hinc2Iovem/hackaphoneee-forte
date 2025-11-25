import { cn } from "@/lib/utils";
import type { CaseStatusVariation } from "@/types/CaseTypes";

const mapStatus: Record<
  CaseStatusVariation,
  { label: string; color: string; dotColor: string }
> = {
  draft: {
    label: "Черновик",
    color: "bg-gray-200 text-gray-700",
    dotColor: "bg-gray-600",
  },
  in_progress: {
    label: "В работе",
    color: "bg-status-in-progress/10 text-status-in-progress",
    dotColor: "bg-status-in-progress",
  },
  ready_for_documents: {
    label: "Готов к генерации документов",
    color: "bg-status-waiting-ba/10 text-status-waiting-ba",
    dotColor: "bg-status-waiting-ba",
  },
  documents_generated: {
    label: "Опубликован",
    color: "bg-status-published/10 text-status-published",
    dotColor: "bg-status-published",
  },
};

export function StatusPill({ status }: { status: CaseStatusVariation }) {
  const cfg = mapStatus[status];
  return (
    <div
      className={cn(
        "inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full",
        cfg.color
      )}
    >
      <span className={cn("w-2 h-2 mr-2 rounded-full", cfg.dotColor)} />
      {cfg.label}
    </div>
  );
}
