import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AchievementService } from "@/lib/services/achievement-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { grade, material, answers, exerciseIds, timeSpent } = body;

    if (
      !grade ||
      !material ||
      !answers ||
      !exerciseIds ||
      timeSpent === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const gradeRecord = await prisma.grade.findUnique({
      where: { name: grade },
    });

    if (!gradeRecord) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    const materialRecord = await prisma.material.findFirst({
      where: {
        name: material,
        gradeId: gradeRecord.id,
      },
    });

    if (!materialRecord) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        id: { in: exerciseIds },
      },
    });

    if (exercises.length !== exerciseIds.length) {
      return NextResponse.json(
        { error: "Some exercises not found" },
        { status: 404 }
      );
    }

    let correctAnswers = 0;
    const answersData = [];

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises.find((ex) => ex.id === exerciseIds[i]);
      const userAnswer = answers[i];
      const isCorrect = exercise && userAnswer === exercise.answer;

      if (isCorrect) {
        correctAnswers++;
      }

      answersData.push({
        exerciseId: exerciseIds[i],
        userAnswer: userAnswer || "",
        isCorrect: isCorrect || false,
        timeSpent: Math.floor(timeSpent / exercises.length),
      });
    }

    const totalQuestions = exercises.length;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    let goldEarned = 0;
    if (accuracy >= 90) {
      goldEarned = 15;
    } else if (accuracy >= 80) {
      goldEarned = 12;
    } else if (accuracy >= 70) {
      goldEarned = 10;
    } else if (accuracy >= 60) {
      goldEarned = 8;
    } else if (accuracy >= 50) {
      goldEarned = 5;
    }

    if (timeSpent < 300) {
      goldEarned += 3;
    } else if (timeSpent < 450) {
      goldEarned += 2;
    }

    const exerciseSession = await prisma.exerciseSession.create({
      data: {
        userId: session.user.id,
        materialId: materialRecord.id,
        gradeId: gradeRecord.id,
        totalQuestions,
        correctAnswers,
        totalTime: timeSpent,
        goldEarned,
        answers: {
          create: answersData,
        },
      },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gold: {
          increment: goldEarned,
        },
      },
    });

    const newBadges = await AchievementService.checkAndAwardAchievements(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      results: {
        correct: correctAnswers,
        total: totalQuestions,
        goldEarned,
        timeSpent,
        accuracy: Math.round(accuracy),
        sessionId: exerciseSession.id,
      },
      newBadges,
    });
  } catch (error) {
    console.error("Exercise submit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
