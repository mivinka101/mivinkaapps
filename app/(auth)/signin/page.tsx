import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { SignButton } from "@/components/sign-button";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl bg-white p-16 text-center shadow-card">
      <h1 className="text-3xl font-semibold text-slate-900">Войдите, чтобы продолжить</h1>
      <p className="max-w-md text-sm text-slate-500">
        Lightfeed объединяет тематические сабреддиты в светлой карточной ленте. Чтобы публиковать посты, голосовать и
        комментировать, войдите через GitHub.
      </p>
      <SignButton session={session} />
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
        Назад к ленте
      </Link>
    </div>
  );
}
