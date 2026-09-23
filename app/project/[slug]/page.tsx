import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectSlugView from "@/components/project/ProjectSlugView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return [
    { slug: "blueyard" },
    { slug: "constellation" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const title =
    resolvedParams.slug === "blueyard"
      ? "Blueyard — Spatial Monograph | Still Studio"
      : "Constellation — Interactive WebGL Study | Still Studio";

  return {
    title,
    description: "Detailed exhibition monograph, spatial architectural plates, and creative direction case study.",
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  if (resolvedParams.slug !== "blueyard" && resolvedParams.slug !== "constellation") {
    notFound();
  }

  return <ProjectSlugView slug={resolvedParams.slug} />;
}



