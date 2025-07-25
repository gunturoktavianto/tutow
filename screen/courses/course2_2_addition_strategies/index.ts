import { registerCourse } from "@/lib/course-registry";
import { Course1_2_AdditionStrategies } from "./course";

// Register with multiple possible names to ensure compatibility
registerCourse("Addition Strategies", {
  component: Course1_2_AdditionStrategies,
  metadata: {
    title: "Addition Strategies",
    description:
      "Belajar strategi penjumlahan lanjutan: penjumlahan hingga 20, 3 penjumlah, garis bilangan, dan penjumlah yang hilang",
    estimatedTime: "35-45 menit",
    difficulty: "easy",
    topics: [
      "addition-strategies",
      "number-lines",
      "missing-addends",
      "three-addends",
    ],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

registerCourse("Strategi Penjumlahan", {
  component: Course1_2_AdditionStrategies,
  metadata: {
    title: "Strategi Penjumlahan",
    description:
      "Belajar strategi penjumlahan lanjutan: penjumlahan hingga 20, 3 penjumlah, garis bilangan, dan penjumlah yang hilang",
    estimatedTime: "35-45 menit",
    difficulty: "easy",
    topics: [
      "addition-strategies",
      "number-lines",
      "missing-addends",
      "three-addends",
    ],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

registerCourse("Addition Sums up to 20", {
  component: Course1_2_AdditionStrategies,
  metadata: {
    title: "Addition Sums up to 20",
    description:
      "Belajar strategi penjumlahan lanjutan: penjumlahan hingga 20, 3 penjumlah, garis bilangan, dan penjumlah yang hilang",
    estimatedTime: "35-45 menit",
    difficulty: "easy",
    topics: [
      "addition-strategies",
      "number-lines",
      "missing-addends",
      "three-addends",
    ],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

export { Course1_2_AdditionStrategies };
