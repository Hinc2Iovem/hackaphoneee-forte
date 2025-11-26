import { cn } from "@/lib/utils";
import type { CaseStatusVariation } from "@/types/CaseTypes";

const mapStatus: Record<
  CaseStatusVariation,
  { label: string; bg: string; dot: string }
> = {
  draft: {
    label: "Новый",
    bg: "bg-status-new-soft text-status-new",
    dot: "bg-status-new",
  },
  in_progress: {
    label: "В работе",
    bg: "bg-status-in-progress-soft text-status-in-progress",
    dot: "bg-status-in-progress",
  },
  ready_for_documents: {
    label: "Ждёт ВА",
    bg: "bg-status-waiting-ba-soft text-status-waiting-ba",
    dot: "bg-status-waiting-ba",
  },
  documents_generated: {
    label: "Опубликован",
    bg: "bg-status-published-soft text-status-published",
    dot: "bg-status-published",
  },
};

export function StatusPill({ status }: { status: CaseStatusVariation }) {
  const cfg = mapStatus[status];

  return (
    <div
      className={cn(
        "inline-flex items-center text-[12px] font-semibold px-[17px] py-[13px] rounded-md",
        cfg.bg
      )}
    >
      <span className={cn("w-2 h-2 mr-2 rounded-full", cfg.dot)} />
      {cfg.label}
    </div>
  );
}
