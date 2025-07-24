"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, ArrowRight, Star, Trophy } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";
import { useSession } from "next-auth/react";

interface PatternExercise {
  id: number;
  sequence: (number | null)[];
  correctAnswers: number[];
  missingIndices: number[];
  pattern: string;
}

interface ComparisonExercise {
  id: number;
  leftNumber: number;
  rightNumber: number;
  type: "symbol" | "number";
  correctAnswer: string | number;
  options?: (string | number)[];
}

const patternExercises: PatternExercise[] = [
  {
    id: 1,
    sequence: [12, 13, 14, null, null, null, null],
    correctAnswers: [15, 16, 17, 18],
    missingIndices: [3, 4, 5, 6],
    pattern: "Naik 1",
  },
  {
    id: 2,
    sequence: [6, 8, 10, null, null, null, null],
    correctAnswers: [12, 14, 16, 18],
    missingIndices: [3, 4, 5, 6],
    pattern: "Naik 2",
  },
  {
    id: 3,
    sequence: [9, 8, 7, null, null, null, null],
    correctAnswers: [6, 5, 4, 3],
    missingIndices: [3, 4, 5, 6],
    pattern: "Turun 1",
  },
  {
    id: 4,
    sequence: [16, 14, null, null, null, null, 4],
    correctAnswers: [12, 10, 8, 6],
    missingIndices: [2, 3, 4, 5],
    pattern: "Turun 2",
  },
  {
    id: 5,
    sequence: [3, 5, 7, null, null, null, null],
    correctAnswers: [9, 11, 13, 15],
    missingIndices: [3, 4, 5, 6],
    pattern: "Naik 2",
  },
  {
    id: 6,
    sequence: [20, 18, null, null, null, null, 8],
    correctAnswers: [16, 14, 12, 10],
    missingIndices: [2, 3, 4, 5],
    pattern: "Turun 2",
  },
];

const comparisonExercises: ComparisonExercise[] = [
  {
    id: 1,
    leftNumber: 83,
    rightNumber: 89,
    type: "symbol",
    correctAnswer: "<",
    options: ["<", ">", "="],
  },
  {
    id: 2,
    leftNumber: 17,
    rightNumber: 17,
    type: "symbol",
    correctAnswer: "=",
    options: ["<", ">", "="],
  },
  {
    id: 3,
    leftNumber: 41,
    rightNumber: 14,
    type: "number",
    correctAnswer: 41,
    options: [41, 14],
  },
  {
    id: 4,
    leftNumber: 39,
    rightNumber: 42,
    type: "number",
    correctAnswer: 42,
    options: [39, 42],
  },
  {
    id: 5,
    leftNumber: 18,
    rightNumber: 66,
    type: "number",
    correctAnswer: 66,
    options: [18, 66],
  },
  {
    id: 6,
    leftNumber: 25,
    rightNumber: 24,
    type: "number",
    correctAnswer: 25,
    options: [25, 24],
  },
  {
    id: 7,
    leftNumber: 36,
    rightNumber: 42,
    type: "number",
    correctAnswer: 42,
    options: [36, 42],
  },
  {
    id: 8,
    leftNumber: 98,
    rightNumber: 89,
    type: "number",
    correctAnswer: 98,
    options: [98, 89],
  },
];

