/*
  YUSFAITH LOGISTICS — DISPATCH DATA (DEMO)
  Truck/driver assignments are saved in the browser, next to the shared orders.
  In the main app these become the deliveries, trucks and drivers tables.
*/

import { addOrder, createOrderId, type Order } from "@/lib/orders";

const KEY = "yusfaith-demo-dispatch";
const ORDERS_KEY = "yusfaith-demo-orders";

export type Assignment = {
  orderId: string;
  truckId: string;
  driverId: string;
  assignedAt: string;
  receiver?: string; // proof of delivery
  deliveredAt?: string;
};

export function loadAssignments(): Assignment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Assignment[]) : [];
  } catch {
    return [];
  }
}

export function saveAssignment(assignment: Assignment) {
  try {
    const others = loadAssignments().filter(
      (a) => a.orderId !== assignment.orderId
    );
    window.localStorage.setItem(KEY, JSON.stringify([assignment, ...others]));
  } catch {
    // demo only — ignore
  }
}

/* Removes ALL demo orders (every subsidiary) and all assignments */
export function clearDemoData() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(ORDERS_KEY);
  } catch {
    // demo only — ignore
  }
}

/* Three sample delivery orders so the board can be demonstrated quickly */
export function seedSampleOrders() {
  const now = new Date().toISOString();

  const orders: Order[] = [
    {
      id: createOrderId("YC"),
      subsidiary: "Cement Depot",
      createdAt: now,
      customer: {
        name: "Sample Customer 1",
        phone: "08000000011",
        address: "Sample site, Lagos Road",
        notes: "",
      },
      location: "Lagos State",
      fulfillment: "Delivery",
      paymentTerms: "Pay before dispatch",
      paymentChannel: "Bank transfer",
      paymentStatus: "Awaiting payment",
      status: "Received",
      items: [
        {
          productId: "dangote-3x",
          name: "Dangote 3X Cement",
          image: "/images/cement/dangote-3x-large.png",
          unit: "bag",
          quantity: 300,
          unitPrice: 9500,
        },
      ],
      subtotal: 2850000,
      deliveryFee: 45000,
      total: 2895000,
      history: [{ status: "Received", at: now }],
      demo: true,
    },
    {
      id: createOrderId("YM"),
      subsidiary: "Building Materials",
      createdAt: now,
      customer: {
        name: "Sample Customer 2",
        phone: "08000000012",
        address: "Sample building site, Ibadan",
        notes: "",
      },
      location: "Oyo State",
      fulfillment: "Delivery",
      paymentTerms: "Pay on arrival",
      paymentChannel: "Cash",
      paymentStatus: "Awaiting payment",
      status: "Preparing",
      items: [
        {
          productId: "iron-rods",
          name: "Iron Rods",
          image: "/images/building-materials/materials-iron-rods.jpg",
          unit: "piece",
          quantity: 120,
          unitPrice: 7200,
        },
      ],
      subtotal: 864000,
      deliveryFee: 30000,
      total: 894000,
      history: [
        { status: "Received", at: now },
        { status: "Preparing", at: now },
      ],
      demo: true,
    },
    {
      id: createOrderId("YC"),
      subsidiary: "Cement Depot",
      createdAt: now,
      customer: {
        name: "Sample Customer 3",
        phone: "08000000013",
        address: "Sample site, Ile-Ise Awo",
        notes: "",
      },
      location: "Ogun State",
      fulfillment: "Delivery",
      paymentTerms: "Pay before dispatch",
      paymentChannel: "Bank transfer",
      paymentStatus: "Payment confirmed",
      status: "Preparing",
      items: [
        {
          productId: "hbm-classic",
          name: "HBM Classic Cement",
          image: "/images/cement/hbm-classic.png",
          unit: "bag",
          quantity: 150,
          unitPrice: 9000,
        },
      ],
      subtotal: 1350000,
      deliveryFee: 25000,
      total: 1375000,
      history: [
        { status: "Received", at: now },
        { status: "Payment confirmed", at: now },
        { status: "Preparing", at: now },
      ],
      demo: true,
    },
  ];

  // addOrder puts each new order at the front, so add in reverse
  [...orders].reverse().forEach(addOrder);
}