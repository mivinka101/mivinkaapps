import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Введите корректные данные (email и пароль не короче 6 символов)." },
      { status: 400 }
    );
  }

  const { password, name } = result.data;
  const email = result.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "Пользователь с таким email уже существует." }, { status: 409 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return NextResponse.json({ message: "Пользователь создан." }, { status: 201 });
  } catch (error) {
    console.error("Failed to register user", error);
    return NextResponse.json({ error: "Не удалось создать пользователя." }, { status: 500 });
  }
}
