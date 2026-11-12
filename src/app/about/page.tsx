import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Yusfaith Global Enterprises",
  description:
    "Yusfaith Global Enterprises is a distributor of Dangote, HBM, BUA, Mangal and Purechem cement, wholesale and retail, serving Ogun, Lagos, Oyo and Osun States. Meet our leadership and learn our vision, mission and values.",
};

export default function AboutPage() {
  return <AboutContent />;
}