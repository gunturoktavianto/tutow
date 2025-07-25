import { useState, useEffect } from "react";

interface ExerciseProgressData {
  overall: {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    averageAccuracy: number;
    averageTimePerQuestion: number;
    totalGoldEarned: number;
  };
  bestSession: {
    id: string;
    completedAt: string;
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    timeSpent: number;
    goldEarned: number;
  } | null;
  materialStats: Array<{
    materialId: string;
    materialName: string;
    materialDisplayName: string;
    gradeName: string;
    gradeDisplayName: string;
    sessions: number;
    totalQuestions: number;
    correctAnswers: number;
    goldEarned: number;
    accuracy: number;
  }>;
  recentSessions: Array<{
    id: string;
    completedAt: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    timeSpent: number;
    goldEarned: number;
  }>;
}

interface UseExerciseProgressOptions {
  grade?: string;
  material?: string;
  autoFetch?: boolean;
}

export function useExerciseProgress(options: UseExerciseProgressOptions = {}) {
  const [data, setData] = useState<ExerciseProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.grade) params.append("grade", options.grade);
      if (options.material) params.append("material", options.material);

      const url = `/api/exercises/progress${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch exercise progress");
      }

      const progressData = await response.json();
      setData(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchProgress();
    }
  }, [options.grade, options.material, options.autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchProgress,
  };
}
