import Image from "next/image";
import Link from "next/link";

import { VoteToggle } from "@/components/vote-toggle";
import { Avatar } from "@/components/ui/avatar";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    subreddit: {
      name: string;
      title: string;
    };
    author: {
      name: string | null;
      image: string | null;
    };
    votes: {
      value: number;
      userId: string;
    }[];
    _count: {
      comments: number;
    };
  };
  sessionUserId?: string;
}

export function PostCard({ post, sessionUserId }: PostCardProps) {
  const totalVotes = post.votes.reduce((acc, vote) => acc + vote.value, 0);
  const userVote = post.votes.find((vote) => vote.userId === sessionUserId)?.value ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-1">
      {post.imageUrl ? (
        <div className="relative aspect-video w-full">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
          <Link href={`/subreddit/${post.subreddit.name}`} className="font-semibold text-slate-700">
            {post.subreddit.title}
          </Link>
          <time dateTime={post.createdAt.toISOString()}>
            {new Intl.DateTimeFormat("ru-RU", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(post.createdAt)}
          </time>
        </div>
        <Link href={`/subreddit/${post.subreddit.name}#${post.id}`} className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">{post.title}</h2>
          <p className="line-clamp-3 text-base text-slate-600">{post.content}</p>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <Avatar src={post.author.image} alt={post.author.name ?? "Пользователь"} />
            <span className="text-sm text-slate-600">{post.author.name ?? "Аноним"}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <VoteToggle
              postId={post.id}
              initialVotes={totalVotes}
              userVote={userVote}
              disabled={!sessionUserId}
            />
            <span>{post._count.comments} комментариев</span>
          </div>
        </div>
      </div>
    </article>
  );
}
