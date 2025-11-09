import Link from "next/link";
import { getServerSession } from "next-auth";

import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    include: {
      subreddit: { select: { name: true, title: true } },
      author: { select: { name: true, image: true } },
      votes: { select: { value: true, userId: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const subreddits = await prisma.subreddit.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
    take: 10
  });

  return (
    <div className="flex flex-col gap-10">
      <Header />
      <section className="grid gap-6 lg:grid-cols-[3fr,1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-sm text-slate-500">
              Лента пока пуста. Создайте пост, чтобы начать обсуждение.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} sessionUserId={session?.user?.id} />
            ))
          )}
        </div>
        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Популярные сабреддиты</h2>
            <p className="text-sm text-slate-500">Вдохновение для следующего поста.</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {subreddits.length === 0 ? (
              <li className="text-sm text-slate-500">Добавьте сабреддиты через Prisma Studio.</li>
            ) : (
              subreddits.map((subreddit) => (
                <li key={subreddit.id} className="flex items-center justify-between">
                  <Link href={`/subreddit/${subreddit.name}`} className="font-medium text-slate-700 hover:text-slate-900">
                    {subreddit.title}
                  </Link>
                  <span className="text-xs uppercase tracking-wide text-slate-400">{subreddit._count.posts} постов</span>
                </li>
              ))
            )}
          </ul>
        </aside>
      </section>
    </div>
  );
}
