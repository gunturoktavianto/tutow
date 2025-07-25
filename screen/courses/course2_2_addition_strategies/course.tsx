"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Star, Trophy, Plus } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";
import { useSession } from "next-auth/react";

interface AdditionExercise {
  id: number;
  type: "simple-addition" | "three-addends" | "number-line" | "missing-addends";
  problems?: Array<{ a: number; b: number; sum: number }>;
  threeAddends?: Array<{ a: number; b: number; c: number; sum: number }>;
  numberLines?: Array<{
    start: number;
    jump1: number;
    jump2: number;
    result: number;
  }>;
  missingAddends?: Array<{
    a: number | null;
    b: number | null;
    sum: number;
    missing: "a" | "b";
  }>;
}

const additionExercises: AdditionExercise[] = [
  // Simple Addition up to 20 (from first image)
  {
    id: 1,
    type: "simple-addition",
    problems: [
      { a: 5, b: 5, sum: 10 },
      { a: 3, b: 8, sum: 11 },
      { a: 6, b: 10, sum: 16 },
      { a: 7, b: 11, sum: 18 },
      { a: 9, b: 5, sum: 14 },
      { a: 8, b: 5, sum: 13 },
      { a: 7, b: 8, sum: 15 },
      { a: 3, b: 15, sum: 18 },
    ],
  },

  // Three Addends (from second image)
  {
    id: 2,
    type: "three-addends",
    threeAddends: [
      { a: 5, b: 4, c: 3, sum: 12 },
      { a: 2, b: 5, c: 3, sum: 10 },
      { a: 5, b: 5, c: 5, sum: 15 },
      { a: 4, b: 7, c: 0, sum: 11 },
      { a: 8, b: 2, c: 4, sum: 14 },
      { a: 3, b: 9, c: 1, sum: 13 },
      { a: 6, b: 2, c: 4, sum: 12 },
      { a: 3, b: 6, c: 6, sum: 15 },
    ],
  },

  // Number Lines (from third image)
  {
    id: 3,
    type: "number-line",
    numberLines: [
      { start: 0, jump1: 3, jump2: 2, result: 5 },
      { start: 0, jump1: 1, jump2: 4, result: 5 },
      { start: 0, jump1: 3, jump2: 1, result: 5 },
      { start: 0, jump1: 2, jump2: 1, result: 3 },
      { start: 0, jump1: 2, jump2: 2, result: 4 },
      { start: 0, jump1: 4, jump2: 1, result: 5 },
    ],
  },

  // Missing Addends (from fourth image)
  {
    id: 4,
    type: "missing-addends",
    missingAddends: [
      { a: 7, b: null, sum: 15, missing: "b" },
      { a: null, b: 3, sum: 9, missing: "a" },
      { a: 2, b: null, sum: 10, missing: "b" },
      { a: null, b: 3, sum: 6, missing: "a" },
      { a: 7, b: null, sum: 12, missing: "b" },
      { a: null, b: 2, sum: 6, missing: "a" },
      { a: 8, b: null, sum: 16, missing: "b" },
      { a: null, b: 6, sum: 7, missing: "a" },
    ],
  },
];

