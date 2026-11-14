"use client";

import { DEFAULT_DELIVERY_FEES } from "@/lib/delivery-fees";
import ShopStore, {
  type ShopConfig,
  type ShopProduct,
} from "@/components/shop/ShopStore";
import { PRODUCTS } from "@/lib/cement/catalog";
import { SALES_CONTACTS } from "@/data/company";

// Who customers call about each brand
const CONTACT_FOR: Record<string, string> = {
  Dangote: SALES_CONTACTS.dangote.label,
  HBM: SALES_CONTACTS.hbm.label,
};

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
  contact: CONTACT_FOR[p.brand] ?? SALES_CONTACTS.generalManager.label,
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
  zones: DEFAULT_DELIVERY_FEES["Cement Depot"], // live fees are edited in Admin → Prices
  maxQuantity: 100000,
  imageFit: "contain",
  highlights: [
    { title: "Five cement brands", text: "Dangote, HBM, BUA, Mangal and Purechem." },
    { title: "Wholesale and retail", text: "From a few bags to bulk orders." },
    { title: "Our own trucks", text: "Delivered by the Yusfaith logistics team." },
  ],
  notesPlaceholder: "e.g. Call before arriving at the site",
  trackHref: "/cement/track",
  salesContacts: [SALES_CONTACTS.dangote, SALES_CONTACTS.hbm, SALES_CONTACTS.generalManager],
};

export default function OrderSystem() {
  return <ShopStore config={config} />;
}