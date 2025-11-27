import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (e) {
      setError("Неверный логин или пароль");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-card shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
        <h1 className="text-lg font-bold tracking-[-0.02em] text-primary">
          AI Бизнес – аналитик
        </h1>
        <div className="flex items-center gap-2 text-xs text-[#888085]">
          <span className="material-symbols-outlined text-base">shield</span>
          <span>Безопасный вход</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-card shadow-[0_4px_4px_rgba(0,0,0,0.1)] p-8">
          <h2 className="text-2xl font-semibold mb-1">Вход в систему</h2>
          <p className="text-sm text-[#888085] mb-6">
            Введите email и пароль, чтобы перейти к вашим запросам.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-white px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  placeholder="••••••••"
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

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-4 h-11 w-full rounded-md cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
            >
              {submitting ? "Входим…" : "Войти"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
