"use client";

import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export function SignButton({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
      >
        Выйти
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
    >
      Войти с GitHub
    </button>
  );
}
