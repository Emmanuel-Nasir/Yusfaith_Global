/*
  ACTIVITY LOG
  Every staff sign-in and sign-out, every staff action, and what customers do
  on the website (orders, receipts, cancellations, account sign-ins).
  Only the Super Admin can read it (Admin → Activity log).

  Demo: the log is kept in this browser only. In the main app each entry is
  written on the server, together with the IP address, and cannot be edited
  or deleted by staff.
*/

export type ActorType = "Staff" | "Customer";

export type ActivityCategory =
  | "Sign-in"
  | "Sign-out"
  | "Order"
  | "Payment"
  | "Price"
  | "Stock"
  | "Staff access"
  | "Delivery"
  | "Account";

export type ActivityEntry = {
  id: string;
  at: string; // ISO time
  actor: string; // name, or "Guest"
  actorType: ActorType;
  role?: string; // staff role
  category: ActivityCategory;
  action: string;
  detail?: string;
  page?: string;
  device?: string;
};

const KEY = "yusfaith-demo-activity";
const MAX_ENTRIES = 1000;
export const ACTIVITY_EVENT = "yusfaith-activity-changed";

function describeDevice() {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  const system = /Android/.test(ua)
    ? "Android"
    : /iPhone|iPad/.test(ua)
      ? "iPhone/iPad"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS/.test(ua)
          ? "Mac"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown";
  return `${browser} · ${system}`;
}

export function loadActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityEntry[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(entry: Omit<ActivityEntry, "id" | "at" | "page" | "device">) {
  if (typeof window === "undefined") return;
  const full: ActivityEntry = {
    ...entry,
    id: `A-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    page: window.location.pathname,
    device: describeDevice(),
  };
  try {
    const next = [full, ...loadActivity()].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  } catch {
    // demo only, ignore
  }
}

export function clearActivity() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  } catch {
    // demo only, ignore
  }
}

/** Guess a category from a free-text staff action. */
export function categoryFor(text: string): ActivityCategory {
  const t = text.toLowerCase();
  if (t.startsWith("signed in")) return "Sign-in";
  if (t.startsWith("signed out")) return "Sign-out";
  if (t.includes("payment")) return "Payment";
  if (t.includes("delivery fee")) return "Delivery";
  if (t.includes("price")) return "Price";
  if (t.includes("stock") || t.includes("product")) return "Stock";
  if (t.includes("invited") || t.includes("role") || t.includes("activated")) return "Staff access";
  return "Order";
}
