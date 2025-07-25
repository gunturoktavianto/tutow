-- CreateTable
CREATE TABLE "plant_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "grade" TEXT NOT NULL,
    "seedPrice" INTEGER NOT NULL,
    "waterCost" INTEGER NOT NULL,
    "growthStages" INTEGER NOT NULL DEFAULT 5,
    "xpReward" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plant_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_books" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plantTypeId" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3),
    "timesHarvested" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plant_types_name_key" ON "plant_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collection_books_userId_plantTypeId_key" ON "collection_books"("userId", "plantTypeId");

-- AddForeignKey
ALTER TABLE "collection_books" ADD CONSTRAINT "collection_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_books" ADD CONSTRAINT "collection_books_plantTypeId_fkey" FOREIGN KEY ("plantTypeId") REFERENCES "plant_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
