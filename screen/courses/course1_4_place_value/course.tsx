"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Star, Trophy, Plus, Minus } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";
import { useSession } from "next-auth/react";

interface PlaceValueExercise {
  id: number;
  targetNumber: number;
  tens: number;
  ones: number;
}

const placeValueExercises: PlaceValueExercise[] = [
  { id: 1, targetNumber: 23, tens: 2, ones: 3 },
  { id: 2, targetNumber: 45, tens: 4, ones: 5 },
  { id: 3, targetNumber: 67, tens: 6, ones: 7 },
  { id: 4, targetNumber: 89, tens: 8, ones: 9 },
  { id: 5, targetNumber: 34, tens: 3, ones: 4 },
  { id: 6, targetNumber: 56, tens: 5, ones: 6 },
  { id: 7, targetNumber: 78, tens: 7, ones: 8 },
  { id: 8, targetNumber: 12, tens: 1, ones: 2 },
  { id: 9, targetNumber: 90, tens: 9, ones: 0 },
  { id: 10, targetNumber: 47, tens: 4, ones: 7 },
];

export function Course1_4_PlaceValue({ courseId }: CourseComponentProps) {
  console.log("Course1_4_PlaceValue loaded with courseId:", courseId);

  const { update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState<
    "intro" | "exercise" | "congratulation"
  >("intro");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userTens, setUserTens] = useState(0);
  const [userOnes, setUserOnes] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === "development");
  }, []);

  useEffect(() => {
    if (currentStep === "congratulation") {
      updateProgress();
    }
  }, [currentStep]);

  const updateProgress = async () => {
    if (!courseId) return;

    try {
      const totalQuestions = placeValueExercises.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          completed: true,
          score: percentage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const data = await response.json();
      console.log("Progress updated:", data);

      // Refresh session to update XP in navbar
      if (data.xpEarned > 0) {
        await updateSession();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const currentExercise = placeValueExercises[currentExerciseIndex];
  const userNumber = userTens * 10 + userOnes;

  const handleTensChange = (change: number) => {
    const newTens = Math.max(0, Math.min(9, userTens + change));
    setUserTens(newTens);
  };

  const handleOnesChange = (change: number) => {
    const newOnes = Math.max(0, Math.min(9, userOnes + change));
    setUserOnes(newOnes);
  };

  const checkAnswer = () => {
    const isCorrect = userNumber === currentExercise.targetNumber;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        if (currentExerciseIndex < placeValueExercises.length - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setUserTens(0);
          setUserOnes(0);
        } else {
          setCurrentStep("congratulation");
        }
      } else {
        setUserTens(0);
        setUserOnes(0);
      }
    }, 2000);
  };

  const autoSolve = () => {
    if (!isDevelopment) return;
    setUserTens(currentExercise.tens);
    setUserOnes(currentExercise.ones);
  };

  const renderBalls = (count: number, color: string) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-6 h-6 rounded-full ${color} border-2 border-gray-300 shadow-sm`}
      />
    ));
  };

  const IntroStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-6">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Nilai Tempat: Puluhan dan Satuan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Mari belajar tentang nilai tempat! Kita akan belajar bagaimana angka
          tersusun dari puluhan dan satuan menggunakan bola-bola yang
          menyenangkan.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Apa yang akan kita pelajari?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">10</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Puluhan
            </h3>
            <p className="text-gray-600">
              Setiap bola biru bernilai 10. Jadi 2 bola biru = 20
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Satuan</h3>
            <p className="text-gray-600">
              Setiap bola hijau bernilai 1. Jadi 5 bola hijau = 5
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Contoh:</h4>
          <p className="text-gray-700">
            Angka <strong>23</strong> terdiri dari:
            <br />• <strong>2 puluhan</strong> (2 bola biru) = 20
            <br />• <strong>3 satuan</strong> (3 bola hijau) = 3
            <br />
            Total: 20 + 3 = <strong>23</strong>
          </p>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
          onClick={() => setCurrentStep("exercise")}
        >
          Mulai Belajar! 🚀
        </Button>
      </div>
    </div>
  );

  const ExerciseStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Soal {currentExerciseIndex + 1} dari {placeValueExercises.length}
        </h1>
        <p className="text-lg text-gray-600">
          Buatlah angka yang sama dengan angka target!
        </p>
      </div>

      <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Angka Target
            </h2>
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <span className="text-5xl font-bold text-white">
                {currentExercise.targetNumber}
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Angka Kamu
            </h2>
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full">
              <span className="text-5xl font-bold text-white">
                {userNumber}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-center text-blue-800 mb-4">
                Puluhan (×10)
              </h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-blue-800">
                  {userTens}
                </span>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => handleTensChange(-1)}
                  disabled={userTens === 0 || showFeedback}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <Button
                  onClick={() => handleTensChange(1)}
                  disabled={userTens === 9 || showFeedback}
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              <div className="min-h-[120px] bg-white rounded-xl p-4 border-2 border-blue-200">
                <div className="grid grid-cols-5 gap-2 justify-items-center">
                  {renderBalls(userTens, "bg-blue-500")}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-center text-green-800 mb-4">
                Satuan (×1)
              </h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-green-800">
                  {userOnes}
                </span>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={() => handleOnesChange(-1)}
                  disabled={userOnes === 0 || showFeedback}
                  className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <Button
                  onClick={() => handleOnesChange(1)}
                  disabled={userOnes === 9 || showFeedback}
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              <div className="min-h-[120px] bg-white rounded-xl p-4 border-2 border-green-200">
                <div className="grid grid-cols-5 gap-2 justify-items-center">
                  {renderBalls(userOnes, "bg-green-500")}
                </div>
              </div>
            </div>
          </div>

          {showFeedback && (
            <div className="text-center mb-6">
              {userNumber === currentExercise.targetNumber ? (
                <div className="flex items-center justify-center text-green-600 text-xl font-semibold">
                  <CheckCircle className="w-8 h-8 mr-2" />
                  Benar! Hebat sekali! 🎉
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center text-red-600 text-xl font-semibold mb-2">
                    <XCircle className="w-8 h-8 mr-2" />
                    Belum tepat. Coba lagi!
                  </div>
                  <p className="text-gray-600">
                    Target: <strong>{currentExercise.targetNumber}</strong> ={" "}
                    {currentExercise.tens} puluhan + {currentExercise.ones}{" "}
                    satuan
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={checkAnswer}
                disabled={showFeedback}
                className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
              >
                Periksa Jawaban
              </Button>
              {isDevelopment && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={autoSolve}
                  disabled={showFeedback}
                  className="px-6 py-3 text-lg rounded-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  🔧 Auto Solve
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CongratulationStep = () => {
    const percentage = Math.round((score / placeValueExercises.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Selamat! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Kamu telah menyelesaikan pembelajaran tentang Nilai Tempat!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {score}/{placeValueExercises.length}
              </div>
              <div className="text-gray-700">Soal Benar</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {percentage}%
              </div>
              <div className="text-gray-700">Skor Akhir</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Yang sudah kamu pelajari:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Nilai Tempat
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  Puluhan & Satuan
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Komposisi Bilangan
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Manipulatif Visual
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
            onClick={() => (window.location.href = "/learning/1/place-value")}
          >
            Lanjut ke Materi Berikutnya! 🚀
          </Button>

          <div>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg rounded-full border-2"
              onClick={() => (window.location.href = "/learning")}
            >
              Kembali ke Menu Utama
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "intro":
        return <IntroStep />;
      case "exercise":
        return <ExerciseStep />;
      case "congratulation":
        return <CongratulationStep />;
      default:
        return <IntroStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="py-8">{renderCurrentStep()}</div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.5s ease forwards;
        }

        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
