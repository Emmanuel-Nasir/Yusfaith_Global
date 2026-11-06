import type { Metadata } from "next";
import RealEstateContent from "@/components/real-estate/RealEstateContent";

export const metadata: Metadata = {
  title: "Yusfaith Real Estate | Homes, Apartments & Land",
  description:
    "Browse homes, apartments, terrace houses and land from Yusfaith Real Estate in Abeokuta, Epe and Ibadan, and book an inspection.",
};

export default function RealEstatePage() {
  return <RealEstateContent />;
}