import type { Metadata } from "next";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export const metadata: Metadata = {
  title: "Yusfaith Global Enterprises",
  description:
    "Discover Yusfaith Global Enterprises and our businesses across cement distribution, building materials, logistics, real estate, and bakery services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
  <Navbar />
  {children}
  <Footer />
</body>
    </html>
  );
}