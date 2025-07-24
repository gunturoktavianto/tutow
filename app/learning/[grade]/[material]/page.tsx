import { MaterialPage } from "@/screen";

interface PageProps {
  params: {
    grade: string;
    material: string;
  };
}

export default function Page({ params }: PageProps) {
  const gradeNumber = parseInt(params.grade);
  return (
    <MaterialPage gradeNumber={gradeNumber} materialId={params.material} />
  );
}
