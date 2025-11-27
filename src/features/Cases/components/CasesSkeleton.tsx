import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

export default function CasesSkeleton() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">
            Моя доска
          </h1>
          <Button
            onClick={() => navigate(HK_ROUTES.private.CASES.CLIENT.NEW)}
            className="h-11 rounded-md px-5 md:px-6"
          >
            <span className="material-symbols-outlined text-xl! mr-2">
              add_circle
            </span>
            <span className="truncate">Создать новый запрос</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="h-11 rounded-xl bg-gray-200/70 animate-pulse" />
          </div>
          <div className="w-44 h-11 rounded-xl bg-gray-200/70 animate-pulse" />
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-gray-200/70 animate-pulse"
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card px-5 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_140px] gap-3 items-center">
                <div className="h-4 w-3/4 rounded-full bg-gray-200/80 animate-pulse" />
                <div className="h-6 w-28 rounded-full bg-gray-200/80 animate-pulse" />
                <div className="h-4 w-20 rounded-full bg-gray-200/80 animate-pulse md:ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
