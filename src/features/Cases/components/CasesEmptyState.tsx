import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

export default function CasesEmptyState() {
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

      <div className="mt-6 px-4">
        <div
          className="flex flex-col items-center justify-center gap-3
                        rounded-xl border border-border-light dark:border-border-dark
                        bg-card-light dark:bg-card-dark px-6 py-10 text-center"
        >
          <span className="material-symbols-outlined text-4xl text-primary mb-1">
            inbox
          </span>
          <p className="text-lg font-semibold">
            У вас пока нет ни одного запроса
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            Создайте первый запрос, чтобы AI-ассистент помог вам подготовить
            документы и диаграммы для бизнес-проекта.
          </p>
          <Button
            className="mt-2"
            onClick={() => navigate(HK_ROUTES.private.CASES.NEW)}
          >
            <span className="material-symbols-outlined text-xl!">
              add_circle
            </span>
            <span>Создать новый запрос</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
