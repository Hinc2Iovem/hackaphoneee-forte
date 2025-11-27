import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useNavigate } from "react-router-dom";

export default function CasesEmptyState() {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    try {
      sessionStorage.removeItem("hk_new_case_draft");
      sessionStorage.removeItem("hk_new_case_step1");
      sessionStorage.removeItem("hk_new_case_step2");
    } catch (e) {
      console.warn("[CaseListTable] failed to clear new case draft", e);
    }

    navigate(HK_ROUTES.private.CASES.CLIENT.NEW);
  };

  return (
    <div className="w-full bg-[#F7F6F8]">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 py-10 space-y-8">
        <div className="mt-4 flex justify-center">
          <div className="relative flex w-full max-w-5xl flex-col gap-8 overflow-hidden rounded-3xl bg-white px-6 py-9 md:px-14 md:py-12 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-10" />
            <div className="pointer-events-none absolute -left-20 bottom-[-24px] h-40 w-40 rounded-full bg-gradient-to-tr from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-5" />

            <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EFF4] px-3 py-1 text-[11px] font-medium text-[#A31551]">
                  <span className="material-symbols-outlined text-sm">
                    rocket_launch
                  </span>
                  <span>Начните с первого запроса</span>
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                    <span className="material-symbols-outlined text-3xl">
                      inbox
                    </span>
                  </span>
                  <div className="space-y-2">
                    <p className="text-xl md:text-2xl font-semibold text-[#1B1B1F] leading-snug">
                      У вас пока нет ни одного запроса
                    </p>
                    <p className="text-sm text-[#888085]">
                      Создайте кейс, опишите идею проекта — и AI-ассистент
                      подготовит для вас комплект документов и диаграмм.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    className="rounded-full px-6 h-11"
                    onClick={handleCreateNew}
                  >
                    <span className="material-symbols-outlined text-xl! mr-2">
                      add_circle
                    </span>
                    <span>Создать новый запрос</span>
                  </Button>
                </div>
              </div>

              <div className="relative rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] px-5 py-5 text-left text-xs text-[#55505A]">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B0A9B5]">
                  Как это работает
                </p>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
                      1
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1F]">
                        Опишите идею проекта
                      </p>
                      <p className="text-[11px] text-[#888085]">
                        Ответьте на несколько вопросов о продукте, клиентах и
                        бизнес-цели.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
                      2
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1F]">
                        Выберите артефакты
                      </p>
                      <p className="text-[11px] text-[#888085]">
                        BRD, user stories, BPMN, UML-диаграммы и другие
                        артефакты.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
                      3
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#1B1B1F]">
                        Уточните детали в чате
                      </p>
                      <p className="text-[11px] text-[#888085]">
                        AI задаёт уточняющие вопросы и подготавливает финальный
                        пакет документов.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
