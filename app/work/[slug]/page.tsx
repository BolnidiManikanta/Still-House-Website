import DreamscapesExperience from "@/components/dreamscapes/DreamscapesExperience";

export function generateStaticParams() {
  return [{ slug: "dreamscapes" }, { slug: "monograph" }];
}

export default function WorkSlugPage() {
  return <DreamscapesExperience />;
}

