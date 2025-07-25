"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy } from "lucide-react";
import Link from "next/link";

interface Exercise {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  difficulty: string;
  imageUrl?: string;
}

interface ExerciseMaterialPageProps {
  params: Promise<{
    grade: string;
    material: string;
  }>;
}

export default function ExerciseMaterialPage({
  params,
}: ExerciseMaterialPageProps) {
  const router = useRouter();
  const { grade, material } = use(params);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [results, setResults] = useState<{
    correct: number;
    total: number;
    goldEarned: number;
    timeSpent: number;
  } | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [grade, material]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExerciseStarted && timeLeft > 0 && !exerciseComplete) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExerciseStarted, timeLeft, exerciseComplete]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        `/api/exercises?grade=${grade}&material=${material}`
      );
      if (response.ok) {
        const data = await response.json();
        setExercises(data.exercises);
        setUserAnswers(new Array(data.exercises.length).fill(""));
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startExercise = () => {
    setIsExerciseStarted(true);
    setTimeLeft(600); // Reset to 10 minutes
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || "");
    } else {
      handleSubmitExercise();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || "");
    }
  };

  const handleSubmitExercise = async () => {
    if (isSubmitting || exerciseComplete) return;

    setIsSubmitting(true);
    setExerciseComplete(true);

    try {
      const timeSpent = 600 - timeLeft;
      const response = await fetch("/api/exercises/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade: grade,
          material: material,
          answers: userAnswers,
          exerciseIds: exercises.map((ex) => ex.id),
          timeSpent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error submitting exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat soal latihan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/exercise/${grade}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada soal tersedia
          </h3>
          <p className="text-gray-600">
            Soal latihan untuk materi ini sedang dalam pengembangan.
          </p>
        </div>
      </div>
    );
  }

  if (showResult && results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Latihan Selesai!</CardTitle>
            <div className="flex justify-center mb-4">
              {results.correct >= 7 ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.correct}/{results.total}
                  </div>
                  <div className="text-sm text-blue-600">Jawaban Benar</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +{results.goldEarned}
                  </div>
                  <div className="text-sm text-green-600">Gold Diperoleh</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-700">
                  Waktu: {formatTime(results.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">
                  Akurasi: {Math.round((results.correct / results.total) * 100)}
                  %
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
              <Link href={`/exercise/${grade}`}>
                <Button variant="outline">Pilih Materi Lain</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isExerciseStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/exercise/${grade}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">
              Siap Memulai Latihan?
            </CardTitle>
            <p className="text-gray-600">
              Latihan ini terdiri dari {exercises.length} soal dengan batas
              waktu 10 menit
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {exercises.length}
                </div>
                <div className="text-sm text-blue-600">Total Soal</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">10</div>
                <div className="text-sm text-green-600">Menit</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">+Gold</div>
                <div className="text-sm text-yellow-600">Hadiah</div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startExercise} size="lg" className="px-8">
                Mulai Latihan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentExercise = exercises[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exercises.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Soal {currentQuestionIndex + 1} dari {exercises.length}
              </Badge>
              <Badge
                className={`px-3 py-1 ${getDifficultyColor(
                  currentExercise.difficulty
                )}`}
              >
                {currentExercise.difficulty === "easy"
                  ? "Mudah"
                  : currentExercise.difficulty === "medium"
                  ? "Sedang"
                  : "Sulit"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span
                className={timeLeft < 60 ? "text-red-600" : "text-gray-600"}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentExercise.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentExercise.imageUrl && (
              <div className="mb-6">
                <img
                  src={currentExercise.imageUrl}
                  alt="Soal"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              {currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Sebelumnya
          </Button>

          <div className="text-sm text-gray-600">
            {userAnswers.filter((answer) => answer !== "").length} dari{" "}
            {exercises.length} terjawab
          </div>

          <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
            {currentQuestionIndex === exercises.length - 1
              ? "Selesai"
              : "Selanjutnya"}
          </Button>
        </div>
      </div>
    </div>
  );
}
