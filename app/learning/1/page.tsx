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
  Star,
  Clock,
  ChevronRight,
  Trophy,
  Play,
} from "lucide-react";

export default function Grade1Learning() {
  // Mock data untuk Grade 1 - akan diganti dengan data real dari database
  const grade1Materials = [
    {
      id: "bilangan",
      name: "Bilangan 1-20",
      description:
        "Belajar mengenal angka 1 sampai 20, membandingkan, dan mengurutkan bilangan",
      totalCourses: 15,
      completedCourses: 12,
      progress: 80,
      totalTime: 120, // minutes
      xpReward: 150,
      difficulty: "Mudah",
      color: "from-blue-400 to-blue-600",
      icon: "🔢",
      topics: [
        "Mengenal Angka",
        "Membandingkan Bilangan",
        "Mengurutkan",
        "Pola Bilangan",
      ],
    },
    {
      id: "penjumlahan",
      name: "Penjumlahan",
      description:
        "Memahami konsep penjumlahan dengan benda konkret dan abstrak",
      totalCourses: 20,
      completedCourses: 12,
      progress: 60,
      totalTime: 160,
      xpReward: 200,
      difficulty: "Mudah",
      color: "from-green-400 to-green-600",
      icon: "➕",
      topics: [
        "Penjumlahan 1-10",
        "Penjumlahan dengan Gambar",
        "Soal Cerita",
        "Sifat Komutatif",
      ],
    },
    {
      id: "pengurangan",
      name: "Pengurangan",
      description:
        "Belajar konsep pengurangan dan hubungannya dengan penjumlahan",
      totalCourses: 18,
      completedCourses: 5,
      progress: 25,
      totalTime: 140,
      xpReward: 180,
      difficulty: "Mudah",
      color: "from-purple-400 to-purple-600",
      icon: "➖",
      topics: [
        "Pengurangan 1-10",
        "Pengurangan dengan Gambar",
        "Hubungan +/-",
        "Soal Cerita",
      ],
    },
    {
      id: "bangun-datar",
      name: "Bangun Datar",
      description:
        "Mengenal bentuk-bentuk dasar: lingkaran, segitiga, persegi, persegi panjang",
      totalCourses: 12,
      completedCourses: 0,
      progress: 0,
      totalTime: 100,
      xpReward: 120,
      difficulty: "Mudah",
      color: "from-orange-400 to-orange-600",
      icon: "🔺",
      topics: [
        "Mengenal Bentuk",
        "Ciri-ciri Bangun",
        "Membedakan Bentuk",
        "Bentuk di Sekitar",
      ],
    },
  ];

  const totalProgress = Math.round(
    grade1Materials.reduce((sum, material) => sum + material.progress, 0) /
      grade1Materials.length
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/learning" className="hover:text-blue-600">
            Belajar
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium">Kelas 1</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Matematika Kelas 1
            </h1>
            <p className="text-xl text-gray-600">
              Dasar-dasar matematika yang menyenangkan untuk anak kelas 1 SD
            </p>
          </div>
          <div className="text-6xl">🎯</div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Progress Kelas 1</h3>
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
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {grade1Materials.map((material) => (
          <Card
            key={material.id}
            className="border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
          >
            {/* Material Header */}
            <div
              className={`h-16 bg-gradient-to-r ${material.color} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center justify-between h-full px-6">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{material.icon}</div>
                  <h3 className="text-xl font-bold text-white">
                    {material.name}
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {material.difficulty}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardDescription className="text-gray-600 leading-relaxed">
                {material.description}
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
                    {material.completedCourses}/{material.totalCourses}{" "}
                    pelajaran
                  </span>
                </div>
                <Progress value={material.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {material.progress}% selesai
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500">Pelajaran</p>
                  <p className="text-sm font-semibold">
                    {material.totalCourses}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-xs text-gray-500">Waktu</p>
                  <p className="text-sm font-semibold">{material.totalTime}m</p>
                </div>
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500">XP</p>
                  <p className="text-sm font-semibold">{material.xpReward}</p>
                </div>
              </div>

              {/* Topics */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Topik yang dipelajari:
                </p>
                <div className="flex flex-wrap gap-1">
                  {material.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link href={`/learning/1/${material.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {material.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Lanjutkan Belajar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Mulai Belajar
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-2 border-yellow-100 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Aksi Cepat</span>
            </CardTitle>
            <CardDescription>
              Aktivitas tambahan untuk mengasah kemampuan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/exercise/1">
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-200 hover:bg-yellow-100"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Latihan Soal Kelas 1
              </Button>
            </Link>
            <Link href="/games">
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-200 hover:bg-yellow-100"
              >
                🎮 Mini Games Matematika
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-2 border-green-100 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="text-xl">💡</div>
              <span>Tips Belajar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✓</div>
                <span>
                  Belajar 15-20 menit setiap hari lebih efektif daripada belajar
                  lama sekaligus
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✓</div>
                <span>
                  Gunakan benda di sekitar untuk memahami konsep matematika
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">✓</div>
                <span>Jangan lupa istirahat dan bermain setelah belajar!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
