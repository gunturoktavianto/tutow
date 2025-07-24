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

export default function Learning() {
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState({
    currentGrade: 1,
    totalXP: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (status === "loading") return;

    try {
      // Fetch fresh data from API to ensure we have the latest XP
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserProgress({
          currentGrade: data.user.currentGrade || 1,
          totalXP: data.user.xp || 0,
        });
      } else if (session?.user) {
        // Fallback to session data if API fails
        const user = session.user as ExtendedUser;
        setUserProgress({
          currentGrade: user.currentGrade || 1,
          totalXP: user.xp || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to session data
      if (session?.user) {
        const user = session.user as ExtendedUser;
        setUserProgress({
          currentGrade: user.currentGrade || 1,
          totalXP: user.xp || 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Refresh data when the page becomes visible (user returns from course)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && session?.user) {
        fetchUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, fetchUserData]);

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

  const grades = [
    {
      id: 1,
      name: "Kelas 1",
      description: "Dasar-dasar matematika: Bilangan, Penjumlahan, Pengurangan",
      totalMaterials: 4,
      completedMaterials: 2,
      progress: 50,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      name: "Kelas 2",
      description: "Perkalian, Pembagian, Pengukuran",
      totalMaterials: 5,
      completedMaterials: 0,
      progress: 0,
      color: "from-green-400 to-green-600",
    },
    {
      id: 3,
      name: "Kelas 3",
      description: "Pecahan, Desimal, Geometri Dasar",
      totalMaterials: 6,
      completedMaterials: 0,
      progress: 0,
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 4,
      name: "Kelas 4",
      description: "Operasi Lanjutan, Grafik, Pola Bilangan",
      totalMaterials: 7,
      completedMaterials: 0,
      progress: 0,
      color: "from-pink-400 to-pink-600",
    },
    {
      id: 5,
      name: "Kelas 5",
      description: "Volume, Luas, Koordinat, Statistik",
      totalMaterials: 8,
      completedMaterials: 0,
      progress: 0,
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 6,
      name: "Kelas 6",
      description: "Persiapan SMP: Aljabar Dasar, Persamaan",
      totalMaterials: 9,
      completedMaterials: 0,
      progress: 0,
      color: "from-red-400 to-red-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎓 Pilih Kelas Belajar
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Mulai petualangan matematika dari kelas yang sesuai dengan
          kemampuanmu. Selesaikan satu kelas untuk membuka kelas berikutnya!
        </p>
      </div>

      {/* Current Progress Banner */}
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

      {/* Grades Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grades.map((grade) => (
          <Card
            key={grade.id}
            className="relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg border-blue-200 hover:border-blue-300 cursor-pointer"
          >
            {/* Gradient Header */}
            <div className={`h-20 bg-gradient-to-r ${grade.color} relative`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between h-full px-6">
                <h3 className="text-2xl font-bold text-white">{grade.name}</h3>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600 leading-relaxed">
                {grade.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
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

              {/* Stats */}
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{grade.totalMaterials} Materi</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link href={`/learning/${grade.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {grade.progress > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Tidak yakin dari kelas mana harus mulai?
          </h3>
          <p className="text-gray-600 mb-6">
            Tidak masalah! Kamu bisa mulai dari kelas manapun yang kamu rasa
            cocok dengan kemampuanmu saat ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learning/1">
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Mulai dari Kelas 1
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-300">
              Tes Penempatan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
