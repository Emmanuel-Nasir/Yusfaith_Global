
import type {
  CementProduct,
  OrderStatus,
  PaymentMethod,
  Fulfillment,
} from "./types";

/**
 * YUSFAITH GLOBAL ENTERPRISES
 * Cement Depot Product Catalogue
 *
 * IMPORTANT:
 * All prices are illustrative demo estimates.
 * They are not verified selling prices.
 *
 * Edit samplePrice when updated pricing is available.
 */

export const PRODUCTS: CementProduct[] = [
  // ==========================================
  // DANGOTE CEMENT
  // Photos marked "real-" are Yusfaith's own stock photos.
  // ==========================================

  {
    id: "dangote-3x",
    name: "Dangote 3X 42.5N",
    brand: "Dangote",
    image: "/images/cement/real-dangote-3x.jpg",
    description:
      "Portland limestone cement made to be extra strong, with extra life and extra yield. A dependable 42.5N grade for general construction, concrete work and block making.",
    samplePrice: 10500,
  },

  {
    id: "dangote-blockmaster",
    name: "Dangote BlocMaster",
    brand: "Dangote",
    image: "/images/cement/dangote-blockmaster.png",
    description:
      "Dangote's premium high-strength 42.5R Portland limestone cement, made for block moulding and higher-strength concrete such as columns, beams and slabs.",
    samplePrice: 10200,
  },

  {
    id: "dangote-falcon",
    name: "Dangote Falcon",
    brand: "Dangote",
    image: "/images/cement/real-dangote-falcon.jpg",
    description:
      "Portland limestone cement for plastering, rendering and screeding. Its binding power holds blocks firmly in walls and gives a smooth finish that needs less paint.",
    samplePrice: 10300,
  },

  // ==========================================
  // HBM (formerly Lafarge Africa)
  // Lafarge Africa Plc was renamed HBM Nigeria Plc in 2026; product brands kept their names.
  // ==========================================

  {
    id: "hbm-ecocem",
    name: "HBM Ecocem Elephant",
    brand: "HBM",
    image: "/images/cement/real-hbm-ecocem.jpg",
    description:
      "A lower-carbon, multipurpose Portland limestone cement for concreting, plastering and block making. 50 kg bag.",
    samplePrice: 10000,
  },

  {
    id: "hbm-supaset",
    name: "HBM Elephant Supaset",
    brand: "HBM",
    image: "/images/cement/real-hbm-supaset.jpg",
    description:
      "Portland limestone cement made for blocks and precast work, trusted by block makers for strong, consistent results.",
    samplePrice: 10200,
  },

  {
    id: "hbm-watershield",
    name: "HBM WaterShield",
    brand: "HBM",
    image: "/images/cement/real-hbm-watershield.jpg",
    description:
      "Waterproof cement for work exposed to water and moisture, such as foundations and wet areas, helping to keep dampness out.",
    samplePrice: 10600,
  },

  {
    id: "hbm-supafix",
    name: "HBM Supafix Tile Adhesive",
    brand: "HBM",
    image: "/images/cement/real-hbm-supafix.jpg",
    description:
      "Supafix Basic tile adhesive for fixing tiles on walls and floors, indoors and outdoors. 20 kg bag.",
    samplePrice: 10100,
  },

  {
    id: "hbm-supa-whyte",
    name: "HBM Supa Whyte Plaster of Paris",
    brand: "HBM",
    image: "/images/cement/real-supa-whyte.jpg",
    description:
      "Plaster of Paris for smooth interior finishes, ceilings and decorative work.",
    samplePrice: 9500,
  },

  {
    id: "hbm-classic",
    name: "HBM Classic",
    brand: "HBM",
    image: "/images/cement/hbm-classic.png",
    description:
      "General-purpose HBM cement for everyday building and construction work.",
    samplePrice: 10000,
  },

  // ==========================================
  // BUA CEMENT
  // ==========================================

  {
    id: "bua-cement",
    name: "BUA Cement",
    brand: "BUA",
    image: "/images/cement/bua-cement.png",
    description:
      "Portland limestone cement from BUA, Nigeria's second-largest cement maker, for general building and construction. Check the bag for the grade supplied.",
    samplePrice: 9900,
  },

  // ==========================================
  // MANGAL CEMENT
  // ==========================================

  {
    id: "mangal-cement",
    name: "Mangal Cement",
    brand: "Mangal",
    image: "/images/cement/mangal-cement.png",
    description:
      "Mangal cement for general building projects, available wholesale, retail and in bulk.",
    samplePrice: 9800,
  },

  // ==========================================
  // PURECHEM CEMENT
  // ==========================================

  {
    id: "purechem-cement",
    name: "Purechem Cement",
    brand: "Purechem",
    image: "/images/cement/purechem-cement.png",
    description:
      "Portland limestone cement made in Ogun State by PureChem, suited to plastering, rendering and general building work.",
    samplePrice: 9700,
  },

];

/**
 * BRAND FILTERS
 * Used by the homepage and ordering system.
 */

export const CEMENT_BRANDS = [
  "All",
  "Dangote",
  "HBM",
  "BUA",
  "Mangal",
  "Purechem",
] as const;

/**
 * ORDER TRACKING
 */

export const STATUSES: OrderStatus[] = [
  "received",
  "confirmed",
  "processing",
  "dispatched",
  "delivered",
];

export const STATUS_LABELS: Record<
  OrderStatus,
  string
> = {
  received: "Order received",
  confirmed: "Order confirmed",
  processing: "Preparing order",
  dispatched: "Out for delivery",
  delivered: "Delivered",
};

/**
 * PAYMENT OPTIONS
 *
 * All payment options are simulated.
 * No actual payment processing is enabled.
 */

export const PAYMENT_LABELS: Record<
  PaymentMethod,
  string
> = {
  "bank-transfer": "Bank Transfer (Demo)",
  card: "Debit / Credit Card (Demo)",
  quotation: "Request Final Quotation",
};

/**
 * FORMAT NIGERIAN NAIRA
 *
 * Example:
 * formatNaira(10500) => ₦10,500
 */

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * DEMO DELIVERY ESTIMATE
 *
 * Pickup = ₦0
 * Delivery = ₦25,000
 *
 * This is a placeholder, not an actual
 * delivery quotation.
 */

export function calculateDeliveryEstimate(
  fulfillment: Fulfillment,
  totalBags: number
): number {
  if (
    fulfillment === "pickup" ||
    totalBags <= 0
  ) {
    return 0;
  }

  return 25000;
}

/**
 * HELPER: FIND PRODUCT BY ID
 */

export function getProductById(
  productId: string
): CementProduct | undefined {
  return PRODUCTS.find(
    (product) => product.id === productId
  );
}

/**
 * HELPER: GET PRODUCTS BY BRAND
 */

export function getProductsByBrand(
  brand: string
): CementProduct[] {
  if (brand === "All") {
    return PRODUCTS;
  }

  return PRODUCTS.filter(
    (product) => product.brand === brand
  );
}

/**
 * HELPER: CALCULATE PRODUCT SUBTOTAL
 */

export function calculateProductSubtotal(
  productId: string,
  quantity: number
): number {
  const product = getProductById(productId);

  if (!product || quantity <= 0) {
    return 0;
  }

  return product.samplePrice * quantity;
}
