import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Yusfaith Global Enterprises",
  description:
    "Yusfaith Global Enterprises is a distributor of HBM and Dangote cement, wholesale and retail, with a head office in Abeokuta and offices in Epe and Ibadan. Meet our leadership and learn our vision, mission and values.",
};

export default function AboutPage() {
  return <AboutContent />;
}