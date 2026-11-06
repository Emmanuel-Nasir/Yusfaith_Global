import type { Metadata } from "next";
import OrderSystem from "@/components/cement/OrderSystem";

export const metadata: Metadata = {
  title: "Order Cement | Yusfaith Cement Depot",
  description:
    "Order Dangote, HBM, BUA, Mangal and Purechem cement from Yusfaith for delivery or pickup.",
};

export default function CementOrderPage() {
  return <OrderSystem />;
}