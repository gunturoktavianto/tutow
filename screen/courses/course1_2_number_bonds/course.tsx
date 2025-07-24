"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Star, Trophy, Plus } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";
import { useSession } from "next-auth/react";

interface NumberBondExercise {
  id: number;
  type: "number-bond" | "dice-addition" | "simple-addition" | "addition-table";
  targetSum?: number;
  leftNumber?: number;
  rightNumber?: number;
  diceLeft?: number;
  diceRight?: number;
  additionPairs?: Array<{ a: number; b: number; sum: number }>;
  tableData?: {
    headers: number[];
    rows: Array<{ base: number; answers: number[] }>;
  };
}

const numberBondExercises: NumberBondExercise[] = [
  // Number Bond exercises (from first image)
  { id: 1, type: "number-bond", targetSum: 9, leftNumber: 2, rightNumber: 7 },
  { id: 2, type: "number-bond", targetSum: 10, leftNumber: 5, rightNumber: 5 },
  { id: 3, type: "number-bond", targetSum: 5, leftNumber: 0, rightNumber: 5 },
  { id: 4, type: "number-bond", targetSum: 10, leftNumber: 2, rightNumber: 8 },
  { id: 5, type: "number-bond", targetSum: 5, leftNumber: 3, rightNumber: 2 },
  { id: 6, type: "number-bond", targetSum: 8, leftNumber: 3, rightNumber: 5 },

  // Dice addition exercises (from second image)
  { id: 7, type: "dice-addition", diceLeft: 6, diceRight: 3 },
  { id: 8, type: "dice-addition", diceLeft: 5, diceRight: 4 },
  { id: 9, type: "dice-addition", diceLeft: 4, diceRight: 6 },
  { id: 10, type: "dice-addition", diceLeft: 9, diceRight: 1 },

  // Simple addition exercises (from third image)
  {
    id: 11,
    type: "simple-addition",
    additionPairs: [
      { a: 6, b: 4, sum: 10 },
      { a: 5, b: 6, sum: 11 },
      { a: 7, b: 6, sum: 13 },
      { a: 9, b: 9, sum: 18 },
      { a: 2, b: 8, sum: 10 },
      { a: 7, b: 7, sum: 14 },
    ],
  },

  // Addition table exercises (from fourth image)
  {
    id: 12,
    type: "addition-table",
    tableData: {
      headers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rows: [
        { base: 1, answers: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { base: 3, answers: [4, 5, 6, 7, 8, 9, 10, 11, 12] },
        { base: 5, answers: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
      ],
    },
  },
];

export function Course1_2_NumberBonds({ courseId }: CourseComponentProps) {
  console.log("Course1_2_NumberBonds loaded with courseId:", courseId);

  const { update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState<
    "intro" | "exercise" | "congratulation"
  >("intro");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<{
    [key: string]: "correct" | "incorrect" | "unanswered";
  }>({});

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
      const totalQuestions = numberBondExercises.length;
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

  const currentExercise = numberBondExercises[currentExerciseIndex];

  const handleInputChange = (key: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear the status for this field when user starts typing again
    if (answerStatus[key]) {
      setAnswerStatus((prev) => ({
        ...prev,
        [key]: "unanswered",
      }));
    }
  };

  const getInputClassName = (key: string, baseClassName: string) => {
    const status = answerStatus[key];
    let statusClass = "";

    if (status === "correct") {
      statusClass = "border-green-500 bg-green-50 text-green-800";
    } else if (status === "incorrect") {
      statusClass = "border-red-500 bg-red-50 text-red-800";
    }

    return `${baseClassName} ${statusClass}`;
  };

  const checkAnswer = () => {
    let isCorrect = false;
    const exercise = currentExercise;
    const newAnswerStatus: {
      [key: string]: "correct" | "incorrect" | "unanswered";
    } = {};

    switch (exercise.type) {
      case "number-bond":
        const bondAnswer = parseInt(userAnswers["bond"] || "");
        isCorrect = bondAnswer === exercise.targetSum;
        newAnswerStatus["bond"] = isCorrect ? "correct" : "incorrect";
        break;

      case "dice-addition":
        const diceAnswer = parseInt(userAnswers["dice"] || "");
        isCorrect = diceAnswer === exercise.diceLeft! + exercise.diceRight!;
        newAnswerStatus["dice"] = isCorrect ? "correct" : "incorrect";
        break;

      case "simple-addition":
        let allCorrect = true;
        exercise.additionPairs!.forEach((pair, index) => {
          const userAnswer = parseInt(userAnswers[`addition_${index}`] || "");
          const isAnswerCorrect = userAnswer === pair.sum;
          newAnswerStatus[`addition_${index}`] = isAnswerCorrect
            ? "correct"
            : "incorrect";
          if (!isAnswerCorrect) allCorrect = false;
        });
        isCorrect = allCorrect;
        break;

      case "addition-table":
        let allTableCorrect = true;
        exercise.tableData!.rows.forEach((row, rowIndex) => {
          row.answers.forEach((answer, colIndex) => {
            const userAnswer = parseInt(
              userAnswers[`table_${rowIndex}_${colIndex}`] || ""
            );
            const isAnswerCorrect = userAnswer === answer;
            newAnswerStatus[`table_${rowIndex}_${colIndex}`] = isAnswerCorrect
              ? "correct"
              : "incorrect";
            if (!isAnswerCorrect) allTableCorrect = false;
          });
        });
        isCorrect = allTableCorrect;
        break;
    }

    setAnswerStatus(newAnswerStatus);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        if (currentExerciseIndex < numberBondExercises.length - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setUserAnswers({});
          setAnswerStatus({});
        } else {
          setCurrentStep("congratulation");
        }
      }
      // Don't reset answers on wrong answer - keep user's input and status so they can correct it
    }, 2000);
  };

  const autoSolve = () => {
    if (!isDevelopment) return;

    const exercise = currentExercise;
    const newAnswers: { [key: string]: string } = {};

    switch (exercise.type) {
      case "number-bond":
        newAnswers["bond"] = exercise.targetSum!.toString();
        break;

      case "dice-addition":
        newAnswers["dice"] = (
          exercise.diceLeft! + exercise.diceRight!
        ).toString();
        break;

      case "simple-addition":
        exercise.additionPairs!.forEach((pair, index) => {
          newAnswers[`addition_${index}`] = pair.sum.toString();
        });
        break;

      case "addition-table":
        exercise.tableData!.rows.forEach((row, rowIndex) => {
          row.answers.forEach((answer, colIndex) => {
            newAnswers[`table_${rowIndex}_${colIndex}`] = answer.toString();
          });
        });
        break;
    }

    setUserAnswers(newAnswers);
  };

  const renderDice = (number: number) => {
    const dots = [];
    const dotPositions = {
      1: [[50, 50]],
      2: [
        [25, 25],
        [75, 75],
      ],
      3: [
        [25, 25],
        [50, 50],
        [75, 75],
      ],
      4: [
        [25, 25],
        [75, 25],
        [25, 75],
        [75, 75],
      ],
      5: [
        [25, 25],
        [75, 25],
        [50, 50],
        [25, 75],
        [75, 75],
      ],
      6: [
        [25, 25],
        [75, 25],
        [25, 50],
        [75, 50],
        [25, 75],
        [75, 75],
      ],
      7: [
        [20, 20],
        [50, 20],
        [80, 20],
        [20, 50],
        [50, 50],
        [80, 50],
        [50, 80],
      ],
      8: [
        [20, 20],
        [50, 20],
        [80, 20],
        [20, 50],
        [80, 50],
        [20, 80],
        [50, 80],
        [80, 80],
      ],
      9: [
        [20, 20],
        [50, 20],
        [80, 20],
        [20, 50],
        [50, 50],
        [80, 50],
        [20, 80],
        [50, 80],
        [80, 80],
      ],
    };

    const positions = dotPositions[number as keyof typeof dotPositions] || [];

    return (
      <div className="w-20 h-20 bg-white border-2 border-gray-400 rounded-lg relative shadow-md">
        {positions.map(([x, y], index) => (
          <div
            key={index}
            className="absolute w-3 h-3 bg-red-500 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    );
  };

  const IntroStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Ikatan Bilangan & Penjumlahan Dasar
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Mari belajar tentang ikatan bilangan dan penjumlahan! Kita akan
          belajar bagaimana angka-angka bisa digabungkan untuk membuat jumlah
          tertentu.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Apa yang akan kita pelajari?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ikatan Bilangan
            </h3>
            <p className="text-gray-600">
              Belajar bagaimana dua angka bisa digabungkan untuk membuat angka
              yang lebih besar
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">=</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Penjumlahan Dasar
            </h3>
            <p className="text-gray-600">
              Menghitung hasil penjumlahan dengan berbagai cara yang
              menyenangkan
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Contoh:</h4>
          <p className="text-gray-700">
            <strong>3 + 5 = 8</strong>
            <br />
            Angka 3 dan 5 adalah "teman" yang membentuk angka 8!
          </p>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
          onClick={() => setCurrentStep("exercise")}
        >
          Mulai Belajar! 🚀
        </Button>
      </div>
    </div>
  );

  const ExerciseStep = () => {
    const exercise = currentExercise;

    const renderNumberBondExercise = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Lengkapi Ikatan Bilangan
        </h3>

        <div className="flex justify-center items-center mb-8">
          <div className="relative">
            {/* Top circle (sum) */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <Input
                type="number"
                value={userAnswers["bond"] || ""}
                onChange={(e) => handleInputChange("bond", e.target.value)}
                className={getInputClassName(
                  "bond",
                  "w-16 h-16 text-2xl font-bold text-center rounded-full border-4 border-yellow-400 bg-yellow-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
                placeholder="?"
                disabled={showFeedback}
              />
            </div>

            {/* Bottom circles (addends) */}
            <div className="flex gap-8 items-center">
              <div className="w-16 h-16 bg-blue-100 border-4 border-blue-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-800">
                  {exercise.leftNumber}
                </span>
              </div>
              <div className="w-16 h-16 bg-green-100 border-4 border-green-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-800">
                  {exercise.rightNumber}
                </span>
              </div>
            </div>

            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ top: "-32px" }}
            >
              <line
                x1="50%"
                y1="32"
                x2="25%"
                y2="80"
                stroke="#666"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="32"
                x2="75%"
                y2="80"
                stroke="#666"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Berapa hasil penjumlahan {exercise.leftNumber} +{" "}
          {exercise.rightNumber}?
        </p>
      </div>
    );

    const renderDiceAdditionExercise = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Hitung Titik pada Dadu
        </h3>

        <div className="flex justify-center items-center gap-8 mb-8">
          {renderDice(exercise.diceLeft!)}
          <Plus className="w-8 h-8 text-gray-600" />
          {renderDice(exercise.diceRight!)}
          <span className="text-3xl font-bold text-gray-600">=</span>
          <Input
            type="number"
            value={userAnswers["dice"] || ""}
            onChange={(e) => handleInputChange("dice", e.target.value)}
            className={getInputClassName(
              "dice",
              "w-20 h-20 text-3xl font-bold text-center border-4 border-purple-400 bg-purple-50 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            placeholder="?"
            disabled={showFeedback}
          />
        </div>

        <p className="text-gray-600 mb-4">
          Hitung jumlah titik pada kedua dadu!
        </p>
      </div>
    );

    const renderSimpleAdditionExercise = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Hitung Penjumlahan Berikut
        </h3>

        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {exercise.additionPairs!.map((pair, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl font-bold">{pair.a}</span>
              <Plus className="w-6 h-6 text-gray-600" />
              <span className="text-2xl font-bold">{pair.b}</span>
              <span className="text-2xl font-bold">=</span>
              <Input
                type="number"
                value={userAnswers[`addition_${index}`] || ""}
                onChange={(e) =>
                  handleInputChange(`addition_${index}`, e.target.value)
                }
                className={getInputClassName(
                  `addition_${index}`,
                  "w-16 h-12 text-xl font-bold text-center border-2 border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
                placeholder="?"
                disabled={showFeedback}
              />
            </div>
          ))}
        </div>
      </div>
    );

    const renderAdditionTableExercise = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Lengkapi Tabel Penjumlahan
        </h3>

        <div className="max-w-4xl mx-auto">
          <table className="w-full border-collapse border-2 border-gray-400">
            <thead>
              <tr>
                <th className="border-2 border-gray-400 p-3 bg-yellow-200 text-xl font-bold">
                  +
                </th>
                {exercise.tableData!.headers.map((header) => (
                  <th
                    key={header}
                    className="border-2 border-gray-400 p-3 bg-yellow-200 text-xl font-bold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exercise.tableData!.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border-2 border-gray-400 p-3 bg-blue-200 text-xl font-bold">
                    {row.base}
                  </td>
                  {row.answers.map((answer, colIndex) => (
                    <td key={colIndex} className="border-2 border-gray-400 p-2">
                      <Input
                        type="number"
                        value={
                          userAnswers[`table_${rowIndex}_${colIndex}`] || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            `table_${rowIndex}_${colIndex}`,
                            e.target.value
                          )
                        }
                        className={getInputClassName(
                          `table_${rowIndex}_${colIndex}`,
                          "w-full h-12 text-lg font-bold text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        )}
                        placeholder="?"
                        disabled={showFeedback}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const renderExerciseContent = () => {
      switch (exercise.type) {
        case "number-bond":
          return renderNumberBondExercise();
        case "dice-addition":
          return renderDiceAdditionExercise();
        case "simple-addition":
          return renderSimpleAdditionExercise();
        case "addition-table":
          return renderAdditionTableExercise();
        default:
          return null;
      }
    };

    const getCorrectAnswer = () => {
      switch (exercise.type) {
        case "number-bond":
          return `${exercise.leftNumber} + ${exercise.rightNumber} = ${exercise.targetSum}`;
        case "dice-addition":
          return `${exercise.diceLeft} + ${exercise.diceRight} = ${
            exercise.diceLeft! + exercise.diceRight!
          }`;
        case "simple-addition":
          return "Periksa kembali perhitungan penjumlahan";
        case "addition-table":
          return "Periksa kembali tabel penjumlahan";
        default:
          return "";
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Soal {currentExerciseIndex + 1} dari {numberBondExercises.length}
          </h1>
          <p className="text-lg text-gray-600">
            Selesaikan soal berikut dengan teliti!
          </p>
        </div>

        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-8">
            {renderExerciseContent()}

            {showFeedback && (
              <div className="text-center mt-8">
                {score > currentExerciseIndex - (showFeedback ? 0 : 1) ? (
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
                    <p className="text-gray-600">{getCorrectAnswer()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center mt-8">
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
  };

  const CongratulationStep = () => {
    const percentage = Math.round((score / numberBondExercises.length) * 100);

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
              Kamu telah menyelesaikan pembelajaran tentang Ikatan Bilangan &
              Penjumlahan Dasar!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {score}/{numberBondExercises.length}
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
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  Ikatan Bilangan
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Penjumlahan Dasar
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Tabel Penjumlahan
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Penjumlahan Visual
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
            onClick={() =>
              (window.location.href = "/learning/1/math-operations")
            }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="py-8">{renderCurrentStep()}</div>

      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

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

        .animate-fade-in {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
