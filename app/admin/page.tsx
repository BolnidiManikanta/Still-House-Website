import type { Metadata } from "next";
import AdminVisualEditor from "@/components/admin/AdminVisualEditor";

export const metadata: Metadata = {
  title: "Admin Visual Page Editor — Krishna Photography Studio",
  description:
    "Full-page visual editor for Krishna Photography Studio. Edit text, imagery, colors, sections, effects, and animations across all pages.",
};

export default function AdminPage() {
  return <AdminVisualEditor />;
}
