
import type { Metadata } from "next";
import BuildingMaterialsStore from "@/components/building-materials/BuildingMaterialsStore";

export const metadata: Metadata = {
  title: "Order Building Materials | Yusfaith Global Enterprises",
  description:
    "Explore building materials and create a simulated order with Yusfaith Global Enterprises.",
};

export default function BuildingMaterialsOrderPage() {
  return <BuildingMaterialsStore />;
}
