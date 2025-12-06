import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import { toastError, toastSuccess } from "@/components/shared/toasts";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname ?? "/cases";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setAnimateIn(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      toastSuccess("Вы успешно вошли в систему");
      navigate(from, { replace: true });
    } catch (e) {
      const message = "Неверный логин или пароль";
      setError(message);
      toastError("Не удалось войти");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F7F6F8]">
      {/* light gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff_0,_#f7f6f8_50%,_#f1edf6_100%)]" />
      {/* soft pink blobs */}
      <div className="pointer-events-none absolute -right-32 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#FF6A78]/25 via-[#9B053F]/10 to-[#820232]/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-[-40px] h-72 w-72 rounded-full bg-gradient-to-tr from-[#FF6A78]/18 via-[#9B053F]/8 to-[#820232]/4 blur-3xl" />

      {/* content above bg */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="z-20 flex items-center justify-center border-b border-[#E4E0EC]/60 bg-white/80 backdrop-blur">
          <div className="flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <img src="/Logo.svg" alt="Logo" className="w-8 h-8" />
              <div className="flex flex-col leading-tight">
                <h1 className="text-base font-bold tracking-[-0.03em] text-[#1B1B1F]">
                  Talap AI
                </h1>
                <span className="text-[11px] text-[#888085]">
                  AI-ассистент бизнес-аналитика
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#888085]">
              <span className="material-symbols-outlined text-base">
                shield
              </span>
              <span>Безопасный вход</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div
            className={[
              "relative w-full max-w-6xl rounded-3xl bg-white shadow-[0_18px_45px_rgba(0,0,0,0.10)] overflow-hidden",
              "px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12",
              "transition-all duration-500 ease-out transform-gpu",
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3",
            ].join(" ")}
          >
            {/* inner blobs on card (как в CasesEmptyState) */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-10" />
            <div className="pointer-events-none absolute -left-24 bottom-[-40px] h-52 w-52 rounded-full bg-gradient-to-tr from-[#FF6A78] via-[#9B053F] to-[#820232] opacity-5" />

            <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <section className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F1EFF4] px-3 py-1 text-[11px] font-medium text-[#A31551]">
                  <span className="material-symbols-outlined text-sm">
                    auto_awesome
                  </span>
                  <span>AI для бизнес-аналитиков</span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#1B1B1F] leading-snug">
                    Войдите, чтобы продолжить работу с кейсами
                  </h2>
                  <p className="text-sm text-[#888085] max-w-md leading-relaxed">
                    Talap AI помогает создавать BRD, user stories, BPMN и UML
                    быстрее, стандартизировать требования и упорядочивать
                    документацию в команде.
                  </p>
                </div>

                <ul className="space-y-2.5 text-sm text-[#55505A]">
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE6EE] text-[12px] text-[#A31551]">
                      <span className="material-symbols-outlined text-[14px]">
                        bolt
                      </span>
                    </span>
                    <span>
                      Автоматическая генерация ключевых артефактов по кейсу
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F0FF] text-[12px] text-[#1B4BB5]">
                      <span className="material-symbols-outlined text-[14px]">
                        schema
                      </span>
                    </span>
                    <span>
                      BPMN, UML-диаграммы и user stories в едином пространстве
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E9F7EF] text-[12px] text-[#1F7A3E]">
                      <span className="material-symbols-outlined text-[14px]">
                        verified
                      </span>
                    </span>
                    <span>Фокус на сути: меньше рутины, больше аналитики</span>
                  </li>
                </ul>
              </section>

              <section className="rounded-2xl bg-white/90 backdrop-blur px-5 py-6 sm:px-6 sm:py-7 border border-[#E4E0EC]/70 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <h3 className="text-xl font-semibold mb-1">Вход в систему</h3>
                <p className="text-xs text-[#888085] mb-6">
                  Введите email и пароль, чтобы перейти к вашим кейсам и
                  документам.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-[#312F35]"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A9B5]">
                        <span className="material-symbols-outlined text-[18px]">
                          mail
                        </span>
                      </span>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-input bg-white px-9 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-[#312F35]"
                      htmlFor="password"
                    >
                      Пароль
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A9B5]">
                        <span className="material-symbols-outlined text-[18px]">
                          lock
                        </span>
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-input bg-white px-9 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Скрыть пароль" : "Показать пароль"
                        }
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 h-11 w-full rounded-md cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
                  >
                    {submitting ? "Входим…" : "Войти"}
                  </Button>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#888085]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">
                        shield
                      </span>
                      <span>Ваши данные зашифрованы</span>
                    </div>
                    <span className="hidden sm:inline text-[11px] text-[#A31551]/80">
                      Забыли пароль? (скоро)
                    </span>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
