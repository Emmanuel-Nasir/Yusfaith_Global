import type { Metadata } from "next";
import AdminContent from "@/components/admin/AdminContent";

export const metadata: Metadata = {
  title: "Staff Area (Demo) | Yusfaith Global Enterprises",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminContent />;
}