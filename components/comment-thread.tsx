import Link from "next/link";

import { addComment } from "@/app/actions/posts";
import { Avatar } from "@/components/ui/avatar";

interface CommentNode {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
  replies: CommentNode[];
}

export function CommentThread({
  comments,
  postId,
  canInteract
}: {
  comments: CommentNode[];
  postId: string;
  canInteract: boolean;
}) {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">Комментарии</h3>
      {canInteract ? <CommentForm postId={postId} /> : <SignPrompt />}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">Будьте первым, кто оставит комментарий.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} depth={0} postId={postId} canInteract={canInteract} />
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  depth,
  postId,
  canInteract
}: {
  comment: CommentNode;
  depth: number;
  postId: string;
  canInteract: boolean;
}) {
  return (
    <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <Avatar src={comment.author.image} alt={comment.author.name ?? "Пользователь"} />
        <div>
          <p className="text-sm font-semibold text-slate-700">{comment.author.name ?? "Аноним"}</p>
          <time className="text-xs text-slate-400" dateTime={comment.createdAt.toISOString()}>
            {new Intl.DateTimeFormat("ru-RU", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(comment.createdAt)}
          </time>
        </div>
      </div>
      <p className="text-sm text-slate-700">{comment.content}</p>
      {depth < 2 && canInteract ? <ReplyForm parentId={comment.id} postId={postId} /> : null}
      {comment.replies.length > 0 ? (
        <div className="space-y-3 border-l border-slate-200 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              postId={postId}
              canInteract={canInteract}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CommentForm({ postId }: { postId: string }) {
  return (
    <form action={addComment} className="flex flex-col gap-3 rounded-2xl bg-slate-100 p-4">
      <input type="hidden" name="postId" value={postId} />
      <label className="text-sm font-medium text-slate-700" htmlFor={`comment-${postId}`}>
        Написать комментарий
      </label>
      <textarea
        id={`comment-${postId}`}
        name="content"
        required
        className="min-h-[120px] rounded-2xl border border-transparent bg-white p-4 text-sm shadow-inner focus:border-slate-300 focus:outline-none"
        placeholder="Поделитесь своими мыслями..."
      />
      <button type="submit" className="self-end rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">
        Отправить
      </button>
    </form>
  );
}

function ReplyForm({ postId, parentId }: { postId: string; parentId: string }) {
  return (
    <form action={addComment} className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-inner">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentId" value={parentId} />
      <textarea
        name="content"
        required
        className="min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-slate-300 focus:bg-white focus:outline-none"
        placeholder="Ответить..."
      />
      <button type="submit" className="self-end rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-slate-700">
        Ответить
      </button>
    </form>
  );
}

function SignPrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100 p-6 text-center">
      <p className="text-sm text-slate-600">
        Чтобы участвовать в обсуждениях, войдите в свой аккаунт.
      </p>
      <Link href="/auth/sign-in" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700">
        Войти
      </Link>
    </div>
  );
}
