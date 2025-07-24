"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Lock, Users } from "lucide-react";

interface Material {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  order: number;
  imageUrl: string | null;
  courses: Course[];
  _count: {
    courses: number;
  };
}

interface Course {
  id: string;
  title: string;
  level: number;
  order: number;
}

interface GradePageProps {
  gradeNumber: number;
}

export function GradePage({ gradeNumber }: GradePageProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);

        // First get the grade ID
        const gradesResponse = await fetch("/api/grades");
        const gradesData = await gradesResponse.json();
        const grade = gradesData.grades.find(
          (g: any) => g.name === gradeNumber.toString()
        );

        if (!grade) {
          setError("Kelas tidak ditemukan");
          return;
        }

        // Then get materials for this grade
        const materialsResponse = await fetch(
          `/api/materials?gradeId=${grade.id}`
        );
        const materialsData = await materialsResponse.json();

        // Get user progress for this grade
        const progressResponse = await fetch(
          `/api/progress?gradeId=${grade.id}`
        );
        const progressData = await progressResponse.json();

        setMaterials(materialsData.materials);
        setUserProgress(progressData.progress || []);
      } catch (err) {
        setError("Gagal memuat data");
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [gradeNumber]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-bounce text-7xl mb-4">🔄</div>
          <p className="text-xl font-bold">Tunggu sebentar ya...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="text-7xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <Link href="/learning">
            <Button className="mt-4 text-lg px-6 py-6 rounded-full">
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getMaterialProgress = (material: Material) => {
    const materialProgress = userProgress.filter(
      (progress) => progress.materialId === material.id && progress.completed
    );

    return material.courses.length > 0
      ? Math.round((materialProgress.length / material.courses.length) * 100)
      : 0;
  };

  const totalProgress =
    materials.length > 0
      ? Math.round(
          materials.reduce(
            (acc, material) => acc + getMaterialProgress(material),
            0
          ) / materials.length
        )
      : 0;

  // Emojis for material themes
  const materialEmojis = [
    "🔢",
    "➕",
    "➖",
    "✖️",
    "➗",
    "📏",
    "📐",
    "🧠",
    "🎯",
    "🎲",
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Simple Header */}
      <div className="mb-6 text-center">
        <Link href="/learning" className="inline-block mb-4">
          <Button variant="outline" size="lg" className="rounded-full">
            ← Kembali
          </Button>
        </Link>
        <div className="flex justify-center items-center gap-4">
          <h1 className="text-5xl font-bold">Kelas {gradeNumber}</h1>
          <div className="text-6xl">📚</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 mb-8 max-w-xl mx-auto shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-5xl">🚀</div>
          <div className="text-white text-xl font-bold">
            {totalProgress}% Selesai
          </div>
        </div>
        <Progress
          value={totalProgress}
          className="h-6 bg-white/20 rounded-full"
        />
      </div>

      {/* Materials Grid - Visual Card Style for Kids */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map((material, index) => {
          const progress = getMaterialProgress(material);
          const isUnlocked =
            index === 0 || getMaterialProgress(materials[index - 1]) > 50;
          const emoji = materialEmojis[index % materialEmojis.length];

          // Calculate stars based on progress
          const totalStars = 3;
          const earnedStars = Math.floor(progress / (100 / totalStars));

          return (
            <Link
              key={material.id}
              href={
                isUnlocked ? `/learning/${gradeNumber}/${material.name}` : "#"
              }
              className={!isUnlocked ? "pointer-events-none" : ""}
            >
              <div
                className={`
                relative aspect-square rounded-3xl overflow-hidden shadow-lg transition-all duration-300
                ${
                  isUnlocked
                    ? "bg-gradient-to-br from-white to-blue-100 hover:shadow-xl transform hover:-translate-y-2"
                    : "bg-gray-200 opacity-70"
                }
              `}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🔒</div>
                      <p className="text-lg font-bold">Belum Terbuka</p>
                    </div>
                  </div>
                )}

                <div className="h-full p-6 flex flex-col justify-between">
                  {/* Top Section */}
                  <div className="text-center">
                    <div className="text-7xl mb-4">{emoji}</div>
                    <h2 className="text-2xl font-bold mb-1">
                      {material.displayName}
                    </h2>

                    {/* Simplified Progress Bar for Kids */}
                    {isUnlocked && (
                      <div className="mt-4 relative h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        >
                          {progress > 30 && (
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                              {progress}%
                            </div>
                          )}
                        </div>
                        {progress <= 30 && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold">
                            {progress}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-4 flex justify-center">
                    <div
                      className={`
                      rounded-full px-6 py-3 font-bold text-white text-center text-lg
                      ${
                        isUnlocked
                          ? progress === 100
                            ? "bg-green-500"
                            : progress > 0
                            ? "bg-blue-500"
                            : "bg-purple-500"
                          : "bg-gray-400"
                      }
                    `}
                    >
                      {progress === 100
                        ? "Selesai! 🎉"
                        : progress > 0
                        ? "Lanjut 👉"
                        : "Mulai 🚀"}
                    </div>
                  </div>
                </div>

                {/* Progress Indicator in Corner */}
                {isUnlocked && progress > 0 && (
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md">
                    <div className="text-sm font-bold">
                      {material.courses.length > 0
                        ? `${
                            userProgress.filter(
                              (p) => p.materialId === material.id && p.completed
                            ).length
                          }/${material.courses.length}`
                        : "0/0"}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
