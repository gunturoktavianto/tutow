"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { titleToSlug } from "@/lib/utils";
import { CourseLoader } from "@/lib/course-loader";
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
  const [showInteractiveContent, setShowInteractiveContent] = useState(true);

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

  const renderInteractiveCourse = () => {
    if (!course?.id) {
      return <DefaultCourseFallback course={course} />;
    }

    return (
      <CourseLoader
        courseId={course.title}
        courseData={course}
        fallback={<DefaultCourseFallback course={course} />}
        onError={(error) => {
          console.error("Error loading course component:", error);
        }}
      />
    );
  };

  const DefaultCourseFallback = ({ course }: { course: Course | null }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-6xl mb-4">🎓</div>
      <h3 className="text-xl font-semibold mb-2">Konten Interaktif</h3>
      <p className="text-gray-600 mb-4">
        Di sini akan ditampilkan konten pembelajaran interaktif untuk course "
        {course?.title}"
      </p>
      <div className="text-sm text-gray-500 mb-4">
        Content type: {course?.content?.type || "interactive"}
      </div>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          ⚠️ Konten interaktif untuk course ini belum tersedia atau sedang dalam
          pengembangan.
        </p>
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

  if (showInteractiveContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href={`/learning/${gradeNumber}/${materialId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Materi
              </Button>
            </Link>
            {course && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  {material?.displayName} • {course.title}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">
                  Aktif
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="pb-8">{renderInteractiveCourse()}</div>
      </div>
    );
  }

  // Since we're going directly to interactive content, we don't need the overview page
  return null;
}
