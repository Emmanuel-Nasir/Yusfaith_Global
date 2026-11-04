import type { Metadata } from "next";
import ProjectsContent from "@/components/projects/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects & Operations | Yusfaith Global Enterprises",
  description:
    "See Yusfaith Global Enterprises in pictures: our Abeokuta head office, Epe depot and awards, and how an order moves from purchase to delivery.",
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}