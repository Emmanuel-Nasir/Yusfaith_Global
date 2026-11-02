
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
  // ==========================================

  {
    id: "dangote-3x",
    name: "Dangote 3X",
    brand: "Dangote",
    image: "/images/cement/dangote-3x-large.png",
    description:
      "Dangote cement for residential, commercial and general construction projects.",
    samplePrice: 10500,
  },

  {
    id: "dangote-blockmaster",
    name: "Dangote BlockMaster",
    brand: "Dangote",
    image: "/images/cement/dangote-blockmaster.png",
    description:
      "Explore Dangote BlockMaster for building and construction requirements.",
    samplePrice: 10200,
  },

  {
    id: "dangote-falcon",
    name: "Dangote Falcon",
    brand: "Dangote",
    image: "/images/cement/dangote-falcon.png",
    description:
      "Explore Dangote Falcon cement for construction and bulk supply.",
    samplePrice: 10300,
  },

  // ==========================================
  // HBM CEMENT
  // ==========================================

  {
    id: "hbm-classic",
    name: "HBM Classic",
    brand: "HBM",
    image: "/images/cement/hbm-classic.png",
    description:
      "HBM Classic cement for building and construction projects.",
    samplePrice: 10000,
  },

  {
    id: "hbm-supafix",
    name: "HBM Supafix",
    brand: "HBM",
    image: "/images/cement/hbm-supafix.png",
    description:
      "Explore HBM Supafix cement and request supply for your project.",
    samplePrice: 10100,
  },

  {
    id: "hbm-supaset",
    name: "HBM Supaset",
    brand: "HBM",
    image: "/images/cement/hbm-supaset.png",
    description:
      "HBM Supaset cement for construction and wholesale enquiries.",
    samplePrice: 10200,
  },

  {
    id: "hbm-watershield",
    name: "HBM Watershield",
    brand: "HBM",
    image: "/images/cement/hbm-watershield.png",
    description:
      "Explore HBM Watershield cement and its supply options.",
    samplePrice: 10600,
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
      "BUA cement for residential, commercial, wholesale and retail supply.",
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
      "Mangal cement for building projects, wholesale and bulk supply.",
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
      "Purechem cement for general construction and building requirements.",
    samplePrice: 9700,
  },

  // ==========================================
  // BULK ORDER CONFIGURATIONS
  // These are not additional cement brands.
  // ==========================================

  {
    id: "dangote-3x-bulk",
    name: "Dangote 3X — Bulk Order",
    brand: "Dangote",
    image: "/images/cement/dangote-stacked.png",
    description:
      "Bulk ordering option for Dangote 3X. Select your required quantity and review estimated costs.",
    samplePrice: 10500,
    bulkOption: true,
  },

  {
    id: "hbm-classic-bulk",
    name: "HBM Classic — Bulk Order",
    brand: "HBM",
    image: "/images/cement/hbm-classic.png",
    description:
      "Bulk ordering option for HBM Classic. Select your required quantity and review estimated costs.",
    samplePrice: 10000,
    bulkOption: true,
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
