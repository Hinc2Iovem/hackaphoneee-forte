import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MOCK_CASE,
  MOCK_GENERATED_ARTIFACTS,
  type ArtifactGenerationStatus,
  type GeneratedArtifact,
} from "./mock-data";

function StatusPill({ status }: { status: ArtifactGenerationStatus }) {
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

export function GeneratedArtifactDetailPage() {
  const navigate = useNavigate();
  const { caseId, artifactId } = useParams<{
    caseId: string;
    artifactId: string;
  }>();

  const currentCase = MOCK_CASE;
  const artifacts = MOCK_GENERATED_ARTIFACTS;

  const selected: GeneratedArtifact =
    artifacts.find((a) => a.id === artifactId) ?? artifacts[0];

  const handleSelectFromSidebar = (id: string) => {
    const cid = caseId ?? currentCase.id;
    navigate(`/cases/${cid}/artifacts/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        <button
          type="button"
          onClick={() =>
            navigate(`/cases/${caseId ?? currentCase.id}/artifacts`)
          }
          className="inline-flex items-center cursor-pointer gap-2 text-sm text-[#A31551] hover:underline"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          <span>К артифактам</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-[#1B1B1F]">
            {currentCase.title}
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
                    {art.title}
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
                <StatusPill status={selected.status} />
              </div>
            </header>

            <div className="flex-1 overflow-y-auto rounded-xl bg-[#F7F6F8] p-4 text-xs md:text-sm leading-relaxed text-[#1B1B1F] whitespace-pre-wrap">
              {selected.content}
            </div>

            <div className="mt-4">
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Опишите, что нужно изменить в документе…"
                  className="w-full resize-none rounded-xl border border-[#E3E1E8] bg-[#F7F6F8] px-3 py-2 pr-10 text-xs md:text-sm text-[#1B1B1F] placeholder:text-[#B0A9B5] focus-visible:border-[#A31551] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A31551]/30"
                />
                <button
                  type="button"
                  className="absolute bottom-1/2 translate-y-1/2 cursor-pointer right-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#A31551] text-white shadow hover:bg-[#8F1246]"
                >
                  <span className="material-symbols-outlined text-[20px]!">
                    send
                  </span>
                </button>
              </div>
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