export function Course1_2_AdditionStrategies({
  courseId,
}: CourseComponentProps) {
  console.log("Course1_2_AdditionStrategies loaded with courseId:", courseId);

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
      const totalQuestions = additionExercises.length;
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

  const currentExercise = additionExercises[currentExerciseIndex];

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
      case "simple-addition":
        let allAdditionCorrect = true;
        exercise.problems!.forEach((problem, index) => {
          const userAnswer = parseInt(userAnswers[`addition_${index}`] || "");
          const isAnswerCorrect = userAnswer === problem.sum;
          newAnswerStatus[`addition_${index}`] = isAnswerCorrect
            ? "correct"
            : "incorrect";
          if (!isAnswerCorrect) allAdditionCorrect = false;
        });
        isCorrect = allAdditionCorrect;
        break;

      case "three-addends":
        let allThreeCorrect = true;
        exercise.threeAddends!.forEach((problem, index) => {
          const userAnswer = parseInt(userAnswers[`three_${index}`] || "");
          const isAnswerCorrect = userAnswer === problem.sum;
          newAnswerStatus[`three_${index}`] = isAnswerCorrect
            ? "correct"
            : "incorrect";
          if (!isAnswerCorrect) allThreeCorrect = false;
        });
        isCorrect = allThreeCorrect;
        break;

      case "number-line":
        let allLineCorrect = true;
        exercise.numberLines!.forEach((problem, index) => {
          const userAnswer1 = parseInt(userAnswers[`line_${index}_1`] || "");
          const userAnswer2 = parseInt(userAnswers[`line_${index}_2`] || "");
          const userResult = parseInt(
            userAnswers[`line_${index}_result`] || ""
          );

          const isAnswer1Correct = userAnswer1 === problem.jump1;
          const isAnswer2Correct = userAnswer2 === problem.jump2;
          const isResultCorrect = userResult === problem.result;

          newAnswerStatus[`line_${index}_1`] = isAnswer1Correct
            ? "correct"
            : "incorrect";
          newAnswerStatus[`line_${index}_2`] = isAnswer2Correct
            ? "correct"
            : "incorrect";
          newAnswerStatus[`line_${index}_result`] = isResultCorrect
            ? "correct"
            : "incorrect";

          if (!isAnswer1Correct || !isAnswer2Correct || !isResultCorrect) {
            allLineCorrect = false;
          }
        });
        isCorrect = allLineCorrect;
        break;

      case "missing-addends":
        let allMissingCorrect = true;
        exercise.missingAddends!.forEach((problem, index) => {
          const userAnswer = parseInt(userAnswers[`missing_${index}`] || "");
          const correctAnswer =
            problem.missing === "a"
              ? problem.sum - problem.b!
              : problem.sum - problem.a!;
          const isAnswerCorrect = userAnswer === correctAnswer;
          newAnswerStatus[`missing_${index}`] = isAnswerCorrect
            ? "correct"
            : "incorrect";
          if (!isAnswerCorrect) allMissingCorrect = false;
        });
        isCorrect = allMissingCorrect;
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
        if (currentExerciseIndex < additionExercises.length - 1) {
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
      case "simple-addition":
        exercise.problems!.forEach((problem, index) => {
          newAnswers[`addition_${index}`] = problem.sum.toString();
        });
        break;

      case "three-addends":
        exercise.threeAddends!.forEach((problem, index) => {
          newAnswers[`three_${index}`] = problem.sum.toString();
        });
        break;

      case "number-line":
        exercise.numberLines!.forEach((problem, index) => {
          newAnswers[`line_${index}_1`] = problem.jump1.toString();
          newAnswers[`line_${index}_2`] = problem.jump2.toString();
          newAnswers[`line_${index}_result`] = problem.result.toString();
        });
        break;

      case "missing-addends":
        exercise.missingAddends!.forEach((problem, index) => {
          const correctAnswer =
            problem.missing === "a"
              ? problem.sum - problem.b!
              : problem.sum - problem.a!;
          newAnswers[`missing_${index}`] = correctAnswer.toString();
        });
        break;
    }

    setUserAnswers(newAnswers);
  };

  const renderNumberLine = (problem: any, index: number) => {
    const maxNumber = 5;
    const numbers = Array.from({ length: maxNumber + 1 }, (_, i) => i);
    const spacing = 60; // spacing between numbers
    const lineWidth = spacing * maxNumber; // total line width
    const circleRadius = 8; // radius for number points

    return (
      <div
        key={index}
        className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4"
      >
        <div className="flex items-center justify-center mb-8">
          {/* Number line container */}
          <div
            className="relative"
            style={{ width: `${lineWidth + 40}px`, height: "80px" }}
          >
            {/* Main horizontal line */}
            <div
              className="absolute bg-gray-800"
              style={{
                left: "20px",
                top: "40px",
                width: `${lineWidth}px`,
                height: "3px",
              }}
            ></div>

            {/* Number points and labels */}
            {numbers.map((num) => (
              <div
                key={num}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${20 + num * spacing - circleRadius}px`,
                  top: "32px",
                }}
              >
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <span className="text-lg font-bold mt-2">{num}</span>
              </div>
            ))}

            {/* Jump arcs */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              style={{ overflow: "visible" }}
            >
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                </marker>
              </defs>

              {/* First jump arc (blue) */}
              <path
                d={`M ${20 + problem.start * spacing} 40 Q ${
                  20 + (problem.start + problem.jump1 / 2) * spacing
                } 15 ${20 + (problem.start + problem.jump1) * spacing} 40`}
                stroke="#3B82F6"
                strokeWidth="3"
                fill="none"
                markerEnd={`url(#arrowhead-${index})`}
              />

              {/* Second jump arc (green) */}
              <path
                d={`M ${20 + (problem.start + problem.jump1) * spacing} 40 Q ${
                  20 +
                  (problem.start + problem.jump1 + problem.jump2 / 2) * spacing
                } 15 ${
                  20 + (problem.start + problem.jump1 + problem.jump2) * spacing
                } 40`}
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                markerEnd={`url(#arrowhead-${index})`}
              />

              {/* Jump labels */}
              <text
                x={20 + (problem.start + problem.jump1 / 2) * spacing}
                y="10"
                textAnchor="middle"
                className="fill-blue-600 text-sm font-bold"
              >
                +{problem.jump1}
              </text>
              <text
                x={
                  20 +
                  (problem.start + problem.jump1 + problem.jump2 / 2) * spacing
                }
                y="10"
                textAnchor="middle"
                className="fill-green-600 text-sm font-bold"
              >
                +{problem.jump2}
              </text>
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 text-lg">
          <Input
            type="number"
            value={userAnswers[`line_${index}_1`] || ""}
            onChange={(e) =>
              handleInputChange(`line_${index}_1`, e.target.value)
            }
            className={getInputClassName(
              `line_${index}_1`,
              "w-14 h-12 text-center font-bold border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            placeholder="?"
            disabled={showFeedback}
          />
          <span className="font-bold text-xl">+</span>
          <Input
            type="number"
            value={userAnswers[`line_${index}_2`] || ""}
            onChange={(e) =>
              handleInputChange(`line_${index}_2`, e.target.value)
            }
            className={getInputClassName(
              `line_${index}_2`,
              "w-14 h-12 text-center font-bold border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            placeholder="?"
            disabled={showFeedback}
          />
          <span className="font-bold text-xl">=</span>
          <Input
            type="number"
            value={userAnswers[`line_${index}_result`] || ""}
            onChange={(e) =>
              handleInputChange(`line_${index}_result`, e.target.value)
            }
            className={getInputClassName(
              `line_${index}_result`,
              "w-14 h-12 text-center font-bold border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
            placeholder="?"
            disabled={showFeedback}
          />
        </div>
      </div>
    );
  };

  const IntroStep = () => (
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Strategi Penjumlahan Lanjutan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Mari belajar berbagai strategi penjumlahan yang lebih canggih! Kita
          akan belajar penjumlahan hingga 20, tiga angka sekaligus, menggunakan
          garis bilangan, dan mencari angka yang hilang.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Strategi yang akan kita pelajari:
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Penjumlahan hingga 20
            </h3>
            <p className="text-gray-600">
              Menyelesaikan soal penjumlahan dengan hasil hingga 20
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Tiga Penjumlah
            </h3>
            <p className="text-gray-600">
              Menjumlahkan tiga angka sekaligus dengan mudah
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">→</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Garis Bilangan
            </h3>
            <p className="text-gray-600">
              Menggunakan garis bilangan untuk memahami penjumlahan
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">?</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Penjumlah yang Hilang
            </h3>
            <p className="text-gray-600">
              Mencari angka yang hilang dalam persamaan penjumlahan
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all"
          onClick={() => setCurrentStep("exercise")}
        >
          Mulai Belajar! 🚀
        </Button>
      </div>
    </div>
  );

  const ExerciseStep = () => {
    const exercise = currentExercise;

    const renderSimpleAddition = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Penjumlahan hingga 20
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {exercise.problems!.map((problem, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border-2 border-gray-200"
            >
              <div className="text-center space-y-1">
                {/* First number - right aligned */}
                <div className="text-right text-2xl font-bold font-mono w-20 mx-auto">
                  {problem.a}
                </div>
                {/* Plus sign and second number - right aligned */}
                <div className="flex items-center justify-end w-20 mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-2xl font-bold font-mono">
                    {problem.b}
                  </span>
                </div>
                {/* Line separator */}
                <div className="border-t-2 border-gray-400 w-20 mx-auto"></div>
                {/* Answer input - right aligned */}
                <div className="flex justify-end w-20 mx-auto pt-1">
                  <Input
                    type="number"
                    value={userAnswers[`addition_${index}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`addition_${index}`, e.target.value)
                    }
                    className={getInputClassName(
                      `addition_${index}`,
                      "w-16 h-12 text-xl font-bold text-right font-mono border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    placeholder="?"
                    disabled={showFeedback}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderThreeAddends = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Hitung Jumlah dari Tiga Angka
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {exercise.threeAddends!.map((problem, index) => (
            <div
              key={index}
              className="bg-white p-6 pt-20 rounded-lg border-2 border-gray-200"
            >
              <div className="relative flex justify-center items-center">
                {/* Top circle (sum) */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
                  <Input
                    type="number"
                    value={userAnswers[`three_${index}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`three_${index}`, e.target.value)
                    }
                    className={getInputClassName(
                      `three_${index}`,
                      "w-16 h-16 text-xl font-bold text-center rounded-full border-4 border-yellow-400 bg-yellow-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    placeholder="?"
                    disabled={showFeedback}
                  />
                </div>

                {/* Bottom circles (addends) */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-100 border-2 border-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-800">
                      {problem.a}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-green-800">
                      {problem.b}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 border-2 border-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-800">
                      {problem.c}
                    </span>
                  </div>
                </div>

                {/* Connecting lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ top: "-64px" }}
                >
                  <line
                    x1="50%"
                    y1="64"
                    x2="25%"
                    y2="112"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  <line
                    x1="50%"
                    y1="64"
                    x2="50%"
                    y2="112"
                    stroke="#666"
                    strokeWidth="2"
                  />
                  <line
                    x1="50%"
                    y1="64"
                    x2="75%"
                    y2="112"
                    stroke="#666"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderNumberLines = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Gunakan Garis Bilangan untuk Menjumlah
        </h3>
        <p className="text-gray-600 mb-6">
          Lihat garis bilangan dan lengkapi persamaan penjumlahan!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {exercise.numberLines!.map((problem, index) =>
            renderNumberLine(problem, index)
          )}
        </div>
      </div>
    );

    const renderMissingAddends = () => (
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">
          Isi Penjumlah yang Hilang
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {exercise.missingAddends!.map((problem, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border-2 border-gray-200"
            >
              <div className="flex items-center justify-center gap-4 text-2xl font-bold">
                {problem.missing === "a" ? (
                  <Input
                    type="number"
                    value={userAnswers[`missing_${index}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`missing_${index}`, e.target.value)
                    }
                    className={getInputClassName(
                      `missing_${index}`,
                      "w-16 h-16 text-2xl font-bold text-center border-4 border-yellow-400 bg-yellow-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    placeholder="?"
                    disabled={showFeedback}
                  />
                ) : (
                  <span className="w-16 h-16 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center">
                    {problem.a}
                  </span>
                )}
                <Plus className="w-6 h-6 text-gray-600" />
                {problem.missing === "b" ? (
                  <Input
                    type="number"
                    value={userAnswers[`missing_${index}`] || ""}
                    onChange={(e) =>
                      handleInputChange(`missing_${index}`, e.target.value)
                    }
                    className={getInputClassName(
                      `missing_${index}`,
                      "w-16 h-16 text-2xl font-bold text-center border-4 border-yellow-400 bg-yellow-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    placeholder="?"
                    disabled={showFeedback}
                  />
                ) : (
                  <span className="w-16 h-16 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center">
                    {problem.b}
                  </span>
                )}
                <span className="text-gray-600">=</span>
                <span className="w-16 h-16 bg-purple-100 border-2 border-purple-400 rounded-lg flex items-center justify-center">
                  {problem.sum}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderExerciseContent = () => {
      switch (exercise.type) {
        case "simple-addition":
          return renderSimpleAddition();
        case "three-addends":
          return renderThreeAddends();
        case "number-line":
          return renderNumberLines();
        case "missing-addends":
          return renderMissingAddends();
        default:
          return null;
      }
    };

    const getExerciseTitle = () => {
      switch (exercise.type) {
        case "simple-addition":
          return "Penjumlahan hingga 20";
        case "three-addends":
          return "Menjumlah Tiga Angka";
        case "number-line":
          return "Garis Bilangan";
        case "missing-addends":
          return "Penjumlah yang Hilang";
        default:
          return "Latihan";
      }
    };

    const getCorrectAnswer = () => {
      switch (exercise.type) {
        case "simple-addition":
          return "Periksa kembali perhitungan penjumlahan";
        case "three-addends":
          return "Jumlahkan ketiga angka dengan teliti";
        case "number-line":
          return "Perhatikan lompatan pada garis bilangan";
        case "missing-addends":
          return "Gunakan pengurangan untuk mencari angka yang hilang";
        default:
          return "";
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getExerciseTitle()} - Soal {currentExerciseIndex + 1} dari{" "}
            {additionExercises.length}
          </h1>
          <p className="text-lg text-gray-600">
            Selesaikan semua soal dengan teliti!
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
                  className="px-8 py-3 text-lg rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
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
    const percentage = Math.round((score / additionExercises.length) * 100);

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
              Kamu telah menyelesaikan pembelajaran tentang Strategi Penjumlahan
              Lanjutan!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {score}/{additionExercises.length}
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
                Strategi yang sudah kamu kuasai:
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Penjumlahan hingga 20
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                  Tiga Penjumlah
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Garis Bilangan
                </span>
                <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Penjumlah yang Hilang
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
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
