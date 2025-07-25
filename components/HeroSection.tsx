import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Belajar Matematika Jadi Petualangan Seru!
          </h1>

          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Tutow Logo"
              width={400}
              height={120}
              className="mx-auto"
              priority
            />
          </div>

          <div className="mb-8">
            <p className="text-lg md:text-xl text-white mb-2">
              <span className="font-semibold">Main, belajar,</span> dan tumbuh
              bersama
            </p>
            <p className="text-lg md:text-xl text-white">
              <span className="font-semibold text-yellow-300">AI tutor</span>{" "}
              yang siap membantu setiap saat!
            </p>
          </div>

          <Link href="/register">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Coba GRATIS ›
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
