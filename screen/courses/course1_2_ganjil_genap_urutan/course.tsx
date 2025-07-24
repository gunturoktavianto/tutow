"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, ArrowRight, Star, Trophy } from "lucide-react";

interface OrdinalExercise {
  id: number;
  instruction: string;
  items: Array<{
    type: string;
    color: string;
    position: number;
  }>;
  correctPositions: number[];
}

interface OddEvenExercise {
  id: number;
  shapes: Array<{
    type: string;
    color: string;
    count: number;
  }>;
  correctType: "odd" | "even";
}

const ordinalExercises: OrdinalExercise[] = [
  {
    id: 1,
    instruction: "Warnai lingkaran pertama dan keenam",
    items: Array.from({ length: 7 }, (_, i) => ({
      type: "circle",
      color: "#E5E7EB",
      position: i + 1,
    })),
    correctPositions: [1, 6],
  },
  {
    id: 2,
    instruction: "Warnai bintang kedua dan ketiga",
    items: Array.from({ length: 7 }, (_, i) => ({
      type: "star",
      color: "#E5E7EB",
      position: i + 1,
    })),
    correctPositions: [2, 3],
  },
  {
    id: 3,
    instruction: "Warnai kotak kelima dan ketujuh",
    items: Array.from({ length: 7 }, (_, i) => ({
      type: "square",
      color: "#E5E7EB",
      position: i + 1,
    })),
    correctPositions: [5, 7],
  },
  {
    id: 4,
    instruction: "Warnai segi lima pertama, kedua dan ketiga",
    items: Array.from({ length: 7 }, (_, i) => ({
      type: "pentagon",
      color: "#E5E7EB",
      position: i + 1,
    })),
    correctPositions: [1, 2, 3],
  },
  {
    id: 5,
    instruction: "Warnai oval keempat, kelima dan kedua",
    items: Array.from({ length: 7 }, (_, i) => ({
      type: "oval",
      color: "#E5E7EB",
      position: i + 1,
    })),
    correctPositions: [4, 5, 2],
  },
];

const oddEvenExercises: OddEvenExercise[] = [
  {
    id: 1,
    shapes: [{ type: "circle", color: "#3B82F6", count: 8 }],
    correctType: "even",
  },
  {
    id: 2,
    shapes: [{ type: "star", color: "#F59E0B", count: 5 }],
    correctType: "odd",
  },
  {
    id: 3,
    shapes: [{ type: "triangle", color: "#10B981", count: 4 }],
    correctType: "even",
  },
  {
    id: 4,
    shapes: [{ type: "square", color: "#8B5CF6", count: 9 }],
    correctType: "odd",
  },
  {
    id: 5,
    shapes: [{ type: "pentagon", color: "#EF4444", count: 6 }],
    correctType: "even",
  },
];

const renderShape = (type: string, color: string, size: number = 40) => {
  const baseProps = {
    width: size,
    height: size,
    fill: color,
    stroke: "#374151",
    strokeWidth: 2,
  };

  switch (type) {
    case "circle":
      return (
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} {...baseProps} />
      );
    case "star":
      const starPath =
        "M12,2 L15,8 L22,8 L17,13 L19,20 L12,16 L5,20 L7,13 L2,8 L9,8 Z";
      return (
        <path d={starPath} transform={`scale(${size / 24})`} {...baseProps} />
      );
    case "square":
      const { width, height, ...restProps } = baseProps;
      return (
        <rect x={2} y={2} width={size - 4} height={size - 4} {...restProps} />
      );
    case "triangle":
      return (
        <polygon
          points={`${size / 2},2 2,${size - 2} ${size - 2},${size - 2}`}
          {...baseProps}
        />
      );
    case "pentagon":
      const pentagonPath = `M${size / 2},2 L${size - 2},${size * 0.4} L${
        size * 0.8
      },${size - 2} L${size * 0.2},${size - 2} L2,${size * 0.4} Z`;
      return <path d={pentagonPath} {...baseProps} />;
    case "oval":
      return (
        <ellipse
          cx={size / 2}
          cy={size / 2}
          rx={size / 2 - 2}
          ry={size / 3}
          {...baseProps}
        />
      );
    default:
      return (
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} {...baseProps} />
      );
  }
};

