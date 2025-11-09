"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      password: String(formData.get("password") ?? "")
    };

    if (!payload.email || !payload.password) {
      setStatus("error");
      setMessage("Укажите email и пароль.");
      return;
    }

    if (payload.password.length < 6) {
      setStatus("error");
      setMessage("Пароль должен содержать минимум 6 символов.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("idle");
      setMessage("");

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Аккаунт создан. Теперь можете войти.");
        event.currentTarget.reset();
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 800);
        return;
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(data?.error ?? "Не удалось создать аккаунт. Попробуйте снова.");
    } catch (error) {
      setStatus("error");
      setMessage("Не удалось создать аккаунт. Попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="text-left">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Имя (необязательно)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>
      <div className="text-left">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>
      <div className="text-left">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>
      {status === "success" ? (
        <p className="text-sm text-emerald-600">{message}</p>
      ) : status === "error" ? (
        <p className="text-sm text-rose-600">{message}</p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Создаём..." : "Создать аккаунт"}
      </button>
    </form>
  );
}
