import type { Metadata } from "next";
import FilmExperience from "@/components/film/FilmExperience";

export const metadata: Metadata = {
  title: "Elena Voss — Film & Cinematography",
  description: "Sensory scenography, cinematic monographs, and digital direction by Elena Voss.",
};

export default function FilmPage() {
  return <FilmExperience />;
}
