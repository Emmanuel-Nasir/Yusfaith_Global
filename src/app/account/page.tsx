import type { Metadata } from "next";
import AccountContent from "@/components/account/AccountContent";

export const metadata: Metadata = {
  title: "My Account | Yusfaith Global Enterprises",
  description:
    "View your Yusfaith orders, saved delivery addresses and profile in one place.",
};

export default function AccountPage() {
  return <AccountContent />;
}