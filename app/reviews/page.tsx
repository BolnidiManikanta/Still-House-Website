import ContactReviewsExperience from "@/components/contact-reviews/ContactReviewsExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews — Still Studio Atelier",
  description: "Read verified client reviews and rate the photography studio atelier.",
};

export default function ReviewsPage() {
  return <ContactReviewsExperience />;
}
