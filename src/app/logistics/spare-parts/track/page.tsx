import type { Metadata } from "next";
import OrderTracker from "@/components/orders/OrderTracker";

export const metadata: Metadata = {
  title: "Track Your Order | Yusfaith Truck Spare Parts",
  description: "Track a Yusfaith truck spare parts order using your order reference.",
};

export default function SparePartsTrackPage() {
  return (
    <OrderTracker
      subsidiary="Truck Spare Parts"
      idPrefix="YP"
      backHref="/logistics/spare-parts"
      backLabel="Back to Spare Parts"
    />
  );
}
