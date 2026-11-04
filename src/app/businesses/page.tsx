import type { Metadata } from "next";
import BusinessesContent from "@/components/businesses/BusinessesContent";

export const metadata: Metadata = {
  title: "Our Businesses | Yusfaith Global Enterprises",
  description:
    "Explore the five Yusfaith businesses: Cement Depot (Dangote and HBM), Building Materials, Logistics, Real Estate and Bakery.",
};

export default function BusinessesPage() {
  return <BusinessesContent />;
}