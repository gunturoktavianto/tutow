import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed Plant Types
  console.log("🌿 Seeding plant types...");
  
  const plantTypes = [
    // Bronze Plants (2)
    {
      name: "sunflower_bronze",
      displayName: "Bunga Matahari Perunggu",
      description: "Bunga matahari cantik berwarna kuning cerah",
      grade: "bronze",
      seedPrice: 20,
      waterCost: 2,
      growthStages: 5,
      xpReward: 2,
      imageUrl: "/plants/sunflower_bronze.png"
    },
    {
      name: "carrot_bronze", 
      displayName: "Wortel Perunggu",
      description: "Wortel segar dan bergizi tinggi",
      grade: "bronze",
      seedPrice: 20,
      waterCost: 2,
      growthStages: 5,
      xpReward: 2,
      imageUrl: "/plants/carrot_bronze.png"
    },
    
    // Silver Plants (3)
    {
      name: "rose_silver",
      displayName: "Mawar Perak",
      description: "Mawar merah yang harum dan indah",
      grade: "silver",
      seedPrice: 30,
      waterCost: 3,
      growthStages: 5,
      xpReward: 3,
      imageUrl: "/plants/rose_silver.png"
    },
    {
      name: "tomato_silver",
      displayName: "Tomat Perak",
      description: "Tomat merah segar dan lezat",
      grade: "silver",
      seedPrice: 30,
      waterCost: 3,
      growthStages: 5,
      xpReward: 3,
      imageUrl: "/plants/tomato_silver.png"
    },
    {
      name: "lavender_silver",
      displayName: "Lavender Perak", 
      description: "Lavender ungu yang menenangkan",
      grade: "silver",
      seedPrice: 30,
      waterCost: 3,
      growthStages: 5,
      xpReward: 3,
      imageUrl: "/plants/lavender_silver.png"
    },
    
    // Gold Plants (5)
    {
      name: "orchid_gold",
      displayName: "Anggrek Emas",
      description: "Anggrek eksotis yang langka dan berharga",
      grade: "gold",
      seedPrice: 50,
      waterCost: 5,
      growthStages: 5,
      xpReward: 5,
      imageUrl: "/plants/orchid_gold.png"
    },
    {
      name: "bonsai_gold",
      displayName: "Bonsai Emas",
      description: "Pohon bonsai miniatur yang elegan",
      grade: "gold",
      seedPrice: 50,
      waterCost: 5,
      growthStages: 5,
      xpReward: 5,
      imageUrl: "/plants/bonsai_gold.png"
    },
    {
      name: "dragon_fruit_gold",
      displayName: "Buah Naga Emas",
      description: "Buah naga eksotis dengan rasa yang unik",
      grade: "gold",
      seedPrice: 50,
      waterCost: 5,
      growthStages: 5,
      xpReward: 5,
      imageUrl: "/plants/dragon_fruit_gold.png"
    },
    {
      name: "cherry_blossom_gold",
      displayName: "Sakura Emas",
      description: "Bunga sakura yang indah dan menawan",
      grade: "gold",
      seedPrice: 50,
      waterCost: 5,
      growthStages: 5,
      xpReward: 5,
      imageUrl: "/plants/cherry_blossom_gold.png"
    },
    {
      name: "golden_lotus_gold",
      displayName: "Teratai Emas",
      description: "Teratai emas yang suci dan berkilau",
      grade: "gold",
      seedPrice: 50,
      waterCost: 5,
      growthStages: 5,
      xpReward: 5,
      imageUrl: "/plants/golden_lotus_gold.png"
    }
  ];

  for (const plant of plantTypes) {
    await prisma.plantType.upsert({
      where: { name: plant.name },
      update: {},
      create: plant,
    });
  }

  console.log(`✅ Created ${plantTypes.length} plant types`);

  // Existing seed data (if any)...
  
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  // // Create Grade 1
  // const grade1 = await prisma.grade.upsert({
  //   where: { name: "1" },
  //   update: {},
  //   create: {
  //     name: "1",
  //     displayName: "Kelas 1",
  //     order: 1,
  //   },
  // });

  // console.log("✅ Grade 1 created");

  // // Seed Materials and Courses for Grade 1
  // const materialsData = [
  //   {
  //     name: "counting-and-numbers",
  //     displayName: "Menghitung dan Bilangan",
  //     description:
  //       "Belajar menghitung, menulis angka, dan memahami konsep bilangan dasar",
  //     order: 1,
  //     imageUrl: "/images/materials/counting.png",
  //     courses: [
  //       {
  //         title: "Menghitung & Menulis Angka",
  //         description:
  //           "Belajar menghitung hingga 20 & 100, menulis angka hingga 20 & 100",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "counting-up-to-20",
  //             "counting-up-to-100",
  //             "writing-numbers",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Bilangan Ganjil, Genap & Urutan",
  //         description:
  //           "Memahami bilangan ganjil & genap, serta bilangan urutan",
  //         level: 1,
  //         order: 2,
  //         content: {
  //           type: "interactive",
  //           lessons: ["odd-even-numbers", "ordinal-numbers"],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Pola Bilangan & Perbandingan",
  //         description:
  //           "Mengenali pola bilangan, membandingkan & mengurutkan hingga 20 & 100",
  //         level: 2,
  //         order: 3,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "number-patterns",
  //             "compare-order-20",
  //             "compare-order-100",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Nilai Tempat",
  //         description: "Memahami nilai tempat (puluhan dan satuan)",
  //         level: 2,
  //         order: 4,
  //         content: { type: "interactive", lessons: ["place-value-tens-ones"] },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Menghitung Loncat",
  //         description:
  //           "Belajar menghitung loncat dengan 2, 5, 10, 3, 4, 6, 7, 8, 9",
  //         level: 3,
  //         order: 5,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "skip-count-2",
  //             "skip-count-5",
  //             "skip-count-10",
  //             "skip-count-others",
  //           ],
  //         },
  //         xpReward: 25,
  //       },
  //     ],
  //   },
  //   {
  //     name: "math-operations",
  //     displayName: "Operasi Matematika",
  //     description:
  //       "Belajar penjumlahan, pengurangan, dan pengenalan perkalian & pembagian",
  //     order: 2,
  //     imageUrl: "/images/materials/operations.png",
  //     courses: [
  //       {
  //         title: "Ikatan Bilangan & Penjumlahan Dasar",
  //         description:
  //           "Ikatan bilangan hingga 10 & 20, penjumlahan 1 digit, penjumlahan dengan gambar",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "number-bonds-10",
  //             "number-bonds-20",
  //             "1-digit-addition",
  //             "addition-pictures",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Strategi Penjumlahan",
  //         description:
  //           "Penjumlahan hingga 20, ikatan bilangan 3 penjumlah, garis bilangan, penjumlah yang hilang",
  //         level: 1,
  //         order: 2,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "addition-up-to-20",
  //             "number-bonds-3-addends",
  //             "addition-number-lines",
  //             "missing-addends",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Penjumlahan hingga 100",
  //         description:
  //           "Ikatan bilangan hingga 100, penjumlahan hingga 100 (dengan & tanpa regrouping), teka-teki silang",
  //         level: 2,
  //         order: 3,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "number-bonds-100",
  //             "addition-100-no-regrouping",
  //             "addition-100-with-regrouping",
  //             "addition-crosswords",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Strategi Pengurangan",
  //         description:
  //           "Pengurangan dengan gambar, garis pengurangan, pengurangan dalam 20, pengurang yang hilang",
  //         level: 2,
  //         order: 4,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "subtraction-pictures",
  //             "subtraction-lines",
  //             "subtraction-within-20",
  //             "missing-subtrahends",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Pengurangan hingga 100",
  //         description:
  //           "Pengurangan dalam 100 (dengan & tanpa meminjam), teka-teki silang pengurangan",
  //         level: 2,
  //         order: 5,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "subtract-100-no-borrowing",
  //             "subtract-100-with-borrowing",
  //             "subtraction-crosswords",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Operasi Campuran",
  //         description:
  //           "Campuran penjumlahan & pengurangan hingga 20 & hingga 100",
  //         level: 3,
  //         order: 6,
  //         content: {
  //           type: "interactive",
  //           lessons: ["mixed-operations-20", "mixed-operations-100"],
  //         },
  //         xpReward: 25,
  //       },
  //       {
  //         title: "Pengenalan Perkalian & Pembagian",
  //         description:
  //           "Perkalian dengan gambar, susunan, pengelompokan (pembagian)",
  //         level: 3,
  //         order: 7,
  //         content: {
  //           type: "interactive",
  //           lessons: ["multiplication-pictures", "arrays", "grouping-division"],
  //         },
  //         xpReward: 25,
  //       },
  //     ],
  //   },
  //   {
  //     name: "shapes-and-geometry",
  //     displayName: "Bentuk & Geometri",
  //     description: "Mengenal bentuk-bentuk dasar, simetri, dan pola geometri",
  //     order: 3,
  //     imageUrl: "/images/materials/shapes.png",
  //     courses: [
  //       {
  //         title: "Bentuk Dasar & Menggambar",
  //         description: "Mengenal bentuk dasar dan belajar menggambar bentuk",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: ["basic-shapes", "drawing-shapes"],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Simetri & Pola",
  //         description: "Memahami simetri & bentuk, pola dengan bentuk",
  //         level: 2,
  //         order: 2,
  //         content: {
  //           type: "interactive",
  //           lessons: ["symmetry-shapes", "patterns-with-shapes"],
  //         },
  //         xpReward: 20,
  //       },
  //     ],
  //   },
  //   {
  //     name: "measurement",
  //     displayName: "Panjang, Massa, Waktu dan Uang",
  //     description:
  //       "Belajar mengukur panjang, massa, memahami waktu dan kalender",
  //     order: 4,
  //     imageUrl: "/images/materials/measurement.png",
  //     courses: [
  //       {
  //         title: "Mengukur Panjang & Massa",
  //         description:
  //           "Mengukur & membandingkan panjang, tinggi, berat, massa, timbangan seimbang",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "measuring-length",
  //             "comparing-height",
  //             "weight-mass",
  //             "balancing-scales",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Waktu & Kalender",
  //         description:
  //           "Membaca waktu (setengah jam), menggambar jarum jam, hari dalam seminggu, bulan, urutan waktu",
  //         level: 2,
  //         order: 2,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "telling-time-half-hour",
  //             "drawing-hands",
  //             "days-of-week",
  //             "months",
  //             "time-sequences",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //     ],
  //   },
  //   {
  //     name: "money",
  //     displayName: "Uang (USD, EUR, IDR)",
  //     description: "Mengenal mata uang, berbelanja, dan membuat grafik uang",
  //     order: 5,
  //     imageUrl: "/images/materials/money.png",
  //     courses: [
  //       {
  //         title: "Uang Amerika & Berbelanja",
  //         description:
  //           "Koin dolar, uang kertas hingga $100, berbelanja ($), grafik uang ($)",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "dollar-coins",
  //             "banknotes-100",
  //             "buying-things-usd",
  //             "money-graphs-usd",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //       {
  //         title: "Uang Euro & Berbelanja",
  //         description:
  //           "Koin euro, uang kertas hingga €100, berbelanja (EUR), grafik uang (EUR)",
  //         level: 2,
  //         order: 2,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "euro-coins",
  //             "euro-banknotes-100",
  //             "buying-things-eur",
  //             "money-graphs-eur",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //       {
  //         title: "Uang Rupiah & Berbelanja",
  //         description:
  //           "Koin rupiah, uang kertas hingga Rp100.000, berbelanja (IDR), grafik uang (IDR)",
  //         level: 2,
  //         order: 3,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "rupiah-coins",
  //             "rupiah-banknotes-100k",
  //             "buying-things-idr",
  //             "money-graphs-idr",
  //           ],
  //         },
  //         xpReward: 20,
  //       },
  //     ],
  //   },
  //   {
  //     name: "data-and-graphs",
  //     displayName: "Grafik Gambar & Tabel Turus",
  //     description:
  //       "Menggunakan tabel data, menggambar & membaca pictograph, tabel turus",
  //     order: 6,
  //     imageUrl: "/images/materials/graphs.png",
  //     courses: [
  //       {
  //         title: "Data & Grafik",
  //         description:
  //           "Menggunakan tabel data, menggambar & membaca pictograph, tabel turus",
  //         level: 1,
  //         order: 1,
  //         content: {
  //           type: "interactive",
  //           lessons: [
  //             "using-data-tables",
  //             "drawing-pictographs",
  //             "reading-pictographs",
  //             "tally-charts",
  //           ],
  //         },
  //         xpReward: 15,
  //       },
  //     ],
  //   },
  // ];

  // // Create materials and courses
  // for (const materialData of materialsData) {
  //   const { courses, ...material } = materialData;

  //   const createdMaterial = await prisma.material.upsert({
  //     where: {
  //       gradeId_order: {
  //         gradeId: grade1.id,
  //         order: material.order,
  //       },
  //     },
  //     update: {},
  //     create: {
  //       ...material,
  //       gradeId: grade1.id,
  //     },
  //   });

  //   console.log(`✅ Material "${material.displayName}" created`);

  //   // Create courses for this material
  //   for (const courseData of courses) {
  //     await prisma.course.upsert({
  //       where: {
  //         materialId_level_order: {
  //           materialId: createdMaterial.id,
  //           level: courseData.level,
  //           order: courseData.order,
  //         },
  //       },
  //       update: {},
  //       create: {
  //         ...courseData,
  //         materialId: createdMaterial.id,
  //       },
  //     });
  //   }

  //   console.log(
  //     `✅ ${courses.length} courses created for "${material.displayName}"`
  //   );
  // }

  console.log("🎉 Seed completed successfully!");


// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
