import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SignInForm } from "./sign-in-form";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl bg-white p-12 text-center shadow-card">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Вход</h1>
        <p className="text-sm text-slate-500">Используйте email и пароль, чтобы продолжить.</p>
      </div>
      <SignInForm />
      <p className="text-sm text-slate-500">
        Нет аккаунта?{" "}
        <Link href="/auth/sign-up" className="font-medium text-slate-900 hover:text-slate-700">
          Зарегистрируйтесь
        </Link>
      </p>
      <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
        Назад к ленте
      </Link>
    </div>
  );
}
