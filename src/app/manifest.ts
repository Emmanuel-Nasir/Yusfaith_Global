import type { MetadataRoute } from "next";

/* Lets staff (and any customer who wants to) add Yusfaith to their phone's
   Home Screen as an app. On iPhone this is required for alerts. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yusfaith Global Enterprises",
    short_name: "Yusfaith",
    description: "Order cement, building materials, spare parts and bakery products, and follow your order.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f1a3d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
