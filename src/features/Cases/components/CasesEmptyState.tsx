import { Skeleton } from "@/components/shared/skeleton";
import { Button } from "@/components/ui/button";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useAuth } from "@/features/Auth/providers/AuthProvider";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "CLIENT" | "AUTHORITY" | "ANALYTIC" | string;

export default function CasesEmptyState() {
  const { user } = useAuth();
  const role = (user?.role ?? "") as Role;

  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowSkeleton(false);
      requestAnimationFrame(() => setAnimateIn(true));
    }, 400);

    return () => clearTimeout(t);
  }, []);

  const canCreate = role === "CLIENT";

  const title = useMemo(() => {
    if (role === "ANALYTIC") return "Пока нет кейсов";
    if (role === "AUTHORITY") return "Пока нет кейсов";
    return "У вас пока нет запросов";
  }, [role]);

  const subtitle = useMemo(() => {
    if (role === "ANALYTIC")
      return "Когда появятся кейсы, вы увидите их здесь. Вы можете просматривать и анализировать, но не создавать.";
    if (role === "AUTHORITY")
      return "Когда появятся кейсы, вы увидите их здесь. Создание кейсов доступно клиентам.";
    return "Создайте запрос, опишите идею проекта — AI подготовит комплект артефактов.";
  }, [role]);

  const badgeText = useMemo(() => {
    if (role === "ANALYTIC") return "Режим аналитика";
    if (role === "AUTHORITY") return "Режим куратора";
    return "Начните с первого запроса";
  }, [role]);

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
    <div className="w-full bg-[#F7F6F8] pb-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 pt-10">
        {showSkeleton ? (
          <CasesEmptyStateSkeleton />
        ) : (
          <div
            className={[
              "transition-all duration-500 ease-out transform-gpu",
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            {/* ---------- MOBILE VIEW ---------- */}
            <div className="md:hidden space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative overflow-hidden">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-10" />

                <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EFF4] px-3 py-1 text-[11px] font-medium text-[#A31551] mb-4">
                  <span className="material-symbols-outlined text-sm">
                    rocket_launch
                  </span>
                  <span>{badgeText}</span>
                </div>

                <div className="flex items-start gap-3 mb-5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] text-white shadow">
                    <span className="material-symbols-outlined text-2xl">
                      inbox
                    </span>
                  </span>

                  <div>
                    <p className="text-lg font-semibold text-[#1B1B1F] leading-snug">
                      {title}
                    </p>
                    <p className="text-xs text-[#888085] mt-1">{subtitle}</p>
                  </div>
                </div>

                {canCreate ? (
                  <Button
                    className="w-full rounded-full h-10 text-sm"
                    onClick={handleCreateNew}
                  >
                    <span className="material-symbols-outlined text-xl mr-1">
                      add_circle
                    </span>
                    Новый запрос
                  </Button>
                ) : (
                  <div className="rounded-xl border border-[#F1EFF4] bg-[#FBFAFE] px-4 py-3 text-[12px] text-[#55505A]">
                    Создание кейсов недоступно для вашей роли.
                  </div>
                )}
              </div>

              {/* “How it works” block only for clients (optional) */}
              {canCreate ? (
                <HowItWorksMobile />
              ) : (
                <HintBlockMobile role={role} />
              )}
            </div>

            {/* ---------- DESKTOP VIEW ---------- */}
            <div className="hidden md:flex justify-center mt-6">
              <div className="relative flex w-full max-w-5xl flex-col gap-10 overflow-hidden rounded-3xl bg-white px-14 py-14 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-10" />
                <div className="pointer-events-none absolute -left-32 bottom-[-40px] h-56 w-56 rounded-full bg-gradient-to-tr from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-5" />

                <div className="grid grid-cols-[1.5fr_1fr] gap-16 items-center">
                  {/* Left column */}
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EFF4] px-4 py-1.5 text-[12px] font-medium text-[#A31551]">
                      <span className="material-symbols-outlined text-sm">
                        rocket_launch
                      </span>
                      <span>
                        {role === "CLIENT"
                          ? "Добро пожаловать в Talap AI"
                          : badgeText}
                      </span>
                    </div>

                    <div className="flex items-start gap-5">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                        <span className="material-symbols-outlined text-4xl">
                          inbox
                        </span>
                      </span>

                      <div className="space-y-3">
                        <p className="text-2xl font-semibold text-[#1B1B1F] leading-snug">
                          {title}
                        </p>
                        <p className="text-sm text-[#888085] max-w-md leading-relaxed">
                          {subtitle}
                        </p>
                      </div>
                    </div>

                    {canCreate ? (
                      <Button
                        className="rounded-full px-7 h-12 text-base"
                        onClick={handleCreateNew}
                      >
                        <span className="material-symbols-outlined text-xl mr-2">
                          add_circle
                        </span>
                        Создать новый запрос
                      </Button>
                    ) : (
                      <div className="max-w-md rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] px-5 py-4 text-sm text-[#55505A]">
                        <p className="font-semibold text-[#1B1B1F]">
                          Доступ только на просмотр
                        </p>
                        <p className="mt-1 text-[#888085]">
                          Вы сможете просматривать кейсы, когда они появятся.
                          Создание доступно только клиентам.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right column */}
                  {canCreate ? (
                    <HowItWorksDesktop />
                  ) : (
                    <RoleInfoDesktop role={role} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- small sub-components ---------------- */

function HowItWorksMobile() {
  return (
    <div className="rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] p-5 text-left text-[11px] text-[#55505A]">
      <p className="mb-4 font-semibold uppercase tracking-[0.16em] text-[#B0A9B5]">
        Как это работает
      </p>
      <ol className="space-y-4">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            1
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">Опишите идею</p>
            <p className="text-[11px] text-[#888085]">
              AI уточнит ключевые детали.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            2
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">
              Выберите артефакты
            </p>
            <p className="text-[11px] text-[#888085]">BRD, BPMN, UML и др.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            3
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">
              Получите документы
            </p>
            <p className="text-[11px] text-[#888085]">
              Пакет выгружается автоматически.
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}

function HintBlockMobile({ role }: { role: string }) {
  return (
    <div className="rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] p-5 text-left text-[12px] text-[#55505A]">
      <p className="font-semibold text-[#1B1B1F]">
        {role === "ANALYTIC"
          ? "Здесь появятся кейсы для анализа"
          : "Здесь появятся кейсы"}
      </p>
      <p className="mt-2 text-[#888085]">
        {role === "ANALYTIC"
          ? "Вы сможете открывать кейсы и смотреть прогресс, но создавать кейсы нельзя."
          : "Создание кейсов доступно клиентам."}
      </p>
    </div>
  );
}

function HowItWorksDesktop() {
  return (
    <div className="rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] px-6 py-6 text-xs text-[#55505A]">
      <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#B0A9B5]">
        Как это работает
      </p>
      <ol className="space-y-5">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            1
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">
              Опишите идею проекта
            </p>
            <p className="text-[11px] text-[#888085]">
              Ответьте на ключевые вопросы о продукте и клиенте.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            2
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">
              Выберите артефакты
            </p>
            <p className="text-[11px] text-[#888085]">
              BRD, BPMN, UML, user stories и другое.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFE6EE] text-[11px] font-semibold text-[#A31551]">
            3
          </span>
          <div>
            <p className="text-xs font-semibold text-[#1B1B1F]">
              Получите результаты
            </p>
            <p className="text-[11px] text-[#888085]">
              Пакет документов будет готов автоматически.
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}

function RoleInfoDesktop({ role }: { role: string }) {
  return (
    <div className="rounded-2xl border border-[#F1EFF4] bg-[#FBFAFE] px-6 py-6 text-sm text-[#55505A]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#B0A9B5]">
        Подсказка
      </p>
      <p className="mt-3 font-semibold text-[#1B1B1F]">
        {role === "ANALYTIC" ? "Роль: аналитик" : "Роль: куратор"}
      </p>
      <p className="mt-2 text-[#888085] leading-relaxed">
        {role === "ANALYTIC"
          ? "Вы увидите все кейсы, когда они появятся. Создание кейсов недоступно."
          : "Вы увидите все кейсы, когда они появятся. Создание кейсов доступно клиентам."}
      </p>
    </div>
  );
}

function CasesEmptyStateSkeleton() {
  return (
    <div className="mt-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-4 md:space-y-0 md:grid md:grid-cols-[1.5fr_1fr] md:gap-8">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.06)] space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
