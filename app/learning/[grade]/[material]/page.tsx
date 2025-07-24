import { MaterialPage } from "@/screen";

interface PageProps {
  params: Promise<{
    grade: string;
    material: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeNumber = parseInt(resolvedParams.grade);

  return (
    <MaterialPage
      gradeNumber={gradeNumber}
      materialId={resolvedParams.material}
    />
  );
}
