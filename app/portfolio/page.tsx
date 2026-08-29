import type { Metadata } from "next";
import PortfolioExperience from "@/components/portfolio/PortfolioExperience";

export const metadata: Metadata = {
  title: "Elena Voss — Photography & Visual Stories",
  description: "Selected images, places & moments by Elena Voss.",
};

export default function PortfolioPage() {
  return (
    <main className="portfolio-page relative min-h-screen">
      <PortfolioExperience />
    </main>
  );
}
