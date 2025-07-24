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
  CheckCircle,
  Lock,
} from "lucide-react";

export default function BilanganMaterial() {
  // Mock data untuk courses dalam materi Bilangan - akan diganti dengan data real
  const courses = [
    {
      id: 1,
      title: "Mengenal Angka 1-5",
      description: "Belajar mengenal dan menulis angka 1 sampai 5",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: true, xp: 10 },
        { id: 2, name: "Aplikasi", completed: true, xp: 15 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 20 },
      ],
      totalXP: 45,
      estimatedTime: 15,
      completed: false,
      progress: 67,
    },
    {
      id: 2,
      title: "Mengenal Angka 6-10",
      description:
        "Lanjutan mengenal angka 6 sampai 10 dengan cara menyenangkan",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: true, xp: 10 },
        { id: 2, name: "Aplikasi", completed: false, xp: 15 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 20 },
      ],
      totalXP: 45,
      estimatedTime: 15,
      completed: false,
      progress: 33,
    },
    {
      id: 3,
      title: "Mengenal Angka 11-15",
      description: "Memahami angka puluhan pertama dengan gambar dan permainan",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: true, xp: 10 },
        { id: 2, name: "Aplikasi", completed: false, xp: 15 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 20 },
      ],
      totalXP: 45,
      estimatedTime: 18,
      completed: false,
      progress: 33,
    },
    {
      id: 4,
      title: "Mengenal Angka 16-20",
      description:
        "Menyelesaikan pengenalan angka hingga 20 dengan aktivitas seru",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: false, xp: 10 },
        { id: 2, name: "Aplikasi", completed: false, xp: 15 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 20 },
      ],
      totalXP: 45,
      estimatedTime: 18,
      completed: false,
      progress: 0,
    },
    {
      id: 5,
      title: "Membandingkan Bilangan",
      description:
        "Belajar membandingkan mana yang lebih besar, lebih kecil, atau sama",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: false, xp: 15 },
        { id: 2, name: "Aplikasi", completed: false, xp: 20 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 25 },
      ],
      totalXP: 60,
      estimatedTime: 20,
      completed: false,
      progress: 0,
    },
    {
      id: 6,
      title: "Mengurutkan Bilangan",
      description: "Mengurutkan angka dari terkecil ke terbesar dan sebaliknya",
      levels: [
        { id: 1, name: "Pemahaman Dasar", completed: false, xp: 15 },
        { id: 2, name: "Aplikasi", completed: false, xp: 20 },
        { id: 3, name: "Eksplorasi", completed: false, xp: 25 },
      ],
      totalXP: 60,
      estimatedTime: 20,
      completed: false,
      progress: 0,
    },
  ];

  const totalCompleted = courses.filter((course) => course.completed).length;
  const overallProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/learning" className="hover:text-blue-600">
          Belajar
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/learning/1" className="hover:text-blue-600">
          Kelas 1
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium">Bilangan 1-20</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔢 Bilangan 1-20
            </h1>
            <p className="text-xl text-gray-600">
              Belajar mengenal, membandingkan, dan mengurutkan bilangan 1 sampai
              20
            </p>
          </div>
          <div className="text-6xl">🎯</div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Progress Materi</h3>
              <p className="text-blue-100">
                {totalCompleted} dari {courses.length} pelajaran selesai
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
      <div className="space-y-6">
        {courses.map((course, index) => {
          const isUnlocked =
            index === 0 ||
            courses[index - 1].completed ||
            courses[index - 1].progress > 0;

          return (
            <Card
              key={course.id}
              className={`border-2 transition-all duration-300 ${
                isUnlocked
                  ? "border-blue-100 hover:border-blue-200 hover:shadow-lg"
                  : "border-gray-200 opacity-60"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          course.completed
                            ? "bg-green-500"
                            : course.progress > 0
                            ? "bg-blue-500"
                            : isUnlocked
                            ? "bg-gray-400"
                            : "bg-gray-300"
                        }`}
                      >
                        {course.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : !isUnlocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          course.id
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-gray-600">{course.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm text-gray-500">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Levels */}
                    <div className="flex space-x-3 mb-4">
                      {course.levels.map((level) => (
                        <div
                          key={level.id}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                            level.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {level.completed && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span>
                            Level {level.id}: {level.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            +{level.xp} XP
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimatedTime} menit</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Total {course.totalXP} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-6">
                    {isUnlocked ? (
                      <Link href={`/learning/1/bilangan/${course.id}`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          {course.progress > 0 ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Lanjutkan
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Mulai
                            </>
                          )}
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Terkunci
                      </Button>
                    )}
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-yellow-800">
                      💡 Selesaikan "{courses[index - 1]?.title}" terlebih
                      dahulu untuk membuka pelajaran ini
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-yellow-100 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Latihan Tambahan</span>
            </CardTitle>
            <CardDescription>
              Asah kemampuan dengan soal-soal latihan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/exercise/1/bilangan">
              <Button
                variant="outline"
                className="w-full border-yellow-200 hover:bg-yellow-100"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Latihan Soal Bilangan
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="text-xl">🎮</div>
              <span>Mini Games</span>
            </CardTitle>
            <CardDescription>
              Bermain sambil belajar tentang bilangan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/games/number-match">
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-100"
              >
                🎯 Tebak Angka
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
