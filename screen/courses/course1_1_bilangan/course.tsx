"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";

interface CountingExercise {
  id: number;
  objects: {
    type:
      | "cross"
      | "star"
      | "hexagon"
      | "oval"
      | "square"
      | "triangle"
      | "circle"
      | "plus";
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
    objects: { type: "cross", color: "#9ACD32", count: 7 },
    correctNumber: 7,
    correctWord: "tujuh",
  },
  {
    id: 2,
    objects: { type: "star", color: "#8B008B", count: 8 },
    correctNumber: 8,
    correctWord: "delapan",
  },
  {
    id: 3,
    objects: { type: "hexagon", color: "#008B8B", count: 3 },
    correctNumber: 3,
    correctWord: "tiga",
  },
  {
    id: 4,
    objects: { type: "oval", color: "#9ACD32", count: 4 },
    correctNumber: 4,
    correctWord: "empat",
  },
  {
    id: 5,
    objects: { type: "square", color: "#FF1493", count: 6 },
    correctNumber: 6,
    correctWord: "enam",
  },
  {
    id: 6,
    objects: { type: "triangle", color: "#1E90FF", count: 2 },
    correctNumber: 2,
    correctWord: "dua",
  },
  {
    id: 7,
    objects: { type: "circle", color: "#8B7355", count: 9 },
    correctNumber: 9,
    correctWord: "sembilan",
  },
  {
    id: 8,
    objects: { type: "plus", color: "#FF8C00", count: 5 },
    correctNumber: 5,
    correctWord: "lima",
  },
  {
    id: 9,
    objects: { type: "star", color: "#FFD700", count: 1 },
    correctNumber: 1,
    correctWord: "satu",
  },
];

const initialNumberGrid: NumberGridCell[][] = [
  [
    { value: 1, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: 11, isEditable: false },
    { value: 12, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: null, isEditable: true },
    { value: 22, isEditable: false },
    { value: 23, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 35, isEditable: false },
    { value: 36, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 44, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 48, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 57, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: null, isEditable: true },
    { value: 62, isEditable: false },
    { value: null, isEditable: true },
    { value: 64, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
  ],
  [
    { value: 71, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 76, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 80, isEditable: false },
  ],
  [
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 90, isEditable: false },
  ],
  [
    { value: 91, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 96, isEditable: false },
    { value: null, isEditable: true },
    { value: null, isEditable: true },
    { value: 99, isEditable: false },
    { value: null, isEditable: true },
  ],
];

const ObjectRenderer = ({
  type,
  color,
  size = 40,
}: {
  type: string;
  color: string;
  size?: number;
}) => {
  const style = { width: size, height: size, color, fill: color };

  switch (type) {
    case "cross":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={color}
          />
        </svg>
      );
    case "hexagon":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path
            d="M17.5 3.5L22 12l-4.5 8.5h-11L2 12l4.5-8.5h11z"
            fill={color}
          />
        </svg>
      );
    case "oval":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <ellipse cx="12" cy="12" rx="8" ry="5" fill={color} />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <rect x="3" y="3" width="18" height="18" fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M12 2l10 18H2L12 2z" fill={color} />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <circle cx="12" cy="12" r="9" fill={color} />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path
            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
            fill={color}
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      );
    default:
      return (
        <div
          style={{ ...style, backgroundColor: color, borderRadius: "50%" }}
        />
      );
  }
};

