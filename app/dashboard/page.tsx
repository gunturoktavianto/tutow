"use client";

import { useState, useEffect } from "react";
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
import {
  BookOpen,
  Trophy,
  Gamepad2,
  Star,
  Coins,
  Target,
  Clock,
  TrendingUp,
  Award,
  Sprout,
  Leaf,
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          setLoading(true);
          const response = await fetch("/api/dashboard");
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            console.error(
              "Error fetching dashboard data:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    // Also refresh when page becomes visible (user returns from another tab)
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        status === "authenticated"
      ) {
        fetchDashboardData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Gagal memuat data dashboard.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const { user, materials, recentBadges, dailyTasks } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang kembali, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ayo lanjutkan petualangan matematika seru hari ini!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-700">{user.xp}</p>
              <p className="text-sm text-blue-600">Total XP</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-2">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-yellow-700">{user.gold}</p>
              <p className="text-sm text-yellow-600">Gold Coins</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-700">{user.streak}</p>
              <p className="text-sm text-green-600">Hari Berturut</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {user.totalLessonsCompleted}
              </p>
              <p className="text-sm text-purple-600">Pelajaran</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Progress */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Pilih aktivitas yang ingin kamu lakukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Link href="/exercise/1">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex-col space-y-2"
                    >
                      <Trophy className="w-8 h-8 text-yellow-600" />
                      <span>Latihan Soal</span>
                    </Button>
                  </Link>
                  <Link href="/garden">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex-col space-y-2"
                    >
                      <Sprout className="w-8 h-8 text-green-600" />
                      <span>Kebun Saya</span>
                    </Button>
                  </Link>
                  <Link href="/games">
                    <Button
                      variant="outline"
                      className="w-full h-20 flex-col space-y-2"
                    >
                      <Gamepad2 className="w-8 h-8 text-purple-600" />
                      <span>Mini Games</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Badge Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBadges.map((badge: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.earnedAt}</p>
                    </div>
                  </div>
                ))}
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Lihat Semua Badge
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Garden Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sprout className="w-5 h-5" />
                  <span>Kebun Saya</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    🌱
                  </div>
                  <div className="w-12 h-12 bg-brown-100 rounded-lg flex items-center justify-center">
                    🪴
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    +
                  </div>
                </div>
                <Link href="/garden">
                  <Button variant="outline" size="sm" className="w-full">
                    Kunjungi Kebun
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
