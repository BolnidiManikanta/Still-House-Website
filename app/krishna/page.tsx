import type { Metadata } from "next";
import KrishnaExperience from "@/components/krishna/KrishnaExperience";

export const metadata: Metadata = {
  title: "Krishna Photography | Visual Archive & Chapters",
  description:
    "Visual archive for a lifetime. Wedding, engagement, pre-wedding, portraits, newborn baby, maternity, pre-birthday, and saree ceremony photographic chapters.",
  keywords: [
    "Krishna Photography",
    "Chapters",
    "Wedding Photography",
    "Visual Archive",
    "Fine Art Photography",
  ],
};

export default function KrishnaPage() {
  return <KrishnaExperience />;
}
