import type { Metadata } from "next";
import RealEstateContent from "@/components/real-estate/RealEstateContent";

export const metadata: Metadata = {
  title: "Yusfaith Real Estate | Homes, Apartments & Land",
  description:
    "Browse homes, apartments, terrace houses and land from Yusfaith Real Estate across Ogun, Lagos and Oyo States, and book an inspection.",
};

export default function RealEstatePage() {
  return <RealEstateContent />;
}