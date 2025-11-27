import type { CaseDetailTypes } from "@/types/CaseTypes";
import { ARTIFACT_META } from "../consts/CASE_INITIAL_QUESTIONS";

export default function ArtifactsSidebar({
  caseDetail,
  dataSufficiencyPercent,
  onEditArtifacts,
}: {
  caseDetail: CaseDetailTypes | undefined;
  dataSufficiencyPercent: number;
  onEditArtifacts?: () => void;
}) {
  return (
    <>
      <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Выбранные артефакты</h2>

          {onEditArtifacts && (
            <button
              type="button"
              onClick={onEditArtifacts}
              className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80"
            >
              <span className="material-symbols-outlined text-[14px]">
                edit
              </span>
              <span>Изменить</span>
            </button>
          )}
        </div>

        {caseDetail?.selected_document_types?.length ? (
          <ul className="space-y-2 text-xs px-2">
            {caseDetail.selected_document_types.map((code) => {
              const meta = ARTIFACT_META[code as "vision"] ?? {
                icon: "description",
                label: code,
              };
              return (
                <li key={code} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {meta.icon}
                  </span>
                  <span>{meta.label}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">
            Артефакты ещё не выбраны (либо сохранение не прошло).
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-[#2c282f] rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Достаточность данных</h2>
          <span className="text-sm font-bold text-teal-500">
            {dataSufficiencyPercent}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${dataSufficiencyPercent}%`,
              background: "linear-gradient(90deg, #8A2BE2, #00CED1)",
            }}
          />
        </div>
      </div>
    </>
  );
}
