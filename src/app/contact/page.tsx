import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Yusfaith Global Enterprises",
  description:
    "Contact Yusfaith Global Enterprises in Abeokuta, Epe or Ibadan. Call our office, chat on WhatsApp, email us or send an enquiry about cement, building materials, delivery and our other businesses.",
};

export default function ContactPage() {
  return <ContactContent />;
}