"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const createPostSchema = z.object({
  title: z.string().min(3, "Заголовок слишком короткий"),
  content: z.string().min(1, "Добавьте текст"),
  subreddit: z.string().min(1, "Выберите сабреддит"),
  imageUrl: z.string().url().optional().or(z.literal(""))
});

const commentSchema = z.object({
  postId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
  content: z.string().min(1, "Комментарий не может быть пустым")
});

const voteSchema = z.object({
  postId: z.string().cuid(),
  value: z.union([z.literal(1), z.literal(-1)])
});

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Необходимо войти в систему");
  }

  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    subreddit: formData.get("subreddit"),
    imageUrl: formData.get("imageUrl") ?? undefined
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { title, content, subreddit, imageUrl } = parsed.data;

  const existingSubreddit = await prisma.subreddit.findUnique({ where: { name: subreddit } });
  if (!existingSubreddit) {
    throw new Error("Сабреддит не найден");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      imageUrl: imageUrl || null,
      subreddit: {
        connect: { id: existingSubreddit.id }
      },
      author: {
        connect: { id: session.user.id }
      }
    }
  });

  revalidatePath("/");
  revalidatePath(`/subreddit/${subreddit}`);
}

export async function addComment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Необходимо войти в систему");
  }

  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    parentId: formData.get("parentId") || undefined,
    content: formData.get("content")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const { postId, parentId, content } = parsed.data;

  await prisma.comment.create({
    data: {
      content,
      author: { connect: { id: session.user.id } },
      post: { connect: { id: postId } },
      parent: parentId ? { connect: { id: parentId } } : undefined
    }
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { subreddit: { select: { name: true } } }
  });

  revalidatePath("/");
  if (post?.subreddit.name) {
    revalidatePath(`/subreddit/${post.subreddit.name}`);
  }
}

export async function toggleVote(postId: string, value: 1 | -1) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Необходимо войти в систему");
  }

  const parsed = voteSchema.safeParse({ postId, value });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Некорректные данные");
  }

  const existing = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId
      }
    }
  });

  if (existing?.value === value) {
    await prisma.vote.delete({ where: { id: existing.id } });
  } else if (existing) {
    await prisma.vote.update({ where: { id: existing.id }, data: { value } });
  } else {
    await prisma.vote.create({
      data: {
        value,
        userId: session.user.id,
        postId
      }
    });
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { subreddit: { select: { name: true } } } });
  revalidatePath("/");
  if (post?.subreddit.name) {
    revalidatePath(`/subreddit/${post.subreddit.name}`);
  }
}
