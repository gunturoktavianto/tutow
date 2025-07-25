"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sprout,
  Droplets,
  Coins,
  Star,
  ShoppingCart,
  Trophy,
  Sparkles,
  Crown,
  Award,
  Flower,
  Leaf,
} from "lucide-react";

interface PlantType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  grade: string;
  seedPrice: number;
  waterCost: number;
  growthStages: number;
  xpReward: number;
  imageUrl: string;
}

interface Pot {
  id: number;
  plantTypeId: string | null;
  plantedAt: string | null;
  lastWatered: string | null;
  currentStage: number;
  isReadyToHarvest: boolean;
}

interface CollectionEntry {
  id: string;
  plantTypeId: string;
  unlocked: boolean;
  unlockedAt: string | null;
  timesHarvested: number;
  plantType: PlantType;
}

export default function GardenPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pots, setPots] = useState<Pot[]>([]);
  const [plantTypes, setPlantTypes] = useState<PlantType[]>([]);
  const [collectionBook, setCollectionBook] = useState<CollectionEntry[]>([]);
  const [selectedPot, setSelectedPot] = useState<number | null>(null);
  const [showPlantDialog, setShowPlantDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [userGold, setUserGold] = useState(0);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserGold(session.user.gold || 0);
      setUserXP(session.user.xp || 0);
      fetchGardenData();
    }
  }, [status, session]);

  const fetchGardenData = async () => {
    try {
      const response = await fetch("/api/garden");
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching garden data:", data.error);
        return;
      }

      setPots(data.garden.pots || []);
      setPlantTypes(data.plantTypes || []);
      setCollectionBook(data.collectionBook || []);
    } catch (error) {
      console.error("Error fetching garden data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    action: string,
    potIndex: number,
    plantTypeId?: string
  ) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          potIndex,
          plantTypeId,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage(result.message);

      if (result.goldSpent) {
        setUserGold((prev) => prev - result.goldSpent);
      }

      if (result.xpGained) {
        setUserXP((prev) => prev + result.xpGained);
      }

      // Update session to sync XP and Gold across all pages
      try {
        await update();
      } catch (sessionError) {
        console.warn("Session update failed:", sessionError);
      }

      await fetchGardenData();
      setShowPlantDialog(false);
    } catch (error) {
      console.error("Error performing action:", error);
      setMessage("Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  };

  const getPlantTypeById = (id: string) => {
    return plantTypes.find((p) => p.id === id);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "bronze":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "silver":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "gold":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case "bronze":
        return <Award className="w-4 h-4" />;
      case "silver":
        return <Trophy className="w-4 h-4" />;
      case "gold":
        return <Crown className="w-4 h-4" />;
      default:
        return <Flower className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-12 h-12 mx-auto mb-4 text-green-600 animate-bounce" />
          <p className="text-lg text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading || pots.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-12 h-12 mx-auto mb-4 text-green-600 animate-bounce" />
          <p className="text-lg text-gray-600">Memuat kebun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Sprout className="w-8 h-8 mr-3 text-green-600" />
            Kebun Saya 🌱
          </h1>
          <p className="text-gray-600">
            Tanam, siram, dan panen tanaman untuk mendapatkan XP!
          </p>

          {/* User Stats */}
          <div className="flex items-center space-x-4 mt-4">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Coins className="w-4 h-4 mr-1" />
              {userGold} Gold
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Star className="w-4 h-4 mr-1" />
              {userXP} XP
            </Badge>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {/* Garden Pots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pots
            .filter((pot) => pot !== null && pot !== undefined)
            .map((pot, index) => {
              const plantType = pot.plantTypeId
                ? getPlantTypeById(pot.plantTypeId)
                : null;
              const progress = plantType
                ? (pot.currentStage / plantType.growthStages) * 100
                : 0;

              return (
                <Card key={`pot-${index}`} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Pot {index + 1}</span>
                      {pot.isReadyToHarvest && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Siap Panen!
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {plantType ? (
                      <>
                        {/* Plant Info */}
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                            <Leaf className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {plantType.displayName}
                          </h3>
                          <Badge
                            className={`mt-2 ${getGradeColor(plantType.grade)}`}
                          >
                            {getGradeIcon(plantType.grade)}
                            <span className="ml-1 capitalize">
                              {plantType.grade}
                            </span>
                          </Badge>
                        </div>

                        {/* Growth Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Pertumbuhan</span>
                            <span>
                              {pot.currentStage}/{plantType.growthStages}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {pot.isReadyToHarvest ? (
                            <Button
                              onClick={() => handleAction("harvest", index)}
                              disabled={actionLoading}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Panen
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleAction("water", index)}
                              disabled={
                                actionLoading || userGold < plantType.waterCost
                              }
                              variant="outline"
                              className="flex-1"
                            >
                              <Droplets className="w-4 h-4 mr-2" />
                              Siram ({plantType.waterCost} Gold)
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Empty Pot */}
                        <div className="text-center py-8">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Sprout className="w-10 h-10 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-4">Pot kosong</p>
                          <Button
                            onClick={() => {
                              setSelectedPot(index);
                              setShowPlantDialog(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Tanam Bibit
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Collection Book Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowCollectionDialog(true)}
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Buku Koleksi ({collectionBook.filter((c) => c.unlocked).length}/
            {plantTypes.length})
          </Button>
        </div>

        {/* Plant Selection Dialog */}
        <Dialog open={showPlantDialog} onOpenChange={setShowPlantDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pilih Bibit untuk Ditanam</DialogTitle>
              <DialogDescription>
                Pilih bibit yang ingin ditanam di pot{" "}
                {selectedPot !== null ? selectedPot + 1 : ""}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["bronze", "silver", "gold"].map((grade) => (
                <div key={`grade-${grade}`} className="space-y-3">
                  <h3 className="font-semibold text-lg capitalize flex items-center">
                    {getGradeIcon(grade)}
                    <span className="ml-2">{grade}</span>
                  </h3>
                  {plantTypes
                    .filter((plant) => plant.grade === grade)
                    .map((plant) => (
                      <Card
                        key={`plant-dialog-${plant.id}`}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">
                                {plant.displayName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {plant.description}
                              </p>
                            </div>
                            <Badge className={getGradeColor(plant.grade)}>
                              {plant.seedPrice} Gold
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                            <span>Siram: {plant.waterCost} Gold</span>
                            <span>XP: {plant.xpReward}</span>
                          </div>
                          <Button
                            onClick={() =>
                              selectedPot !== null &&
                              handleAction("plant", selectedPot, plant.id)
                            }
                            disabled={
                              actionLoading || userGold < plant.seedPrice
                            }
                            className="w-full"
                            size="sm"
                          >
                            {userGold < plant.seedPrice
                              ? "Gold Tidak Cukup"
                              : "Tanam"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Collection Book Dialog */}
        <Dialog
          open={showCollectionDialog}
          onOpenChange={setShowCollectionDialog}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buku Koleksi Tanaman</DialogTitle>
              <DialogDescription>
                Koleksi tanaman yang sudah pernah dipanen.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {plantTypes.map((plant) => {
                const collectionEntry = collectionBook.find(
                  (c) => c.plantTypeId === plant.id
                );
                const isUnlocked = collectionEntry?.unlocked || false;

                return (
                  <Card
                    key={`collection-${plant.id}`}
                    className={`${isUnlocked ? "" : "opacity-50"}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                        {isUnlocked ? (
                          <Leaf className="w-8 h-8 text-green-600" />
                        ) : (
                          <span className="text-2xl">❓</span>
                        )}
                      </div>
                      <h4 className="font-medium text-sm">
                        {isUnlocked ? plant.displayName : "???"}
                      </h4>
                      <Badge
                        className={`mt-2 text-xs ${getGradeColor(plant.grade)}`}
                      >
                        {getGradeIcon(plant.grade)}
                        <span className="ml-1 capitalize">{plant.grade}</span>
                      </Badge>
                      {isUnlocked && collectionEntry && (
                        <p className="text-xs text-gray-500 mt-2">
                          Dipanen: {collectionEntry.timesHarvested}x
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
