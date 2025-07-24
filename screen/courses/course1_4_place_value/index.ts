import { registerCourse } from "@/lib/course-registry";
import { Course1_4_PlaceValue } from "./course";

// Register with multiple possible names to ensure compatibility
registerCourse("Place Value", {
  component: Course1_4_PlaceValue,
  metadata: {
    title: "Place Value",
    description:
      "Belajar tentang nilai tempat puluhan dan satuan dengan cara yang menyenangkan menggunakan bola-bola interaktif",
    estimatedTime: "25-35 menit",
    difficulty: "easy",
    topics: ["place-value", "tens-ones", "counting", "number-composition"],
    gradeLevel: 1,
    materialType: "place-value",
  },
});

registerCourse("Nilai Tempat", {
  component: Course1_4_PlaceValue,
  metadata: {
    title: "Nilai Tempat",
    description:
      "Belajar tentang nilai tempat puluhan dan satuan dengan cara yang menyenangkan menggunakan bola-bola interaktif",
    estimatedTime: "25-35 menit",
    difficulty: "easy",
    topics: ["place-value", "tens-ones", "counting", "number-composition"],
    gradeLevel: 1,
    materialType: "place-value",
  },
});

registerCourse("Place Value (Tens and Ones)", {
  component: Course1_4_PlaceValue,
  metadata: {
    title: "Place Value (Tens and Ones)",
    description:
      "Belajar tentang nilai tempat puluhan dan satuan dengan cara yang menyenangkan menggunakan bola-bola interaktif",
    estimatedTime: "25-35 menit",
    difficulty: "easy",
    topics: ["place-value", "tens-ones", "counting", "number-composition"],
    gradeLevel: 1,
    materialType: "place-value",
  },
});

export { Course1_4_PlaceValue };
