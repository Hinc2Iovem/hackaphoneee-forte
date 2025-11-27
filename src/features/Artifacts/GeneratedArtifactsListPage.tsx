import { useNavigate, useParams } from "react-router-dom";
import {
  MOCK_CASE,
  MOCK_GENERATED_ARTIFACTS,
  type ArtifactGenerationStatus,
} from "./mock-data";

function StatusBadge({ status }: { status: ArtifactGenerationStatus }) {
  const config: Record<
    ArtifactGenerationStatus,
    { label: string; className: string }
  > = {
    accepted: {
      label: "Принят",
      className: "bg-emerald-50 text-emerald-700",
    },
    rejected: {
      label: "Не принят",
      className: "bg-rose-50 text-rose-700",
    },
    pending: {
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

export function GeneratedArtifactsListPage() {
  const navigate = useNavigate();
  const { caseId } = useParams<{ caseId: string }>();

  const currentCase = MOCK_CASE;

  const handleOpen = (artifactId: string) => {
    const id = caseId ?? currentCase.id;
    navigate(`/cases/${id}/artifacts/${artifactId}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        <button
          type="button"
          onClick={() => navigate("/cases")}
          className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>К доске</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1B1B1F]">
            {currentCase.title}
          </h1>
          <p className="text-xs text-[#888085]">Список артефактов</p>
        </div>

        <div className="space-y-3 pt-4">
          {MOCK_GENERATED_ARTIFACTS.map((art) => (
            <button
              key={art.id}
              type="button"
              onClick={() => handleOpen(art.id)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 text-left text-sm md:text-base text-[#1B1B1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:bg-[#FDF7FA]"
            >
              <span>{art.title}</span>
              <StatusBadge status={art.status} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
