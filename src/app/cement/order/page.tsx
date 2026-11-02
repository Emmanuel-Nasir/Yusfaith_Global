
import type { Metadata } from "next";
import OrderSystem from "@/components/cement/OrderSystem";

export const metadata: Metadata = {
  title: "Cement Ordering Demo | Yusfaith Global Enterprises",
  description:
    "Interactive demonstration of cement ordering for Yusfaith Global Enterprises.",
};

export default function CementOrderPage() {
  return <OrderSystem />;
}
