import ContactReviewsExperience from "@/components/contact-reviews/ContactReviewsExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Inquiries — Still Studio Atelier",
  description: "Inquire for photography commissions, weddings, fashion and editorial bookings.",
};

export default function ContactPage() {
  return <ContactReviewsExperience />;
}
