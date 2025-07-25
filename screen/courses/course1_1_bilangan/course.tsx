"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Star,
  Trophy,
  Bot,
} from "lucide-react";

interface CountingExercise {
  id: number;
  objects: {
    type: string;
    color: string;
    count: number;
  };
  correctNumber: number;
  correctWord: string;
}

interface NumberGridCell {
  value: number | null;
  isEditable: boolean;
}

const countingExercises: CountingExercise[] = [
  {
    id: 1,
    objects: { type: "star", color: "#FFD700", count: 3 },
    correctNumber: 3,
    correctWord: "tiga",
  },
  {
    id: 2,
    objects: { type: "circle", color: "#FF69B4", count: 5 },
    correctNumber: 5,
    correctWord: "lima",
  },
  {
    id: 3,
    objects: { type: "square", color: "#32CD32", count: 7 },
    correctNumber: 7,
    correctWord: "tujuh",
  },
  {
    id: 4,
    objects: { type: "triangle", color: "#1E90FF", count: 4 },
    correctNumber: 4,
    correctWord: "empat",
  },
  {
    id: 5,
    objects: { type: "hexagon", color: "#9932CC", count: 6 },
    correctNumber: 6,
    correctWord: "enam",
  },
];

// Add word options for multiple choice
const numberWords = [
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
];

// Create a seeded random function for consistent results
const seededRandom = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getWordOptions = (correctWord: string, seed: number) => {
  const options = [correctWord];
  const otherWords = numberWords.filter((word) => word !== correctWord);

  // Use seeded random for consistent results
  const shuffledWords = [...otherWords];
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }

  // Add 3 wrong options
  for (let i = 0; i < 3 && i < shuffledWords.length; i++) {
    options.push(shuffledWords[i]);
  }

  // Shuffle the final options using seeded random
  const finalOptions = [...options];
  for (let i = finalOptions.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed * 2 + i) * (i + 1));
    [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
  }

  return finalOptions;
};

const ObjectRenderer = ({
  type,
  color,
  size = 50,
  animate = false,
}: {
  type: string;
  color: string;
  size?: number;
  animate?: boolean;
}) => {
  const style = {
    width: size,
    height: size,
    color,
    fill: color,
    transition: "all 0.3s ease",
    transform: animate ? "scale(1.1)" : "scale(1)",
  };

  const shapes = {
    star: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-pulse" : ""}
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
        />
      </svg>
    ),
    circle: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-bounce" : ""}
      >
        <circle cx="12" cy="12" r="9" fill={color} />
      </svg>
    ),
    square: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-spin" : ""}
      >
        <rect x="3" y="3" width="18" height="18" fill={color} />
      </svg>
    ),
    triangle: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-ping" : ""}
      >
        <path d="M12 2l10 18H2L12 2z" fill={color} />
      </svg>
    ),
    hexagon: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-pulse" : ""}
      >
        <path d="M17.5 3.5L22 12l-4.5 8.5h-11L2 12l4.5-8.5h11z" fill={color} />
      </svg>
    ),
  };

  return shapes[type as keyof typeof shapes] || shapes.circle;
};

// Fix: Use a single stable onChange handler for all grid inputs, passing num via data attribute
const GridInput = ({
  num,
  value,
  onChange,
}: {
  num: number;
  value: string;
  onChange: (num: number, value: string) => void;
}) => (
  <Input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    className="w-full h-full text-center border-none bg-transparent text-lg font-bold [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
    value={value}
    onChange={(e) => {
      const v = e.target.value.replace(/[^0-9]/g, "");
      onChange(num, v);
    }}
    placeholder="?"
    maxLength={2}
  />
);

