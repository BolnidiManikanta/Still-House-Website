import { notFound } from "next/navigation";
import Experience from "@/components/project/experience";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  if (resolvedParams.slug !== "blueyard" && resolvedParams.slug !== "constellation") {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-clip bg-[#e8e8e8]">
      <Experience />
    </main>
  );
}
