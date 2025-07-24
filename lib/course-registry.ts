import { ComponentType } from "react";

export interface CourseMetadata {
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  gradeLevel: number;
  materialType: string;
}

export interface InteractiveCourseEntry {
  component: ComponentType<any>;
  metadata: CourseMetadata;
}

export type CourseMapping = Record<string, InteractiveCourseEntry>;

export const courseMapping: CourseMapping = {};

export function registerCourse(
  courseId: string,
  entry: InteractiveCourseEntry
): void {
  courseMapping[courseId] = entry;
}

export function getCourseComponent(
  courseId: string
): InteractiveCourseEntry | null {
  return courseMapping[courseId] || null;
}

export function isCourseRegistered(courseId: string): boolean {
  return courseId in courseMapping;
}

export function getAllRegisteredCourses(): string[] {
  return Object.keys(courseMapping);
}

export function getCoursesByGrade(
  gradeLevel: number
): Array<{ id: string; entry: InteractiveCourseEntry }> {
  return Object.entries(courseMapping)
    .filter(([_, entry]) => entry.metadata.gradeLevel === gradeLevel)
    .map(([id, entry]) => ({ id, entry }));
}

export function getCoursesByMaterial(
  materialType: string
): Array<{ id: string; entry: InteractiveCourseEntry }> {
  return Object.entries(courseMapping)
    .filter(([_, entry]) => entry.metadata.materialType === materialType)
    .map(([id, entry]) => ({ id, entry }));
}

export function getCourseMetadata(courseId: string): CourseMetadata | null {
  const course = getCourseComponent(courseId);
  return course ? course.metadata : null;
}
