"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Clock, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { titleToSlug } from "@/lib/utils";

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // First get the grade ID
        const gradesResponse = await fetch("/api/grades");
        const gradesData = await gradesResponse.json();
        const grade = gradesData.grades.find(
          (g: any) => g.name === gradeNumber.toString()
        );

        if (!grade) {
          setError("Kelas tidak ditemukan");
          return;
        }

        // Get materials for this grade to find the right material
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

        // Get the material with courses
        const coursesResponse = await fetch(
          `/api/courses?materialId=${targetMaterial.id}`
        );
        const coursesData = await coursesResponse.json();
        const materialData = coursesData.material;

        // Find course by title slug
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

  const levelColors = {
    1: "from-blue-500 to-blue-600",
    2: "from-green-500 to-green-600",
    3: "from-purple-500 to-purple-600",
  };

  const levelNames = {
    1: "Pemahaman Dasar",
    2: "Aplikasi",
    3: "Soal Eksploratif",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/learning" className="hover:text-blue-600">
          Belajar
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/learning/${gradeNumber}`} className="hover:text-blue-600">
          Kelas {gradeNumber}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/learning/${gradeNumber}/${materialId}`}
          className="hover:text-blue-600"
        >
          {material.displayName}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium">{course.title}</span>
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link href={`/learning/${gradeNumber}/${materialId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Materi
          </Button>
        </Link>
      </div>

      {/* Course Header */}
      <div className="mb-8">
        <div
          className={`bg-gradient-to-r ${
            levelColors[course.level as keyof typeof levelColors]
          } rounded-2xl p-8 text-white`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {course.level}
                </div>
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {levelNames[course.level as keyof typeof levelNames]}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-lg opacity-90">{course.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>15-25 menit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>+{course.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Konten Pembelajaran</CardTitle>
              <CardDescription>
                Ikuti langkah-langkah pembelajaran di bawah ini untuk
                menyelesaikan course ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Interactive Content Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Konten Interaktif
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Di sini akan ditampilkan konten pembelajaran interaktif
                    untuk course "{course.title}"
                  </p>
                  <div className="text-sm text-gray-500">
                    Content type: {course.content?.type || "interactive"}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button className="flex-1" size="lg">
                    Mulai Pembelajaran
                  </Button>
                  <Button variant="outline" size="lg">
                    Lihat Contoh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kemajuan</span>
                  <span className="font-medium">0%</span>
                </div>
                <Progress value={0} className="h-2" />

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-orange-600 font-medium">
                      Belum dimulai
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi waktu:</span>
                    <span className="font-medium">15-25 menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP yang didapat:</span>
                    <span className="font-medium text-blue-600">
                      +{course.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Tips Belajar</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Siapkan alat tulis untuk mencatat</li>
                <li>• Pastikan koneksi internet stabil</li>
                <li>• Fokus dan hindari gangguan</li>
                <li>• Jangan ragu bertanya jika bingung</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
