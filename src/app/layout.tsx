import type { Metadata, Viewport } from "next";

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
import AlertToaster from "@/components/alerts/AlertToaster";
import HelpChat from "@/components/help/HelpChat";
import SyncStarter from "@/components/sync/SyncStarter";
export const metadata: Metadata = {
  title: "Yusfaith Global Enterprises",
  description:
    "Discover Yusfaith Global Enterprises and our businesses across cement distribution, building materials, logistics, real estate, and bakery services.",
  applicationName: "Yusfaith",
  appleWebApp: { capable: true, title: "Yusfaith", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0f1a3d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
  <Navbar />
  {children}
  <Footer />
  <AlertToaster />
  <HelpChat />
  <SyncStarter />
</body>
    </html>
  );
}