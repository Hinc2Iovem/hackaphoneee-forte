import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

export default function CasesEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em]">
            Моя доска
          </h1>
          <Button
            onClick={() => navigate(HK_ROUTES.private.CASES.NEW)}
            className="h-11 rounded-full px-5 md:px-6 shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
          >
            <span className="material-symbols-outlined text-xl! mr-2">
              add_circle
            </span>
            <span className="truncate">Создать новый запрос</span>
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex flex-col items-center justify-center gap-3 max-w-md w-full rounded-2xl bg-card px-8 py-10 text-center shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
            <span className="material-symbols-outlined text-4xl text-primary mb-1">
              inbox
            </span>
            <p className="text-lg font-semibold">
              У вас пока нет ни одного запроса
            </p>
            <p className="text-sm text-gray-500">
              Создайте первый запрос, чтобы AI-ассистент помог вам подготовить
              документы и диаграммы для бизнес-проекта.
            </p>
            <Button
              className="mt-2 rounded-full"
              onClick={() => navigate(HK_ROUTES.private.CASES.NEW)}
            >
              <span className="material-symbols-outlined text-xl! mr-2">
                add_circle
              </span>
              <span>Создать новый запрос</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
