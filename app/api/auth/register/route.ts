import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Format email tidak valid"),
  username: z
    .string()
    .regex(/^[a-zA-Z]+$/, "Username hanya boleh menggunakan huruf"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  school: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        );
      }
      if (existingUser.username === validatedData.username) {
        return NextResponse.json(
          { error: "Username sudah digunakan" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        school: validatedData.school || null,
        xp: 0,
        gold: 100,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        school: true,
        xp: true,
        gold: true,
        createdAt: true,
      },
    });

    await prisma.garden.create({
      data: {
        userId: user.id,
        pots: [
          { id: 1, plant: null, waterLevel: 0, lastWatered: null },
          { id: 2, plant: null, waterLevel: 0, lastWatered: null },
          { id: 3, plant: null, waterLevel: 0, lastWatered: null },
          { id: 4, plant: null, waterLevel: 0, lastWatered: null },
          { id: 5, plant: null, waterLevel: 0, lastWatered: null },
        ],
      },
    });

    return NextResponse.json({
      message: "Akun berhasil dibuat",
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
