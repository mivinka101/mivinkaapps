import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Mivinka Lightfeed",
  description: "Минималистичный Reddit-клон на Next.js 14"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ru" className="bg-canvas">
      <body className={`${inter.className} bg-canvas text-slate-900 min-h-screen`}>
        <Providers session={session}>
          <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
