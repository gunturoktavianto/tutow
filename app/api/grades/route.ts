import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ grades });
  } catch (error) {
    console.error("Grades API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
