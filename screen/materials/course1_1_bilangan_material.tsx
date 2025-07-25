"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { CourseComponentProps } from "@/lib/course-loader";
import { AITutor, AITutorRef } from "@/components/ai-tutor";
import useOpenAIRealtime from "@/lib/hooks/useOpenAIRealtime";

interface MaterialSlide {
  id: number;
  type: "intro" | "concept" | "visual" | "interactive" | "summary";
  title: string;
  content: React.ReactNode;
  narration?: string;
}

const ObjectRenderer = ({
  type,
  color,
  size = 60,
  animate = false,
}: {
  type: string;
  color: string;
  size?: number;
  animate?: boolean;
}) => {
  const style = {
    width: size,
    height: size,
    color,
    fill: color,
    transition: "all 0.3s ease",
    transform: animate ? "scale(1.1)" : "scale(1)",
  };

  const shapes = {
    star: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-pulse" : ""}
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={color}
        />
      </svg>
    ),
    heart: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-bounce" : ""}
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill={color}
        />
      </svg>
    ),
    circle: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-spin" : ""}
      >
        <circle cx="12" cy="12" r="9" fill={color} />
      </svg>
    ),
    square: (
      <svg
        viewBox="0 0 24 24"
        style={style}
        className={animate ? "animate-ping" : ""}
      >
        <rect x="3" y="3" width="18" height="18" fill={color} />
      </svg>
    ),
  };

  return shapes[type as keyof typeof shapes] || shapes.circle;
};

