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

    let garden = await prisma.garden.findUnique({
      where: { userId },
    });

    if (!garden) {
      const emptyPots = Array(3)
        .fill(null)
        .map((_, index) => ({
          id: index,
          plantTypeId: null,
          plantedAt: null,
          lastWatered: null,
          currentStage: 0,
          isReadyToHarvest: false,
        }));

      garden = await prisma.garden.create({
        data: {
          userId,
          pots: emptyPots,
        },
      });
    }

    const collectionBook = await prisma.collectionBook.findMany({
      where: { userId },
      include: { plantType: true },
    });

    const plantTypes = await prisma.plantType.findMany({
      orderBy: [{ grade: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({
      garden,
      collectionBook,
      plantTypes,
    });
  } catch (error) {
    console.error("Garden GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { action, potIndex, plantTypeId } = body;

    const garden = await prisma.garden.findUnique({
      where: { userId },
    });

    if (!garden) {
      return NextResponse.json({ error: "Garden not found" }, { status: 404 });
    }

    const pots = garden.pots as any[];

    if (potIndex < 0 || potIndex >= pots.length) {
      return NextResponse.json({ error: "Invalid pot index" }, { status: 400 });
    }

    switch (action) {
      case "plant":
        return await handlePlant(userId, garden, pots, potIndex, plantTypeId);
      case "water":
        return await handleWater(userId, garden, pots, potIndex);
      case "harvest":
        return await handleHarvest(userId, garden, pots, potIndex);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Garden POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePlant(
  userId: string,
  garden: any,
  pots: any[],
  potIndex: number,
  plantTypeId: string
) {
  const pot = pots[potIndex];

  if (pot.plantTypeId) {
    return NextResponse.json(
      { error: "Pot already has a plant" },
      { status: 400 }
    );
  }

  const plantType = await prisma.plantType.findUnique({
    where: { id: plantTypeId },
  });

  if (!plantType) {
    return NextResponse.json(
      { error: "Plant type not found" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gold: true },
  });

  if (!user || user.gold < plantType.seedPrice) {
    return NextResponse.json({ error: "Insufficient gold" }, { status: 400 });
  }

  const now = new Date();
  pots[potIndex] = {
    id: potIndex,
    plantTypeId: plantTypeId,
    plantedAt: now.toISOString(),
    lastWatered: now.toISOString(),
    currentStage: 1,
    isReadyToHarvest: false,
  };

  await prisma.$transaction([
    prisma.garden.update({
      where: { id: garden.id },
      data: { pots },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { gold: { decrement: plantType.seedPrice } },
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: `${plantType.displayName} berhasil ditanam!`,
    goldSpent: plantType.seedPrice,
  });
}

async function handleWater(
  userId: string,
  garden: any,
  pots: any[],
  potIndex: number
) {
  const pot = pots[potIndex];

  if (!pot.plantTypeId) {
    return NextResponse.json(
      { error: "No plant in this pot" },
      { status: 400 }
    );
  }

  if (pot.isReadyToHarvest) {
    return NextResponse.json(
      { error: "Plant is ready to harvest" },
      { status: 400 }
    );
  }

  const plantType = await prisma.plantType.findUnique({
    where: { id: pot.plantTypeId },
  });

  if (!plantType) {
    return NextResponse.json(
      { error: "Plant type not found" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { gold: true },
  });

  if (!user || user.gold < plantType.waterCost) {
    return NextResponse.json({ error: "Insufficient gold" }, { status: 400 });
  }

  const now = new Date();
  const newStage = Math.min(pot.currentStage + 1, plantType.growthStages);
  const isReadyToHarvest = newStage >= plantType.growthStages;

  pots[potIndex] = {
    ...pot,
    lastWatered: now.toISOString(),
    currentStage: newStage,
    isReadyToHarvest,
  };

  await prisma.$transaction([
    prisma.garden.update({
      where: { id: garden.id },
      data: { pots },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { gold: { decrement: plantType.waterCost } },
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: isReadyToHarvest
      ? `${plantType.displayName} siap dipanen!`
      : `${plantType.displayName} berhasil disiram!`,
    goldSpent: plantType.waterCost,
    newStage,
    isReadyToHarvest,
  });
}

async function handleHarvest(
  userId: string,
  garden: any,
  pots: any[],
  potIndex: number
) {
  const pot = pots[potIndex];

  if (!pot.plantTypeId || !pot.isReadyToHarvest) {
    return NextResponse.json(
      { error: "Plant is not ready to harvest" },
      { status: 400 }
    );
  }

  const plantType = await prisma.plantType.findUnique({
    where: { id: pot.plantTypeId },
  });

  if (!plantType) {
    return NextResponse.json(
      { error: "Plant type not found" },
      { status: 404 }
    );
  }

  let collectionEntry = await prisma.collectionBook.findUnique({
    where: {
      userId_plantTypeId: {
        userId,
        plantTypeId: pot.plantTypeId,
      },
    },
  });

  const isFirstTime = !collectionEntry?.unlocked;
  let xpReward = plantType.xpReward;

  if (isFirstTime) {
    xpReward *= 2;
  }

  pots[potIndex] = {
    id: potIndex,
    plantTypeId: null,
    plantedAt: null,
    lastWatered: null,
    currentStage: 0,
    isReadyToHarvest: false,
  };

  if (collectionEntry) {
    await prisma.collectionBook.update({
      where: { id: collectionEntry.id },
      data: {
        unlocked: true,
        unlockedAt: isFirstTime ? new Date() : collectionEntry.unlockedAt,
        timesHarvested: { increment: 1 },
      },
    });
  } else {
    await prisma.collectionBook.create({
      data: {
        userId,
        plantTypeId: pot.plantTypeId,
        unlocked: true,
        unlockedAt: new Date(),
        timesHarvested: 1,
      },
    });
  }

  await prisma.$transaction([
    prisma.garden.update({
      where: { id: garden.id },
      data: { pots },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpReward } },
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: isFirstTime
      ? `Selamat! ${plantType.displayName} pertama kali dipanen! +${xpReward} XP`
      : `${plantType.displayName} berhasil dipanen! +${xpReward} XP`,
    xpGained: xpReward,
    isFirstTime,
  });
}
