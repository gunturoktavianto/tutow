import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏆 Starting badge seeding...");

  const badges = [
    {
      name: "grade_1_master",
      displayName: "Master Kelas 1",
      description: "Menyelesaikan semua materi interaktif di Kelas 1",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "1",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "grade_2_master",
      displayName: "Master Kelas 2",
      description: "Menyelesaikan semua materi interaktif di Kelas 2",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "2",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "grade_3_master",
      displayName: "Master Kelas 3",
      description: "Menyelesaikan semua materi interaktif di Kelas 3",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "3",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "grade_4_master",
      displayName: "Master Kelas 4",
      description: "Menyelesaikan semua materi interaktif di Kelas 4",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "4",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "grade_5_master",
      displayName: "Master Kelas 5",
      description: "Menyelesaikan semua materi interaktif di Kelas 5",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "5",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "grade_6_master",
      displayName: "Master Kelas 6",
      description: "Menyelesaikan semua materi interaktif di Kelas 6",
      category: "grade",
      requirement: {
        type: "grade_completion",
        grade: "6",
        completionPercentage: 100,
      },
      imageUrl: "🎓",
    },
    {
      name: "first_steps",
      displayName: "Langkah Pertama",
      description: "Menjawab 10 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 10,
      },
      imageUrl: "👶",
    },
    {
      name: "getting_started",
      displayName: "Mulai Berjalan",
      description: "Menjawab 20 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 20,
      },
      imageUrl: "🚶",
    },
    {
      name: "half_century",
      displayName: "Setengah Abad",
      description: "Menjawab 50 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 50,
      },
      imageUrl: "🏃",
    },
    {
      name: "century_club",
      displayName: "Klub Seratus",
      description: "Menjawab 100 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 100,
      },
      imageUrl: "💯",
    },
    {
      name: "double_century",
      displayName: "Dua Ratus Hebat",
      description: "Menjawab 200 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 200,
      },
      imageUrl: "🔥",
    },
    {
      name: "five_hundred_strong",
      displayName: "Lima Ratus Kuat",
      description: "Menjawab 500 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 500,
      },
      imageUrl: "⭐",
    },
    {
      name: "thousand_master",
      displayName: "Master Seribu",
      description: "Menjawab 1000 soal latihan dengan benar",
      category: "exercise",
      requirement: {
        type: "correct_answers",
        count: 1000,
      },
      imageUrl: "👑",
    },
    {
      name: "bilangan_expert",
      displayName: "Ahli Bilangan",
      description: "Menyelesaikan semua materi Bilangan",
      category: "material",
      requirement: {
        type: "material_completion",
        materialNames: ["counting-and-numbers", "bilangan"],
      },
      imageUrl: "🔢",
    },
    {
      name: "operasi_expert",
      displayName: "Ahli Operasi",
      description: "Menyelesaikan semua materi Operasi Matematika",
      category: "material",
      requirement: {
        type: "material_completion",
        materialNames: ["math-operations", "operasi"],
      },
      imageUrl: "➕",
    },
    {
      name: "geometry_expert",
      displayName: "Ahli Geometri",
      description: "Menyelesaikan semua materi Bentuk & Geometri",
      category: "material",
      requirement: {
        type: "material_completion",
        materialNames: ["shapes-and-geometry", "geometri"],
      },
      imageUrl: "📐",
    },
    {
      name: "perfect_score",
      displayName: "Nilai Sempurna",
      description: "Mendapat skor 100% dalam satu sesi latihan",
      category: "milestone",
      requirement: {
        type: "perfect_session",
        accuracy: 100,
      },
      imageUrl: "🎯",
    },
    {
      name: "speed_demon",
      displayName: "Kilat Matematika",
      description: "Menyelesaikan 10 soal dalam waktu kurang dari 2 menit",
      category: "milestone",
      requirement: {
        type: "speed_completion",
        questions: 10,
        maxTime: 120,
      },
      imageUrl: "⚡",
    },
    {
      name: "consistent_learner",
      displayName: "Pelajar Konsisten",
      description: "Belajar selama 7 hari berturut-turut",
      category: "milestone",
      requirement: {
        type: "daily_streak",
        days: 7,
      },
      imageUrl: "📚",
    },
    {
      name: "exercise_enthusiast",
      displayName: "Pecinta Latihan",
      description: "Menyelesaikan 10 sesi latihan",
      category: "exercise",
      requirement: {
        type: "session_count",
        count: 10,
      },
      imageUrl: "🏋️",
    },
    {
      name: "gold_collector",
      displayName: "Kolektor Emas",
      description: "Mengumpulkan 1000 gold dari latihan",
      category: "milestone",
      requirement: {
        type: "gold_earned",
        amount: 1000,
      },
      imageUrl: "🪙",
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: {
        ...badge,
        requirement: JSON.stringify(badge.requirement),
      },
    });
  }

  console.log(`✅ Created ${badges.length} achievement badges`);
  console.log("🎉 Badge seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Badge seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
