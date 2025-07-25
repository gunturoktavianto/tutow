import React, { ComponentType } from "react";
import { getCourseComponent, CourseMetadata } from "./course-registry";
import { lazy } from "react";

export interface CourseLoaderProps {
  courseId: string;
  courseData?: any; // Additional course data from database
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export interface CourseComponentProps {
  courseId: string;
  courseData?: any;
  mode?: "material" | "exercise";
}

export function CourseLoader({
  courseId,
  courseData,
  fallback,
  onError,
}: CourseLoaderProps): React.ReactElement {
  try {
    const courseEntry = getCourseComponent(courseId);

    if (!courseEntry) {
      return (fallback || <DefaultCourseFallback />) as React.ReactElement;
    }

    const { component: CourseComponent, metadata } = courseEntry;

    return React.createElement(CourseComponent, {
      courseId: courseData?.id || courseId, // Use database ID for progress tracking
      courseData,
      metadata,
    } as CourseComponentProps);
  } catch (error) {
    console.error(`Error loading course ${courseId}:`, error);

    if (onError) {
      onError(error as Error);
    }

    return (fallback || <DefaultCourseFallback />) as React.ReactElement;
  }
}

export function DefaultCourseFallback(): React.ReactElement {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="text-6xl mb-4">🎓</div>
      <h3 className="text-xl font-semibold mb-2">Konten Interaktif</h3>
      <p className="text-gray-600 mb-4">
        Konten pembelajaran interaktif sedang dimuat...
      </p>
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          ⚠️ Konten interaktif untuk course ini belum tersedia atau sedang dalam
          pengembangan.
        </p>
      </div>
    </div>
  );
}

export const courseComponents = {
  course1_1_bilangan: lazy(() =>
    import("@/screen/courses/course1_1_bilangan").then((mod) => ({
      default: mod.Course1_1_Bilangan,
    }))
  ),
  course1_2_ganjil_genap_urutan: lazy(() =>
    import("@/screen/courses/course1_2_ganjil_genap_urutan").then((mod) => ({
      default: mod.Course1_2_GanjilGenapUrutan,
    }))
  ),
  course1_3_pola_perbandingan: lazy(() =>
    import("@/screen/courses/course1_3_pola_perbandingan").then((mod) => ({
      default: mod.Course1_3_PolaPerbandingan,
    }))
  ),
  course1_4_place_value: lazy(() =>
    import("@/screen/courses/course1_4_place_value").then((mod) => ({
      default: mod.Course1_4_PlaceValue,
    }))
  ),
  course2_1_number_bonds: lazy(() =>
    import("@/screen/courses/course2_1_number_bonds").then((mod) => ({
      default: mod.Course1_2_NumberBonds,
    }))
  ),
  course2_2_addition_strategies: lazy(() =>
    import("@/screen/courses/course2_2_addition_strategies").then((mod) => ({
      default: mod.Course1_2_AdditionStrategies,
    }))
  ),
};

export const loadCourseComponent = (courseId: string) => {
  return courseComponents[courseId as keyof typeof courseComponents];
};

export const MaterialComponents = {
  course1_1_bilangan: lazy(() =>
    import("@/screen/materials").then((mod) => ({
      default: mod.Course1_1_BilanganMaterial,
    }))
  ),
  course1_2_ganjil_genap_urutan: lazy(() =>
    import("@/screen/materials").then((mod) => ({
      default: mod.Course1_2_GanjilGenapUrutanMaterial,
    }))
  ),
  course1_3_pola_perbandingan: lazy(() =>
    import("@/screen/materials").then((mod) => ({
      default: mod.Course1_3_PolaPerbandinganMaterial,
    }))
  ),
  course2_1_number_bonds: lazy(() =>
    import("@/screen/materials").then((mod) => ({
      default: mod.Course2_1_NumberBondsMaterial,
    }))
  ),
};

export const loadMaterialComponent = (courseId: string) => {
  return MaterialComponents[courseId as keyof typeof MaterialComponents];
};

export function hasCourseComponent(courseId: string): boolean {
  return getCourseComponent(courseId) !== null;
}
