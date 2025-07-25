import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const grade1 = await prisma.grade.findUnique({
      where: { name: "1" },
      include: {
        materials: {
          include: {
            _count: {
              select: {
                exercises: true,
                courses: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!grade1) {
      return NextResponse.json({
        materials: [],
        message: "Grade 1 not found",
      });
    }

    return NextResponse.json({
      grade: grade1,
      materials: grade1.materials,
      total: grade1.materials.length,
    });
  } catch (error) {
    console.error("Materials API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
