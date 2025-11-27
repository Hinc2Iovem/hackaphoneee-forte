import type { CaseDetailTypes } from "@/types/CaseTypes";
import { INITIAL_ANSWER_LABELS } from "../consts/CASE_INITIAL_QUESTIONS";

export default function BriefSidebar({
  caseDetail,
  caseId,
  onEditInitial,
}: {
  caseDetail: CaseDetailTypes | undefined;
  caseId?: string;
  onEditInitial: () => void;
}) {
  return (
    <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Резюме брифа</h2>
        {caseId && (
          <button
            type="button"
            onClick={onEditInitial}
            className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            <span>Редактировать</span>
          </button>
        )}
      </div>

      {caseDetail?.initial_answers ? (
        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 max-h-64 overflow-y-auto scrollbar-thin px-2">
          {Object.entries(caseDetail.initial_answers).map(([key, value]) => {
            const label = INITIAL_ANSWER_LABELS[key] ?? key;
            return (
              <li key={key} className="flex flex-col">
                <span className="font-semibold text-[12px] text-gray-700">
                  {label}:
                </span>
                <span
                  className="
                    text-[12px]
                    text-gray-600 dark:text-gray-300
                    whitespace-pre-wrap
                    break-words break-all
                  "
                >
                  {value}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-gray-500">
          Ответы на стартовые вопросы пока не заполнены.
        </p>
      )}
    </div>
  );
}
