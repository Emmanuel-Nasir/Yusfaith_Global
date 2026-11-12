import type { Metadata } from "next";
import BakeryStore from "@/components/bakery/BakeryStore";

export const metadata: Metadata = {
  title: "Yusfaith Bakery | Fresh Bread, Pastries & Cakes",
  description:
    "Order fresh bread, pastries, doughnuts and celebration cakes from Yusfaith Bakery for delivery or pickup across Ogun, Lagos, Oyo and Osun States.",
};

export default function BakeryPage() {
  return <BakeryStore />;
}