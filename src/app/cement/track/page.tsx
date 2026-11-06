import type { Metadata } from "next";
import OrderTracker from "@/components/orders/OrderTracker";

export const metadata: Metadata = {
  title: "Track Your Order | Yusfaith Cement Depot",
  description: "Track a Yusfaith Cement Depot order using your order reference.",
};

export default function CementTrackPage() {
  return (
    <OrderTracker
      subsidiary="Cement Depot"
      idPrefix="YC"
      backHref="/cement"
      backLabel="Back to Cement Depot"
    />
  );
}