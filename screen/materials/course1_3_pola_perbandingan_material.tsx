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

const PatternBlock = ({
  color,
  shape,
  size = 60,
}: {
  color: string;
  shape: string;
  size?: number;
}) => {
  const shapes = {
    circle: (
      <div
        className="rounded-full border-2 border-gray-300"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    ),
    square: (
      <div
        className="border-2 border-gray-300"
        style={{ width: size, height: size, backgroundColor: color }}
      />
    ),
    triangle: (
      <div
        className="triangle border-2 border-gray-300"
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }}
      />
    ),
  };

  return shapes[shape as keyof typeof shapes] || shapes.circle;
};

export function Course1_3_PolaPerbandinganMaterial({
  courseId,
}: CourseComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactiveState, setInteractiveState] = useState<any>({});

  const slides: MaterialSlide[] = [
    {
      id: 1,
      type: "intro",
      title: "Selamat Datang di Dunia Pola! 🎨",
      narration:
        "Hai teman-teman! Hari ini kita akan belajar tentang pola dan perbandingan. Pola ada di mana-mana di sekitar kita!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🎨</div>
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            Ayo Belajar Pola & Perbandingan!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Pola adalah susunan yang berulang. Mari kita temukan pola yang
            menarik!
          </p>
          <div className="flex justify-center items-center space-x-4">
            <PatternBlock color="#FF6B6B" shape="circle" />
            <PatternBlock color="#4ECDC4" shape="square" />
            <PatternBlock color="#FF6B6B" shape="circle" />
            <PatternBlock color="#4ECDC4" shape="square" />
            <div className="text-2xl">❓</div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "concept",
      title: "Apa itu Pola? 🔄",
      narration:
        "Pola adalah susunan yang berulang-ulang dengan aturan tertentu. Seperti warna merah, biru, merah, biru!",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">
              Pola = Berulang dengan Aturan!
            </h2>
            <p className="text-lg text-gray-600">
              Pola mengikuti aturan yang sama berulang-ulang
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-gradient-to-br from-red-100 to-pink-100 border-4 border-red-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-red-600">
                  Pola Warna
                </h3>
                <div className="flex justify-center space-x-2 mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Merah - Biru - Merah - Biru - Merah
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-green-600">
                  Pola Bentuk
                </h3>
                <div className="flex justify-center space-x-2 mb-4">
                  <PatternBlock color="#FFD93D" shape="circle" size={48} />
                  <PatternBlock color="#6BCF7F" shape="square" size={48} />
                  <PatternBlock color="#FFD93D" shape="circle" size={48} />
                  <PatternBlock color="#6BCF7F" shape="square" size={48} />
                  <PatternBlock color="#FFD93D" shape="circle" size={48} />
                </div>
                <p className="text-sm text-gray-600">
                  Lingkaran - Kotak - Lingkaran - Kotak - Lingkaran
                </p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      type: "visual",
      title: "Pola Angka! 🔢",
      narration:
        "Angka juga bisa membuat pola! Mari kita lihat pola angka yang menarik!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
            Pola dengan Angka!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-purple-600">
                  Pola +1
                </h3>
                <div className="flex justify-center space-x-4 mb-4">
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <div
                      key={num}
                      className="w-12 h-12 bg-purple-500 text-white font-bold rounded-full flex items-center justify-center"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animation: "fadeInScale 0.6s ease forwards",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Setiap angka bertambah 1
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Pola +2
                </h3>
                <div className="flex justify-center space-x-4 mb-4">
                  {[2, 4, 6, 8, 10].map((num, index) => (
                    <div
                      key={num}
                      className="w-12 h-12 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animation: "fadeInScale 0.6s ease forwards",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Setiap angka bertambah 2
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
      title: "Ayo Bermain Lanjutkan Pola! 🎮",
      narration:
        "Sekarang giliran kamu! Klik untuk melanjutkan pola yang sudah dimulai!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
            Lanjutkan Pola Ini!
          </h2>

          <div className="space-y-8">
            <Card className="p-6 bg-white border-4 border-orange-200">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-4 text-orange-600">
                  Pola 1: Merah - Biru - ?
                </h3>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                  <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
                  <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                  <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
                  <button
                    className={`w-16 h-16 border-4 border-dashed rounded-full transition-all ${
                      interactiveState.pattern1 === "red"
                        ? "bg-red-500 border-red-600"
                        : interactiveState.pattern1 === "blue"
                        ? "bg-blue-500 border-blue-600"
                        : "border-gray-400 hover:border-orange-400"
                    }`}
                    onClick={() => {
                      setInteractiveState((prev) => ({
                        ...prev,
                        pattern1: prev.pattern1 === "red" ? "blue" : "red",
                      }));
                    }}
                  >
                    {!interactiveState.pattern1 && (
                      <span className="text-2xl">?</span>
                    )}
                  </button>
                </div>
                {interactiveState.pattern1 === "red" && (
                  <div className="text-green-600 font-bold animate-bounce">
                    ✅ Benar! Polanya Merah-Biru!
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-white border-4 border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-4 text-green-600">
                  Pola 2: 1, 3, 5, ?
                </h3>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  {[1, 3, 5].map((num) => (
                    <div
                      key={num}
                      className="w-16 h-16 bg-green-500 text-white font-bold rounded-full flex items-center justify-center text-xl"
                    >
                      {num}
                    </div>
                  ))}
                  <div className="flex flex-col space-y-2">
                    <button
                      className={`w-16 h-16 border-4 rounded-full font-bold text-xl transition-all ${
                        interactiveState.pattern2 === 7
                          ? "bg-green-500 text-white border-green-600"
                          : "border-gray-400 hover:border-green-400"
                      }`}
                      onClick={() => {
                        setInteractiveState((prev) => ({
                          ...prev,
                          pattern2: 7,
                        }));
                      }}
                    >
                      7
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      className={`w-16 h-16 border-4 rounded-full font-bold text-xl transition-all ${
                        interactiveState.pattern2 === 6
                          ? "bg-red-500 text-white border-red-600"
                          : "border-gray-400 hover:border-red-400"
                      }`}
                      onClick={() => {
                        setInteractiveState((prev) => ({
                          ...prev,
                          pattern2: 6,
                        }));
                      }}
                    >
                      6
                    </button>
                  </div>
                </div>
                {interactiveState.pattern2 === 7 && (
                  <div className="text-green-600 font-bold animate-bounce">
                    ✅ Benar! Polanya +2!
                  </div>
                )}
                {interactiveState.pattern2 === 6 && (
                  <div className="text-red-600 font-bold">
                    ❌ Coba lagi! Lihat polanya!
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => setInteractiveState({})}
              className="px-6 py-3 text-lg rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
            >
              Reset 🔄
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      type: "concept",
      title: "Perbandingan! ⚖️",
      narration:
        "Perbandingan adalah membandingkan dua hal. Mana yang lebih banyak? Mana yang lebih sedikit?",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              Mari Belajar Perbandingan!
            </h2>
            <p className="text-lg text-gray-600">
              Membandingkan mana yang lebih banyak atau sedikit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-yellow-600">
                  Lebih Banyak
                </h3>
                <div className="flex justify-center space-x-8 mb-4">
                  <div>
                    <div className="flex flex-wrap justify-center mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="text-3xl m-1">
                          🍎
                        </span>
                      ))}
                    </div>
                    <p className="font-bold">5 apel</p>
                  </div>
                  <div className="text-4xl text-green-600 font-bold">{">"}</div>
                  <div>
                    <div className="flex flex-wrap justify-center mb-2">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} className="text-3xl m-1">
                          🍊
                        </span>
                      ))}
                    </div>
                    <p className="font-bold">3 jeruk</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">5 lebih banyak dari 3</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Lebih Sedikit
                </h3>
                <div className="flex justify-center space-x-8 mb-4">
                  <div>
                    <div className="flex flex-wrap justify-center mb-2">
                      {Array.from({ length: 2 }, (_, i) => (
                        <span key={i} className="text-3xl m-1">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="font-bold">2 bintang</p>
                  </div>
                  <div className="text-4xl text-red-600 font-bold">{"<"}</div>
                  <div>
                    <div className="flex flex-wrap justify-center mb-2">
                      {Array.from({ length: 4 }, (_, i) => (
                        <span key={i} className="text-3xl m-1">
                          💎
                        </span>
                      ))}
                    </div>
                    <p className="font-bold">4 berlian</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">2 lebih sedikit dari 4</p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      type: "summary",
      title: "Hebat! Kamu Sudah Menguasai Pola & Perbandingan! 🎉",
      narration:
        "Wah, kamu sudah belajar tentang pola dan perbandingan! Sekarang kamu bisa menemukan pola di mana-mana!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            Selamat! Kamu Hebat!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sekarang kamu sudah bisa mengenali pola dan membandingkan jumlah!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <p className="font-bold text-purple-600">Pola</p>
                <p className="text-sm text-gray-600">Berulang teratur</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔢</div>
                <p className="font-bold text-blue-600">Pola Angka</p>
                <p className="text-sm text-gray-600">+1, +2, dst</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-200">
              <div className="text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <p className="font-bold text-yellow-600">Perbandingan</p>
                <p className="text-sm text-gray-600">Lebih/Kurang</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold text-purple-600">
              Yang sudah kamu pelajari:
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm">Pola Warna</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔺</div>
                <p className="text-sm">Pola Bentuk</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">Membandingkan</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Pembelajaran: Pola & Perbandingan
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
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
