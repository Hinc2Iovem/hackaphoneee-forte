import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

export default function CasesSkeleton() {
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
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 items-center bg-card-light dark:bg-white/5
                       p-6 rounded-xl shadow-sm border border-border-light/60
                       dark:border-border-dark/60 animate-pulse"
          >
            <div className="col-span-12 md:col-span-6">
              <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="col-span-8 md:col-span-3">
              <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="col-span-4 md:col-span-3 flex justify-end">
              <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