export function Course1_1_Bilangan({
  courseId,
  courseData,
  onExplainMaterial,
  onExplainProblem,
}: {
  courseId: string;
  courseData?: any;
  onExplainMaterial?: (material: string) => void;
  onExplainProblem?: (problem: string) => void;
}) {
  // Main flow states
  const [currentStep, setCurrentStep] = useState<
    "intro" | "counting" | "grid" | "congratulation"
  >("intro");

  // Counting exercise states
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showObjects, setShowObjects] = useState(false);
  const [animateObjects, setAnimateObjects] = useState(false);
  const [userAnswer, setUserAnswer] = useState({ number: "", word: "" });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // Grid states
  const [gridStep, setGridStep] = useState<"intro" | "learn" | "practice">(
    "intro"
  );
  const [currentGridRange, setCurrentGridRange] = useState<[number, number]>([
    1, 10,
  ]);
  const [gridAnswers, setGridAnswers] = useState<{ [key: string]: string }>({});
  const [showGridResult, setShowGridResult] = useState(false);
  const [gridIsCorrect, setGridIsCorrect] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState<{
    [key: string]: boolean;
  }>({});

  // Animation states
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);
  const [celebrationPositions, setCelebrationPositions] = useState<
    { left: string; top: string }[]
  >([]);

  // Generate stable celebration positions
  const generateCelebrationPositions = useCallback(() => {
    const positions = ["🎉", "⭐", "🎊", "👏", "✨"].map((_, index) => ({
      left: `${20 + index * 15}%`,
      top: `${10 + (index % 2) * 20}%`,
    }));
    setCelebrationPositions(positions);
  }, []);

  // Introduction Step
  const IntroStep = () => (
    <div className="max-w-4xl mx-auto text-center p-8">
      <div className="mb-8">
        <div className="text-8xl mb-6 animate-bounce">🔢</div>
        <h1 className="text-4xl font-bold mb-4 text-blue-600">
          Ayo Belajar Menghitung!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Kita akan belajar menghitung benda dan menulis angka dengan cara yang
          seru!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-200 transform hover:scale-105 transition-all">
          <div className="text-6xl mb-4">👆</div>
          <h3 className="text-xl font-bold mb-2">Menghitung Benda</h3>
          <p className="text-gray-600">
            Hitung benda-benda lucu dan tulis angkanya!
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-100 to-yellow-100 border-2 border-green-200 transform hover:scale-105 transition-all">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">Menulis Angka</h3>
          <p className="text-gray-600">Lengkapi tabel angka 1 sampai 100!</p>
        </Card>
      </div>

      <Button
        size="lg"
        className="px-12 py-6 text-xl rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
        onClick={() => {
          setCurrentStep("counting");
          setTimeout(() => setShowObjects(true), 500);
        }}
      >
        Mulai Petualangan! 🚀
      </Button>
    </div>
  );

  // Counting Exercise Step
  const CountingStep = () => {
    const exercise = countingExercises[currentExercise];

    // Memoize word options with stable seed
    const wordOptions = useMemo(() => {
      return getWordOptions(exercise.correctWord, currentExercise);
    }, [currentExercise, exercise.correctWord]);

    // Memoize renderObjects function
    const renderedObjects = useMemo(() => {
      const objects = [];
      for (let i = 0; i < exercise.objects.count; i++) {
        objects.push(
          <div
            key={`${currentExercise}-object-${i}`}
            className="inline-block m-2"
            style={{
              animationDelay: `${i * 0.2}s`,
              opacity: showObjects ? 1 : 0,
              transform: showObjects ? "translateY(0)" : "translateY(-20px)",
              transition: "all 0.5s ease",
            }}
          >
            <ObjectRenderer
              type={exercise.objects.type}
              color={exercise.objects.color}
              size={60}
              animate={animateObjects}
            />
          </div>
        );
      }
      return objects;
    }, [exercise.objects, showObjects, animateObjects, currentExercise]);

    const handleAnswer = useCallback(() => {
      const numberCorrect =
        parseInt(userAnswer.number) === exercise.correctNumber;
      const wordCorrect =
        userAnswer.word.toLowerCase().trim() ===
        exercise.correctWord.toLowerCase();
      const correct = numberCorrect && wordCorrect;

      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        // Generate stable celebration positions
        generateCelebrationPositions();

        // Mark as completed
        setCompletedExercises((prev) => [...prev, currentExercise]);

        // Move to next exercise or grid step
        setTimeout(() => {
          // Clear emojis before transitioning
          setCelebrationEmojis([]);
          setCelebrationPositions([]);

          if (currentExercise < countingExercises.length - 1) {
            setCurrentExercise((prev) => prev + 1);
            setShowObjects(false);
            setShowResult(false);
            setUserAnswer({ number: "", word: "" });
            setTimeout(() => setShowObjects(true), 500);
          } else {
            setCurrentStep("grid");
          }
        }, 2000);
      }
    }, [userAnswer, exercise, currentExercise, generateCelebrationPositions]);

    const handleNumberChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAnswer((prev) => ({
          ...prev,
          number: e.target.value,
        }));
      },
      []
    );

    const handleWordSelect = useCallback((option: string) => {
      setUserAnswer((prev) => ({
        ...prev,
        word: option,
      }));
    }, []);

    const handleRetry = useCallback(() => {
      setShowResult(false);
      setUserAnswer({ number: "", word: "" });
    }, []);

    return (
      <div className="max-w-4xl mx-auto p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Menghitung Benda</h2>
            <div className="text-lg text-gray-600">
              {currentExercise + 1} dari {countingExercises.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentExercise + 1) / countingExercises.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <Card className="p-8 border-4 border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-6 text-blue-600">
              Hitung benda di bawah ini! 👇
            </h3>

            {/* Objects Display */}
            <div className="bg-white rounded-3xl p-8 border-4 border-dashed border-blue-300 mb-8 min-h-[200px] flex items-center justify-center">
              {showObjects ? (
                <div className="flex flex-wrap justify-center items-center">
                  {renderedObjects}
                </div>
              ) : (
                <div className="text-6xl animate-bounce">🔄</div>
              )}
            </div>

            {showObjects && !showResult && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-center items-center gap-4">
                  <div className="text-2xl">Ada</div>
                  <div className="w-20 h-20 border-4 border-dashed border-blue-400 rounded-full flex items-center justify-center bg-white">
                    <Input
                      key={`number-input-${currentExercise}`}
                      type="number"
                      className="w-12 h-12 text-center border-none text-2xl font-bold bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      value={userAnswer.number}
                      onChange={handleNumberChange}
                      placeholder="?"
                    />
                  </div>
                  <div className="text-2xl">benda</div>
                </div>

                <div className="space-y-4">
                  <div className="text-xl font-bold">
                    Pilih kata yang tepat:
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {wordOptions.map((option) => (
                      <Button
                        key={`${currentExercise}-${option}`}
                        variant={
                          userAnswer.word === option ? "default" : "outline"
                        }
                        className={`p-4 text-lg font-bold rounded-xl border-2 transition-all transform hover:scale-105 ${
                          userAnswer.word === option
                            ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                            : "bg-white text-blue-600 border-blue-300 hover:border-blue-500"
                        }`}
                        onClick={() => handleWordSelect(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={handleAnswer}
                    disabled={!userAnswer.number || !userAnswer.word}
                    className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
                  >
                    Periksa Jawaban! ✓
                  </Button>

                  {onExplainProblem && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        onExplainProblem(
                          `Bagaimana cara menghitung ${exercise.objects.count} benda ${exercise.objects.type} dan menulis angka serta kata bilangannya?`
                        )
                      }
                      className="px-6 py-4 text-lg rounded-full border-2 border-blue-300 hover:border-blue-500 transform hover:scale-105 transition-all"
                    >
                      <Bot className="w-5 h-5 mr-2" />
                      Minta Bantuan AI
                    </Button>
                  )}
                </div>
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
                  <div className="text-xl text-gray-600">
                    Ada {exercise.correctNumber} ({exercise.correctWord}) benda!
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

        {/* Celebration Emojis */}
        {celebrationEmojis.length > 0 && (
          <div className="fixed inset-0 pointer-events-none">
            {celebrationEmojis.map((emoji, index) => (
              <div
                key={`celebration-${index}`}
                className="absolute text-6xl animate-bounce"
                style={{
                  left: celebrationPositions[index]?.left || "50%",
                  top: celebrationPositions[index]?.top || "50%",
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "2s",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const GridStep = () => {
    // Stable handler for all inputs
    const handleGridInputChange = useCallback(
      (num: number, value: string) => {
        setGridAnswers((prev) => ({
          ...prev,
          [num]: value,
        }));
        // Clear checked state when user changes input
        if (showGridResult) {
          setCheckedAnswers((prev) => ({
            ...prev,
            [num]: false,
          }));
        }
      },
      [showGridResult]
    );

    // Check grid answers
    const checkGridAnswers = useCallback(() => {
      const emptyNumbers = [
        3, 4, 6, 7, 9, 12, 13, 14, 16, 17, 19, 22, 23, 24, 26, 27, 29,
      ];
      const newCheckedAnswers: { [key: string]: boolean } = {};
      let allCorrect = true;

      emptyNumbers.forEach((num) => {
        const userAnswer = gridAnswers[num];
        const isCorrect = userAnswer === num.toString();
        newCheckedAnswers[num] = isCorrect;
        if (!isCorrect) {
          allCorrect = false;
        }
      });

      setCheckedAnswers(newCheckedAnswers);
      setGridIsCorrect(allCorrect);
      setShowGridResult(true);

      if (allCorrect) {
        // Generate celebration
        generateCelebrationPositions();
        setCelebrationEmojis(["🎉", "⭐", "🎊", "👏", "✨"]);

        // Auto-proceed to congratulation after delay
        setTimeout(() => {
          setCelebrationEmojis([]);
          setCelebrationPositions([]);
          setCurrentStep("congratulation");
        }, 2000);
      }
    }, [gridAnswers, generateCelebrationPositions]);

    // Check if user has filled all required answers
    const hasAllAnswers = useCallback(() => {
      const emptyNumbers = [
        3, 4, 6, 7, 9, 12, 13, 14, 16, 17, 19, 22, 23, 24, 26, 27, 29,
      ];
      return emptyNumbers.every(
        (num) => gridAnswers[num] && gridAnswers[num].trim() !== ""
      );
    }, [gridAnswers]);

    const handleRetryGrid = useCallback(() => {
      setShowGridResult(false);
      setCheckedAnswers({});
      // Don't clear answers, let user fix them
    }, []);

    if (gridStep === "intro") {
      return (
        <div className="max-w-4xl mx-auto text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">📊</div>
          <h2 className="text-4xl font-bold mb-4 text-green-600">
            Sekarang Belajar Angka 1-100!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Kita akan mengisi tabel angka dari 1 sampai 100. Seru banget!
          </p>

          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-8 p-4 bg-white rounded-2xl border-4 border-green-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, index) => (
              <div
                key={num}
                className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold rounded-lg flex items-center justify-center text-lg"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.5s ease forwards",
                }}
              >
                {num}
              </div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={() => setGridStep("practice")}
            className="px-12 py-6 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all"
          >
            Ayo Mulai! 🎯
          </Button>
        </div>
      );
    }

    // Define the grid layout once
    const gridLayout = useMemo(() => {
      return Array.from({ length: 30 }, (_, i) => {
        const num = i + 1;
        return {
          num,
          shouldShow: [1, 2, 5, 8, 10, 11, 15, 18, 20, 21, 25, 28, 30].includes(
            num
          ),
          isEmpty: [
            3, 4, 6, 7, 9, 12, 13, 14, 16, 17, 19, 22, 23, 24, 26, 27, 29,
          ].includes(num),
        };
      });
    }, []);

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-green-600">
            Lengkapi Angka yang Hilang!
          </h2>
          <p className="text-lg text-gray-600">
            Isi kotak kosong dengan angka yang tepat
          </p>
        </div>

        <Card className="p-8 bg-gradient-to-br from-white to-green-50 border-4 border-green-200">
          <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
            {gridLayout.map(({ num, shouldShow, isEmpty }) => (
              <div
                key={`cell-${num}`}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold transition-all ${
                  shouldShow
                    ? "bg-green-500 text-white border-green-600"
                    : isEmpty
                    ? showGridResult
                      ? checkedAnswers[num] === true
                        ? "bg-green-100 border-green-500 border-2"
                        : checkedAnswers[num] === false
                        ? "bg-red-100 border-red-500 border-2"
                        : "bg-white border-green-300 border-dashed"
                      : "bg-white border-green-300 border-dashed"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {shouldShow ? (
                  <span className="text-lg">{num}</span>
                ) : isEmpty ? (
                  <GridInput
                    num={num}
                    value={gridAnswers[num] || ""}
                    onChange={handleGridInputChange}
                  />
                ) : null}
              </div>
            ))}
          </div>

          {!showGridResult && (
            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={checkGridAnswers}
                disabled={!hasAllAnswers()}
                className="px-8 py-4 text-xl rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Periksa Jawaban! ✓
              </Button>
              {!hasAllAnswers() && (
                <p className="text-sm text-gray-500 mt-2">
                  Isi semua kotak kosong terlebih dahulu
                </p>
              )}
            </div>
          )}

          {showGridResult && (
            <div className="text-center mt-8 space-y-4 animate-fade-in">
              <div
                className={`text-6xl mb-4 ${
                  gridIsCorrect ? "animate-bounce" : "animate-shake"
                }`}
              >
                {gridIsCorrect ? "🎉" : "😅"}
              </div>
              <div
                className={`text-3xl font-bold ${
                  gridIsCorrect ? "text-green-600" : "text-orange-600"
                }`}
              >
                {gridIsCorrect
                  ? "Sempurna! Semua jawaban benar!"
                  : "Ada beberapa yang belum tepat. Coba periksa lagi!"}
              </div>
              {!gridIsCorrect && (
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">
                    Kotak berwarna merah perlu diperbaiki
                  </p>
                  <Button
                    onClick={handleRetryGrid}
                    className="px-6 py-3 text-lg rounded-full"
                  >
                    Perbaiki Jawaban! 🔄
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  };

  // Congratulation Step
  const CongratulationStep = () => (
    <div className="max-w-4xl mx-auto text-center p-8">
      <div className="mb-8 relative">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>

        <h1 className="text-5xl font-bold text-purple-600 mb-4">
          Selamat! Kamu Hebat! 🎉
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Kamu sudah bisa menghitung dan menulis angka dengan sempurna!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-yellow-300">
          <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-yellow-800">100%</div>
          <div className="text-yellow-700">Sempurna!</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-100 to-blue-200 border-4 border-green-300">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-green-800">+50 XP</div>
          <div className="text-green-700">Poin Didapat</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-200 border-4 border-purple-300">
          <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-purple-800">Selesai</div>
          <div className="text-purple-700">Pembelajaran</div>
        </Card>
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          className="px-12 py-6 text-xl rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all"
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

  // Main render logic
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "intro":
        return <IntroStep />;
      case "counting":
        return <CountingStep />;
      case "grid":
        return <GridStep />;
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
