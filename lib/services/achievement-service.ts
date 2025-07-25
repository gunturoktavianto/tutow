import { prisma } from "@/lib/prisma";

interface AchievementRequirement {
  type: string;
  count?: number;
  grade?: string;
  completionPercentage?: number;
  materialNames?: string[];
  accuracy?: number;
  questions?: number;
  maxTime?: number;
  days?: number;
  amount?: number;
}

export class AchievementService {
  static async checkAndAwardAchievements(userId: string) {
    const badges = await prisma.badge.findMany();
    const newBadges: string[] = [];

    for (const badge of badges) {
      const alreadyEarned = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });

      if (alreadyEarned) continue;

      const requirement = JSON.parse(
        badge.requirement as string
      ) as AchievementRequirement;
      const earned = await this.checkRequirement(userId, requirement);

      if (earned) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        newBadges.push(badge.displayName);
      }
    }

    return newBadges;
  }

  private static async checkRequirement(
    userId: string,
    requirement: AchievementRequirement
  ): Promise<boolean> {
    switch (requirement.type) {
      case "correct_answers":
        return this.checkCorrectAnswers(userId, requirement.count!);

      case "grade_completion":
        return this.checkGradeCompletion(
          userId,
          requirement.grade!,
          requirement.completionPercentage!
        );

      case "material_completion":
        return this.checkMaterialCompletion(userId, requirement.materialNames!);

      case "perfect_session":
        return this.checkPerfectSession(userId, requirement.accuracy!);

      case "speed_completion":
        return this.checkSpeedCompletion(
          userId,
          requirement.questions!,
          requirement.maxTime!
        );

      case "session_count":
        return this.checkSessionCount(userId, requirement.count!);

      case "gold_earned":
        return this.checkGoldEarned(userId, requirement.amount!);

      case "daily_streak":
        return this.checkDailyStreak(userId, requirement.days!);

      default:
        return false;
    }
  }

  private static async checkCorrectAnswers(
    userId: string,
    targetCount: number
  ): Promise<boolean> {
    const result = await prisma.exerciseSession.aggregate({
      where: { userId },
      _sum: {
        correctAnswers: true,
      },
    });

    return (result._sum.correctAnswers || 0) >= targetCount;
  }

  private static async checkGradeCompletion(
    userId: string,
    gradeName: string,
    targetPercentage: number
  ): Promise<boolean> {
    const grade = await prisma.grade.findUnique({
      where: { name: gradeName },
      include: {
        materials: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!grade) return false;

    const totalCourses = grade.materials.reduce(
      (sum, material) => sum + material.courses.length,
      0
    );

    if (totalCourses === 0) return false;

    const completedCourses = await prisma.courseProgress.count({
      where: {
        userId,
        completed: true,
        course: {
          material: {
            gradeId: grade.id,
          },
        },
      },
    });

    const completionPercentage = (completedCourses / totalCourses) * 100;
    return completionPercentage >= targetPercentage;
  }

  private static async checkMaterialCompletion(
    userId: string,
    materialNames: string[]
  ): Promise<boolean> {
    for (const materialName of materialNames) {
      const material = await prisma.material.findFirst({
        where: { name: materialName },
        include: { courses: true },
      });

      if (!material) continue;

      const totalCourses = material.courses.length;
      if (totalCourses === 0) continue;

      const completedCourses = await prisma.courseProgress.count({
        where: {
          userId,
          materialId: material.id,
          completed: true,
        },
      });

      if (completedCourses === totalCourses) {
        return true;
      }
    }

    return false;
  }

  private static async checkPerfectSession(
    userId: string,
    targetAccuracy: number
  ): Promise<boolean> {
    const perfectSession = await prisma.exerciseSession.findFirst({
      where: {
        userId,
        AND: [
          { totalQuestions: { gt: 0 } },
          {
            OR: [
              {
                correctAnswers: {
                  equals: prisma.exerciseSession.fields.totalQuestions,
                },
              },
            ],
          },
        ],
      },
    });

    if (!perfectSession) return false;

    const accuracy =
      (perfectSession.correctAnswers / perfectSession.totalQuestions) * 100;
    return accuracy >= targetAccuracy;
  }

  private static async checkSpeedCompletion(
    userId: string,
    targetQuestions: number,
    maxTime: number
  ): Promise<boolean> {
    const speedSession = await prisma.exerciseSession.findFirst({
      where: {
        userId,
        totalQuestions: { gte: targetQuestions },
        totalTime: { lte: maxTime },
      },
    });

    return !!speedSession;
  }

  private static async checkSessionCount(
    userId: string,
    targetCount: number
  ): Promise<boolean> {
    const sessionCount = await prisma.exerciseSession.count({
      where: { userId },
    });

    return sessionCount >= targetCount;
  }

  private static async checkGoldEarned(
    userId: string,
    targetAmount: number
  ): Promise<boolean> {
    const result = await prisma.exerciseSession.aggregate({
      where: { userId },
      _sum: {
        goldEarned: true,
      },
    });

    return (result._sum.goldEarned || 0) >= targetAmount;
  }

  private static async checkDailyStreak(
    userId: string,
    targetDays: number
  ): Promise<boolean> {
    const recentSessions = await prisma.exerciseSession.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: targetDays,
    });

    if (recentSessions.length < targetDays) return false;

    const uniqueDays = new Set();
    for (const session of recentSessions) {
      const day = session.completedAt.toDateString();
      uniqueDays.add(day);
    }

    if (uniqueDays.size < targetDays) return false;

    const sortedDays = Array.from(uniqueDays).sort();
    let consecutiveDays = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prevDate = new Date(sortedDays[i - 1] as string);
      const currDate = new Date(sortedDays[i] as string);
      const dayDiff =
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1) {
        consecutiveDays++;
      } else {
        consecutiveDays = 1;
      }
    }

    return consecutiveDays >= targetDays;
  }

  static async getUserBadges(userId: string) {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });

    return userBadges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      displayName: ub.badge.displayName,
      description: ub.badge.description,
      category: ub.badge.category,
      imageUrl: ub.badge.imageUrl,
      earnedAt: ub.earnedAt,
    }));
  }

  static async getBadgeProgress(userId: string) {
    const badges = await prisma.badge.findMany({
      orderBy: { category: "asc" },
    });

    const progress = [];

    for (const badge of badges) {
      const earned = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: badge.id,
          },
        },
      });

      const requirement = JSON.parse(
        badge.requirement as string
      ) as AchievementRequirement;
      const currentProgress = await this.getCurrentProgress(
        userId,
        requirement
      );

      progress.push({
        id: badge.id,
        name: badge.name,
        displayName: badge.displayName,
        description: badge.description,
        category: badge.category,
        imageUrl: badge.imageUrl,
        earned: !!earned,
        earnedAt: earned?.earnedAt,
        currentProgress,
        requirement,
      });
    }

    return progress;
  }

  private static async getCurrentProgress(
    userId: string,
    requirement: AchievementRequirement
  ): Promise<number> {
    switch (requirement.type) {
      case "correct_answers": {
        const result = await prisma.exerciseSession.aggregate({
          where: { userId },
          _sum: { correctAnswers: true },
        });
        return result._sum.correctAnswers || 0;
      }

      case "session_count": {
        return await prisma.exerciseSession.count({
          where: { userId },
        });
      }

      case "gold_earned": {
        const result = await prisma.exerciseSession.aggregate({
          where: { userId },
          _sum: { goldEarned: true },
        });
        return result._sum.goldEarned || 0;
      }

      case "grade_completion": {
        const grade = await prisma.grade.findUnique({
          where: { name: requirement.grade! },
          include: { materials: { include: { courses: true } } },
        });

        if (!grade) return 0;

        const totalCourses = grade.materials.reduce(
          (sum, material) => sum + material.courses.length,
          0
        );
        if (totalCourses === 0) return 0;

        const completedCourses = await prisma.courseProgress.count({
          where: {
            userId,
            completed: true,
            course: { material: { gradeId: grade.id } },
          },
        });

        return Math.round((completedCourses / totalCourses) * 100);
      }

      default:
        return 0;
    }
  }
}
