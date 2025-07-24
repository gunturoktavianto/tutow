import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  school: z.string().optional(),
  currentGrade: z.number().min(1).max(6).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        school: true,
        currentGrade: true,
        xp: true,
        gold: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get current user from database using email
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile (username is not editable)
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: validatedData.name,
        school: validatedData.school,
        currentGrade: validatedData.currentGrade,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        school: true,
        currentGrade: true,
        xp: true,
        gold: true,
      },
    });

    return NextResponse.json({
      message: "Profile berhasil diperbarui",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
