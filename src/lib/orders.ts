/*
  YUSFAITH — SHARED DEMO ORDERS
  One order list for every subsidiary, saved in the browser (localStorage)
  and shared with every device through /api/sync (see sync.ts).
  Logistics and the admin preview read from here. In the main app this
  becomes the central orders table in the database.
*/

import { deleteItem, pushItem } from "./sync";

export type Subsidiary =
  | "Cement Depot"
  | "Building Materials"
  | "Bakery"
  | "Truck Spare Parts"
  | "Real Estate";

/* WHEN the customer pays (agreed with Yusfaith) */
export type PaymentTerms =
  | "Pay before dispatch"
  | "Pay before pickup"
  | "Pay on arrival" // staff-entered orders only; the website takes transfers only
  | "Cash & Carry (pickup)";

/* HOW the customer pays */
export type PaymentChannel = "Bank transfer" | "POS" | "Cash" | "Online";

// "Awaiting quote": a price request; staff have not sent the price yet
export type PaymentStatus = "Awaiting quote" | "Awaiting payment" | "Payment confirmed";

/* Someone told about a new request (branch manager, Head of Sales, GM, CEO) */
export type Recipient = { name: string; role: string; phone?: string };

/* One message in the chat on a request ("system" = automatic note) */
export type OrderMessage = {
  id: string;
  at: string;
  from: "customer" | "staff" | "system";
  name: string;
  role?: string;
  text: string;
  staffOnly?: boolean; // internal note: not shown to the customer
};

export const ORDERS_EVENT = "yusfaith-orders-changed";

export type ContactMethod = "WhatsApp" | "SMS" | "Email" | "Phone call";
export const CONTACT_METHODS: ContactMethod[] = ["WhatsApp", "SMS", "Email", "Phone call"];

/* After this long with nobody handling a new request, it is escalated by
   SMS/WhatsApp to the branch manager and Head of Sales. */
export const ESCALATE_AFTER_MINUTES = 5;

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

export type Receipt = {
  name: string;
  type: string;
  size: number;
  preview?: string; // small image preview (demo only)
  uploadedAt: string;
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
    email?: string;
    contactBy?: ContactMethod; // how they want to hear from us
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
  receipt?: Receipt; // payment receipt uploaded by the customer
  /* Price requests (Cement, Building Materials, Spare Parts have no fixed prices) */
  pricing?: "fixed" | "quote";
  notified?: Recipient[]; // who was told about the request
  quote?: { at: string; by: string; note?: string }; // when and by whom the price was sent
  messages?: OrderMessage[]; // chat between the customer and Yusfaith staff
  handledBy?: { name: string; role?: string; at: string }; // staff member who picked it up
  escalatedAt?: string; // when the 5-minute escalation went out
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
  // send only what changed to the server, so other devices see it
  const before = new Map(loadOrders().map((order) => [order.id, JSON.stringify(order)]));
  for (const order of orders) {
    if (before.get(order.id) !== JSON.stringify(order)) pushItem("orders", order.id, order);
    before.delete(order.id);
  }
  for (const id of before.keys()) deleteItem("orders", id);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event(ORDERS_EVENT));
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

export function removeOrder(id: string) {
  saveOrders(loadOrders().filter((order) => order.id !== id));
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

  if (order.paymentStatus === "Awaiting quote") {
    return { blockedReason: "Send the customer a price quote first." };
  }
  if (next === "Out for delivery" && order.paymentTerms === "Pay before dispatch" && !paid) {
    return { blockedReason: "Payment must be confirmed before dispatch." };
  }
  if (next === "Ready for pickup" && order.paymentTerms === "Pay before pickup" && !paid) {
    return { blockedReason: "Payment must be confirmed before the order is ready for pickup." };
  }
  if ((next === "Delivered" || next === "Collected") && !paid) {
    return { blockedReason: "Payment must be confirmed before handover." };
  }

  return { status: next };
}

/** Add a chat message to an order. Returns the updated order. */
export function addMessage(id: string, message: Omit<OrderMessage, "id" | "at">) {
  const order = findOrder(id);
  if (!order) return undefined;
  const full: OrderMessage = {
    ...message,
    id: `M-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
  };
  return updateOrder(order.id, { messages: [...(order.messages ?? []), full] });
}
