import { registerCourse } from "@/lib/course-registry";
import { Course1_2_GanjilGenapUrutan } from "./course";

registerCourse("Bilangan Ganjil, Genap & Urutan", {
  component: Course1_2_GanjilGenapUrutan,
  metadata: {
    title: "Bilangan Ganjil, Genap & Urutan",
    description:
      "Belajar tentang urutan bilangan (pertama, kedua, dst) dan membedakan bilangan ganjil dengan genap",
    estimatedTime: "20-30 menit",
    difficulty: "easy",
    topics: ["ordinal-numbers", "odd-even", "number-patterns", "basic-math"],
    gradeLevel: 1,
    materialType: "bilangan",
  },
});

export { Course1_2_GanjilGenapUrutan };
