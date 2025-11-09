import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { SignButton } from "@/components/sign-button";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-card backdrop-blur">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        Lightfeed
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
        <Link
          href={session?.user ? "/create-post" : "/auth/sign-in"}
          className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Создать пост
        </Link>
        <SignButton session={session} />
      </nav>
    </header>
  );
}
