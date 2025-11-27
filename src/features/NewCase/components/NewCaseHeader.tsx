import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

type NewCaseHeaderTypes = {
  stepTitle: string;
  completionWidth: "w-1/3" | "w-2/3" | "w-full";
};

export default function NewCaseHeader({
  stepTitle,
  completionWidth,
}: NewCaseHeaderTypes) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate(HK_ROUTES.private.CASES.SHARED.BASE)}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5F5A60] hover:text-[#A31551]"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        <span>К доске</span>
      </button>

      <div>
        <div className="mb-2 text-xl font-semibold text-[#A31551]">
          {stepTitle}
        </div>

        <div className="h-1.5 w-full rounded-full bg-[#F4B6CF] overflow-hidden">
          <div
            className={`
        h-full ${completionWidth}
        bg-[linear-gradient(270deg,#FF6A78_0%,#9B053F_69%,#820232_87%)]
      `}
          />
        </div>
      </div>
    </div>
  );
}
