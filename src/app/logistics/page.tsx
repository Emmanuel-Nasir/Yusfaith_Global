import type { Metadata } from "next";
import LogisticsContent from "@/components/logistics/LogisticsContent";

export const metadata: Metadata = {
  title: "Yusfaith Logistics | Delivery & Truck Spare Parts",
  description:
    "Yusfaith Logistics delivers customer orders with its own trucks and drivers, from our depots across Ogun, Lagos, Oyo and Osun States to your site.",
};

export default function LogisticsPage() {
  return <LogisticsContent />;
}