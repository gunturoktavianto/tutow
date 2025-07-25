import Image from "next/image";

export default function FeatureSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-20 right-20 w-8 h-8 bg-black transform rotate-45"></div>
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-cyan-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-60 left-20 w-12 h-12 bg-cyan-300 rounded-full opacity-40"></div>
      <div className="absolute top-40 left-8 w-6 h-6 bg-black rounded-full"></div>
      <div className="absolute top-48 left-16 w-4 h-4 bg-black rounded-full opacity-60"></div>
      <div className="absolute top-56 left-12 w-3 h-3 bg-black rounded-full opacity-40"></div>
      <div className="absolute bottom-20 right-40 w-20 h-20 bg-green-300 rounded-full opacity-50"></div>
      <div className="absolute bottom-40 right-20 w-16 h-16 bg-green-200 rounded-full opacity-30"></div>

      <div className="absolute top-32 left-16 w-24 h-24 opacity-40">
        <Image
          src="/Layer_17.svg"
          alt="Decorative element"
          width={96}
          height={96}
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-1/2 right-12 w-20 h-32 opacity-30">
        <Image
          src="/Layer_18.svg"
          alt="Decorative element"
          width={80}
          height={128}
          className="w-full h-full"
        />
      </div>

      <div className="absolute bottom-32 left-8 w-28 h-20 opacity-35">
        <Image
          src="/Layer_19.svg"
          alt="Decorative element"
          width={112}
          height={80}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-orange-500">Bukan Hanya Belajar,</span>{" "}
            <span className="text-green-600 italic">tapi</span>{" "}
            <span className="text-yellow-500">Dunia Penuh Tantangan</span>
          </h2>

          <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
            <p className="text-lg leading-relaxed">
              <span className="font-bold text-gray-900">TUTOW</span> adalah
              dunia baru untuk anak-anak menjelajahi matematika dengan cara yang
              menyenangkan. Dengan kombinasi AI Tutor berbahasa Indonesia, game
              edukatif, dan pendekatan Singapore Math, TUTOW membuat proses
              belajar terasa seperti bermain dan bertumbuh.
            </p>

            <p className="text-lg leading-relaxed italic text-gray-600">
              Kami percaya setiap anak bisa mencintai matematika dan menguasai
              problem solving, asal diberikan pengalaman yang tepat.
            </p>

            <p className="text-lg leading-relaxed font-semibold text-gray-800">
              Dan TUTOW hadir untuk membuktikannya.
            </p>
          </div>
        </div>

        
      </div>
    </section>
  );
}
