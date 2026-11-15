"use client";

import { DEFAULT_DELIVERY_FEES } from "@/lib/delivery-fees";
import ShopStore, {
  type ShopConfig,
  type ShopProduct,
} from "@/components/shop/ShopStore";
import {
  CATEGORY_IMAGES,
  PART_CATEGORIES,
  SPARE_PARTS,
} from "@/lib/logistics/spare-parts";
import { LOGISTICS_PHONE, SALES_CONTACTS } from "@/data/company";

const products: ShopProduct[] = SPARE_PARTS.map((part) => ({
  id: part.id,
  name: part.name,
  category: part.category,
  description: part.description,
  image: CATEGORY_IMAGES[part.category],
  unit: part.unit,
  price: part.price,
}));

const config: ShopConfig = {
  subsidiary: "Truck Spare Parts",
  idPrefix: "YP",
  eyebrow: "Yusfaith Logistics · Truck Spare Parts",
  headline: "The parts that",
  highlight: "keep trucks moving.",
  intro:
    "We run our own fleet, so we know what keeps a truck on the road. Request spare parts for heavy-duty trucks and our team will confirm the price and fit for your truck.",
  heroImage: "/images/logistics/yusfaith-truck-front.jpeg",
  heroAlt: "A Yusfaith truck at the depot",
  menuEyebrow: "Spare Parts",
  menuTitle: "Choose your parts",
  priceNote:
    "Prices depend on the part and your truck. Add what you need and send a request: our team confirms the fit and calls you with the price, including delivery.",
  products,
  filters: PART_CATEGORIES,
  zones: DEFAULT_DELIVERY_FEES["Truck Spare Parts"], // live fees are edited in Admin → Prices
  maxQuantity: 500,
  imageFit: "cover",
  highlights: [
    { title: "36 common parts", text: "Engine, brakes, clutch, tyres, oils and more." },
    { title: "Checked for your truck", text: "Tell us the make and model in your request." },
    { title: "On-time delivery", text: "Delivered by the Yusfaith logistics team." },
  ],
  notesPlaceholder: "Truck make and model, e.g. Sinotruk HOWO 2019, and any part numbers",
  trackHref: "/logistics/spare-parts/track",
  salesContacts: [
    { label: "Logistics & Spare Parts", name: "Logistics team", role: "Logistics line", phone: LOGISTICS_PHONE },
    SALES_CONTACTS.generalManager,
  ],
};

export default function SparePartsStore() {
  return <ShopStore config={config} />;
}