export function Course1_2_GanjilGenapUrutan({
  courseId,
  courseData,
}: {
  courseId: string;
  courseData?: any;
}) {
  const [currentStep, setCurrentStep] = useState<
    "intro" | "ordinal" | "oddeven" | "congratulation"
  >("intro");
  const [currentOrdinalExercise, setCurrentOrdinalExercise] = useState(0);
  const [currentOddEvenExercise, setCurrentOddEvenExercise] = useState(0);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<"odd" | "even" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const updateProgress = async (completed: boolean = true, score?: number) => {
    if (!courseId) return;

    try {
      setIsUpdatingProgress(true);
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          completed: completed,
          score: score,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const data = await response.json();
      console.log("Progress updated successfully:", data);
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const IntroStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bilangan Ganjil, Genap & Urutan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ayo belajar tentang bilangan ganjil, genap, dan urutan bilangan
            dengan cara yang menyenangkan!
          </p>
        </div>

        <Card className="p-8 border-4 border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-600">
                Yang akan kamu pelajari:
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg">
                    Mengenal urutan bilangan (pertama, kedua, dst)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg">
                    Membedakan bilangan ganjil dan genap
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg">
                    Mengelompokkan objek berdasarkan jumlah
                  </span>
                </div>
              </div>
            </div>
            <div className="text-8xl text-center">🎯</div>
          </div>
        </Card>

        <Button
          size="lg"
          onClick={() => setCurrentStep("ordinal")}
          className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
        >
          Mulai Belajar! 🚀
        </Button>
      </div>
    </div>
  );

  const OrdinalStep = () => {
    const exercise = ordinalExercises[currentOrdinalExercise];

    const handlePositionClick = (position: number) => {
      setSelectedPositions((prev) => {
        if (prev.includes(position)) {
          return prev.filter((p) => p !== position);
        } else {
          return [...prev, position];
        }
      });
    };

    const handleAnswer = () => {
      const correct =
        exercise.correctPositions.sort().join(",") ===
        selectedPositions.sort().join(",");
      setIsCorrect(correct);
      setShowResult(true);
    };

    const handleNext = () => {
      if (currentOrdinalExercise < ordinalExercises.length - 1) {
        setCurrentOrdinalExercise((prev) => prev + 1);
        setSelectedPositions([]);
        setShowResult(false);
      } else {
        setCurrentStep("oddeven");
      }
    };

    const handleRetry = () => {
      setSelectedPositions([]);
      setShowResult(false);
    };

    return (
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Belajar Urutan Bilangan
          </h2>
          <div className="text-lg text-gray-600">
            Soal {currentOrdinalExercise + 1} dari {ordinalExercises.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentOrdinalExercise + 1) / ordinalExercises.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <Card className="p-8 border-4 border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-bold text-blue-600">
              {exercise.instruction}
            </h3>

            <div className="flex justify-center items-center gap-4 flex-wrap">
              {exercise.items.map((item, index) => {
                const isSelected = selectedPositions.includes(item.position);
                const isCorrect = exercise.correctPositions.includes(
                  item.position
                );
                const showCorrectColor = showResult && isCorrect;
                const showWrongColor = showResult && isSelected && !isCorrect;

                return (
                  <div
                    key={index}
                    className={`cursor-pointer transform transition-all hover:scale-110 ${
                      isSelected ? "scale-110" : ""
                    }`}
                    onClick={() =>
                      !showResult && handlePositionClick(item.position)
                    }
                  >
                    <svg width="60" height="60">
                      {renderShape(
                        item.type,
                        showCorrectColor
                          ? "#10B981"
                          : showWrongColor
                          ? "#EF4444"
                          : isSelected
                          ? "#3B82F6"
                          : item.color,
                        56
                      )}
                    </svg>
                    <div className="text-center mt-2 text-sm font-bold">
                      {item.position}
                    </div>
                  </div>
                );
              })}
            </div>

            {!showResult && (
              <Button
                size="lg"
                onClick={handleAnswer}
                disabled={selectedPositions.length === 0}
                className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
              >
                Periksa Jawaban! ✓
              </Button>
            )}

            {showResult && (
              <div className="space-y-6 animate-fade-in">
                <div
                  className={`text-6xl mb-4 ${
                    isCorrect ? "animate-bounce" : "animate-shake"
                  }`}
                >
                  {isCorrect ? "🎉" : "😅"}
                </div>
                <div
                  className={`text-3xl font-bold ${
                    isCorrect ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isCorrect
                    ? "Benar! Kamu hebat!"
                    : "Hampir benar! Coba lagi yuk!"}
                </div>
                {isCorrect ? (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all"
                  >
                    {currentOrdinalExercise < ordinalExercises.length - 1
                      ? "Soal Berikutnya!"
                      : "Lanjut ke Ganjil Genap!"}{" "}
                    <ArrowRight className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleRetry}
                    className="px-6 py-3 text-lg rounded-full"
                  >
                    Coba Lagi! 🔄
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const OddEvenStep = () => {
    const exercise = oddEvenExercises[currentOddEvenExercise];

    const handleTypeSelect = (type: "odd" | "even") => {
      setSelectedType(type);
    };

    const handleAnswer = () => {
      const correct = selectedType === exercise.correctType;
      setIsCorrect(correct);
      setShowResult(true);
    };

    const handleNext = async () => {
      if (currentOddEvenExercise < oddEvenExercises.length - 1) {
        setCurrentOddEvenExercise((prev) => prev + 1);
        setSelectedType(null);
        setShowResult(false);
      } else {
        // Course completed, update progress
        await updateProgress(true, 100);
        setCurrentStep("congratulation");
      }
    };

    const handleRetry = () => {
      setSelectedType(null);
      setShowResult(false);
    };

    return (
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-purple-600">
            Belajar Bilangan Ganjil dan Genap
          </h2>
          <div className="text-lg text-gray-600">
            Soal {currentOddEvenExercise + 1} dari {oddEvenExercises.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentOddEvenExercise + 1) / oddEvenExercises.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <Card className="p-8 border-4 border-purple-200 bg-gradient-to-br from-white to-purple-50">
          <div className="text-center space-y-8">
            <h3 className="text-2xl font-bold text-purple-600">
              Hitung bentuk di bawah ini dan pilih jenisnya!
            </h3>

            <div className="bg-white rounded-3xl p-8 border-4 border-dashed border-purple-300 min-h-[200px] flex items-center justify-center">
              <div className="flex flex-wrap justify-center items-center gap-4">
                {Array.from(
                  { length: exercise.shapes[0].count },
                  (_, index) => (
                    <svg key={index} width="50" height="50">
                      {renderShape(
                        exercise.shapes[0].type,
                        exercise.shapes[0].color,
                        46
                      )}
                    </svg>
                  )
                )}
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-700">
              Ada {exercise.shapes[0].count} bentuk
            </div>

            {!showResult && (
              <div className="space-y-6">
                <div className="text-xl font-bold">
                  Pilih jenis bilangan yang tepat:
                </div>
                <div className="flex justify-center gap-6">
                  <Button
                    variant={selectedType === "odd" ? "default" : "outline"}
                    className={`px-8 py-6 text-xl font-bold rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedType === "odd"
                        ? "bg-orange-500 text-white border-orange-600 shadow-lg"
                        : "bg-white text-orange-600 border-orange-300 hover:border-orange-500"
                    }`}
                    onClick={() => handleTypeSelect("odd")}
                  >
                    Ganjil
                  </Button>
                  <Button
                    variant={selectedType === "even" ? "default" : "outline"}
                    className={`px-8 py-6 text-xl font-bold rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedType === "even"
                        ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                        : "bg-white text-blue-600 border-blue-300 hover:border-blue-500"
                    }`}
                    onClick={() => handleTypeSelect("even")}
                  >
                    Genap
                  </Button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAnswer}
                  disabled={!selectedType}
                  className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
                >
                  Periksa Jawaban! ✓
                </Button>
              </div>
            )}

            {showResult && (
              <div className="space-y-6 animate-fade-in">
                <div
                  className={`text-6xl mb-4 ${
                    isCorrect ? "animate-bounce" : "animate-shake"
                  }`}
                >
                  {isCorrect ? "🎉" : "😅"}
                </div>
                <div
                  className={`text-3xl font-bold ${
                    isCorrect ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isCorrect
                    ? "Benar! Kamu hebat!"
                    : "Hampir benar! Coba lagi yuk!"}
                </div>
                {isCorrect ? (
                  <div className="space-y-4">
                    <div className="text-xl text-gray-600">
                      {exercise.shapes[0].count} adalah bilangan{" "}
                      {exercise.correctType === "odd" ? "ganjil" : "genap"}!
                    </div>
                    <Button
                      size="lg"
                      onClick={handleNext}
                      disabled={isUpdatingProgress}
                      className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {isUpdatingProgress
                        ? "Menyimpan..."
                        : currentOddEvenExercise < oddEvenExercises.length - 1
                        ? "Soal Berikutnya!"
                        : "Selesai!"}{" "}
                      {!isUpdatingProgress && <ArrowRight className="ml-2" />}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleRetry}
                    className="px-6 py-3 text-lg rounded-full"
                  >
                    Coba Lagi! 🔄
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const CongratulationStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center space-y-8">
        <div className="text-8xl mb-8 animate-bounce">🎉</div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Selamat!
          </h1>
          <p className="text-2xl text-gray-600">
            Kamu telah menyelesaikan pelajaran tentang bilangan ganjil, genap,
            dan urutan!
          </p>
        </div>

        <Card className="p-8 border-4 border-green-200 bg-gradient-to-br from-white to-green-50">
          <div className="space-y-6">
            <div className="text-6xl">🏆</div>
            <h2 className="text-3xl font-bold text-green-600">
              Pencapaian Kamu
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-blue-200">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-bold text-lg">Ahli Urutan</div>
                  <div className="text-gray-600">Menguasai urutan bilangan</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-purple-200">
                <Trophy className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="font-bold text-lg">Master Ganjil Genap</div>
                  <div className="text-gray-600">
                    Bisa membedakan ganjil dan genap
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
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
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "intro":
        return <IntroStep />;
      case "ordinal":
        return <OrdinalStep />;
      case "oddeven":
        return <OddEvenStep />;
      case "congratulation":
        return <CongratulationStep />;
      default:
        return <IntroStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="py-8">{renderCurrentStep()}</div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}
