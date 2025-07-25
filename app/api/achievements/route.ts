import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AchievementService } from "@/lib/services/achievement-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "earned";

    if (type === "progress") {
      const badgeProgress = await AchievementService.getBadgeProgress(
        session.user.id
      );
      return NextResponse.json({ badges: badgeProgress });
    }

    const userBadges = await AchievementService.getUserBadges(session.user.id);
    return NextResponse.json({ badges: userBadges });
  } catch (error) {
    console.error("Achievements API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newBadges = await AchievementService.checkAndAwardAchievements(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      newBadges,
      message:
        newBadges.length > 0
          ? `Selamat! Kamu mendapat ${
              newBadges.length
            } badge baru: ${newBadges.join(", ")}`
          : "Tidak ada badge baru saat ini",
    });
  } catch (error) {
    console.error("Achievement check API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
