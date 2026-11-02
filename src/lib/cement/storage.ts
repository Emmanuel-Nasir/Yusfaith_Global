
import type {
  CartLine,
  CementOrder,
  OrderStatus,
} from "./types";

import { PRODUCTS, STATUSES } from "./catalog";

const CART_KEY = "yusfaith-demo-cement-cart-v2";
const ORDERS_KEY = "yusfaith-demo-cement-orders-v2";

export const MAX_BAGS_PER_PRODUCT = 100000;

function readJSON(key: string): unknown {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") {
    throw new Error("Browser storage is unavailable.");
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error(
      "Unable to save demo data. Check your browser storage."
    );
  }
}

export function getCart(): CartLine[] {
  const data = readJSON(CART_KEY);

  if (!Array.isArray(data)) return [];

  const result: CartLine[] = [];

  for (const item of data) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      !PRODUCTS.some((p) => p.id === item.productId)
    ) {
      continue;
    }

    if (
      result.some(
        (line) => line.productId === item.productId
      )
    ) {
      continue;
    }

    result.push({
      productId: item.productId,
      quantity: Math.min(
        item.quantity,
        MAX_BAGS_PER_PRODUCT
      ),
    });
  }

  return result;
}

export function saveCart(cart: CartLine[]) {
  writeJSON(CART_KEY, cart);
}

export function getOrders(): CementOrder[] {
  const data = readJSON(ORDERS_KEY);

  if (!Array.isArray(data)) return [];

  return data.filter((item): item is CementOrder => {
    return (
      item !== null &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.createdAt === "string" &&
      item.customer !== null &&
      typeof item.customer === "object" &&
      typeof item.customer.name === "string" &&
      Array.isArray(item.lines) &&
      Number.isSafeInteger(item.totalBags) &&
      STATUSES.includes(item.status) &&
      item.demo === true
    );
  });
}

export function saveOrder(order: CementOrder) {
  const orders = getOrders();

  if (orders.some((item) => item.id === order.id)) {
    throw new Error(
      "Duplicate order reference. Please try again."
    );
  }

  writeJSON(ORDERS_KEY, [order, ...orders]);
}

export function findOrder(
  reference: string
): CementOrder | null {
  const normalized = reference.trim().toUpperCase();

  return (
    getOrders().find(
      (order) => order.id.toUpperCase() === normalized
    ) ?? null
  );
}

export function updateOrderStatus(
  reference: string,
  status: OrderStatus
) {
  const orders = getOrders();

  if (!orders.some((order) => order.id === reference)) {
    throw new Error("Demo order not found.");
  }

  writeJSON(
    ORDERS_KEY,
    orders.map((order) =>
      order.id === reference
        ? { ...order, status }
        : order
    )
  );
}

export function makeOrderId(): string {
  const token =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
          .replaceAll("-", "")
          .slice(0, 12)
      : `${Date.now().toString(36)}${Math.random()
          .toString(36)
          .slice(2, 8)}`;

  return `YGE-DEMO-${token.toUpperCase()}`;
}