export function Course1_1_BilanganMaterial({ courseId }: CourseComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactiveState, setInteractiveState] = useState<
    Record<string, boolean>
  >({});
  const aiTutorRef = useRef<AITutorRef>(null);

  const {
    isSessionActive,
    startSession,
    sendTextMessage,
    status,
    stopSession,
  } = useOpenAIRealtime("alloy");

  // Function to stop current narration
  const stopCurrentNarration = () => {
    setIsPlaying(false);
    // Note: OpenAI Realtime doesn't have a direct stop method for ongoing speech
    // The audio will naturally end when the current response completes
  };

  const slides: MaterialSlide[] = [
    {
      id: 1,
      type: "intro",
      title: "Selamat Datang di Dunia Angka! 🔢",
      narration:
        "Hai teman-teman! Hari ini kita akan belajar tentang angka dan menghitung. Siap untuk petualangan seru?",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🔢</div>
          <h1 className="text-4xl font-bold mb-4 text-blue-600">
            Ayo Belajar Mengenal Angka!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Kita akan belajar mengenal angka 1 sampai 10 dengan cara yang seru
            dan menyenangkan!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-6xl animate-pulse">1️⃣</div>
            <div
              className="text-6xl animate-pulse"
              style={{ animationDelay: "0.2s" }}
            >
              2️⃣
            </div>
            <div
              className="text-6xl animate-pulse"
              style={{ animationDelay: "0.4s" }}
            >
              3️⃣
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      type: "concept",
      title: "Apa itu Angka? 🤔",
      narration:
        "Angka adalah simbol yang kita gunakan untuk menunjukkan berapa banyak sesuatu. Mari kita lihat contohnya!",
      content: (
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              Angka Membantu Kita Menghitung!
            </h2>
            <p className="text-lg text-gray-600">
              Angka seperti nama untuk jumlah benda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 border-4 border-pink-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🍎</div>
                <div className="text-4xl font-bold text-pink-600 mb-2">1</div>
                <p className="text-lg">Satu apel</p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 border-4 border-blue-200">
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="text-4xl">🐱</span>
                  <span className="text-4xl">🐱</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                <p className="text-lg">Dua kucing</p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      type: "visual",
      title: "Mari Mengenal Angka 1-5! ✨",
      narration:
        "Sekarang kita akan mengenal angka 1 sampai 5. Perhatikan bentuk angka dan jumlah bendanya ya!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">
            Angka 1 sampai 5
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <Card
                key={num}
                className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-200 transform hover:scale-105 transition-all"
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-orange-600 mb-4">
                    {num}
                  </div>
                  <div className="flex justify-center flex-wrap mb-4">
                    {Array.from({ length: num }, (_, i) => (
                      <div key={i} className="m-1">
                        <ObjectRenderer
                          type="star"
                          color="#FFD700"
                          size={30}
                          animate={false}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold">
                    {num === 1
                      ? "Satu"
                      : num === 2
                      ? "Dua"
                      : num === 3
                      ? "Tiga"
                      : num === 4
                      ? "Empat"
                      : "Lima"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      type: "interactive",
      title: "Ayo Bermain Menghitung! 🎮",
      narration:
        "Sekarang giliran kamu! Klik pada benda-benda untuk menghitungnya. Seru kan?",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
            Klik untuk Menghitung!
          </h2>

          <div className="bg-white rounded-3xl p-8 border-4 border-dashed border-blue-300 mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className={`transform transition-all duration-300 ${
                    interactiveState[`heart_${i}`]
                      ? "scale-125"
                      : "scale-100 hover:scale-110"
                  }`}
                  onClick={() => {
                    setInteractiveState((prev) => ({
                      ...prev,
                      [`heart_${i}`]: !prev[`heart_${i}`],
                    }));
                  }}
                >
                  <ObjectRenderer
                    type="heart"
                    color={
                      interactiveState[`heart_${i}`] ? "#FF69B4" : "#FFB6C1"
                    }
                    size={60}
                    animate={interactiveState[`heart_${i}`]}
                  />
                </button>
              ))}
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {Object.values(interactiveState).filter(Boolean).length}
              </div>
              <p className="text-lg">hati yang diklik</p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setInteractiveState({})}
              className="px-6 py-3 text-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
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
      title: "Angka 6 sampai 10! 🌟",
      narration:
        "Sekarang kita lanjut ke angka yang lebih besar. Angka 6 sampai 10!",
      content: (
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
            Angka 6 sampai 10
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[6, 7, 8, 9, 10].map((num) => (
              <Card
                key={num}
                className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-200 transform hover:scale-105 transition-all"
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-600 mb-4">
                    {num}
                  </div>
                  <div className="grid grid-cols-2 gap-1 justify-items-center mb-4">
                    {Array.from({ length: num }, (_, i) => (
                      <div key={i} className="m-1">
                        <ObjectRenderer
                          type="circle"
                          color="#9932CC"
                          size={20}
                          animate={false}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-bold">
                    {num === 6
                      ? "Enam"
                      : num === 7
                      ? "Tujuh"
                      : num === 8
                      ? "Delapan"
                      : num === 9
                      ? "Sembilan"
                      : "Sepuluh"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      type: "summary",
      title: "Hebat! Kamu Sudah Belajar Angka! 🎉",
      narration:
        "Wah, kamu sudah belajar semua angka dari 1 sampai 10! Kamu hebat sekali! Sekarang kamu bisa menghitung benda-benda di sekitarmu!",
      content: (
        <div className="text-center p-8">
          <div className="text-8xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold mb-4 text-green-600">
            Selamat! Kamu Hebat!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sekarang kamu sudah mengenal angka 1 sampai 10 dan bisa menghitung
            dengan baik!
          </p>

          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold rounded-lg flex items-center justify-center text-lg animate-pulse"
                style={{ animationDelay: `${num * 0.1}s` }}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold text-purple-600">
              Yang sudah kamu pelajari:
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🔢</div>
                <p className="text-sm">Mengenal Angka</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">👆</div>
                <p className="text-sm">Menghitung Benda</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const speakText = async (text: string) => {
    setIsPlaying(true);

    try {
      // Check if session is active, if not start it
      if (!isSessionActive) {
        await startSession();
        // Wait longer for session to properly initialize
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Double check if session is now active
        if (!isSessionActive) {
          console.warn("Session failed to start properly");
          setIsPlaying(false);
          return;
        }
      }

      // Additional safety check before sending message
      if (status.includes("Error") || status.includes("Disconnected")) {
        console.warn("Cannot send message - session in error state:", status);
        setIsPlaying(false);
        return;
      }

      // Send the narration text to AI for speech
      const narrationPrompt = `Tolong bacakan teks berikut dengan suara yang ramah dan cocok untuk anak SD. Gunakan intonasi yang menarik dan jelas: "${text}"`;
      await sendTextMessage(narrationPrompt);

      // Set a timeout to reset playing state
      setTimeout(() => {
        setIsPlaying(false);
      }, 8000); // Increased timeout for longer messages
    } catch (error) {
      console.error("Error in speakText:", error);
      setIsPlaying(false);

      // Try to restart session on error
      try {
        if (isSessionActive) {
          stopSession();
        }
      } catch (stopError) {
        console.error("Error stopping session:", stopError);
      }
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      stopCurrentNarration(); // Stop current narration
      const newSlideIndex = currentSlide + 1;
      setCurrentSlide(newSlideIndex);

      // Auto-play narration for the new slide
      const newSlideData = slides[newSlideIndex];
      if (newSlideData.narration) {
        setTimeout(() => {
          speakText(newSlideData.narration!);
        }, 500); // Small delay to let slide transition complete
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      stopCurrentNarration(); // Stop current narration
      const newSlideIndex = currentSlide - 1;
      setCurrentSlide(newSlideIndex);

      // Auto-play narration for the new slide
      const newSlideData = slides[newSlideIndex];
      if (newSlideData.narration) {
        setTimeout(() => {
          speakText(newSlideData.narration!);
        }, 500); // Small delay to let slide transition complete
      }
    }
  };

  // Auto-play narration when component first loads
  useEffect(() => {
    const firstSlide = slides[0];
    if (firstSlide && firstSlide.narration) {
      // Increased delay to ensure component is fully mounted and ready
      const timer = setTimeout(() => {
        speakText(firstSlide.narration!);
      }, 2000);

      // Cleanup timeout on unmount
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Pembelajaran: Mengenal Angka
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
                disabled={
                  isPlaying || (!isSessionActive && status.includes("Error"))
                }
                variant="outline"
                size="lg"
                className="px-6 py-3 rounded-full"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                {isPlaying
                  ? "Memutar..."
                  : !isSessionActive && status
                  ? "Memulai AI..."
                  : "Dengar Ulang"}
              </Button>
            )}

            <div className="flex space-x-2">
              {slides.map((_, index: number) => (
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
