import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Format email tidak valid"),
  username: z
    .string()
    .regex(/^[a-zA-Z]+$/, "Username hanya boleh menggunakan huruf"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  school: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        school: validatedData.school,
        xp: 0,
        gold: 100, // Starting gold
      },
    });

    // Create initial garden for user
    await prisma.garden.create({
      data: {
        userId: user.id,
        pots: [
          { plantId: null, stage: 0, waterLevel: 0 },
          { plantId: null, stage: 0, waterLevel: 0 },
          { plantId: null, stage: 0, waterLevel: 0 },
          { plantId: null, stage: 0, waterLevel: 0 },
          { plantId: null, stage: 0, waterLevel: 0 },
        ],
      },
    });

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
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
