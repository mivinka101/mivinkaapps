"use client";

import { useOptimistic, useTransition } from "react";
import { HiOutlineArrowSmUp, HiOutlineArrowSmDown } from "react-icons/hi";

import { toggleVote } from "@/app/actions/posts";
import { cn } from "@/lib/utils";

export function VoteToggle({
  postId,
  initialVotes,
  userVote,
  disabled
}: {
  postId: string;
  initialVotes: number;
  userVote: number;
  disabled?: boolean;
}) {
  const [state, setState] = useOptimistic(
    { votes: initialVotes, vote: userVote },
    (current, next: { vote: 1 | -1 }) => {
      const isSame = current.vote === next.vote;
      const newVote = isSame ? 0 : next.vote;
      const delta = isSame ? -next.vote : next.vote - current.vote;
      return { votes: current.votes + delta, vote: newVote };
    }
  );
  const [isPending, startTransition] = useTransition();

  const handleVote = (value: 1 | -1) => {
    if (disabled) return;

    startTransition(async () => {
      setState({ vote: value });
      try {
        await toggleVote(postId, value);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1",
        disabled ? "bg-slate-50 opacity-60" : "bg-slate-100"
      )}
    >
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition",
          state.vote === 1 ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-white"
        )}
        disabled={isPending || disabled}
      >
        <HiOutlineArrowSmUp className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-slate-700">{state.votes}</span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition",
          state.vote === -1 ? "bg-rose-500 text-white" : "text-slate-500 hover:bg-white"
        )}
        disabled={isPending || disabled}
      >
        <HiOutlineArrowSmDown className="h-5 w-5" />
      </button>
    </div>
  );
}
