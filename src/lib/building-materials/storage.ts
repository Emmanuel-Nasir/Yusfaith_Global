
import {
  MAX_QUANTITY_PER_PRODUCT,
  PRODUCTS,
  type CartItem,
  type MaterialOrder,
} from "./catalog";

const CART_KEY = "yusfaith-building-materials-cart-v2";
const ORDERS_KEY = "yusfaith-building-materials-orders-v2";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getCart(): CartItem[] {
  try {
    const raw = getStorage()?.getItem(CART_KEY);
    if (!raw) return [];

    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    return data.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        PRODUCTS.some((product) => product.id === item.productId) &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY_PER_PRODUCT
    );
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  const storage = getStorage();
  if (!storage) throw new Error("Browser storage unavailable.");

  storage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getOrders(): MaterialOrder[] {
  try {
    const raw = getStorage()?.getItem(ORDERS_KEY);
    if (!raw) return [];

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as MaterialOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: MaterialOrder): void {
  const storage = getStorage();
  if (!storage) throw new Error("Browser storage unavailable.");

  storage.setItem(
    ORDERS_KEY,
    JSON.stringify([order, ...getOrders()])
  );
}

export function findOrder(reference: string): MaterialOrder | undefined {
  const normalized = reference.trim().toUpperCase();

  return getOrders().find(
    (order) => order.id.toUpperCase() === normalized
  );
}

export function createOrderId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Math.random().toString(36).slice(2, 12);

  return `YGE-BM-${random.toUpperCase()}`;
}
