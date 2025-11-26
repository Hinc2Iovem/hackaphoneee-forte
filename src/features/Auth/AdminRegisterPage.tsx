import { useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosAuth } from "@/api/axios";

type RegisterPayload = {
  email: string;
  fullName: string;
  password: string;
};

export function AdminRegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    email: "",
    fullName: "",
    password: "",
  });
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setSuccess(null);

    if (!passwordsMatch) {
      setError("Пароли не совпадают");
      return;
    }

    setSubmitting(true);
    try {
      await axiosAuth.post("/admin/register", form);
      setSuccess("Пользователь успешно создан");
      setForm({ email: "", fullName: "", password: "" });
      setConfirm("");
    } catch {
      setError("Не удалось создать пользователя");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-xl bg-card shadow-[0_4px_4px_rgba(0,0,0,0.1)] p-8">
      <h2 className="text-2xl font-semibold mb-1">
        Регистрация нового пользователя
      </h2>
      <p className="text-sm text-[#888085] mb-6">
        Доступно только администраторам с ролью AUTHORITY.
      </p>

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
          <label className="block text-sm font-medium">Пароль</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Повторите пароль</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-600">{success}</p>}

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
