"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export function SignButton({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
      >
        Выйти
      </button>
    );
  }

  return (
    <Link
      href="/auth/sign-in"
      className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
    >
      Войти
    </Link>
  );
}
