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

    const { searchParams } = new URL(request.url);
    const gradeName = searchParams.get("grade");
    const materialName = searchParams.get("material");

    let whereClause: any = {
      userId: session.user.id,
    };

    if (gradeName) {
      const grade = await prisma.grade.findUnique({
        where: { name: gradeName },
      });
      if (grade) {
        whereClause.gradeId = grade.id;
      }
    }

    if (materialName && gradeName) {
      const grade = await prisma.grade.findUnique({
        where: { name: gradeName },
      });
      if (grade) {
        const material = await prisma.material.findFirst({
          where: {
            name: materialName,
            gradeId: grade.id,
          },
        });
        if (material) {
          whereClause.materialId = material.id;
        }
      }
    }

    const sessions = await prisma.exerciseSession.findMany({
      where: whereClause,
      orderBy: {
        completedAt: "desc",
      },
      include: {
        answers: true,
      },
    });

    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce(
      (sum, session) => sum + session.totalQuestions,
      0
    );
    const totalCorrect = sessions.reduce(
      (sum, session) => sum + session.correctAnswers,
      0
    );
    const totalTime = sessions.reduce(
      (sum, session) => sum + session.totalTime,
      0
    );
    const totalGoldEarned = sessions.reduce(
      (sum, session) => sum + session.goldEarned,
      0
    );

    const averageAccuracy =
      totalSessions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const averageTimePerQuestion =
      totalQuestions > 0 ? totalTime / totalQuestions : 0;

    let bestSession = null;
    if (sessions.length > 0) {
      bestSession = sessions.reduce((best, current) => {
        const currentAccuracy =
          (current.correctAnswers / current.totalQuestions) * 100;
        const bestAccuracy = (best.correctAnswers / best.totalQuestions) * 100;

        if (currentAccuracy > bestAccuracy) {
          return current;
        } else if (
          currentAccuracy === bestAccuracy &&
          current.totalTime < best.totalTime
        ) {
          return current;
        }
        return best;
      });
    }

    const materialStats = await prisma.exerciseSession.groupBy({
      by: ["materialId"],
      where: {
        userId: session.user.id,
        materialId: { not: null },
      },
      _sum: {
        correctAnswers: true,
        totalQuestions: true,
        goldEarned: true,
      },
      _count: {
        id: true,
      },
    });

    const materialStatsWithNames = await Promise.all(
      materialStats.map(async (stat) => {
        const material = await prisma.material.findUnique({
          where: { id: stat.materialId! },
          include: { grade: true },
        });

        return {
          materialId: stat.materialId,
          materialName: material?.name,
          materialDisplayName: material?.displayName,
          gradeName: material?.grade.name,
          gradeDisplayName: material?.grade.displayName,
          sessions: stat._count.id,
          totalQuestions: stat._sum.totalQuestions || 0,
          correctAnswers: stat._sum.correctAnswers || 0,
          goldEarned: stat._sum.goldEarned || 0,
          accuracy: stat._sum.totalQuestions
            ? ((stat._sum.correctAnswers || 0) /
                (stat._sum.totalQuestions || 1)) *
              100
            : 0,
        };
      })
    );

    const recentSessions = sessions.slice(0, 10).map((session) => ({
      id: session.id,
      completedAt: session.completedAt,
      totalQuestions: session.totalQuestions,
      correctAnswers: session.correctAnswers,
      accuracy: (session.correctAnswers / session.totalQuestions) * 100,
      timeSpent: session.totalTime,
      goldEarned: session.goldEarned,
    }));

    return NextResponse.json({
      overall: {
        totalSessions,
        totalQuestions,
        totalCorrect,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        averageTimePerQuestion: Math.round(averageTimePerQuestion * 100) / 100,
        totalGoldEarned,
      },
      bestSession: bestSession
        ? {
            id: bestSession.id,
            completedAt: bestSession.completedAt,
            correctAnswers: bestSession.correctAnswers,
            totalQuestions: bestSession.totalQuestions,
            accuracy: Math.round(
              (bestSession.correctAnswers / bestSession.totalQuestions) * 100
            ),
            timeSpent: bestSession.totalTime,
            goldEarned: bestSession.goldEarned,
          }
        : null,
      materialStats: materialStatsWithNames,
      recentSessions,
    });
  } catch (error) {
    console.error("Exercise progress API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
