import { registerCourse } from "@/lib/course-registry";
import { Course1_2_NumberBonds } from "./course";

// Register with multiple possible names to ensure compatibility
registerCourse("Number Bonds & Basic Addition", {
  component: Course1_2_NumberBonds,
  metadata: {
    title: "Number Bonds & Basic Addition",
    description:
      "Belajar tentang ikatan bilangan dan penjumlahan dasar dengan cara yang interaktif dan menyenangkan",
    estimatedTime: "30-40 menit",
    difficulty: "easy",
    topics: ["number-bonds", "addition", "basic-math", "visual-math"],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

registerCourse("Ikatan Bilangan & Penjumlahan Dasar", {
  component: Course1_2_NumberBonds,
  metadata: {
    title: "Ikatan Bilangan & Penjumlahan Dasar",
    description:
      "Belajar tentang ikatan bilangan dan penjumlahan dasar dengan cara yang interaktif dan menyenangkan",
    estimatedTime: "30-40 menit",
    difficulty: "easy",
    topics: ["number-bonds", "addition", "basic-math", "visual-math"],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

registerCourse("Number Bonds", {
  component: Course1_2_NumberBonds,
  metadata: {
    title: "Number Bonds",
    description:
      "Belajar tentang ikatan bilangan dan penjumlahan dasar dengan cara yang interaktif dan menyenangkan",
    estimatedTime: "30-40 menit",
    difficulty: "easy",
    topics: ["number-bonds", "addition", "basic-math", "visual-math"],
    gradeLevel: 1,
    materialType: "math-operations",
  },
});

export { Course1_2_NumberBonds };
