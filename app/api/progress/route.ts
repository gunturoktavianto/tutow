import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");
    const gradeId = searchParams.get("gradeId");

    if (materialId) {
      const progress = await prisma.courseProgress.findMany({
        where: {
          userId: session.user.id,
          materialId: materialId,
        },
        include: {
          course: true,
        },
      });

      return NextResponse.json({ progress });
    }

    if (gradeId) {
      const progress = await prisma.courseProgress.findMany({
        where: {
          userId: session.user.id,
          material: {
            gradeId: gradeId,
          },
        },
        include: {
          course: true,
          material: true,
        },
      });

      return NextResponse.json({ progress });
    }

    const allProgress = await prisma.courseProgress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true,
        material: {
          include: {
            grade: true,
          },
        },
      },
    });

    return NextResponse.json({ progress: allProgress });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
