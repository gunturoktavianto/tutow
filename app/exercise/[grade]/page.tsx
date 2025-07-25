import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ExerciseGradePageProps {
  params: Promise<{
    grade: string;
  }>;
}

async function getGradeExerciseData(gradeName: string) {
  const grade = await prisma.grade.findUnique({
    where: { name: gradeName },
    include: {
      materials: {
        include: {
          _count: {
            select: {
              exercises: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return grade;
}

export default async function ExerciseGradePage({
  params,
}: ExerciseGradePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { grade: gradeName } = await params;
  const grade = await getGradeExerciseData(gradeName);

  if (!grade) {
    redirect("/exercise");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/exercise">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Latihan Soal - {grade.displayName}
        </h1>
        <p className="text-gray-600">Pilih materi untuk memulai latihan soal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grade.materials.map((material) => (
          <Link
            key={material.id}
            href={`/exercise/${grade.name}/${material.name}`}
            className="block"
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {material.displayName}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {material.description}
                    </CardDescription>
                  </div>
                  <BookOpen className="h-6 w-6 text-blue-500 ml-2 flex-shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      {material._count.exercises} soal
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    ~10 menit
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {grade.materials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada materi tersedia
          </h3>
          <p className="text-gray-600">
            Materi latihan soal untuk kelas ini sedang dalam pengembangan.
          </p>
        </div>
      )}
    </div>
  );
}
