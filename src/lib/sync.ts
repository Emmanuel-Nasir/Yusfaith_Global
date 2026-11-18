/*
  SHARED SYNC (browser side)
  The site still reads everything from this browser's storage, so every page
  works as before. This file copies each change to the server (/api/sync) and
  checks the server every few seconds for changes made on other devices,
  so an order placed on a customer's phone appears in Admin on any computer.

  If the server is not set up (no Supabase keys), sync switches itself off
  and the site keeps working per browser, exactly as the demo did.
*/

export type SyncCollection = "orders" | "activity" | "settings" | "alerts";

/* Storage keys and events used by the other lib files (kept here to avoid
   circular imports). */
const ORDERS_KEY = "yusfaith-demo-orders";
const ORDERS_EVENT = "yusfaith-orders-changed";
const ACTIVITY_KEY = "yusfaith-demo-activity";
const ACTIVITY_EVENT = "yusfaith-activity-changed";
const FEES_KEY = "yusfaith-demo-delivery-fees";
const FEES_EVENT = "yusfaith-delivery-fees-changed";
const ALERT_EVENT = "yusfaith-alert";
const MIGRATED_KEY = "yusfaith-sync-migrated";
const MAX_ACTIVITY = 1000;

type Item = { collection: SyncCollection; id: string; data: unknown; deleted: boolean; updated_at: string };

let enabled: boolean | null = null; // null = not checked yet
let started = false;
let cursor = "1970-01-01T00:00:00Z";
let startedAt = 0;
const pending = new Set<string>(); // "collection|id" being saved right now
let touched = new Set<string>(); // changed here since the current check began
const ownAlerts = new Set<string>();
const queue: { collection: SyncCollection; id?: string; data?: unknown; deleted?: boolean; clearAll?: boolean }[] = [];

function send(body: (typeof queue)[number]) {
  if (enabled === false) return;
  if (enabled === null) {
    queue.push(body); // first check not finished yet
    return;
  }
  const key = `${body.collection}|${body.id ?? "*"}`;
  pending.add(key);
  touched.add(key);
  fetch("/api/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true })
    .catch(() => {
      // offline: the change stays in this browser and is sent again on the next save
    })
    .finally(() => pending.delete(key));
}

/** Save one item for every device. */
export function pushItem(collection: SyncCollection, id: string, data: unknown) {
  if (typeof window === "undefined") return;
  if (collection === "alerts") ownAlerts.add(id);
  send({ collection, id, data });
}

/** Remove one item on every device. */
export function deleteItem(collection: SyncCollection, id: string) {
  if (typeof window === "undefined") return;
  send({ collection, id, deleted: true });
}

/** Remove a whole collection (used to clear the activity log). */
export function clearCollection(collection: SyncCollection) {
  if (typeof window === "undefined") return;
  send({ collection, clearAll: true });
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full: keep going, the server still has it
  }
}

function apply(items: Item[]) {
  let ordersChanged = false;
  let activityChanged = false;
  let feesChanged = false;

  const orders = readJson<{ id: string; createdAt?: string }[]>(ORDERS_KEY, []);
  const orderIndex = new Map(orders.map((o, i) => [o.id, i]));
  const activity = readJson<{ id: string; at: string }[]>(ACTIVITY_KEY, []);
  const activityIds = new Set(activity.map((a) => a.id));
  let activityList = activity;

  for (const item of items) {
    const key = `${item.collection}|${item.id}`;
    // our own newer change is on its way; the next check brings it back merged
    if (pending.has(key) || touched.has(key)) continue;

    if (item.collection === "orders") {
      const at = orderIndex.get(item.id);
      if (item.deleted) {
        if (at !== undefined) {
          orders.splice(at, 1);
          orderIndex.clear();
          orders.forEach((o, i) => orderIndex.set(o.id, i));
          ordersChanged = true;
        }
      } else if (at !== undefined) {
        if (JSON.stringify(orders[at]) !== JSON.stringify(item.data)) {
          orders[at] = item.data as { id: string };
          ordersChanged = true;
        }
      } else {
        orders.push(item.data as { id: string });
        orderIndex.set(item.id, orders.length - 1);
        ordersChanged = true;
      }
    } else if (item.collection === "activity") {
      if (item.deleted) {
        if (activityIds.has(item.id)) {
          activityList = activityList.filter((a) => a.id !== item.id);
          activityIds.delete(item.id);
          activityChanged = true;
        }
      } else if (!activityIds.has(item.id)) {
        activityList = [...activityList, item.data as { id: string; at: string }];
        activityIds.add(item.id);
        activityChanged = true;
      }
    } else if (item.collection === "settings" && item.id === "delivery-fees") {
      if (item.deleted) window.localStorage.removeItem(FEES_KEY);
      else writeJson(FEES_KEY, item.data);
      feesChanged = true;
    } else if (item.collection === "alerts" && !item.deleted) {
      const alert = item.data as { id: string; at: string };
      if (ownAlerts.has(alert.id)) continue;
      if (new Date(alert.at).getTime() < startedAt - 5000) continue; // old alert, not news
      window.dispatchEvent(new CustomEvent(ALERT_EVENT, { detail: alert }));
    }
  }

  if (ordersChanged) {
    orders.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    writeJson(ORDERS_KEY, orders);
    window.dispatchEvent(new Event(ORDERS_EVENT));
  }
  if (activityChanged) {
    activityList.sort((a, b) => b.at.localeCompare(a.at));
    writeJson(ACTIVITY_KEY, activityList.slice(0, MAX_ACTIVITY));
    window.dispatchEvent(new Event(ACTIVITY_EVENT));
  }
  if (feesChanged) window.dispatchEvent(new Event(FEES_EVENT));
}

async function pull() {
  // read every page of changes since the last check
  for (let page = 0; page < 20; page++) {
    touched = new Set();
    const res = await fetch(`/api/sync?since=${encodeURIComponent(cursor)}`, { cache: "no-store" });
    if (res.status === 503) {
      enabled = false;
      return;
    }
    if (!res.ok) return;
    const body = (await res.json()) as { items: Item[]; more: boolean };
    enabled = true;
    if (body.items.length) {
      apply(body.items);
      cursor = body.items[body.items.length - 1].updated_at;
    }
    if (!body.more) return;
  }
}

/* Orders placed in this browser before sharing was switched on are sent once,
   so they appear on other devices too. */
function migrateOnce() {
  if (window.localStorage.getItem(MIGRATED_KEY)) return;
  for (const order of readJson<{ id: string }[]>(ORDERS_KEY, [])) send({ collection: "orders", id: order.id, data: order });
  window.localStorage.setItem(MIGRATED_KEY, "1");
}

/** Start syncing (called once from the site layout). */
export function startSync() {
  if (typeof window === "undefined" || started) return;
  started = true;
  startedAt = Date.now();

  let timer: number | undefined;
  const loop = async () => {
    try {
      await pull();
    } catch {
      // offline, try again later
    }
    if (enabled === true && queue.length) {
      migrateOnce();
      queue.splice(0).forEach(send);
    } else if (enabled === true) {
      migrateOnce();
    } else if (enabled === false) {
      queue.length = 0;
      return; // not set up: stop checking
    }
    timer = window.setTimeout(loop, document.visibilityState === "visible" ? 3000 : 15000);
  };

  const wake = () => {
    if (document.visibilityState === "visible" && enabled !== false) {
      window.clearTimeout(timer);
      loop();
    }
  };
  document.addEventListener("visibilitychange", wake);
  loop();
}
