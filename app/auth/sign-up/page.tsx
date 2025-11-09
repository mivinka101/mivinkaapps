import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SignUpForm } from "./sign-up-form";
import { authOptions } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl bg-white p-12 text-center shadow-card">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Регистрация</h1>
        <p className="text-sm text-slate-500">Создайте аккаунт, чтобы публиковать посты и комментировать.</p>
      </div>
      <SignUpForm />
      <p className="text-sm text-slate-500">
        Уже есть аккаунт?{" "}
        <Link href="/auth/sign-in" className="font-medium text-slate-900 hover:text-slate-700">
          Войдите
        </Link>
      </p>
      <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
        Назад к ленте
      </Link>
    </div>
  );
}