export function Course1_1_Bilangan({
  courseId,
  courseData,
}: {
  courseId: string;
  courseData?: any;
}) {
  const [currentActivity, setCurrentActivity] = useState<
    "counting" | "grid" | "congratulation"
  >("counting");
  const [countingAnswers, setCountingAnswers] = useState<{
    [key: number]: { number: string; word: string };
  }>({});
  const [countingResults, setCountingResults] = useState<{
    [key: number]: { number: boolean; word: boolean };
  }>({});
  const [numberGrid, setNumberGrid] =
    useState<NumberGridCell[][]>(initialNumberGrid);
  const [gridResults, setGridResults] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showResults, setShowResults] = useState(false);
  const [countingCompleted, setCountingCompleted] = useState(false);
  const [gridCompleted, setGridCompleted] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [progressUpdateFailed, setProgressUpdateFailed] = useState(false);

  console.log("Course1_1_Bilangan - Props received:", {
    courseId,
    courseData,
    hasRealCourseId: !!courseId,
  });

  const handleCountingInputChange = (
    exerciseId: number,
    field: "number" | "word",
    value: string
  ) => {
    setCountingAnswers((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const checkCountingAnswers = () => {
    const results: { [key: number]: { number: boolean; word: boolean } } = {};

    countingExercises.forEach((exercise) => {
      const userAnswer = countingAnswers[exercise.id];
      results[exercise.id] = {
        number: userAnswer?.number === exercise.correctNumber.toString(),
        word:
          userAnswer?.word?.toLowerCase().trim() ===
          exercise.correctWord.toLowerCase(),
      };
    });

    setCountingResults(results);
    setShowResults(true);

    // Check if all answers are correct
    const allCorrect = countingExercises.every((exercise) => {
      const result = results[exercise.id];
      return result && result.number && result.word;
    });

    setCountingCompleted(allCorrect);

    // Auto-progress to next activity if all correct
    if (allCorrect) {
      setTimeout(() => {
        setCurrentActivity("grid");
      }, 2000); // Wait 2 seconds to show success message
    }
  };

  const isCountingAllCorrect = () => {
    return countingExercises.every((exercise) => {
      const result = countingResults[exercise.id];
      return result && result.number && result.word;
    });
  };

  const resetCountingActivity = () => {
    setCountingResults({});
    setShowResults(false);
    setCountingCompleted(false);
  };

  const handleGridInputChange = (row: number, col: number, value: string) => {
    const numValue = value === "" ? null : parseInt(value);
    const newGrid = [...numberGrid];
    newGrid[row][col] = { ...newGrid[row][col], value: numValue };
    setNumberGrid(newGrid);
  };

  const checkGridAnswers = () => {
    const results: { [key: string]: boolean } = {};

    numberGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.isEditable) {
          const expectedValue = rowIndex * 10 + colIndex + 1;
          const key = `${rowIndex}-${colIndex}`;
          results[key] = cell.value === expectedValue;
        }
      });
    });

    setGridResults(results);
    setShowResults(true);

    // Check if all answers are correct
    const allCorrect = Object.values(results).every(
      (result) => result === true
    );
    setGridCompleted(allCorrect);

    // Auto-progress to congratulation page if all correct
    if (allCorrect) {
      setTimeout(async () => {
        setIsUpdatingProgress(true);
        setProgressUpdateFailed(false);

        // Try to update course completion, but don't block UI if it fails
        try {
          await updateCourseCompletion();
          console.log(
            "Progress updated successfully, proceeding to congratulation page"
          );
        } catch (error) {
          console.error(
            "Failed to update course completion, but continuing to congratulation page:",
            error
          );
          setProgressUpdateFailed(true);
        } finally {
          setIsUpdatingProgress(false);
          setCurrentActivity("congratulation");
          setCourseCompleted(true);
        }
      }, 2000); // Wait 2 seconds to show success message
    }
  };

  const isGridAllCorrect = () => {
    return (
      Object.values(gridResults).every((result) => result === true) &&
      Object.keys(gridResults).length > 0
    );
  };

  const updateCourseCompletion = async () => {
    try {
      console.log("Updating course completion...", {
        courseId,
        courseTitle: courseData?.title,
        hasValidCourseId: !!courseId,
      });

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const requestBody = {
        courseId: courseId,
        completed: true,
        score: 100,
      };

      console.log("Progress update request body:", requestBody);

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unable to parse error response" }));
        console.error("Failed to update course completion:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Course completion updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating course completion:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : "Unknown",
      });

      // Re-throw the error so it can be caught by the caller
      throw error;
    }
  };

  // Development helper function to auto-fill all counting answers
  const autoFillCountingAnswers = () => {
    const autoAnswers: { [key: number]: { number: string; word: string } } = {};
    countingExercises.forEach((exercise) => {
      autoAnswers[exercise.id] = {
        number: exercise.correctNumber.toString(),
        word: exercise.correctWord,
      };
    });
    setCountingAnswers(autoAnswers);
  };

  // Development helper function to auto-fill grid answers
  const autoFillGridAnswers = () => {
    const newGrid = [...numberGrid];
    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.isEditable) {
          const expectedValue = rowIndex * 10 + colIndex + 1;
          newGrid[rowIndex][colIndex] = { ...cell, value: expectedValue };
        }
      });
    });
    setNumberGrid(newGrid);
  };

  // Development helper function to auto-fill and check counting answers
  const autoFillAndCheckCounting = () => {
    autoFillCountingAnswers();
    setTimeout(() => {
      checkCountingAnswers();
    }, 100); // Small delay to ensure state is updated
  };

  // Development helper function to auto-fill and check grid answers
  const autoFillAndCheckGrid = () => {
    autoFillGridAnswers();
    setTimeout(() => {
      checkGridAnswers();
    }, 100); // Small delay to ensure state is updated
  };

  const resetGridActivity = () => {
    setGridResults({});
    setShowResults(false);
    setGridCompleted(false);
  };

  const renderCountingObjects = (exercise: CountingExercise) => {
    const objects = [];
    const { type, color, count } = exercise.objects;

    const rows = Math.ceil(count / 3);
    const objectsPerRow = Math.ceil(count / rows);

    for (let row = 0; row < rows; row++) {
      const rowObjects = [];
      for (
        let col = 0;
        col < objectsPerRow && row * objectsPerRow + col < count;
        col++
      ) {
        rowObjects.push(
          <div key={`${row}-${col}`} className="inline-block m-1">
            <ObjectRenderer type={type} color={color} size={32} />
          </div>
        );
      }
      objects.push(
        <div key={row} className="flex justify-center">
          {rowObjects}
        </div>
      );
    }

    return objects;
  };

  // Congratulation page
  if (currentActivity === "congratulation") {
    console.log("Rendering congratulation page", {
      courseCompleted,
      progressUpdateFailed,
    });
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="mb-8">
            <div className="text-8xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">Selamat!</h1>
            <p className="text-xl text-gray-700 mb-2">
              Anda telah menyelesaikan course
            </p>
            <p className="text-2xl font-semibold text-blue-600 mb-8">
              "Menghitung & Menulis Angka"
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">
                  Tingkat Penyelesaian
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">
                  Aktivitas Diselesaikan
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">+50 XP</div>
                <div className="text-sm text-gray-600">Poin yang Diperoleh</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {progressUpdateFailed && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Progress tidak tersimpan otomatis, tapi Anda tetap berhasil
                  menyelesaikan course ini!
                </p>
              </div>
            )}

            <p className="text-gray-600 mb-6">
              Anda telah menguasai keterampilan menghitung objek dan menulis
              angka dalam bentuk angka dan kata. Lanjutkan perjalanan belajar
              Anda dengan materi berikutnya!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={() => {
                  window.location.href = "/learning/1/bilangan";
                }}
              >
                Lanjut ke Materi Berikutnya
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={() => {
                  window.location.href = "/learning";
                }}
              >
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentActivity === "counting") {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Menghitung & Menulis Angka
            </h1>
            <div className="flex items-center gap-3">
              {process.env.NODE_ENV === "development" && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={autoFillCountingAnswers}
                    variant="secondary"
                    size="sm"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
                  >
                    🔧 Auto Fill
                  </Button>
                  <Button
                    onClick={autoFillAndCheckCounting}
                    variant="secondary"
                    size="sm"
                    className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                  >
                    ⚡ Fill & Check
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentActivity("congratulation");
                      setCourseCompleted(true);
                    }}
                    variant="secondary"
                    size="sm"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300"
                  >
                    🎉 Test Congrats
                  </Button>
                </div>
              )}
              <Button
                onClick={() => {
                  if (!showResults) {
                    alert(
                      "Silakan periksa jawaban terlebih dahulu sebelum melanjutkan!"
                    );
                    return;
                  }
                  if (!isCountingAllCorrect()) {
                    alert(
                      "Masih ada jawaban yang salah! Perbaiki semua jawaban sebelum melanjutkan ke aktivitas berikutnya."
                    );
                    return;
                  }
                  setCurrentActivity("grid");
                }}
                variant="outline"
                className={`flex items-center gap-2 ${
                  showResults && !isCountingAllCorrect()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={showResults && !isCountingAllCorrect()}
              >
                Lanjut ke Aktivitas 2 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Hitung jumlah objek, lalu tulis angka dan kata bilangannya!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countingExercises.map((exercise) => (
            <Card key={exercise.id} className="p-4">
              <CardContent className="space-y-4">
                <div className="border-2 border-gray-200 rounded-lg p-4 min-h-[120px] flex flex-col justify-center items-center bg-gray-50">
                  {renderCountingObjects(exercise)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center bg-white">
                      <Input
                        type="number"
                        className="w-8 h-8 text-center border-none p-0 text-lg font-bold"
                        placeholder=""
                        value={countingAnswers[exercise.id]?.number || ""}
                        onChange={(e) =>
                          handleCountingInputChange(
                            exercise.id,
                            "number",
                            e.target.value
                          )
                        }
                        disabled={showResults}
                      />
                    </div>
                    {showResults && (
                      <div className="flex items-center">
                        {countingResults[exercise.id]?.number ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      placeholder="tulis dalam kata..."
                      className="flex-1"
                      value={countingAnswers[exercise.id]?.word || ""}
                      onChange={(e) =>
                        handleCountingInputChange(
                          exercise.id,
                          "word",
                          e.target.value
                        )
                      }
                      disabled={showResults}
                    />
                    {showResults && (
                      <div className="flex items-center">
                        {countingResults[exercise.id]?.word ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {!showResults ? (
            <Button onClick={checkCountingAnswers} size="lg" className="px-8">
              Periksa Jawaban
            </Button>
          ) : !isCountingAllCorrect() ? (
            <Button
              onClick={resetCountingActivity}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Periksa Ulang
            </Button>
          ) : (
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600 mb-2">
                  🎉 Sempurna! Menuju aktivitas berikutnya...
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              </div>
            </div>
          )}
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Hasil:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600 font-medium">
                    Benar:{" "}
                    {Object.values(countingResults).reduce(
                      (acc, result) =>
                        acc + (result.number && result.word ? 1 : 0),
                      0
                    )}{" "}
                    soal
                  </span>
                </div>
                <div>
                  <span className="text-red-600 font-medium">
                    Salah:{" "}
                    {Object.values(countingResults).reduce(
                      (acc, result) =>
                        acc + (!result.number || !result.word ? 1 : 0),
                      0
                    )}{" "}
                    soal
                  </span>
                </div>
              </div>
            </div>

            {!isCountingAllCorrect() && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-red-800">Perhatian!</h4>
                </div>
                <p className="text-red-700 text-sm">
                  Masih ada jawaban yang salah. Perbaiki semua jawaban dengan
                  benar sebelum melanjutkan ke aktivitas berikutnya.
                </p>
              </div>
            )}

            {isCountingAllCorrect() && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-green-800">Selamat!</h4>
                </div>
                <p className="text-green-700 text-sm">
                  Semua jawaban sudah benar! Anda bisa melanjutkan ke aktivitas
                  berikutnya.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Melengkapi Tabel Angka
          </h1>
          <div className="flex items-center gap-3">
            {process.env.NODE_ENV === "development" && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={autoFillGridAnswers}
                  variant="secondary"
                  size="sm"
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
                >
                  🔧 Auto Fill
                </Button>
                <Button
                  onClick={autoFillAndCheckGrid}
                  variant="secondary"
                  size="sm"
                  className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                >
                  ⚡ Fill & Check
                </Button>
                <Button
                  onClick={() => {
                    setCurrentActivity("congratulation");
                    setCourseCompleted(true);
                  }}
                  variant="secondary"
                  size="sm"
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300"
                >
                  🎉 Test Congrats
                </Button>
              </div>
            )}
            <Button
              onClick={() => setCurrentActivity("counting")}
              variant="outline"
            >
              Kembali ke Aktivitas 1
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Lengkapi tabel angka 1-100 dengan mengisi kotak-kotak kosong!
        </p>
      </div>

      <Card className="p-6">
        <CardContent>
          <div className="grid grid-cols-10 gap-1 max-w-2xl mx-auto">
            {numberGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const expectedValue = rowIndex * 10 + colIndex + 1;

                return (
                  <div
                    key={key}
                    className={`
                      w-12 h-12 border border-gray-300 flex items-center justify-center text-sm font-medium
                      ${cell.isEditable ? "bg-white" : "bg-gray-100"}
                      ${
                        showResults && cell.isEditable
                          ? gridResults[key]
                            ? "bg-green-100 border-green-400"
                            : "bg-red-100 border-red-400"
                          : ""
                      }
                    `}
                  >
                    {cell.isEditable ? (
                      <Input
                        type="number"
                        className="w-full h-full text-center border-none p-0 text-sm bg-transparent"
                        value={cell.value || ""}
                        onChange={(e) =>
                          handleGridInputChange(
                            rowIndex,
                            colIndex,
                            e.target.value
                          )
                        }
                        disabled={showResults}
                        min="1"
                        max="100"
                      />
                    ) : (
                      <span>{cell.value}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4">
        {!showResults ? (
          <Button onClick={checkGridAnswers} size="lg" className="px-8">
            Periksa Jawaban
          </Button>
        ) : !isGridAllCorrect() ? (
          <Button
            onClick={resetGridActivity}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Periksa Ulang
          </Button>
        ) : (
          <div className="flex justify-center">
            <div className="text-center">
              {isUpdatingProgress ? (
                <>
                  <div className="text-lg font-semibold text-blue-600 mb-2">
                    💾 Menyimpan progress...
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold text-green-600 mb-2">
                    🎉 Luar biasa! Menuju halaman selamat...
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </>
              )}

              {/* Manual proceed button if stuck */}
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setCurrentActivity("congratulation");
                    setCourseCompleted(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Lanjut Manual (jika stuck)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showResults && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Hasil:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-600 font-medium">
                  Benar:{" "}
                  {Object.values(gridResults).filter((result) => result).length}{" "}
                  kotak
                </span>
              </div>
              <div>
                <span className="text-red-600 font-medium">
                  Salah:{" "}
                  {
                    Object.values(gridResults).filter((result) => !result)
                      .length
                  }{" "}
                  kotak
                </span>
              </div>
            </div>
          </div>

          {!isGridAllCorrect() && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold text-red-800">Perhatian!</h4>
              </div>
              <p className="text-red-700 text-sm">
                Masih ada kotak yang belum diisi dengan benar. Perbaiki semua
                jawaban sebelum menyelesaikan aktivitas ini.
              </p>
            </div>
          )}

          {isGridAllCorrect() && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-green-800">Selamat!</h4>
              </div>
              <p className="text-green-700 text-sm">
                Semua kotak sudah diisi dengan benar! Anda telah menyelesaikan
                aktivitas ini dengan sempurna.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
