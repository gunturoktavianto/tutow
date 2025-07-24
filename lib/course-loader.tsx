import React, { ComponentType } from "react";
import { getCourseComponent, CourseMetadata } from "./course-registry";

export interface CourseLoaderProps {
  courseId: string;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export interface CourseComponentProps {
  courseId: string;
  metadata?: CourseMetadata;
}

export function CourseLoader({
  courseId,
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
      courseId,
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

export function loadCourseComponent(
  courseId: string
): ComponentType<any> | null {
  const courseEntry = getCourseComponent(courseId);
  return courseEntry ? courseEntry.component : null;
}

export function hasCourseComponent(courseId: string): boolean {
  return getCourseComponent(courseId) !== null;
}
