import ContactReviewsExperience from "@/components/contact-reviews/ContactReviewsExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Reviews — Still Studio Atelier",
  description:
    "Inquire for bookings, commissions, wedding and editorial photography, or read verified client reviews and rate the studio atelier.",
};

export default function ContactReviewsPage() {
  return <ContactReviewsExperience />;
}
