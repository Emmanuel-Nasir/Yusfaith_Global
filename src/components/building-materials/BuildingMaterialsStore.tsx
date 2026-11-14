"use client";

import ShopStore, {
  type ShopConfig,
  type ShopProduct,
} from "@/components/shop/ShopStore";
import {
  CATEGORIES,
  MAX_QUANTITY_PER_PRODUCT,
  PRODUCTS,
} from "@/lib/building-materials/catalog";
import { SALES_CONTACTS } from "@/data/company";

const FILTERS: string[] = CATEGORIES.filter((c) => c !== "All");

const products: ShopProduct[] = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  image: p.image,
  unit: p.unit,
  price: p.samplePrice,
}));

const config: ShopConfig = {
  subsidiary: "Building Materials",
  idPrefix: "YM",
  eyebrow: "Yusfaith Building Materials",
  headline: "Everything you need",
  highlight: "to build better.",
  intro:
    "Roofing, steel, blocks, plumbing, electrical, paints, finishing and timber. Order for delivery by our own trucks or pickup from our depots.",
  heroImage: "/images/building-materials/materials-warehouse.jpg",
  heroAlt: "Building materials stacked in a warehouse",
  menuEyebrow: "Our Materials",
  menuTitle: "Choose your materials",
  priceNote:
    "Demo prices: sample estimates, not confirmed Yusfaith prices.",
  products,
  filters: FILTERS,
  zones: [
    { name: "Ogun State", fee: 25000 },
    { name: "Lagos State", fee: 30000 },
    { name: "Oyo State", fee: 35000 },
    { name: "Osun State", fee: 40000 },
  ],
  maxQuantity: MAX_QUANTITY_PER_PRODUCT,
  imageFit: "cover",
  highlights: [
    { title: "Eight product groups", text: "From roofing and paints to doors and timber." },
    { title: "Bulk quantities", text: "Type any quantity for large orders." },
    { title: "Our own trucks", text: "Delivered by the Yusfaith logistics team." },
  ],
  notesPlaceholder: "e.g. Deliver to the back gate of the site",
  trackHref: "/building-materials/track",
  salesContacts: [SALES_CONTACTS.generalManager],
};

export default function BuildingMaterialsStore() {
  return <ShopStore config={config} />;
}