import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { cn } from "@/lib/utils";
import type { CaseDetailTypes, CaseStatusVariation } from "@/types/CaseTypes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CasesPagination } from "./CasesPagination";
import { useCasesTableStore } from "../store/useCasesTableStore";

interface Props {
  cases: CaseDetailTypes[];
}

type StatusFilter = "all" | CaseStatusVariation;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "ready_for_documents", label: "Ждёт ВА" },
  { id: "documents_generated", label: "Опубликован" },
];

export function BACaseListTable({ cases }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const page = useCasesTableStore((state) => state.page);
  const perPage = useCasesTableStore((state) => state.perPage);
  const setPage = useCasesTableStore((state) => state.setPage);

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cases
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .filter((c) => {
        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;
        const matchesSearch = !q || c.title.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      });
  }, [cases, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, setPage]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / perPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, setPage]);

  const pagedCases = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredCases.slice(start, start + perPage);
  }, [filteredCases, page, perPage]);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.033em]">
            Моя доска
          </h1>
          <Button
            onClick={() => navigate(HK_ROUTES.private.CASES.NEW)}
            className="h-11 rounded-md cursor-pointer px-5 md:px-6 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
          >
            <span className="material-symbols-outlined text-xl! mr-2">
              add_circle
            </span>
            <span className="truncate text-[18px] cursor-pointer">
              Создать новый запрос
            </span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#888085]">
                search
              </span>
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border-0 bg-[#ECD9E3]/80 px-10 py-3 text-md text-[#888085] placeholder:text-[#888085] shadow-[0_4px_4px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ECD9E3]/80 px-4 py-3 text-md text-[#888085] shadow-[0_4px_4px_rgba(0,0,0,0.05)] hover:bg-[#ECD9E3] transition-colors"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Фильтр по статусу</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-md cursor-pointer text-md transition-all",
                statusFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-[0_4px_4px_rgba(0,0,0,0.15)]"
                  : "bg-[#ECD9E3] text-[#888085] hover:bg-[#e0cdd9]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_120px_120px] items-center px-6 py-2 text-xs font-medium text-[#888085]">
          <div>Название</div>
          <div>Статус</div>
          <div>Сотрудник</div>
          <div>Дата обновления</div>
          <div className="text-right">Confluence</div>
        </div>

        <div className="flex flex-col gap-3">
          {pagedCases.map((c) => {
            const date = new Date(c.updated_at).toLocaleDateString("ru-RU");
            const employee = c.requester_name ?? "—";
            const hasConfluenceLink = false;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  navigate(HK_ROUTES.private.CASES.FOLLOW_UP_VALUE(c.id))
                }
                className="w-full cursor-pointer text-left rounded-lg bg-card px-6 py-5 shadow-[0_4px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_120px_120px] gap-3 items-center">
                  <div className="text-sm md:text-base font-normal text-foreground">
                    {c.title}
                  </div>

                  <div>
                    <StatusPill status={c.status} />
                  </div>

                  <div className="text-xs md:text-sm text-gray-700">
                    {employee}
                  </div>

                  <div className="text-xs md:text-sm text-gray-500">{date}</div>

                  <div className="flex md:justify-end">
                    {hasConfluenceLink ? (
                      <a
                        href="#"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-full bg-[#F8F5FF] px-3 py-1 text-xs font-medium text-primary hover:bg-[#F0E8FF]"
                      >
                        Перейти
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {filteredCases.length === 0 && (
            <div className="mt-4 text-sm text-gray-500">
              По вашему запросу ничего не найдено.
            </div>
          )}
        </div>

        <CasesPagination totalItems={filteredCases.length} />
      </div>
    </div>
  );
}
