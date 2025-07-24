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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat materi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
          <Link href="/learning">
            <Button className="mt-4">Kembali ke Learning</Button>
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

  const getCourseCompleted = (material: Material, courseIndex: number) => {
    const course = material.courses[courseIndex];
    if (!course) return false;

    return userProgress.some(
      (progress) => progress.courseId === course.id && progress.completed
    );
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link href="/learning" className="hover:text-blue-600">
          Belajar
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium">Kelas {gradeNumber}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Matematika Kelas {gradeNumber}
            </h1>
            <p className="text-xl text-gray-600">
              Dasar-dasar matematika yang menyenangkan
            </p>
          </div>
          <div className="text-6xl">🎯</div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">
                Progress Kelas {gradeNumber}
              </h3>
              <p className="text-blue-100">
                Kamu sudah menyelesaikan {totalProgress}% dari semua materi!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalProgress}%</div>
              <div className="text-sm text-blue-100">Selesai</div>
            </div>
          </div>
          <Progress value={totalProgress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {materials.map((material, index) => {
          const progress = getMaterialProgress(material);
          const completedLessons = Math.floor(
            (progress / 100) * material._count.courses
          );
          const isUnlocked =
            index === 0 || getMaterialProgress(materials[index - 1]) > 50;

          return (
            <Card
              key={material.id}
              className={`border-2 transition-all duration-300 ${
                isUnlocked
                  ? "border-gray-200 hover:border-blue-300 cursor-pointer"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                        index % 4 === 0
                          ? "bg-blue-500"
                          : index % 4 === 1
                          ? "bg-green-500"
                          : index % 4 === 2
                          ? "bg-purple-500"
                          : "bg-orange-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {material.displayName}
                      </CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUnlocked ? (
                      progress === 100 ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {completedLessons}/{material._count.courses} pelajaran
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      1.2k siswa
                    </Badge>
                  </div>

                  {isUnlocked ? (
                    <Link href={`/learning/${gradeNumber}/${material.name}`}>
                      <Button className="w-full mt-4">
                        {progress === 0 ? "Mulai Belajar" : "Lanjutkan"}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full mt-4">
                      Selesaikan materi sebelumnya
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
