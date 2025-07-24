"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Play, CheckCircle, Lock } from "lucide-react";
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

        setMaterial(coursesData.material);
      } catch (err) {
        setError("Gagal memuat data");
        console.error("Error fetching material:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [gradeNumber, materialId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat materi...</p>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {error || "Materi tidak ditemukan"}
          </h1>
          <Link href={`/learning/${gradeNumber}`}>
            <Button className="mt-4">Kembali ke Kelas {gradeNumber}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock completion status - in real app this would come from user progress data
  const getCourseCompleted = (courseIndex: number) => {
    return courseIndex < 2; // First 2 courses completed for demo
  };

  const totalCompleted = material.courses.filter((_, index) =>
    getCourseCompleted(index)
  ).length;
  const overallProgress =
    material.courses.length > 0
      ? Math.round((totalCompleted / material.courses.length) * 100)
      : 0;

  const levelColors = {
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-purple-500",
  };

  const levelNames = {
    1: "Pemahaman Dasar",
    2: "Aplikasi",
    3: "Soal Eksploratif",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/learning" className="hover:text-blue-600">
          Belajar
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/learning/${gradeNumber}`} className="hover:text-blue-600">
          Kelas {gradeNumber}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium">{material.displayName}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔢 {material.displayName}
            </h1>
            <p className="text-xl text-gray-600">{material.description}</p>
          </div>
          <div className="text-6xl">🎯</div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Progress Materi</h3>
              <p className="text-blue-100">
                {totalCompleted} dari {material.courses.length} pelajaran
                selesai
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-sm text-blue-100">Selesai</div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {material.courses.map((course, index) => {
          const completed = getCourseCompleted(index);
          const isUnlocked = index === 0 || getCourseCompleted(index - 1);

          return (
            <Card
              key={course.id}
              className={`border-2 transition-all duration-300 ${
                completed
                  ? "border-green-200 bg-green-50"
                  : isUnlocked
                  ? "border-gray-200 hover:border-blue-300 cursor-pointer"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                          levelColors[course.level as keyof typeof levelColors]
                        }`}
                      >
                        {course.level}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">
                            {course.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {
                              levelNames[
                                course.level as keyof typeof levelNames
                              ]
                            }
                          </Badge>
                        </div>
                        <CardDescription>{course.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-600">
                      <div>15-25 menit</div>
                      <div>+{course.xpReward} XP</div>
                    </div>
                    {completed ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : isUnlocked ? (
                      <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <Play className="w-4 h-4 text-blue-500" />
                      </div>
                    ) : (
                      <Lock className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {isUnlocked ? (
                  <Link
                    href={`/learning/${gradeNumber}/${materialId}/${titleToSlug(
                      course.title
                    )}`}
                  >
                    <Button className="w-full">
                      {completed ? "Ulangi Pelajaran" : "Mulai Pelajaran"}
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Selesaikan pelajaran sebelumnya
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
