import type { Metadata } from "next";
import DepotLanding, {
  type LandingConfig,
} from "@/components/depot/DepotLanding";
import { PRODUCTS } from "@/lib/building-materials/catalog";

export const metadata: Metadata = {
  title: "Yusfaith Building Materials | Roofing, Steel, Blocks & More",
  description:
    "Order roofing, iron rods, blocks, plumbing, electrical, paints, finishing and timber from Yusfaith Building Materials, with delivery by our own trucks across Ogun, Lagos, Oyo and Osun States.",
};

const CATEGORY_IMAGES: Record<string, string> = {
  Roofing: "/images/building-materials/materials-longspan-roofing.jpg",
  Steel: "/images/building-materials/materials-iron-rods.jpg",
  "Blocks & Aggregates": "/images/building-materials/materials-concrete-blocks.jpg",
  Plumbing: "/images/building-materials/materials-pvc-pipes.jpg",
  Electrical: "/images/building-materials/materials-electrical-conduits.jpg",
  Finishing: "/images/building-materials/materials-floor-wall-tiles.jpg",
  Paints: "/images/building-materials/materials-emulsion-paint.jpg",
  "Doors & Timber": "/images/building-materials/materials-doors-frames.jpg",
};

const items = Object.keys(CATEGORY_IMAGES).map((category) => ({
  name: category,
  text: PRODUCTS.filter((p) => p.category === category)
    .map((p) => p.name)
    .join(", "),
  image: CATEGORY_IMAGES[category],
}));

const config: LandingConfig = {
  eyebrow: "Yusfaith Building Materials",
  headline: "Everything you need",
  highlight: "to build better.",
  intro:
    "Materials that take a project from foundation to roof, delivered by our own trucks or collected from our depots.",
  heroImage: "/images/building-materials/materials-warehouse.jpg",
  heroAlt: "Building materials stacked in a warehouse",
  orderHref: "/building-materials/order",
  trackHref: "/building-materials/track",
  listEyebrow: "Our Materials",
  listTitle: "Shop by category",
  listIntro:
    "Choose from our range of building materials. Prices are set by Yusfaith, and bulk orders are welcome.",
  items,
  imageFit: "cover",
};

export default function BuildingMaterialsPage() {
  return <DepotLanding config={config} />;
}