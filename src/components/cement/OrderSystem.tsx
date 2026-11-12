"use client";

import ShopStore, {
  type ShopConfig,
  type ShopProduct,
} from "@/components/shop/ShopStore";
import { PRODUCTS } from "@/lib/cement/catalog";

const BRANDS: string[] = ["Dangote", "HBM", "BUA", "Mangal", "Purechem"];

const products: ShopProduct[] = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.brand,
  description: p.description,
  image: p.image,
  unit: "bag",
  price: p.samplePrice,
  badge: p.bulkOption ? "Bulk option" : undefined,
}));

const config: ShopConfig = {
  subsidiary: "Cement Depot",
  idPrefix: "YC",
  eyebrow: "Yusfaith / Olasunkanmi Cement Depot",
  headline: "Strong foundations.",
  highlight: "Reliable supply.",
  intro:
    "Order Dangote, HBM, BUA, Mangal and Purechem cement, wholesale or retail, for delivery by our own trucks or pickup from our depots.",
  heroImage: "/images/corporate/yusfaith-depot-truck.jpeg",
  heroAlt: "Yusfaith Global Enterprises office and depot with a delivery truck",
  menuEyebrow: "Our Cement",
  menuTitle: "Choose your cement",
  priceNote:
    "Demo prices per bag: sample estimates, not confirmed Yusfaith prices.",
  products,
  filters: BRANDS,
  zones: [
    { name: "Abeokuta", fee: 25000 },
    { name: "Epe", fee: 30000 },
    { name: "Ibadan", fee: 35000 },
  ],
  maxQuantity: 100000,
  imageFit: "contain",
  highlights: [
    { title: "Five cement brands", text: "Dangote, HBM, BUA, Mangal and Purechem." },
    { title: "Wholesale and retail", text: "From a few bags to bulk orders." },
    { title: "Our own trucks", text: "Delivered by the Yusfaith logistics team." },
  ],
  notesPlaceholder: "e.g. Call before arriving at the site",
  trackHref: "/cement/track",
};

export default function OrderSystem() {
  return <ShopStore config={config} />;
}