import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/progress - Starting request");
    const session = await getServerSession(authOptions);
    console.log("Session in GET progress:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    let userId = session?.user?.id;

    if (!userId && session?.user?.email) {
      console.log(
        "No user ID in session, finding user by email:",
        session.user.email
      );
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
      console.log("Found user by email:", {
        userId,
        email: session.user.email,
      });
    }

    if (!userId) {
      console.log("Unauthorized request - no user ID found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");
    const gradeId = searchParams.get("gradeId");

    console.log("Progress query params:", { materialId, gradeId, userId });

    if (materialId) {
      const progress = await prisma.courseProgress.findMany({
        where: {
          userId: userId,
          materialId: materialId,
        },
        include: {
          course: true,
        },
      });

      console.log("Found progress for material:", {
        materialId,
        userId,
        progressCount: progress.length,
        completedCount: progress.filter((p) => p.completed).length,
      });

      return NextResponse.json({ progress });
    }

    if (gradeId) {
      const progress = await prisma.courseProgress.findMany({
        where: {
          userId: userId,
          material: {
            gradeId: gradeId,
          },
        },
        include: {
          course: true,
          material: true,
        },
      });

      console.log("Found progress for grade:", {
        gradeId,
        userId,
        progressCount: progress.length,
        completedCount: progress.filter((p) => p.completed).length,
      });

      return NextResponse.json({ progress });
    }

    const allProgress = await prisma.courseProgress.findMany({
      where: {
        userId: userId,
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

    console.log("Found all progress:", {
      userId,
      progressCount: allProgress.length,
      completedCount: allProgress.filter((p) => p.completed).length,
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

export async function POST(request: NextRequest) {
  let body: any;
  let userId: string | undefined;
  let session: any;

  try {
    console.log("POST /api/progress - Starting request");
    session = await getServerSession(authOptions);
    console.log("Full session object:", JSON.stringify(session, null, 2));
    console.log("Session check:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      userObject: session?.user,
    });

    // Try to get user ID from session, or fallback to finding by email
    userId = session?.user?.id;

    if (!userId && session?.user?.email) {
      console.log(
        "No user ID in session, trying to find user by email:",
        session.user.email
      );
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
      console.log("Found user by email:", {
        userId,
        email: session.user.email,
      });
    }

    if (!userId) {
      console.log("Unauthorized request - no session, user ID, or email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    body = await request.json();
    console.log("Request body:", body);
    const { courseId, completed, score } = body;

    if (!courseId) {
      console.log("Missing courseId in request");
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Get course and material info
    console.log("Looking up course:", courseId);
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { material: true },
    });
    console.log("Course found:", {
      found: !!course,
      courseId: course?.id,
      materialId: course?.materialId,
      xpReward: course?.xpReward,
    });

    if (!course) {
      console.log("Course not found in database");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if progress already exists
    const existingProgress = await prisma.courseProgress.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    let progress;
    if (existingProgress) {
      // Update existing progress
      progress = await prisma.courseProgress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          completed: completed,
          score: score,
          completedAt: completed ? new Date() : null,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new progress
      progress = await prisma.courseProgress.create({
        data: {
          userId: userId,
          courseId: courseId,
          materialId: course.materialId,
          completed: completed,
          score: score,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    // Update user XP if course is completed (only if not already completed)
    let xpEarned = 0;
    if (completed && !existingProgress?.completed) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: {
            increment: course.xpReward,
          },
        },
      });
      xpEarned = course.xpReward;
    }

    console.log("Course progress updated successfully:", {
      userId: userId,
      courseId: courseId,
      completed: completed,
      score: score,
      xpEarned: xpEarned,
    });

    return NextResponse.json({
      success: true,
      progress,
      xpEarned: xpEarned,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      courseId: body?.courseId,
      userId: userId,
      sessionUserId: session?.user?.id,
      sessionEmail: session?.user?.email,
    });
    return NextResponse.json(
      {
        error: "Failed to update progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
