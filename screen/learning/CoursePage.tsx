"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Target, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { titleToSlug } from "@/lib/utils";
import { CourseLoader } from "@/lib/course-loader";
import { loadMaterialComponent } from "@/lib/course-loader";
import { Suspense } from "react";
import { AITutor, AITutorRef } from "@/components/ai-tutor";
import "@/screen/courses";

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  content: any;
  xpReward: number;
}

interface Material {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  courses: Course[];
  grade: {
    name: string;
    displayName: string;
  };
}

interface CoursePageProps {
  gradeNumber: number;
  materialId: string;
  courseSlug: string;
}

export function CoursePage({
  gradeNumber,
  materialId,
  courseSlug,
}: CoursePageProps) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"material" | "exercise">("material");
  const aiTutorRef = useRef<AITutorRef>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const gradesResponse = await fetch("/api/grades");
        const gradesData = await gradesResponse.json();
        const grade = gradesData.grades.find(
          (g: any) => g.name === gradeNumber.toString()
        );

        if (!grade) {
          setError("Kelas tidak ditemukan");
          return;
        }

        const materialsResponse = await fetch(
          `/api/materials?gradeId=${grade.id}`
        );
        const materialsData = await materialsResponse.json();
        const targetMaterial = materialsData.materials.find(
          (m: any) => m.name === materialId
        );

        if (!targetMaterial) {
          setError("Materi tidak ditemukan");
          return;
        }

        const coursesResponse = await fetch(
          `/api/courses?materialId=${targetMaterial.id}`
        );
        const coursesData = await coursesResponse.json();
        const materialData = coursesData.material;

        const targetCourse = materialData.courses.find(
          (c: Course) => titleToSlug(c.title) === courseSlug
        );

        if (!targetCourse) {
          setError("Course tidak ditemukan");
          return;
        }

        setMaterial(materialData);
        setCourse(targetCourse);
      } catch (err) {
        setError("Gagal memuat data");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [gradeNumber, materialId, courseSlug]);

  const getCourseId = (courseTitle: string) => {
    const courseMapping: { [key: string]: string } = {
      "Menghitung & Menulis Angka": "course1_1_bilangan",
      "Bilangan Ganjil, Genap & Urutan": "course1_2_ganjil_genap_urutan",
      "Pola Bilangan & Perbandingan": "course1_3_pola_perbandingan",
      "Place Value": "course1_4_place_value",
      "Number Bonds & Basic Addition": "course2_1_number_bonds",
      "Addition Strategies": "course2_2_addition_strategies",
    };

    return (
      courseMapping[courseTitle] ||
      courseTitle.toLowerCase().replace(/\s+/g, "_")
    );
  };

  const renderMaterialContent = () => {
    if (!course?.title) {
      return <MaterialFallback course={course} />;
    }

    const courseId = getCourseId(course.title);
    const MaterialComponent = loadMaterialComponent(courseId);

    if (!MaterialComponent) {
      return <MaterialFallback course={course} />;
    }

    return (
      <Suspense fallback={<MaterialLoadingFallback />}>
        <MaterialComponent
          courseId={courseId}
          courseData={course}
          mode="material"
          onExplainMaterial={handleExplainMaterial}
          onExplainProblem={handleExplainProblem}
        />
      </Suspense>
    );
  };

  const renderExerciseContent = () => {
    if (!course?.id) {
      return <ExerciseFallback course={course} />;
    }

    return (
      <CourseLoader
        courseId={course.title}
        courseData={course}
        fallback={<ExerciseFallback course={course} />}
        onError={(error) => {
          console.error("Error loading course component:", error);
        }}
        onExplainMaterial={handleExplainMaterial}
        onExplainProblem={handleExplainProblem}
      />
    );
  };

  const handleExplainMaterial = (material: string) => {
    if (aiTutorRef.current?.explainMaterial) {
      aiTutorRef.current.explainMaterial(material);
    }
  };

  const handleExplainProblem = (problem: string) => {
    if (aiTutorRef.current?.explainProblem) {
      aiTutorRef.current.explainProblem(problem);
    }
  };

  const MaterialLoadingFallback = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat materi pembelajaran...</p>
      </div>
    </div>
  );

  const MaterialFallback = ({ course }: { course: Course | null }) => (
    <div className="container mx-auto px-4 py-8">
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2 text-blue-800">
          Materi Pembelajaran
        </h3>
        <p className="text-blue-600 mb-4">
          Materi pembelajaran untuk "{course?.title}" sedang dalam pengembangan
        </p>
        <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 Sementara ini, silakan gunakan mode "Latihan Soal" untuk belajar
            dengan mengerjakan soal
          </p>
        </div>
        <Button
          onClick={() => setMode("exercise")}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          Beralih ke Latihan Soal
        </Button>
      </div>
    </div>
  );

  const ExerciseFallback = ({ course }: { course: Course | null }) => (
    <div className="container mx-auto px-4 py-8">
      <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold mb-2 text-green-800">
          Latihan Soal
        </h3>
        <p className="text-green-600 mb-4">
          Latihan soal untuk "{course?.title}" belum tersedia
        </p>
        <div className="text-sm text-gray-500 mb-4">
          Content type: {course?.content?.type || "interactive"}
        </div>
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            ⚠️ Konten latihan soal untuk course ini sedang dalam pengembangan
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat course...</p>
        </div>
      </div>
    );
  }

  if (error || !material || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {error || "Course tidak ditemukan"}
          </h1>
          <Link href={`/learning/${gradeNumber}/${materialId}`}>
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Materi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href={`/learning/${gradeNumber}/${materialId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Materi
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {material?.displayName} • {course.title}
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={mode === "material" ? "default" : "ghost"}
                onClick={() => setMode("material")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  mode === "material"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Pembelajaran
              </Button>
              <Button
                size="sm"
                variant={mode === "exercise" ? "default" : "ghost"}
                onClick={() => setMode("exercise")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  mode === "exercise"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <Target className="w-3 h-3 mr-1" />
                Latihan Soal
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  mode === "material" ? "bg-blue-500" : "bg-green-500"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  mode === "material" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {mode === "material" ? "Mode Pembelajaran" : "Mode Latihan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8">
        {mode === "material"
          ? renderMaterialContent()
          : renderExerciseContent()}
      </div>

      <AITutor
        ref={aiTutorRef}
        courseTitle={course.title}
        currentMaterial={`${course.title} - ${
          course.description || "Materi pembelajaran matematika"
        }`}
      />
    </div>
  );
}
