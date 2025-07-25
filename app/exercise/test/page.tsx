"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  order: number;
  _count: {
    exercises: number;
    courses: number;
  };
}

interface Grade {
  id: string;
  name: string;
  displayName: string;
  materials: Material[];
}

export default function ExerciseTestPage() {
  const [gradeData, setGradeData] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/exercises/materials");
      if (response.ok) {
        const data = await response.json();
        setGradeData(data.grade);
      } else {
        setError("Failed to fetch materials");
      }
    } catch (err) {
      setError("Error fetching materials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const testExercise = async (material: Material) => {
    try {
      const response = await fetch(
        `/api/exercises?grade=1&material=${material.name}`
      );
      if (response.ok) {
        const data = await response.json();
        alert(
          `Found ${data.exercises.length} exercises for ${
            material.displayName
          }:\n\n${data.exercises
            .slice(0, 3)
            .map((ex: any, i: number) => `${i + 1}. ${ex.question}`)
            .join("\n")}\n\n...and ${data.exercises.length - 3} more`
        );
      } else {
        alert(`No exercises found for ${material.displayName}`);
      }
    } catch (err) {
      alert(`Error testing ${material.displayName}: ${err}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchMaterials} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!gradeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">No Grade 1 data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Exercise Test Page - {gradeData.displayName}
        </h1>
        <p className="text-gray-600">
          Testing existing materials and their exercises
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gradeData.materials.map((material) => (
          <Card key={material.id} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{material.displayName}</CardTitle>
              <p className="text-sm text-gray-600">{material.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {material._count.courses} courses
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {material._count.exercises} exercises
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Material name:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {material.name}
                  </code>
                </p>
                <p className="text-xs text-gray-500">Order: {material.order}</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => testExercise(material)}
                  className="w-full"
                  size="sm"
                  disabled={material._count.exercises === 0}
                >
                  Test Exercises ({material._count.exercises})
                </Button>

                <Button
                  onClick={() =>
                    window.open(`/exercise/1/${material.name}`, "_blank")
                  }
                  variant="outline"
                  className="w-full"
                  size="sm"
                  disabled={material._count.exercises === 0}
                >
                  Open Exercise Page
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gradeData.materials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No materials found for Grade 1</p>
        </div>
      )}
    </div>
  );
}
