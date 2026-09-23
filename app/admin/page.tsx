import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Studio CMS — Still Studio",
  description:
    "Master studio administration console for managing copy, imagery, optical atmospheric filters, and exhibition monographs across Still Studio.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
