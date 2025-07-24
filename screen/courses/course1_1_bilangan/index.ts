import { registerCourse } from "@/lib/course-registry";
import { Course1_1_Bilangan } from "./course";

registerCourse("cmdheim6v0004yz100yq8h178", {
  component: Course1_1_Bilangan,
  metadata: {
    title: "Menghitung & Menulis Angka",
    description:
      "Belajar menghitung objek dan menulis angka dalam bentuk angka dan kata",
    estimatedTime: "15-25 menit",
    difficulty: "easy",
    topics: ["counting", "number-writing", "number-words", "basic-math"],
    gradeLevel: 1,
    materialType: "bilangan",
  },
});

export { Course1_1_Bilangan };
