import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          xp: true,
          school: true,
        },
        orderBy: {
          xp: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
    }));

    return NextResponse.json({
      leaderboard,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
