import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let userId = session?.user?.id;
    if (!userId && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with current grade
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        xp: true,
        gold: true,
        currentGrade: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get materials for current grade with progress
    const currentGrade = user.currentGrade || 1;
    const materials = await prisma.material.findMany({
      where: {
        gradeId: currentGrade.toString(),
      },
      include: {
        courses: {
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // Get all course progress for this user and current grade materials
    const materialIds = materials.map((m) => m.id);
    const allCourseProgress = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
        materialId: {
          in: materialIds,
        },
      },
    });

    // Calculate progress for each material
    const materialsWithProgress = materials.map((material) => {
      const totalCourses = material.courses.length;
      const materialProgress = allCourseProgress.filter(
        (progress) => progress.materialId === material.id && progress.completed
      );
      const completedCourses = materialProgress.length;

      const progress =
        totalCourses > 0
          ? Math.round((completedCourses / totalCourses) * 100)
          : 0;

      return {
        id: material.id,
        name: material.displayName || material.name,
        description: material.description,
        progress,
        totalLessons: totalCourses,
        completedLessons: completedCourses,
        color: getColorForMaterial(material.id),
      };
    });

    // Get user statistics
    const totalProgress = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
        completed: true,
      },
    });

    const totalLessonsCompleted = totalProgress.length;

    // Calculate streak (simplified - days with at least one completed course)
    const recentProgress = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
        completed: true,
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dailyCompletions = new Map();
    recentProgress.forEach((progress) => {
      if (progress.completedAt) {
        const day = new Date(progress.completedAt);
        day.setHours(23, 59, 59, 999);
        const dayKey = day.toDateString();
        dailyCompletions.set(dayKey, true);
      }
    });

    let checkDate = new Date(today);
    while (dailyCompletions.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Get recent badges (simplified - based on total lessons completed)
    const recentBadges = [];
    if (totalLessonsCompleted >= 50) {
      recentBadges.push({
        name: "Master Pembelajar",
        icon: "🏆",
        earnedAt: "Baru saja",
      });
    }
    if (totalLessonsCompleted >= 20) {
      recentBadges.push({
        name: "Rajin Belajar",
        icon: "⭐",
        earnedAt: "1 minggu lalu",
      });
    }
    if (totalLessonsCompleted >= 10) {
      recentBadges.push({
        name: "Pemula Gigih",
        icon: "🎯",
        earnedAt: "2 minggu lalu",
      });
    }

    // Calculate daily tasks
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayProgress = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
        completed: true,
        completedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const todayLessons = todayProgress.length;

    const dailyTasks = [
      {
        task: "Selesaikan 1 pelajaran",
        progress: Math.min(todayLessons, 1),
        target: 1,
        completed: todayLessons >= 1,
      },
      {
        task: "Kerjakan 3 latihan soal",
        progress: Math.min(todayLessons, 3),
        target: 3,
        completed: todayLessons >= 3,
      },
      {
        task: "Raih 50 XP hari ini",
        progress: Math.min(user.xp % 50, 50), // Simplified XP tracking
        target: 50,
        completed: user.xp % 50 >= 50,
      },
    ];

    return NextResponse.json({
      user: {
        name: user.name,
        xp: user.xp,
        gold: user.gold,
        currentGrade: user.currentGrade,
        streak,
        totalLessonsCompleted,
        totalExercisesCompleted: totalLessonsCompleted, // Same as lessons for now
      },
      materials: materialsWithProgress,
      recentBadges: recentBadges.slice(0, 3), // Latest 3 badges
      dailyTasks,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getColorForMaterial(materialId: string): string {
  const colors = ["blue", "green", "purple", "orange", "red", "cyan"];
  const hash = materialId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
}
