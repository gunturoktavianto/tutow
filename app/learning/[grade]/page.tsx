import { GradePage } from "@/screen";

interface PageProps {
  params: Promise<{ grade: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeNumber = parseInt(resolvedParams.grade);
  return <GradePage gradeNumber={gradeNumber} />;
}
