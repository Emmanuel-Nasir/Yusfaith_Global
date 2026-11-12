
export type MaterialCategory =
  | "Roofing"
  | "Steel"
  | "Blocks & Aggregates"
  | "Plumbing"
  | "Electrical"
  | "Finishing"
  | "Paints"
  | "Doors & Timber";

export type MaterialProduct = {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  image: string;
  unit: string;
  samplePrice: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Fulfillment = "delivery" | "pickup";
export type PaymentMethod = "bank-transfer" | "card" | "quotation";

export type MaterialOrder = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    location: string;
    address: string;
    notes: string;
  };
  fulfillment: Fulfillment;
  paymentMethod: PaymentMethod;
  paymentStatus: "not-paid";
  status: "received";
  items: {
    productId: string;
    name: string;
    image: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  deliveryEstimate: number;
  estimatedTotal: number;
  demo: true;
};

const root = "/images/building-materials/";

export const PRODUCTS: MaterialProduct[] = [
  {
    id: "longspan-roofing",
    name: "Longspan Roofing Sheets",
    category: "Roofing",
    description: "Metal roofing sheets for residential and commercial projects.",
    image: root + "materials-longspan-roofing.jpg",
    unit: "sheet",
    samplePrice: 16500,
  },
  {
    id: "galvanized-roofing",
    name: "Galvanized Roofing Sheets",
    category: "Roofing",
    description: "Galvanized roofing sheets for building projects.",
    image: root + "materials-galvanized-roofing.jpg",
    unit: "sheet",
    samplePrice: 13500,
  },
  {
    id: "iron-rods",
    name: "Reinforcement Iron Rods",
    category: "Steel",
    description: "Steel reinforcement for foundations, beams and columns.",
    image: root + "materials-iron-rods.jpg",
    unit: "length",
    samplePrice: 12500,
  },
  {
    id: "binding-wire",
    name: "Binding Wire",
    category: "Steel",
    description: "Binding wire for reinforcement work.",
    image: root + "materials-binding-wire.jpg",
    unit: "roll",
    samplePrice: 18000,
  },
  {
    id: "concrete-blocks",
    name: "Concrete Building Blocks",
    category: "Blocks & Aggregates",
    description: "Concrete blocks for construction and partition walls.",
    image: root + "materials-concrete-blocks.jpg",
    unit: "block",
    samplePrice: 850,
  },
  {
    id: "sand-granite",
    name: "Sand and Granite",
    category: "Blocks & Aggregates",
    description: "Aggregates for concrete and general construction.",
    image: root + "materials-sand-and-granite.jpg",
    unit: "load",
    samplePrice: 85000,
  },
  {
    id: "pvc-pipes",
    name: "PVC Pipes",
    category: "Plumbing",
    description: "PVC pipes for water distribution and drainage.",
    image: root + "materials-pvc-pipes.jpg",
    unit: "length",
    samplePrice: 4200,
  },
  {
    id: "plumbing-fittings",
    name: "Plumbing Fittings",
    category: "Plumbing",
    description: "Pipe connectors and plumbing accessories.",
    image: root + "materials-plumbing-fittings.jpg",
    unit: "set",
    samplePrice: 3500,
  },
  {
    id: "electrical-conduits",
    name: "Electrical Conduits",
    category: "Electrical",
    description: "Protective conduits for electrical installations.",
    image: root + "materials-electrical-conduits.jpg",
    unit: "length",
    samplePrice: 2800,
  },
  {
    id: "floor-wall-tiles",
    name: "Floor and Wall Tiles",
    category: "Finishing",
    description: "Tiles for interior flooring and wall finishes.",
    image: root + "materials-floor-wall-tiles.jpg",
    unit: "carton",
    samplePrice: 14500,
  },
  {
    id: "ceiling-boards",
    name: "Ceiling Boards",
    category: "Finishing",
    description: "Ceiling boards for interior finishing.",
    image: root + "materials-ceiling-boards.jpg",
    unit: "board",
    samplePrice: 9500,
  },
  // Paints — images are illustrations until Yusfaith sends photos of its paint stock
  {
    id: "emulsion-paint",
    name: "Emulsion Paint",
    category: "Paints",
    description: "Water-based paint for interior and exterior walls, in a wide range of colours. Smooth finish that is easy to clean.",
    image: root + "materials-emulsion-paint.jpg",
    unit: "bucket",
    samplePrice: 38000,
  },
  {
    id: "gloss-paint",
    name: "Gloss Paint",
    category: "Paints",
    description: "Hard-wearing, shiny oil-based paint for doors, windows, metal and wood.",
    image: root + "materials-gloss-paint.jpg",
    unit: "tin",
    samplePrice: 16000,
  },
  {
    id: "textured-paint",
    name: "Textured Paint",
    category: "Paints",
    description: "Thick, weather-resistant coating that gives exterior walls a durable textured finish.",
    image: root + "materials-textured-paint.jpg",
    unit: "bucket",
    samplePrice: 42000,
  },
  {
    id: "primer-undercoat",
    name: "Primer and Undercoat",
    category: "Paints",
    description: "Prepares new plaster, wood and metal so the top coat sticks better and lasts longer.",
    image: root + "materials-primer-undercoat.jpg",
    unit: "tin",
    samplePrice: 14000,
  },
  {
    id: "doors-frames",
    name: "Doors and Frames",
    category: "Doors & Timber",
    description: "Doors and frames for building projects.",
    image: root + "materials-doors-frames.jpg",
    unit: "set",
    samplePrice: 65000,
  },
  {
    id: "timber-planks",
    name: "Timber Planks",
    category: "Doors & Timber",
    description: "Timber for carpentry and construction.",
    image: root + "materials-timber-planks.jpg",
    unit: "plank",
    samplePrice: 6500,
  },
  {
    id: "nails-fasteners",
    name: "Nails and Fasteners",
    category: "Doors & Timber",
    description: "General construction nails and fasteners.",
    image: root + "materials-nails-fasteners.jpg",
    unit: "pack",
    samplePrice: 4200,
  },
];

export const CATEGORIES = [
  "All",
  "Roofing",
  "Steel",
  "Blocks & Aggregates",
  "Plumbing",
  "Electrical",
  "Finishing",
  "Paints",
  "Doors & Timber",
] as const;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  "bank-transfer": "Bank Transfer (Demo)",
  card: "Card Payment (Demo)",
  quotation: "Request Final Quotation",
};

export const MAX_QUANTITY_PER_PRODUCT = 100000;

export function getProduct(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDeliveryEstimate(
  fulfillment: Fulfillment,
  itemCount: number
) {
  return fulfillment === "delivery" && itemCount > 0 ? 25000 : 0;
}
