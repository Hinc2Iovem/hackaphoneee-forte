import { Button } from "@/components/ui/button";
import { useSaveInitialAnswers } from "@/features/Cases/hooks/useSaveInitialAnswers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCaseDetail } from "@/features/Cases/hooks/useGetCaseDetail";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { casesQK } from "@/features/Cases/hooks/casesQueryKeys";
import { useQueryClient } from "@tanstack/react-query";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CaseInitialAnswers } from "./CaseInitialStep";
import ArtifactsSpinner from "../components/ArtifactsLoading";
import {
  ARTIFACTS,
  AVAILABLE_ARTIFACT_CODES,
  type Artifact,
} from "../consts/CASE_INITIAL_QUESTIONS";
import NewCaseHeader from "../components/NewCaseHeader";

interface Props {
  answers: CaseInitialAnswers | undefined;
  onFinished?: () => void;
}

type Step2Draft = {
  answers?: CaseInitialAnswers;
  selected?: string[];
};

export function CaseThirdStep({ answers: answersProp, onFinished }: Props) {
  const queryClient = useQueryClient();
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { data: caseDetail } = useGetCaseDetail(caseId!, {
    enabled: !answersProp,
  });
  const { mutateAsync, isPending } = useSaveInitialAnswers(caseId!);

  const storageKey = caseId
    ? `hk_new_case_step2_${caseId}`
    : "hk_new_case_step2";

  const [effectiveAnswers, setEffectiveAnswers] =
    useState<CaseInitialAnswers | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      const draft: Step2Draft = raw ? JSON.parse(raw) : {};

      const answersFromServer =
        answersProp ?? caseDetail?.initial_answers ?? null;

      const answers = answersFromServer ?? draft.answers ?? null;
      const selectedFromDraft =
        draft.selected ?? caseDetail?.selected_document_types ?? [];

      if (answers) setEffectiveAnswers(answers);
      if (selectedFromDraft && selectedFromDraft.length > 0) {
        setSelected(selectedFromDraft);
      }
    } catch (e) {
      console.warn("[CaseThirdStep] failed to read sessionStorage", e);
    } finally {
      setHydrated(true);
    }
  }, [
    storageKey,
    answersProp,
    caseDetail?.initial_answers,
    caseDetail?.selected_document_types,
  ]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      const payload: Step2Draft = {
        answers: effectiveAnswers ?? undefined,
        selected,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn("[CaseThirdStep] failed to write sessionStorage", e);
    }
  }, [hydrated, effectiveAnswers, selected, storageKey]);

  function toggle(code: string) {
    if (!AVAILABLE_ARTIFACT_CODES.has(code as Artifact["code"])) return;

    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  async function handleFinish() {
    if (!effectiveAnswers) return;

    setIsGenerating(true);
    try {
      await mutateAsync({
        initial_answers: effectiveAnswers,
        selected_document_types: selected,
      });

      onFinished?.();
      queryClient.invalidateQueries({
        queryKey: casesQK.all,
      });
      navigate(HK_ROUTES.private.CASES.CLIENT.FOLLOW_UP_VALUE(caseId || ""));
    } finally {
      setIsGenerating(false);
    }
  }

  if (!effectiveAnswers) {
    return <div className="p-4 text-sm">Загружаем данные кейса…</div>;
  }

  if (isGenerating || isPending) {
    return <ArtifactsSpinner title="Генерация вопросов..." />;
  }

  const artifacts = ARTIFACTS;
  const documentArtifacts = artifacts.filter((a) => a.group !== "diagram");
  const diagramArtifacts = artifacts.filter((a) => a.group === "diagram");

  const renderArtifactCard = (a: Artifact) => {
    const isAvailable = AVAILABLE_ARTIFACT_CODES.has(a.code);
    const isActive = isAvailable && selected.includes(a.code);

    const handleClick = () => {
      if (!isAvailable) return;
      toggle(a.code);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (!isAvailable) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(a.code);
      }
    };
    return (
      <div
        key={a.code}
        role="button"
        tabIndex={0}
        aria-disabled={!isAvailable}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex h-[120px] flex-col justify-between rounded-2xl border px-4 py-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors
          ${
            isAvailable
              ? isActive
                ? "border-[#A31551] bg-[#FFE6EE] cursor-pointer"
                : "border-[#F1EFF4] bg-white hover:border-[#A31551]/50 cursor-pointer"
              : "border-[#E3E1E8] bg-[#F7F6F8] opacity-60 cursor-not-allowed"
          }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <div
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md ${
                isAvailable && isActive ? "bg-[#A31551]" : "bg-[#F1EFF4]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] leading-none ${
                  isAvailable && isActive ? "text-white" : "text-[#A31551]"
                }`}
              >
                {a.icon}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[#1B1B1F] leading-snug">
                {a.label}
              </p>
              {!isAvailable && (
                <span className="inline-flex w-fit rounded-full bg-[#E3E1E8] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#888085]">
                  Скоро
                </span>
              )}
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex size-5 items-center justify-center rounded-full border border-[#E3E1E8] bg-white text-[11px] text-[#888085]"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                ?
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="end"
              className="max-w-xs text-xs leading-snug text-[#1B1B1F] bg-white"
            >
              {a.description}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex justify-end">
          <div
            className={`flex size-6 items-center justify-center rounded-md border-2 ${
              isAvailable && isActive
                ? "border-[#A31551] bg-[#A31551] text-white"
                : "border-[#E3E1E8] bg-white"
            }`}
          >
            {isAvailable && isActive && (
              <span className="material-symbols-outlined text-[18px] leading-none">
                check
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32 space-y-10">
        <NewCaseHeader
          stepTitle="Шаг 2 из 3: Выбор артефактов"
          completionWidth="w-2/3"
        />

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1B1F]">
            Выберите артефакты для генерации
          </h1>
          <p className="text-sm text-[#888085]">
            Укажите, какие документы и диаграммы должен подготовить ИИ-ассистент
            на основе вашего запроса.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#1B1B1F]">Документы</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {documentArtifacts.map(renderArtifactCard)}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[#1B1B1F]">Диаграммы</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {diagramArtifacts.map(renderArtifactCard)}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-[#E3E1E8] bg-[#F7F6F8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-4">
          <Button
            type="button"
            onClick={handleFinish}
            disabled={!selected.length || isPending}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#A31551] px-8 text-sm font-semibold text-white hover:bg-[#8F1246] disabled:opacity-60"
          >
            <span>Далее</span>
            <span className="material-symbols-outlined text-xl">
              arrow_forward
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
