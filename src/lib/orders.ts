/*
  YUSFAITH — SHARED DEMO ORDERS
  One order list for every subsidiary, saved in the browser (localStorage).
  Logistics and the admin preview read from here. In the main app this
  becomes the central orders table in the database.
*/

export type Subsidiary =
  | "Cement Depot"
  | "Building Materials"
  | "Bakery"
  | "Real Estate";

/* WHEN the customer pays (agreed with Yusfaith) */
export type PaymentTerms =
  | "Pay before dispatch"
  | "Pay on arrival"
  | "Cash & Carry (pickup)";

/* HOW the customer pays */
export type PaymentChannel = "Bank transfer" | "POS" | "Cash" | "Online";

export type PaymentStatus = "Awaiting payment" | "Payment confirmed";

export type Fulfillment = "Delivery" | "Pickup";

export type OrderStatus =
  | "Received"
  | "Preparing"
  | "Out for delivery"
  | "Ready for pickup"
  | "Delivered"
  | "Collected";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  unit: string;
  quantity: number;
  unitPrice: number; // price at the moment of ordering
};

export type Order = {
  id: string;
  subsidiary: Subsidiary;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  };
  location: string; // delivery zone or pickup branch
  fulfillment: Fulfillment;
  paymentTerms: PaymentTerms;
  paymentChannel: PaymentChannel;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number; // always separate from the product total
  total: number;
  history: { status: string; at: string }[];
  demo: true;
};

const STORAGE_KEY = "yusfaith-demo-orders";

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // storage full or blocked — demo only, ignore
  }
}

export function findOrder(id: string): Order | undefined {
  return loadOrders().find(
    (order) => order.id.toUpperCase() === id.trim().toUpperCase()
  );
}

export function createOrderId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

export function addOrder(order: Order) {
  saveOrders([order, ...loadOrders()]);
}

export function updateOrder(id: string, changes: Partial<Order>) {
  const orders = loadOrders().map((order) =>
    order.id === id ? { ...order, ...changes } : order
  );
  saveOrders(orders);
  return orders.find((order) => order.id === id);
}

/* The steps a customer sees, depending on delivery or pickup */
export function statusSteps(fulfillment: Fulfillment): OrderStatus[] {
  return fulfillment === "Delivery"
    ? ["Received", "Preparing", "Out for delivery", "Delivered"]
    : ["Received", "Preparing", "Ready for pickup", "Collected"];
}

/*
  Demo "advance" button. Follows the agreed rules:
  - "Pay before dispatch": cannot go out for delivery until payment is confirmed.
  - "Pay on arrival": cannot be marked delivered until payment is confirmed.
  - "Cash & Carry": cannot be collected until payment is confirmed.
*/
export function nextStep(order: Order): {
  status?: OrderStatus;
  blockedReason?: string;
} {
  const steps = statusSteps(order.fulfillment);
  const index = steps.indexOf(order.status);
  const next = steps[index + 1];

  if (!next) return {};

  const paid = order.paymentStatus === "Payment confirmed";

  if (next === "Out for delivery" && order.paymentTerms === "Pay before dispatch" && !paid) {
    return { blockedReason: "Payment must be confirmed before dispatch." };
  }
  if ((next === "Delivered" || next === "Collected") && !paid) {
    return { blockedReason: "Payment must be confirmed before handover." };
  }

  return { status: next };
}