import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Trophy, Gamepad2, Star, Users, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6">
                T
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Tutow
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Belajar Matematika Seru untuk Anak SD
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-10">
              <p className="text-lg text-gray-700 leading-relaxed">
                Bergabunglah dengan petualangan matematika yang menyenangkan!
                Tutow membantu anak-anak SD belajar matematika dengan cara yang
                interaktif, gamified, dan mudah dipahami.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  Mulai Belajar Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-yellow-400 animate-bounce">
          <Star className="w-8 h-8" />
        </div>
        <div className="absolute top-32 right-16 text-blue-400 animate-pulse">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 left-20 text-purple-400 animate-bounce delay-1000">
          <Trophy className="w-8 h-8" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Tutow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tutow dirancang khusus untuk membuat belajar matematika menjadi
              pengalaman yang menyenangkan dan efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">
                  Pembelajaran Interaktif
                </CardTitle>
                <CardDescription>
                  Materi pembelajaran yang disesuaikan dengan kurikulum nasional
                  dan metode Singapore Math
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Gamepad2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Gamifikasi Seru</CardTitle>
                <CardDescription>
                  Sistem XP, Gold, Badge, dan Garden yang membuat belajar terasa
                  seperti bermain game
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Latihan Beragam</CardTitle>
                <CardDescription>
                  Bank soal lengkap dengan tingkat kesulitan yang bervariasi
                  untuk mengasah kemampuan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-yellow-100 hover:border-yellow-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Pantau perkembangan belajar anak dengan sistem progress yang
                  detail dan mudah dipahami
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-pink-100 hover:border-pink-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Ramah Anak</CardTitle>
                <CardDescription>
                  Interface yang colorful, friendly, dan dirancang khusus untuk
                  anak-anak usia SD
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Akses Mudah</CardTitle>
                <CardDescription>
                  Dapat diakses dari browser di tablet, desktop, dan smartphone
                  dengan koneksi internet
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Petualangan Matematika?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Daftar sekarang dan rasakan pengalaman belajar matematika yang
            berbeda!
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Daftar Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tutow
              </span>
            </div>
            <p className="text-gray-600">
              © 2024 Tutow. Aplikasi edukasi matematika untuk anak Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
