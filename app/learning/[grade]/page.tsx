import { GradePage } from "@/screen";

interface PageProps {
  params: { grade: string };
}

export default function Page({ params }: PageProps) {
  const gradeNumber = parseInt(params.grade);
  return <GradePage gradeNumber={gradeNumber} />;
}
