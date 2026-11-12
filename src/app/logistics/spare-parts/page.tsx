import type { Metadata } from "next";
import SparePartsStore from "@/components/logistics/SparePartsStore";

export const metadata: Metadata = {
  title: "Truck Spare Parts | Yusfaith Logistics",
  description:
    "Order spare parts for heavy-duty trucks from Yusfaith Logistics: filters, brakes, clutch, suspension, electrical, tyres, oils and accessories, delivered across Ogun, Lagos, Oyo and Osun States.",
};

export default function SparePartsPage() {
  return <SparePartsStore />;
}
