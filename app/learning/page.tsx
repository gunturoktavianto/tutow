"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
import { BookOpen, Star, CheckCircle } from "lucide-react";

interface ExtendedUser {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  xp?: number;
  gold?: number;
  currentGrade?: number;
}

interface Grade {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface Material {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  order: number;
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

interface GradeWithProgress extends Grade {
  totalMaterials: number;
  completedMaterials: number;
  progress: number;
  color: string;
}

export default function Learning() {
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState({
    currentGrade: 1,
    totalXP: 0,
  });
  const [grades, setGrades] = useState<GradeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const gradeColors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-orange-400 to-orange-600",
    "from-red-400 to-red-600",
  ];

  const gradeDescriptions = [
    "Dasar-dasar matematika: Bilangan, Penjumlahan, Pengurangan",
    "Perkalian, Pembagian, Pengukuran",
    "Pecahan, Desimal, Geometri Dasar",
    "Operasi Lanjutan, Grafik, Pola Bilangan",
    "Volume, Luas, Koordinat, Statistik",
    "Persiapan SMP: Aljabar Dasar, Persamaan",
  ];

  const fetchUserData = useCallback(async () => {
    if (status === "loading") return;

    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserProgress({
          currentGrade: data.user.currentGrade || 1,
          totalXP: data.user.xp || 0,
        });
      } else if (session?.user) {
        const user = session.user as ExtendedUser;
        setUserProgress({
          currentGrade: user.currentGrade || 1,
          totalXP: user.xp || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (session?.user) {
        const user = session.user as ExtendedUser;
        setUserProgress({
          currentGrade: user.currentGrade || 1,
          totalXP: user.xp || 0,
        });
      }
    }
  }, [session, status]);

  const fetchGradesWithProgress = useCallback(async () => {
    try {
      const gradesResponse = await fetch("/api/grades");
      const gradesData = await gradesResponse.json();

      const gradesWithProgress: GradeWithProgress[] = await Promise.all(
        gradesData.grades.map(async (grade: Grade, index: number) => {
          try {
            const materialsResponse = await fetch(
              `/api/materials?gradeId=${grade.id}`
            );
            const materialsData = await materialsResponse.json();

            const progressResponse = await fetch(
              `/api/progress?gradeId=${grade.id}`
            );
            const progressData = await progressResponse.json();

            const materials: Material[] = materialsData.materials || [];
            const userProgressData = progressData.progress || [];

            const completedMaterials = materials.filter((material) => {
              const materialProgress = userProgressData.filter(
                (progress: any) =>
                  progress.materialId === material.id && progress.completed
              );
              return (
                material.courses.length > 0 &&
                materialProgress.length === material.courses.length
              );
            }).length;

            const progress =
              materials.length > 0
                ? Math.round((completedMaterials / materials.length) * 100)
                : 0;

            return {
              ...grade,
              totalMaterials: materials.length,
              completedMaterials,
              progress,
              color: gradeColors[index % gradeColors.length],
              description:
                gradeDescriptions[index] ||
                `Materi pembelajaran untuk ${grade.name}`,
            };
          } catch (error) {
            console.error(
              `Error fetching data for grade ${grade.name}:`,
              error
            );
            return {
              ...grade,
              totalMaterials: 0,
              completedMaterials: 0,
              progress: 0,
              color: gradeColors[index % gradeColors.length],
              description:
                gradeDescriptions[index] ||
                `Materi pembelajaran untuk ${grade.name}`,
            };
          }
        })
      );

      setGrades(gradesWithProgress);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (status !== "loading") {
      fetchGradesWithProgress();
    }
  }, [status, fetchGradesWithProgress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && session?.user) {
        fetchUserData();
        fetchGradesWithProgress();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, fetchUserData, fetchGradesWithProgress]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎓 Pilih Kelas Belajar
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mulai petualangan matematika dari kelas yang sesuai dengan
          kemampuanmu. Selesaikan satu kelas untuk membuka kelas berikutnya!
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Kelas Saat Ini: {userProgress.currentGrade}
            </h2>
            <p className="text-blue-100">
              Kamu sudah mengumpulkan {userProgress.totalXP} XP! Terus semangat
              belajar! 🌟
            </p>
          </div>
          <div className="text-6xl">📚</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => (
          <Card
            key={grade.id}
            className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg border-blue-200 hover:border-blue-300 cursor-pointer"
          >
            <div className={`h-20 bg-gradient-to-r ${grade.color} relative`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between h-full px-6">
                <h3 className="text-2xl font-bold text-white">
                  Kelas {grade.name}
                </h3>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600 leading-relaxed">
                {grade.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm text-gray-500">
                    {grade.completedMaterials}/{grade.totalMaterials} materi
                  </span>
                </div>
                <Progress value={grade.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {grade.progress}% selesai
                </p>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{grade.totalMaterials} Materi</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/learning/${grade.name}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {grade.progress > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
    </div>
  );
}
