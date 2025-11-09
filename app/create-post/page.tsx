import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { createPost } from "@/app/actions/posts";
import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/(auth)/signin");
  }

  const subreddits = await prisma.subreddit.findMany({ orderBy: { title: "asc" } });
  const hasCommunities = subreddits.length > 0;

  return (
    <div className="flex flex-col gap-10">
      <Header />
      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <form
          action={createPost}
          className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-card"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">Новый пост</h1>
            <p className="text-sm text-slate-500">
              Делитесь открытиями, вдохновляйте других и поддерживайте любимые комьюнити.
            </p>
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Заголовок
            <input
              name="title"
              required
              minLength={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-400 focus:bg-white focus:outline-none"
              placeholder="Например: Лучшие приложения для продуктивности"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Текст
            <textarea
              name="content"
              required
              className="min-h-[200px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-400 focus:bg-white focus:outline-none"
              placeholder="Расскажите подробнее..."
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Ссылка на изображение (опционально)
            <input
              name="imageUrl"
              type="url"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-400 focus:bg-white focus:outline-none"
              placeholder="https://"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Сабреддит
            <select
              name="subreddit"
              required
              disabled={!hasCommunities}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-400 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={subreddits[0]?.name ?? ""}
            >
              {subreddits.map((subreddit) => (
                <option key={subreddit.id} value={subreddit.name}>
                  {subreddit.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={!hasCommunities}
            className="rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Опубликовать
          </button>
        </form>
        <aside className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-900">Создавайте сообщества</h2>
          <p className="text-sm text-slate-500">
            Пока что сабреддиты задаются вручную через Prisma. Добавьте новые записи в таблицу Subreddit, чтобы расширить
            ленту. Мы намеренно оставили интерфейс минималистичным.
          </p>
          {!hasCommunities ? (
            <p className="rounded-2xl bg-slate-100 p-4 text-xs text-slate-500">
              После создания первого сабреддита форма публикации будет доступна.
            </p>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
