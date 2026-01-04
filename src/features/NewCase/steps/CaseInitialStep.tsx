import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { casesQK } from "@/features/Cases/hooks/casesQueryKeys";
import { useCreateCase } from "@/features/Cases/hooks/useCreateCase";
import { useQueryClient } from "@tanstack/react-query";
import NewCaseHeader from "../components/NewCaseHeader";
import { CASE_INITIAL_QUESTIONS } from "../consts/CASE_INITIAL_QUESTIONS";

export type CaseInitialAnswers = Record<string, string>;

interface Props {
  initialTitle?: string;
  initialAnswers?: CaseInitialAnswers;
  onSaveLocal?: (data: { title: string; answers: CaseInitialAnswers }) => void;
}

const SS_KEY = "hk_new_case_step1";

type Step1Draft = {
  title?: string;
  answers?: CaseInitialAnswers;
  confluence_space_key?: string | null;
  confluence_space_name?: string | null;
};

export function CaseInitialStep({
  initialTitle = "",
  initialAnswers,
  onSaveLocal,
}: Props) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialTitle);
  const [answers, setAnswers] = useState<CaseInitialAnswers>(
    initialAnswers ??
      Object.fromEntries(CASE_INITIAL_QUESTIONS.map((f) => [f.key, ""]))
  );
  // const [spacePopoverOpen, setSpacePopoverOpen] = useState(false);

  // const [selectedSpaceKey, setSelectedSpaceKey] = useState<string | null>(null);
  // const [selectedSpaceName, setSelectedSpaceName] = useState<string | null>(
  //   null
  // );

  // const { data: spaces, isLoading: isSpacesLoading } = useGetConfluenceSpaces();

  const { mutateAsync: createCase, isPending: isCreating } = useCreateCase();
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (initialAnswers || initialTitle) {
      setHydrated(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem(SS_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as Step1Draft;

      if (parsed.title) setTitle(parsed.title);
      if (parsed.answers) {
        setAnswers((prev) => ({ ...prev, ...parsed.answers }));
      }
      // if (parsed.confluence_space_key) {
      //   setSelectedSpaceKey(parsed.confluence_space_key);
      // }
      // if (parsed.confluence_space_name) {
      //   setSelectedSpaceName(parsed.confluence_space_name);
      // }
    } catch (e) {
      console.warn("[CaseInitialStep] failed to read sessionStorage", e);
    } finally {
      setHydrated(true);
    }
  }, [initialAnswers, initialTitle]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      const payload: Step1Draft = {
        title,
        answers,
        // confluence_space_key: selectedSpaceKey,
        // confluence_space_name: selectedSpaceName,
      };
      sessionStorage.setItem(SS_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("[CaseInitialStep] failed to write sessionStorage", e);
    }
  }, [hydrated, title, answers]);

  function updateField(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const allQuestionsFilled = CASE_INITIAL_QUESTIONS.every((f) =>
    (answers[f.key] ?? "").trim()
  );
  const canSubmit = !!title.trim() && allQuestionsFilled && !isCreating;

  async function handleNext() {
    if (!canSubmit) return;

    const trimmedTitle = title.trim();

    onSaveLocal?.({
      title: trimmedTitle,
      answers,
      // confluence_space_key: selectedSpaceKey ?? null,
      // confluence_space_name: selectedSpaceName ?? null,
    });

    const session = await createCase({
      title: trimmedTitle,
      // confluence_space_key: selectedSpaceKey ?? null,
      // confluence_space_name: selectedSpaceName ?? null,
    });

    queryClient.invalidateQueries({ queryKey: casesQK.all });
    sessionStorage.removeItem(SS_KEY);

    navigate(`/client/cases/new/${session.id}/artifacts`);
  }

  // function handleSpaceClick(space: ConfluenceSpace) {
  //   setSelectedSpaceKey(space.key);
  //   setSelectedSpaceName(space.name);
  // }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F6F8]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-32 space-y-8">
        <NewCaseHeader
          stepTitle="Шаг 1 из 3: Основная информация"
          completionWidth="w-1/3"
        />

        <div className="mt-12 space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1B1F]">
            Название бизнес - проекта
          </h1>
          <div className="rounded-xl bg-[#F1EFF4] px-4 py-3">
            <Input
              placeholder="Например: Запуск кредитной карты для молодёжи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 w-full border-0 bg-transparent px-0 text-sm md:text-base text-[#1B1B1F] placeholder:text-[#B0A9B5] focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 ">
          {CASE_INITIAL_QUESTIONS.map((field) => (
            <div
              key={field.key}
              className="flex h-80 flex-col rounded-2xl border border-[#F1EFF4] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-3 min-h-10 flex items-start">
                <p className="text-sm font-semibold text-[#1B1B1F] leading-snug">
                  {field.label}
                </p>
              </div>

              <Textarea
                placeholder="Введите ответ"
                value={answers[field.key] ?? ""}
                onChange={(e) => updateField(field.key, e.target.value)}
                className="flex-1 w-full scrollbar-thin resize-none rounded-xl border border-[#E3E1E8] bg-[#F7F6F8] p-3 text-sm text-[#1B1B1F] placeholder:text-[#B0A9B5] focus-visible:border-[#A31551] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A31551]/30"
              />
            </div>
          ))}
        </div>

        {/* <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#1B1B1F]">
              Выберите нужный space в Confluence
            </h2>
            {isSpacesLoading && (
              <span className="text-xs text-[#888085]">
                Загружаем пространства…
              </span>
            )}
          </div>

          <p className="text-xs text-[#888085]">
            Выберите пространство Confluence, в котором мы будем работать с
            артефактами и документами.
          </p>

          <div className="mt-3 max-w-lg">
            <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={spacePopoverOpen}
                  className="w-full justify-between h-10 rounded-xl border-[#E3E1E8] bg-white text-sm"
                  disabled={isSpacesLoading}
                >
                  {selectedSpaceName ? (
                    <span className="truncate text-left">
                      {selectedSpaceName}
                      {selectedSpaceKey && (
                        <span className="ml-2 text-[11px] font-mono text-[#888085]">
                          ({selectedSpaceKey})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[#B0A9B5]">
                      Выберите пространство Confluence…
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[320px] p-0">
                <Command>
                  <CommandInput placeholder="Поиск по названию или ключу…" />
                  <CommandEmpty>Ничего не найдено.</CommandEmpty>

                  <CommandGroup>
                    {(spaces ?? []).map((space) => (
                      <CommandItem
                        key={space.key}
                        value={`${space.name} ${space.key}`}
                        className="flex items-start gap-2 py-2"
                        onSelect={() => {
                          handleSpaceClick(space);
                          setSpacePopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mt-0.5 h-4 w-4",
                            space.key === selectedSpaceKey
                              ? "opacity-100 text-[#A31551]"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {space.name}
                          </span>
                          <span className="text-[11px] font-mono text-[#888085]">
                            {space.key}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedSpaceName && (
              <p className="mt-1 text-[11px] text-[#888085]">
                Вы выбрали:{" "}
                <span className="font-semibold">{selectedSpaceName}</span>
                {selectedSpaceKey && (
                  <>
                    {" "}
                    (<span className="font-mono">{selectedSpaceKey}</span>)
                  </>
                )}
              </p>
            )}
          </div>
        </div> */}
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-[#E3E1E8] bg-[#F7F6F8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(HK_ROUTES.private.CASES.SHARED.BASE)}
            className="h-11 rounded-lg border border-[#E3E1E8] bg-white px-6 text-sm font-medium text-[#1B1B1F] hover:bg-[#F1EFF4]"
          >
            Отменить
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!canSubmit}
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
