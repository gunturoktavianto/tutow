"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { titleToSlug } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  content: any;
  xpReward: number;
}

interface Material {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  courses: Course[];
  grade: {
    name: string;
    displayName: string;
  };
}

interface MaterialPageProps {
  gradeNumber: number;
  materialId: string;
}

export function MaterialPage({ gradeNumber, materialId }: MaterialPageProps) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterial = async () => {
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

        // Get materials for this grade to find the right material
        const materialsResponse = await fetch(
          `/api/materials?gradeId=${grade.id}`
        );
        const materialsData = await materialsResponse.json();
        const targetMaterial = materialsData.materials.find(
          (m: any) => m.name === materialId
        );

        if (!targetMaterial) {
          setError("Materi tidak ditemukan");
          return;
        }

        // Get the material with courses
        const coursesResponse = await fetch(
          `/api/courses?materialId=${targetMaterial.id}`
        );
        const coursesData = await coursesResponse.json();

        // Get user progress for this material - add cache busting
        const progressResponse = await fetch(
          `/api/progress?materialId=${targetMaterial.id}&t=${Date.now()}`
        );
        const progressData = await progressResponse.json();

        setMaterial(coursesData.material);
        setUserProgress(progressData.progress || []);
      } catch (err) {
        setError("Gagal memuat data");
        console.error("Error fetching material:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();

    // Also refetch when the page becomes visible (user returns from course)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMaterial();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gradeNumber, materialId]);

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

  if (error || !material) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="text-7xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Materi tidak ditemukan"}
          </h1>
          <Link href={`/learning/${gradeNumber}`}>
            <Button className="mt-4 text-lg px-6 py-6 rounded-full">
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCourseCompleted = (courseIndex: number) => {
    const course = material.courses[courseIndex];
    if (!course) return false;

    const isCompleted = userProgress.some(
      (progress) => progress.courseId === course.id && progress.completed
    );

    return isCompleted;
  };

  const totalCompleted = material.courses.filter((_, index) =>
    getCourseCompleted(index)
  ).length;
  const overallProgress =
    material.courses.length > 0
      ? Math.round((totalCompleted / material.courses.length) * 100)
      : 0;

  // Course emojis for different levels
  const courseEmojis = ["📚", "🧮", "🎯", "🏆", "⭐", "🎪", "🎨", "🔥"];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Simple Header */}
      <div className="mb-6">
        <Link href={`/learning/${gradeNumber}`} className="inline-block mb-4">
          <Button variant="outline" size="lg" className="rounded-full">
            ← Kembali
          </Button>
        </Link>
        <div className="flex justify-center items-center gap-4">
          <h1 className="text-4xl font-bold">{material.displayName}</h1>
          <div className="text-6xl">🔢</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 mb-8 max-w-xl mx-auto shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-5xl">🚀</div>
          <div className="text-white text-xl font-bold">
            {overallProgress}% Selesai
          </div>
        </div>
        <Progress
          value={overallProgress}
          className="h-6 bg-white/20 rounded-full"
        />
        <div className="mt-3 text-white text-sm">
          {totalCompleted} dari {material.courses.length} pelajaran
        </div>
      </div>

      {/* Courses Grid - Visual Card Style for Kids */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {material.courses.map((course, index) => {
          const completed = getCourseCompleted(index);
          const isUnlocked = index === 0 || getCourseCompleted(index - 1);
          const emoji = courseEmojis[index % courseEmojis.length];

          return (
            <Link
              key={course.id}
              href={
                isUnlocked
                  ? `/learning/${gradeNumber}/${materialId}/${titleToSlug(
                      course.title
                    )}`
                  : "#"
              }
              className={!isUnlocked ? "pointer-events-none" : ""}
            >
              <div
                className={`
                relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 p-6
                ${
                  completed
                    ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300"
                    : isUnlocked
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

                <div className="flex items-center gap-6">
                  {/* Left Section - Level */}

                  {/* Right Section - Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {emoji}
                      {course.title}
                    </h3>

                    {/* Level Badge */}
                    <div className="mb-3">
                      <Badge
                        variant="outline"
                        className={`
                        ${
                          course.level === 1
                            ? "bg-blue-100 text-blue-700"
                            : course.level === 2
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }
                      `}
                      >
                        {course.level === 1
                          ? "Dasar"
                          : course.level === 2
                          ? "Menengah"
                          : "Lanjut"}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                      <div
                        className={`
                        rounded-full px-6 py-3 font-bold text-white text-center
                        ${
                          completed
                            ? "bg-green-500"
                            : isUnlocked
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }
                      `}
                      >
                        {completed
                          ? "Ulangi 🔄"
                          : isUnlocked
                          ? "Mulai 🎯"
                          : "Terkunci 🔒"}
                      </div>
                    </div>

                    {/* XP Reward */}
                    <div className="mt-3 text-sm text-gray-600 font-medium">
                      ⭐ +{course.xpReward} XP
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {completed ? (
                      <div className="text-4xl">✅</div>
                    ) : isUnlocked ? (
                      <div className=""></div>
                    ) : (
                      <div className="text-4xl text-gray-300">🔒</div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
