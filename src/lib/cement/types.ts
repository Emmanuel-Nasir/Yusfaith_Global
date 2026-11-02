
export type CementBrand =
  | "Dangote"
  | "HBM"
  | "BUA"
  | "Mangal"
  | "Purechem";

export type CementProduct = {
  id: string;
  name: string;
  brand: CementBrand;
  image: string;
  description: string;
  samplePrice: number;
  bulkOption?: boolean;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type Fulfillment = "delivery" | "pickup";

export type PaymentMethod =
  | "bank-transfer"
  | "card"
  | "quotation";

export type OrderStatus =
  | "received"
  | "confirmed"
  | "processing"
  | "dispatched"
  | "delivered";

export type CementOrder = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  fulfillment: Fulfillment;
  location: string;
  address: string;
  notes: string;
  lines: {
    productId: string;
    name: string;
    brand: string;
    image: string;
    quantity: number;
    unitPrice?: number;
    subtotal?: number;
  }[];
  totalBags: number;
  subtotal?: number;
  deliveryEstimate?: number;
  estimatedTotal?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: "not-paid";
  status: OrderStatus;
  demo: true;
};
