import type { Metadata } from "next";
import BuildingMaterialsStore from "@/components/building-materials/BuildingMaterialsStore";

export const metadata: Metadata = {
  title: "Order Building Materials | Yusfaith",
  description:
    "Order roofing, steel, blocks, plumbing, electrical, finishing and timber from Yusfaith Building Materials.",
};

export default function BuildingMaterialsOrderPage() {
  return <BuildingMaterialsStore />;
}