import { CoursePage } from "@/screen";

interface PageProps {
  params: {
    grade: string;
    material: string;
    course: string;
  };
}

export default function Page({ params }: PageProps) {
  const gradeNumber = parseInt(params.grade);
  return (
    <CoursePage
      gradeNumber={gradeNumber}
      materialId={params.material}
      courseSlug={params.course}
    />
  );
}
