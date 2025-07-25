import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Trophy,
  Gamepad2,
  Star,
  Users,
  Target,
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureSection />

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Fitur Unggulan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Tutow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tutow dirancang khusus untuk membuat belajar matematika menjadi
              pengalaman yang menyenangkan dan efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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

            <Card className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Gamifikasi Seru</CardTitle>
                <CardDescription>
                  Sistem XP, Gold, Badge, dan Garden yang membuat belajar terasa
                  seperti bermain game
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Latihan Beragam</CardTitle>
                <CardDescription>
                  Bank soal lengkap dengan tingkat kesulitan yang bervariasi
                  untuk mengasah kemampuan
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-yellow-100 hover:border-yellow-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Pantau perkembangan belajar anak dengan sistem progress yang
                  detail dan mudah dipahami
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-pink-100 hover:border-pink-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Ramah Anak</CardTitle>
                <CardDescription>
                  Interface yang colorful, friendly, dan dirancang khusus untuk
                  anak-anak usia SD
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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

      {/* Pricing Section - NEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Paket Berlangganan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Tepat untuk Anak Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mulai dengan trial gratis untuk merasakan pengalaman belajar
              Tutow, kemudian upgrade ke Premium untuk akses penuh
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial Plan */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 relative">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Trial Gratis</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  Coba fitur dasar untuk mengenal Tutow
                </CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    Gratis
                  </span>
                  <p className="text-gray-600 mt-1">Selamanya</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">1 course pembelajaran</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      10 soal latihan per hari
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Progress tracking dasar
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Sistem XP dan Badge</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Akses ke Garden dasar</span>
                  </li>
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Coba Gratis
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Tidak perlu kartu kredit
                </p>
              </CardContent>
            </Card>

            {/* Premium Plan - Most Popular */}
            <Card className="border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 relative shadow-lg scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Rekomendasi
                </div>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Premium</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  Akses lengkap untuk pembelajaran optimal
                </CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    Rp 149.999
                  </span>
                  <p className="text-gray-600 mt-1">per bulan</p>
                  <div className="mt-2">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Hemat 30% dengan paket tahunan
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Semua course</strong> pembelajaran interaktif
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Unlimited</strong> soal latihan
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Progress tracking <strong>lengkap</strong>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Sistem Garden & Gold <strong>premium</strong>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Support</strong> prioritas
                    </span>
                  </li>
                </ul>
                <Link href="/register?plan=premium" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Upgrade ke Premium
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">
                  14 hari uang kembali jika tidak puas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Semua paket dilengkapi dengan dukungan teknis dan update konten
              rutin
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Bebas batalkan kapan saja</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Akses di semua perangkat</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Update konten rutin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Petualangan Matematika?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan rasakan pengalaman belajar matematika yang
            berbeda! Mulai dengan paket gratis, upgrade kapan saja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Daftar Gratis Sekarang
              </Button>
            </Link>
            <Link href="https://drive.google.com/drive/folders/1_nC0BkQ50iNH3em0hPXnQXxOg0cvg7H8?usp=sharing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-blue-600 hover:bg-white px-8 py-3 text-lg font-semibold transition-all"
              >
                Lihat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img src="/logo.png" alt="logo tutow" className="w-24 h-auto" />
              <div className="text-left">
                <p className="text-sm text-gray-800">
                  © 2025 <strong>Tutow.</strong> Aplikasi{" "}
                  <span className="text-indigo-600 font-semibold">edukasi</span>{" "}
                  matematika untuk anak Indonesia.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Membantu anak Indonesia menguasai matematika dengan cara yang
                  menyenangkan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link
                href="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-600 transition-colors"
              >
                Syarat & Ketentuan
              </Link>
              <Link
                href="/contact"
                className="hover:text-blue-600 transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
