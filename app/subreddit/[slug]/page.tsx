import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import { CommentThread } from "@/components/comment-thread";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type FlatComment = {
  id: string;
  content: string;
  createdAt: Date;
  author: { name: string | null; image: string | null };
  parentId: string | null;
};

type CommentNode = FlatComment & { replies: CommentNode[] };

function buildCommentTree(comments: FlatComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  comments.forEach((comment) => {
    const node = map.get(comment.id);
    if (!node) return;
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export default async function SubredditPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const subreddit = await prisma.subreddit.findUnique({
    where: { name: params.slug },
    include: {
      posts: {
        include: {
          author: { select: { name: true, image: true } },
          votes: { select: { value: true, userId: true } },
          comments: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { name: true, image: true } }
            }
          },
          subreddit: { select: { name: true, title: true } },
          _count: { select: { comments: true } }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!subreddit) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10">
      <Header />
      <section className="flex flex-col gap-8">
        <header className="space-y-3 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white shadow-card">
          <span className="text-xs uppercase tracking-[0.3em] text-white/60">Сабреддит</span>
          <h1 className="text-4xl font-semibold">{subreddit.title}</h1>
          {subreddit.description ? <p className="max-w-2xl text-sm text-white/80">{subreddit.description}</p> : null}
        </header>
        <div className="space-y-12">
          {subreddit.posts.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Здесь пока пусто. Опубликуйте первый пост!</p>
          ) : (
            subreddit.posts.map((post) => {
              const tree = buildCommentTree(
                post.comments.map((comment) => ({
                  id: comment.id,
                  content: comment.content,
                  createdAt: comment.createdAt,
                  parentId: comment.parentId,
                  author: comment.author
                }))
              );

              return (
                <div key={post.id} id={post.id} className="space-y-6">
                  <PostCard post={post} sessionUserId={session?.user?.id} />
                  <CommentThread postId={post.id} comments={tree} canInteract={Boolean(session?.user)} />
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
