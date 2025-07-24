import { CoursePage } from "@/screen";

interface PageProps {
  params: Promise<{
    grade: string;
    material: string;
    course: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeNumber = parseInt(resolvedParams.grade);

  return (
    <CoursePage
      gradeNumber={gradeNumber}
      materialId={resolvedParams.material}
      courseSlug={resolvedParams.course}
    />
  );
}
