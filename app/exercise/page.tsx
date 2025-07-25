import { Suspense } from "react";
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
import { BookOpen, Trophy, Clock } from "lucide-react";
import Link from "next/link";

async function getExerciseData() {
  // Only get Grade 1 materials
  const grade1 = await prisma.grade.findUnique({
    where: { name: "1" },
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

  return grade1 ? [grade1] : [];
}

export default async function ExercisePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const grades = await getExerciseData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Latihan Soal</h1>
        <p className="text-gray-600">
          Pilih kelas dan materi untuk memulai latihan soal
        </p>
      </div>

      <div className="grid gap-6">
        {grades.map((grade) => (
          <Card key={grade.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="text-xl">{grade.displayName}</CardTitle>
              <CardDescription className="text-blue-100">
                {grade.materials.length} materi tersedia
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grade.materials.map((material) => (
                  <Link
                    key={material.id}
                    href={`/exercise/${grade.name}/${material.name}`}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {material.displayName}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {material.description}
                            </p>
                          </div>
                          <BookOpen className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0" />
                        </div>

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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
