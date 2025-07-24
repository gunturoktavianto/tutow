import { registerCourse } from "@/lib/course-registry";
import { Course1_3_PolaPerbandingan } from "./course";

registerCourse("Pola Bilangan & Perbandingan", {
  component: Course1_3_PolaPerbandingan,
  metadata: {
    title: "Pola Bilangan & Perbandingan",
    description:
      "Belajar mengenali pola angka dan membandingkan angka untuk menentukan mana yang lebih besar atau lebih kecil",
    estimatedTime: "20-30 menit",
    difficulty: "easy",
    topics: ["number-patterns", "comparison", "ordering", "basic-math"],
    gradeLevel: 1,
    materialType: "bilangan",
  },
});

export { Course1_3_PolaPerbandingan };
