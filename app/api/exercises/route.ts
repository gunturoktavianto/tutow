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

    if (!gradeName || !materialName) {
      return NextResponse.json(
        { error: "Grade and material are required" },
        { status: 400 }
      );
    }

    const grade = await prisma.grade.findUnique({
      where: { name: gradeName },
    });

    if (!grade) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    const material = await prisma.material.findFirst({
      where: {
        name: materialName,
        gradeId: grade.id,
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    const allExercises = await prisma.exercise.findMany({
      where: {
        materialId: material.id,
        gradeId: grade.id,
      },
    });

    if (allExercises.length === 0) {
      return NextResponse.json({
        exercises: [],
        message: "No exercises available for this material",
      });
    }

    const shuffled = allExercises.sort(() => 0.5 - Math.random());
    const selectedExercises = shuffled.slice(
      0,
      Math.min(10, allExercises.length)
    );

    const exercisesWithParsedOptions = selectedExercises.map((exercise) => ({
      ...exercise,
      options: Array.isArray(exercise.options)
        ? exercise.options
        : JSON.parse(exercise.options as string),
    }));

    return NextResponse.json({
      exercises: exercisesWithParsedOptions,
      total: allExercises.length,
    });
  } catch (error) {
    console.error("Exercises API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