export function Course1_3_PolaPerbandingan({ courseId }: CourseComponentProps) {
  const { update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState<
    "intro" | "patterns" | "comparison" | "congratulation"
  >("intro");
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [patternAnswers, setPatternAnswers] = useState<{
    [key: number]: { [index: number]: string };
  }>({});
  const [comparisonAnswers, setComparisonAnswers] = useState<{
    [key: number]: string | number;
  }>({});
  const [showPatternFeedback, setShowPatternFeedback] = useState(false);
  const [showComparisonFeedback, setShowComparisonFeedback] = useState(false);
  const [patternScore, setPatternScore] = useState(0);
  const [comparisonScore, setComparisonScore] = useState(0);
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
      const totalScore = patternScore + comparisonScore;
      const totalQuestions =
        patternExercises.length + comparisonExercises.length;
      const percentage = Math.round((totalScore / totalQuestions) * 100);

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

  const autoAnswerPattern = () => {
    if (!isDevelopment) return;

    const currentExercise = patternExercises[currentPatternIndex];
    const answers: { [index: number]: string } = {};

    currentExercise.missingIndices.forEach((index, i) => {
      answers[index] = currentExercise.correctAnswers[i].toString();
    });

    setPatternAnswers((prev) => ({
      ...prev,
      [currentExercise.id]: answers,
    }));
  };

  const autoAnswerComparison = () => {
    if (!isDevelopment) return;

    const currentExercise = comparisonExercises[currentComparisonIndex];
    setComparisonAnswers((prev) => ({
      ...prev,
      [currentExercise.id]: currentExercise.correctAnswer,
    }));
  };

  const IntroStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Pola Bilangan & Perbandingan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Mari belajar tentang pola angka dan membandingkan angka! Kita akan
          mencari pola yang hilang dan menentukan angka mana yang lebih besar.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Apa yang akan kita pelajari?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Pola Bilangan
            </h3>
            <p className="text-gray-600">
              Mencari angka yang hilang dalam urutan pola naik dan turun
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Membandingkan Angka
            </h3>
            <p className="text-gray-600">
              Menentukan angka mana yang lebih besar, lebih kecil, atau sama
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
          onClick={() => setCurrentStep("patterns")}
        >
          Mulai Belajar! 🚀
        </Button>
      </div>
    </div>
  );

  const PatternsStep = () => {
    const currentExercise = patternExercises[currentPatternIndex];
    const currentAnswers = patternAnswers[currentExercise.id] || {};

    const handlePatternInputChange = (index: number, value: string) => {
      setPatternAnswers((prev) => ({
        ...prev,
        [currentExercise.id]: {
          ...prev[currentExercise.id],
          [index]: value,
        },
      }));
    };

    const checkPatternAnswer = () => {
      const isCorrect = currentExercise.missingIndices.every((index) => {
        const userAnswer = parseInt(currentAnswers[index] || "");
        const correctAnswer =
          currentExercise.correctAnswers[
            currentExercise.missingIndices.indexOf(index)
          ];
        return userAnswer === correctAnswer;
      });

      if (isCorrect) {
        setPatternScore((prev) => prev + 1);
      }

      setShowPatternFeedback(true);
      setTimeout(() => {
        setShowPatternFeedback(false);
        if (isCorrect) {
          if (currentPatternIndex < patternExercises.length - 1) {
            setCurrentPatternIndex((prev) => prev + 1);
          } else {
            setCurrentStep("comparison");
          }
        } else {
          setPatternAnswers((prev) => ({
            ...prev,
            [currentExercise.id]: {},
          }));
        }
      }, 2000);
    };

    const isPatternComplete = currentExercise.missingIndices.every(
      (index) => currentAnswers[index] && currentAnswers[index].trim() !== ""
    );

    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pola Bilangan - Soal {currentPatternIndex + 1} dari{" "}
            {patternExercises.length}
          </h1>
          <p className="text-lg text-gray-600">
            Temukan pola dan isi bilangan yang hilang!
          </p>
        </div>

        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 mb-4">
                Pola:{" "}
                <span className="font-bold">{currentExercise.pattern}</span>
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-7 gap-4">
                {currentExercise.sequence.map((num, index) => (
                  <div key={index} className="relative">
                    {num !== null ? (
                      <div className="w-16 h-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-800">
                          {num}
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-center justify-center">
                        <Input
                          type="number"
                          className="w-full h-full text-center text-xl font-bold border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={currentAnswers[index] || ""}
                          onChange={(e) =>
                            handlePatternInputChange(index, e.target.value)
                          }
                          placeholder="?"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {showPatternFeedback && (
              <div className="text-center mb-6">
                {currentExercise.missingIndices.every((index) => {
                  const userAnswer = parseInt(currentAnswers[index] || "");
                  const correctAnswer =
                    currentExercise.correctAnswers[
                      currentExercise.missingIndices.indexOf(index)
                    ];
                  return userAnswer === correctAnswer;
                }) ? (
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
                      Perhatikan pola:{" "}
                      <strong>{currentExercise.pattern}</strong>. Jawaban yang
                      benar: {currentExercise.correctAnswers.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={checkPatternAnswer}
                  disabled={!isPatternComplete || showPatternFeedback}
                  className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
                >
                  Periksa Jawaban
                </Button>
                {isDevelopment && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={autoAnswerPattern}
                    disabled={showPatternFeedback}
                    className="px-6 py-3 text-lg rounded-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  >
                    🔧 Auto Answer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ComparisonStep = () => {
    const currentExercise = comparisonExercises[currentComparisonIndex];
    const currentAnswer = comparisonAnswers[currentExercise.id];

    const handleComparisonAnswer = (answer: string | number) => {
      setComparisonAnswers((prev) => ({
        ...prev,
        [currentExercise.id]: answer,
      }));

      const isCorrect = answer === currentExercise.correctAnswer;
      if (isCorrect) {
        setComparisonScore((prev) => prev + 1);
      }

      setShowComparisonFeedback(true);
      setTimeout(() => {
        setShowComparisonFeedback(false);
        if (isCorrect) {
          if (currentComparisonIndex < comparisonExercises.length - 1) {
            setCurrentComparisonIndex((prev) => prev + 1);
          } else {
            setCurrentStep("congratulation");
          }
        } else {
          setComparisonAnswers((prev) => {
            const { [currentExercise.id]: _, ...rest } = prev;
            return rest;
          });
        }
      }, 2000);
    };

    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Membandingkan Bilangan - Soal {currentComparisonIndex + 1} dari{" "}
            {comparisonExercises.length}
          </h1>
          <p className="text-lg text-gray-600">
            {currentExercise.type === "symbol"
              ? "Pilih simbol yang tepat!"
              : "Pilih bilangan yang lebih besar!"}
          </p>
        </div>

        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-blue-800">
                    {currentExercise.leftNumber}
                  </span>
                </div>
              </div>

              <div className="text-6xl font-bold text-gray-400">
                {currentExercise.type === "symbol" ? "?" : "vs"}
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-green-800">
                    {currentExercise.rightNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {currentExercise.options?.map((option) => (
                <Button
                  key={option}
                  size="lg"
                  variant={currentAnswer === option ? "default" : "outline"}
                  className={`px-8 py-4 text-2xl rounded-full min-w-[100px] ${
                    currentAnswer === option
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : ""
                  }`}
                  onClick={() => handleComparisonAnswer(option)}
                  disabled={showComparisonFeedback}
                >
                  {option}
                </Button>
              ))}
            </div>

            {isDevelopment && !showComparisonFeedback && (
              <div className="text-center mb-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={autoAnswerComparison}
                  className="px-6 py-3 text-lg rounded-full border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  🔧 Auto Answer
                </Button>
              </div>
            )}

            {showComparisonFeedback && (
              <div className="text-center mb-6">
                {currentAnswer === currentExercise.correctAnswer ? (
                  <div className="flex items-center justify-center text-green-600 text-xl font-semibold">
                    <CheckCircle className="w-8 h-8 mr-2" />
                    Benar! Pintar sekali! 🎉
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-red-600 text-xl font-semibold mb-2">
                      <XCircle className="w-8 h-8 mr-2" />
                      Belum tepat. Coba lagi!
                    </div>
                    <p className="text-gray-600">
                      Jawaban yang benar adalah:{" "}
                      <strong>{currentExercise.correctAnswer}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const CongratulationStep = () => {
    const totalScore = patternScore + comparisonScore;
    const totalQuestions = patternExercises.length + comparisonExercises.length;
    const percentage = Math.round((totalScore / totalQuestions) * 100);

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
              Kamu telah menyelesaikan pembelajaran tentang Pola Bilangan &
              Perbandingan!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {patternScore}/{patternExercises.length}
              </div>
              <div className="text-gray-700">Pola Bilangan</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {comparisonScore}/{comparisonExercises.length}
              </div>
              <div className="text-gray-700">Perbandingan</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {percentage}%
              </div>
              <div className="text-gray-700">Total Skor</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Yang sudah kamu pelajari:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Pola Naik & Turun
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  Membandingkan Bilangan
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Simbol &lt;, &gt;, =
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Mengurutkan Bilangan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
            onClick={() => (window.location.href = "/learning/1/bilangan")}
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
      case "patterns":
        return <PatternsStep />;
      case "comparison":
        return <ComparisonStep />;
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.5s ease forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Hide number input spinners */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
