"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  imageUrl: string;
  earned: boolean;
  earnedAt?: string;
  currentProgress?: number;
  requirement?: {
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
  };
}

interface AchievementBadgesProps {
  showProgress?: boolean;
  category?: string;
  limit?: number;
  compact?: boolean;
}

export function AchievementBadges({
  showProgress = false,
  category,
  limit,
  compact = false,
}: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const type = showProgress ? "progress" : "earned";
      const response = await fetch(`/api/achievements?type=${type}`);

      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }

      const data = await response.json();
      let filteredAchievements = data.badges;

      if (category) {
        filteredAchievements = filteredAchievements.filter(
          (a: Achievement) => a.category === category
        );
      }

      if (limit) {
        filteredAchievements = filteredAchievements.slice(0, limit);
      }

      setAchievements(filteredAchievements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [showProgress, category, limit]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exercise":
        return "🏋️";
      case "grade":
        return "🎓";
      case "material":
        return "📚";
      case "milestone":
        return "🏆";
      default:
        return "🎯";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exercise":
        return "bg-blue-100 text-blue-800";
      case "grade":
        return "bg-green-100 text-green-800";
      case "material":
        return "bg-purple-100 text-purple-800";
      case "milestone":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressText = (achievement: Achievement) => {
    if (!achievement.requirement || achievement.earned) return null;

    const req = achievement.requirement;
    const current = achievement.currentProgress || 0;

    switch (req.type) {
      case "correct_answers":
        return `${current}/${req.count} soal benar`;
      case "session_count":
        return `${current}/${req.count} sesi`;
      case "gold_earned":
        return `${current}/${req.amount} gold`;
      case "grade_completion":
        return `${current}% selesai`;
      default:
        return null;
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.requirement || achievement.earned) return 100;

    const req = achievement.requirement;
    const current = achievement.currentProgress || 0;

    switch (req.type) {
      case "correct_answers":
        return Math.min((current / (req.count || 1)) * 100, 100);
      case "session_count":
        return Math.min((current / (req.count || 1)) * 100, 100);
      case "gold_earned":
        return Math.min((current / (req.amount || 1)) * 100, 100);
      case "grade_completion":
        return Math.min(current, 100);
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className={compact ? "text-center py-4" : ""}>
        {!compact && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold mb-2">
                {showProgress ? "Belum Ada Progress" : "Belum Ada Badge"}
              </h3>
              <p className="text-gray-600">
                {showProgress
                  ? "Mulai belajar untuk melihat progress badge kamu!"
                  : "Selesaikan latihan dan pembelajaran untuk mendapat badge pertama kamu!"}
              </p>
            </CardContent>
          </Card>
        )}
        {compact && (
          <div>
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm text-gray-600">Belum ada badge yang diraih</p>
          </div>
        )}
      </div>
    );
  }

  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  if (compact) {
    return (
      <div className="space-y-3">
        {achievements.slice(0, limit || 3).map((achievement) => (
          <div
            key={achievement.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${
              achievement.earned
                ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`text-2xl p-1.5 rounded-full ${
                achievement.earned ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              {achievement.imageUrl}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate">
                  {achievement.displayName}
                </h4>
                {achievement.earned && (
                  <Badge variant="default" className="text-xs px-1 py-0">
                    ✓
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-600 truncate">
                {achievement.description}
              </p>

              {achievement.earned && achievement.earnedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(achievement.earnedAt).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(
        ([categoryName, categoryAchievements]) => (
          <div key={categoryName}>
            {!category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">
                  {getCategoryIcon(categoryName)}
                </span>
                <h3 className="text-lg font-semibold capitalize">
                  {categoryName === "exercise" && "Latihan"}
                  {categoryName === "grade" && "Kelas"}
                  {categoryName === "material" && "Materi"}
                  {categoryName === "milestone" && "Pencapaian"}
                </h3>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`transition-all duration-200 ${
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`text-3xl p-2 rounded-full ${
                          achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                        }`}
                      >
                        {achievement.imageUrl}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm truncate">
                            {achievement.displayName}
                          </h4>
                          {achievement.earned && (
                            <Badge
                              variant="default"
                              className="text-xs px-1.5 py-0.5"
                            >
                              ✓
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {achievement.description}
                        </p>

                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(
                            achievement.category
                          )}`}
                        >
                          {getCategoryIcon(achievement.category)}{" "}
                          {achievement.category}
                        </Badge>

                        {showProgress && !achievement.earned && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{getProgressText(achievement)}</span>
                            </div>
                            <Progress
                              value={getProgressPercentage(achievement)}
                              className="h-2"
                            />
                          </div>
                        )}

                        {achievement.earned && achievement.earnedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Diraih:{" "}
                            {new Date(achievement.earnedAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
