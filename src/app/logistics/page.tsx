import type { Metadata } from "next";
import LogisticsContent from "@/components/logistics/LogisticsContent";

export const metadata: Metadata = {
  title: "Yusfaith Logistics | In-House Delivery",
  description:
    "Yusfaith Logistics delivers customer orders with its own trucks and drivers, from our depots in Abeokuta, Epe and Ibadan to your site.",
};

export default function LogisticsPage() {
  return <LogisticsContent />;
}