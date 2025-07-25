"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Volume2, Sparkles } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";

interface MaterialSlide {
  id: number;
  type: "intro" | "concept" | "visual" | "interactive" | "summary";
  title: string;
  content: React.ReactNode;
  narration?: string;
}

export function Course1_2_GanjilGenapUrutanMaterial({
  courseId,
}: CourseComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactiveState, setInteractiveState] = useState<any>({});

  const slides: MaterialSlide[] = [
    {
      id: 1,
      type: "intro",
      title: "Selamat Datang di Dunia Ganjil & Genap! 🎭",
      narration:
        "Hai teman-teman! Hari ini kita akan belajar tentang angka ganjil dan genap, serta urutan angka. Seru banget!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🎭</div>
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            Ayo Belajar Ganjil & Genap!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Kita akan mengenal angka ganjil, genap, dan belajar mengurutkan
            angka dengan cara yang menyenangkan!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-red-100 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold text-red-600">1</span>
              <p className="text-sm text-red-600">Ganjil</p>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold text-blue-600">2</span>
              <p className="text-sm text-blue-600">Genap</p>
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold text-red-600">3</span>
              <p className="text-sm text-red-600">Ganjil</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "concept",
      title: "Apa itu Angka Genap? 👫",
      narration:
        "Angka genap adalah angka yang bisa dibagi dua sama rata. Seperti sepatu yang selalu berpasangan!",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Angka Genap = Berpasangan!
            </h2>
            <p className="text-lg text-gray-600">
              Angka genap selalu bisa dibuat berpasangan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-lg font-bold text-blue-600">2 = 1 + 1</p>
                <p className="text-sm text-gray-600">Berpasangan sempurna!</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">4</div>
                <div className="grid grid-cols-2 gap-2 justify-items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-lg font-bold text-blue-600">4 = 2 + 2</p>
                <p className="text-sm text-gray-600">Dua pasang!</p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      type: "concept",
      title: "Apa itu Angka Ganjil? 🕺",
      narration:
        "Angka ganjil adalah angka yang tidak bisa dibagi dua sama rata. Selalu ada satu yang sendirian!",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-red-600">
              Angka Ganjil = Ada yang Sendirian!
            </h2>
            <p className="text-lg text-gray-600">
              Angka ganjil selalu punya satu yang tidak berpasangan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-red-100 to-pink-100 border-4 border-red-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-4">1</div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-lg font-bold text-red-600">Sendirian</p>
                <p className="text-sm text-gray-600">Tidak ada pasangan</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-100 to-orange-100 border-4 border-red-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-4">3</div>
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="flex flex-col space-y-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-lg font-bold text-red-600">2 + 1</p>
                <p className="text-sm text-gray-600">
                  Satu pasang + satu sendirian
                </p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      type: "interactive",
      title: "Ayo Bermain Tebak Ganjil-Genap! 🎮",
      narration:
        "Sekarang giliran kamu! Klik pada angka dan lihat apakah itu ganjil atau genap!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
            Klik Angka untuk Melihat!
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                className={`p-4 rounded-xl border-4 transition-all transform hover:scale-105 ${
                  interactiveState[`num_${num}`]
                    ? num % 2 === 0
                      ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                      : "bg-red-500 text-white border-red-600 shadow-lg"
                    : "bg-white border-gray-300 hover:border-purple-400"
                }`}
                onClick={() => {
                  setInteractiveState((prev) => ({
                    ...prev,
                    [`num_${num}`]: !prev[`num_${num}`],
                  }));
                }}
              >
                <div className="text-2xl font-bold mb-2">{num}</div>
                {interactiveState[`num_${num}`] && (
                  <div className="text-xs">
                    {num % 2 === 0 ? "GENAP" : "GANJIL"}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setInteractiveState({})}
              className="px-6 py-3 text-lg rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Reset 🔄
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      type: "visual",
      title: "Mengurutkan Angka! 📈",
      narration:
        "Sekarang kita belajar mengurutkan angka dari yang terkecil ke yang terbesar!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
            Urutan Angka
          </h2>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-700">
              Dari Kecil ke Besar (Naik)
            </h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div
                  key={num}
                  className="relative"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animation: "slideInUp 0.6s ease forwards",
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg flex items-center justify-center text-xl">
                    {num}
                  </div>
                  {index < 4 && (
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-green-600 text-xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-700">
              Dari Besar ke Kecil (Turun)
            </h3>
            <div className="flex justify-center space-x-2">
              {[5, 4, 3, 2, 1].map((num, index) => (
                <div
                  key={num}
                  className="relative"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animation: "slideInDown 0.6s ease forwards",
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold rounded-lg flex items-center justify-center text-xl">
                    {num}
                  </div>
                  {index < 4 && (
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-red-600 text-xl">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      type: "summary",
      title: "Hebat! Kamu Sudah Menguasai Ganjil-Genap! 🎉",
      narration:
        "Wah, kamu sudah belajar tentang angka ganjil, genap, dan urutan! Kamu hebat sekali!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            Selamat! Kamu Hebat!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sekarang kamu sudah tahu perbedaan angka ganjil dan genap, serta
            cara mengurutkan angka!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-br from-red-100 to-pink-100 border-4 border-red-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔴</div>
                <p className="font-bold text-red-600">Angka Ganjil</p>
                <p className="text-sm text-gray-600">1, 3, 5, 7, 9...</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔵</div>
                <p className="font-bold text-blue-600">Angka Genap</p>
                <p className="text-sm text-gray-600">2, 4, 6, 8, 10...</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-200">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="font-bold text-green-600">Urutan</p>
                <p className="text-sm text-gray-600">Naik & Turun</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold text-purple-600">
              Yang sudah kamu pelajari:
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">👫</div>
                <p className="text-sm">Genap Berpasangan</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🕺</div>
                <p className="text-sm">Ganjil Sendirian</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-sm">Mengurutkan</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Pembelajaran: Ganjil Genap & Urutan
            </h1>
            <div className="text-lg text-gray-600">
              {currentSlide + 1} dari {slides.length}
            </div>
          </div>

          <Progress
            value={((currentSlide + 1) / slides.length) * 100}
            className="h-3"
          />
        </div>

        <Card className="mb-6 border-4 border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="min-h-[500px] flex flex-col">
              <div className="flex-1">{currentSlideData.content}</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
            size="lg"
            className="px-6 py-3 rounded-full disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Sebelumnya
          </Button>

          <div className="flex items-center space-x-4">
            {currentSlideData.narration && (
              <Button
                onClick={() => speakText(currentSlideData.narration!)}
                disabled={isPlaying}
                variant="outline"
                size="lg"
                className="px-6 py-3 rounded-full"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isPlaying ? "Memutar..." : "Dengarkan"}
              </Button>
            )}

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-purple-500 scale-125"
                      : index < currentSlide
                      ? "bg-green-400"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            size="lg"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 disabled:opacity-50"
          >
            {currentSlide === slides.length - 1 ? "Selesai" : "Selanjutnya"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
