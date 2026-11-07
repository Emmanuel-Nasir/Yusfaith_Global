import type { Metadata } from "next";
import OrderTracker from "@/components/orders/OrderTracker";

export const metadata: Metadata = {
  title: "Track Your Order | Yusfaith Building Materials",
  description: "Track a Yusfaith Building Materials order using your order reference.",
};

export default function BuildingMaterialsTrackPage() {
  return (
    <OrderTracker
      subsidiary="Building Materials"
      idPrefix="YM"
      backHref="/building-materials"
      backLabel="Back to Building Materials"
    />
  );
}