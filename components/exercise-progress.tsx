"use client";

import { useExerciseProgress } from "@/lib/hooks/useExerciseProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ExerciseProgressProps {
  grade?: string;
  material?: string;
  showMaterialStats?: boolean;
  showRecentSessions?: boolean;
}

export function ExerciseProgress({
  grade,
  material,
  showMaterialStats = true,
  showRecentSessions = true,
}: ExerciseProgressProps) {
  const { data, loading, error } = useExerciseProgress({ grade, material });

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
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

  if (!data) {
    return null;
  }

  const { overall, bestSession, materialStats, recentSessions } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Soal</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Dari {overall.totalSessions} sesi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jawaban Benar</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overall.totalCorrect}
            </div>
            <p className="text-xs text-muted-foreground">
              Akurasi {overall.averageAccuracy.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold Earned</CardTitle>
            <span className="text-2xl">🪙</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {overall.totalGoldEarned}
            </div>
            <p className="text-xs text-muted-foreground">
              Total gold dari latihan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Waktu
            </CardTitle>
            <span className="text-2xl">⏱️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overall.averageTimePerQuestion.toFixed(1)}s
            </div>
            <p className="text-xs text-muted-foreground">Per soal</p>
          </CardContent>
        </Card>
      </div>

      {bestSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Sesi Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Akurasi</p>
                <p className="text-2xl font-bold text-green-600">
                  {bestSession.accuracy}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Benar/Total</p>
                <p className="text-lg font-semibold">
                  {bestSession.correctAnswers}/{bestSession.totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waktu</p>
                <p className="text-lg font-semibold">
                  {Math.floor(bestSession.timeSpent / 60)}m{" "}
                  {bestSession.timeSpent % 60}s
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gold</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {bestSession.goldEarned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showMaterialStats && materialStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress per Materi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materialStats.map((stat) => (
                <div key={stat.materialId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stat.materialDisplayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.gradeDisplayName} • {stat.sessions} sesi
                      </p>
                    </div>
                    <Badge
                      variant={stat.accuracy >= 80 ? "default" : "secondary"}
                    >
                      {stat.accuracy.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={stat.accuracy} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {stat.correctAnswers}/{stat.totalQuestions} benar
                    </span>
                    <span>{stat.goldEarned} gold</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showRecentSessions && recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sesi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.accuracy >= 80
                          ? "bg-green-500"
                          : session.accuracy >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">
                        {session.correctAnswers}/{session.totalQuestions} benar
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.completedAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={session.accuracy >= 80 ? "default" : "secondary"}
                    >
                      {session.accuracy.toFixed(0)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{session.goldEarned} gold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
