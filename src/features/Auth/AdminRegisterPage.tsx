import { useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosAuth } from "@/api/axios";
import type { HKRolesTypes } from "@/consts/HK_ROLES";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastError, toastSuccess } from "@/components/shared/toasts";

type RegisterPayload = {
  email: string;
  fullName: string;
  password: string;
  role: HKRolesTypes;
};

export function AdminRegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    email: "",
    fullName: "",
    password: "",
    role: "CLIENT",
  });
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = form.password && form.password === confirm;

  function update<K extends keyof RegisterPayload>(
    key: K,
    value: RegisterPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      const message = "Пароли не совпадают";
      setError(message);

      toastError("Проверьте пароли", {
        description: message,
      });

      return;
    }

    setSubmitting(true);
    try {
      await axiosAuth.post("/admin/register", form);

      toastSuccess("Пользователь успешно создан");

      setForm({ email: "", fullName: "", password: "", role: "CLIENT" });
      setConfirm("");
    } catch {
      const message = "Не удалось создать пользователя";
      setError(message);

      toastError("Ошибка при создании пользователя");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-xl bg-card mx-auto shadow-[0_4px_4px_rgba(0,0,0,0.1)] p-8">
      <h2 className="text-2xl font-semibold mb-1">
        Регистрация нового пользователя
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Полное имя</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Роль пользователя</label>
          <Select
            value={form.role}
            onValueChange={(val) => update("role", val as HKRolesTypes)}
          >
            <SelectTrigger className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANALYTIC">Бизнес-аналитик</SelectItem>
              <SelectItem value="CLIENT">Клиент</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Пароль</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded-md border border-input bg-white px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <button
              type="button"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Повторите пароль</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-input bg-white px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <button
              type="button"
              aria-label={showConfirm ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-lg">
                {showConfirm ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={submitting || !passwordsMatch}
          className="mt-2 h-11 w-full rounded-md cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
        >
          {submitting ? "Создаем…" : "Создать пользователя"}
        </Button>
      </form>
    </div>
  );
}
