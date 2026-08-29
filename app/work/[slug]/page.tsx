import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkSlugPage({ params }: PageProps) {
  await params;
  notFound();
}
