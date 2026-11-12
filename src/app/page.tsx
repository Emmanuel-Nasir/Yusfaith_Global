import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title:
    "Yusfaith Global Enterprises | Cement, Building Materials, Logistics, Real Estate & Bakery",
  description:
    "Yusfaith Global Enterprises is a Nigerian group of five businesses: Cement Depot, Building Materials, Logistics, Real Estate and Bakery, serving customers across Ogun, Lagos, Oyo and Osun States.",
};

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <HomeContent />
    </main>
  );
}