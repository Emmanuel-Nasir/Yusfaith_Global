import type { Metadata } from "next";
import BakeryTracker from "@/components/bakery/BakeryTracker";

export const metadata: Metadata = {
  title: "Track Your Order | Yusfaith Bakery",
  description: "Track a Yusfaith Bakery order using your order reference.",
};

export default function BakeryTrackPage() {
  return <BakeryTracker />;
}