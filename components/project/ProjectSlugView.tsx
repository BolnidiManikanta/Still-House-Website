"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("@/components/project/experience"), {
  ssr: false,
});

export default function ProjectSlugView({ slug = "blueyard" }: { slug?: string }) {
  return (
    <main className="relative min-h-screen overflow-clip bg-[#e8e8e8]">
      <Experience slug={slug} />
    </main>
  );
}

