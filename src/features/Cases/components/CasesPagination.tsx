import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCasesTableStore } from "../store/useCasesTableStore";

interface Props {
  totalItems: number;
  className?: string;
}

export function CasesPagination({ totalItems, className }: Props) {
  const page = useCasesTableStore((state) => state.page);
  const perPage = useCasesTableStore((state) => state.perPage);
  const setPage = useCasesTableStore((state) => state.setPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (totalItems <= perPage) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-between gap-3 text-xs text-[#888085]",
        className
      )}
    >
      <div>
        Показаны{" "}
        <span className="font-semibold">
          {from}–{to}
        </span>{" "}
        из {totalItems}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 rounded-md px-3"
          disabled={!canPrev}
          onClick={() => canPrev && setPage(page - 1)}
        >
          <span className="material-symbols-outlined text-sm">
            chevron_left
          </span>
        </Button>

        <span className="text-xs">
          Страница <span className="font-semibold">{page}</span> из {totalPages}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 rounded-md px-3"
          disabled={!canNext}
          onClick={() => canNext && setPage(page + 1)}
        >
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Button>
      </div>
    </div>
  );
}
