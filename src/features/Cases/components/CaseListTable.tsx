import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import type { CaseDetailTypes } from "@/types/CaseTypes";
import { useNavigate } from "react-router-dom";

interface Props {
  cases: CaseDetailTypes[];
}

export function CaseListTable({ cases }: Props) {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <div className="flex flex-wrap justify-between items-center gap-4 p-4">
        <h1 className="text-4xl font-black tracking-[-0.033em]">Мои запросы</h1>
        <Button onClick={() => navigate(HK_ROUTES.private.CASES.NEW)}>
          <span className="material-symbols-outlined text-xl!">add_circle</span>
          <span className="truncate">Создать новый запрос</span>
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4">
        {cases.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-12 gap-4 items-center bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
            onClick={() =>
              navigate(HK_ROUTES.private.CASES.FOLLOW_UP_VALUE(c.id))
            }
          >
            <div className="col-span-12 md:col-span-6 font-bold">{c.title}</div>
            <div className="col-span-8 md:col-span-3">
              <StatusPill status={c.status} />
            </div>
            <div className="col-span-4 md:col-span-3 text-right text-sm text-gray-500">
              {new Date(c.updated_at).toLocaleDateString("ru-RU")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
