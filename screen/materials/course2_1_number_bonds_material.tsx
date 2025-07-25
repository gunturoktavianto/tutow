"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Volume2, Plus, Equal } from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";

interface MaterialSlide {
  id: number;
  type: "intro" | "concept" | "visual" | "interactive" | "summary";
  title: string;
  content: React.ReactNode;
  narration?: string;
}

const NumberBond = ({
  total,
  left,
  right,
  interactive = false,
  onClick,
}: {
  total: number;
  left: number;
  right: number;
  interactive?: boolean;
  onClick?: () => void;
}) => (
  <div
    className={`relative ${
      interactive
        ? "cursor-pointer transform hover:scale-105 transition-all"
        : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-center space-x-4">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full flex items-center justify-center text-xl">
        {left}
      </div>
      <Plus className="w-8 h-8 text-gray-600" />
      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-full flex items-center justify-center text-xl">
        {right}
      </div>
      <Equal className="w-8 h-8 text-gray-600" />
      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full flex items-center justify-center text-2xl border-4 border-yellow-300">
        {total}
      </div>
    </div>
  </div>
);

export function Course2_1_NumberBondsMaterial({
  courseId,
}: CourseComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactiveState, setInteractiveState] = useState<any>({});

  const slides: MaterialSlide[] = [
    {
      id: 1,
      type: "intro",
      title: "Selamat Datang di Dunia Number Bonds! 🔗",
      narration:
        "Hai teman-teman! Hari ini kita akan belajar tentang number bonds atau ikatan bilangan. Ini seperti puzzle angka yang seru!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🔗</div>
          <h1 className="text-4xl font-bold mb-4 text-blue-600">
            Ayo Belajar Number Bonds!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Number bonds adalah cara melihat bagaimana angka-angka kecil
            bergabung membentuk angka yang lebih besar!
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center">
              3
            </div>
            <Plus className="w-6 h-6 text-gray-600" />
            <div className="w-12 h-12 bg-green-500 text-white font-bold rounded-full flex items-center justify-center">
              2
            </div>
            <Equal className="w-6 h-6 text-gray-600" />
            <div className="w-16 h-16 bg-yellow-500 text-white font-bold rounded-full flex items-center justify-center text-xl">
              5
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "concept",
      title: "Apa itu Number Bonds? 🧩",
      narration:
        "Number bonds adalah cara menunjukkan bagaimana dua angka bergabung membentuk angka lain. Seperti puzzle yang cocok!",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              Number Bonds = Puzzle Angka!
            </h2>
            <p className="text-lg text-gray-600">
              Dua angka kecil bergabung jadi satu angka besar
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Contoh Number Bond untuk 5
                </h3>
                <div className="space-y-4">
                  <NumberBond total={5} left={1} right={4} />
                  <NumberBond total={5} left={2} right={3} />
                  <NumberBond total={5} left={0} right={5} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      type: "visual",
      title: "Number Bonds untuk 10! 🔟",
      narration:
        "Angka 10 sangat istimewa! Mari kita lihat semua cara untuk membuat 10!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
            Semua Cara Membuat 10!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { left: 0, right: 10 },
              { left: 1, right: 9 },
              { left: 2, right: 8 },
              { left: 3, right: 7 },
              { left: 4, right: 6 },
              { left: 5, right: 5 },
            ].map((bond, index) => (
              <Card
                key={index}
                className="p-4 bg-white border-2 border-green-200 hover:shadow-lg transition-all"
              >
                <NumberBond total={10} left={bond.left} right={bond.right} />
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-bold text-green-600">
              Wah! Ada 6 cara berbeda untuk membuat 10! 🎉
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      type: "interactive",
      title: "Ayo Bermain Number Bonds! 🎮",
      narration:
        "Sekarang giliran kamu! Klik pada number bonds untuk melihat animasinya!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
            Klik untuk Melihat Animasi!
          </h2>

          <div className="space-y-6">
            {[
              { total: 6, left: 2, right: 4 },
              { total: 8, left: 3, right: 5 },
              { total: 7, left: 4, right: 3 },
            ].map((bond, index) => (
              <Card
                key={index}
                className={`p-6 border-4 transition-all ${
                  interactiveState[`bond_${index}`]
                    ? "border-purple-400 bg-purple-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-purple-200"
                }`}
              >
                <NumberBond
                  total={bond.total}
                  left={bond.left}
                  right={bond.right}
                  interactive={true}
                  onClick={() => {
                    setInteractiveState((prev) => ({
                      ...prev,
                      [`bond_${index}`]: !prev[`bond_${index}`],
                    }));
                  }}
                />
                {interactiveState[`bond_${index}`] && (
                  <div className="text-center mt-4 animate-fade-in">
                    <div className="text-lg font-bold text-purple-600">
                      {bond.left} + {bond.right} = {bond.total} ✨
                    </div>
                    <div className="flex justify-center space-x-2 mt-2">
                      {Array.from({ length: bond.left }, (_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                      <div className="text-xl text-gray-600">+</div>
                      {Array.from({ length: bond.right }, (_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-green-400 rounded-full animate-bounce"
                          style={{
                            animationDelay: `${(bond.left + i) * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
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
      title: "Number Bonds dengan Gambar! 🎨",
      narration: "Mari kita lihat number bonds dengan gambar yang lucu!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
            Number Bonds dengan Gambar!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-red-100 to-pink-100 border-4 border-red-200">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-4 text-red-600">
                  3 + 2 = 5 Apel
                </h3>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="space-x-1">
                    {Array.from({ length: 3 }, (_, i) => (
                      <span key={i} className="text-3xl">
                        🍎
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl">+</span>
                  <div className="space-x-1">
                    {Array.from({ length: 2 }, (_, i) => (
                      <span key={i} className="text-3xl">
                        🍎
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl">=</span>
                  <div className="text-3xl font-bold text-red-600">5</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-200">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-4 text-blue-600">
                  4 + 1 = 5 Bintang
                </h3>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="space-x-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <span key={i} className="text-3xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl">+</span>
                  <div className="space-x-1">
                    {Array.from({ length: 1 }, (_, i) => (
                      <span key={i} className="text-3xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl">=</span>
                  <div className="text-3xl font-bold text-blue-600">5</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      type: "summary",
      title: "Hebat! Kamu Sudah Menguasai Number Bonds! 🎉",
      narration:
        "Wah, kamu sudah belajar tentang number bonds! Sekarang kamu tahu bagaimana angka-angka bergabung!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold mb-4 text-blue-600">
            Selamat! Kamu Hebat!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sekarang kamu sudah mengerti number bonds dan bagaimana angka-angka
            bergabung!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔗</div>
                <p className="font-bold text-blue-600">Number Bonds</p>
                <p className="text-sm text-gray-600">Angka bergabung</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🔟</div>
                <p className="font-bold text-green-600">Bonds untuk 10</p>
                <p className="text-sm text-gray-600">6 cara berbeda</p>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-bold text-yellow-600">Dengan Gambar</p>
                <p className="text-sm text-gray-600">Visual & Interaktif</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold text-purple-600">
              Yang sudah kamu pelajari:
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🧩</div>
                <p className="text-sm">Puzzle Angka</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">➕</div>
                <p className="text-sm">Penjumlahan</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-sm">Interaktif</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Pembelajaran: Number Bonds
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

        <Card className="mb-6 border-4 border-blue-200 bg-white/80 backdrop-blur-sm">
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
                      ? "bg-blue-500 scale-125"
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
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50"
          >
            {currentSlide === slides.length - 1 ? "Selesai" : "Selanjutnya"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
