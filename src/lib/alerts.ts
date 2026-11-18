/*
  ALERTS (demo)
  Staff and customers can turn on alerts. In this demo an alert pops up in the
  website and, if the browser allows it, as a phone/computer notification
  while the site is open in a tab (any tab on the same device).

  Turning alerts on also signs this device up for push notifications
  (see push.ts and public/sw.js), so the phone is alerted even when the
  website is closed. Customers are signed up for their own order only.
*/

import { pushItem } from "./sync";

export type AlertAudience = "staff" | "customer";

export type SiteAlert = {
  id: string;
  at: string;
  audience: AlertAudience;
  title: string;
  body: string;
  url: string;
};

const LATEST_KEY = "yusfaith-demo-alert-latest";
const ENABLED_KEY = "yusfaith-demo-alerts-on";
export const ALERT_EVENT = "yusfaith-alert";
export const ALERT_SETTINGS_EVENT = "yusfaith-alert-settings";

function readEnabled(): Record<AlertAudience, boolean> {
  try {
    const raw = window.localStorage.getItem(ENABLED_KEY);
    return raw ? JSON.parse(raw) : { staff: false, customer: false };
  } catch {
    return { staff: false, customer: false };
  }
}

export function alertsEnabled(audience: AlertAudience) {
  if (typeof window === "undefined") return false;
  return Boolean(readEnabled()[audience]);
}

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

/* ---------- push notifications (alerts when the site is closed) ---------- */

export function pushSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && notificationsSupported();
}

function keyToBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function serviceWorker() {
  return navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready);
}

/** Sign this device up for push alerts (needs permission already granted). */
export async function subscribePush(audience: AlertAudience, orderId?: string) {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  try {
    const info = await fetch("/api/push", { cache: "no-store" });
    if (!info.ok) return false; // push not set up on the server
    const { publicKey } = (await info.json()) as { publicKey: string };
    const reg = await serviceWorker();
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) }));
    const res = await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON(), audience, orderId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function unsubscribePush(audience: AlertAudience) {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    if (!sub) return;
    await fetch("/api/push", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint, audience }),
    });
  } catch {
    // ignore
  }
}

/** Turn alerts on (asks the browser for notification permission). */
export async function enableAlerts(audience: AlertAudience, orderId?: string) {
  const next = { ...readEnabled(), [audience]: true };
  try {
    window.localStorage.setItem(ENABLED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  let permission: NotificationPermission | "unsupported" = "unsupported";
  if (notificationsSupported()) {
    permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
  }
  if (permission === "granted") await subscribePush(audience, orderId);
  window.dispatchEvent(new Event(ALERT_SETTINGS_EVENT));
  return permission;
}

export function disableAlerts(audience: AlertAudience) {
  void unsubscribePush(audience);
  const next = { ...readEnabled(), [audience]: false };
  try {
    window.localStorage.setItem(ENABLED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(ALERT_SETTINGS_EVENT));
}

/** Show the system notification (only in the tab that receives the alert). */
export function showSystemNotification(alert: SiteAlert) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  const options = { body: alert.body, tag: alert.id, icon: "/icons/icon-192.png", data: { url: alert.url } };
  // phones only allow notifications through the service worker
  if (pushSupported()) {
    navigator.serviceWorker
      .getRegistration("/sw.js")
      .then((reg) => {
        if (reg) return reg.showNotification(alert.title, options);
        throw new Error("no service worker");
      })
      .catch(() => {
        try {
          new Notification(alert.title, options);
        } catch {
          // ignore
        }
      });
    return;
  }
  try {
    const n = new Notification(alert.title, options);
    n.onclick = () => {
      window.focus();
      window.location.href = alert.url;
    };
  } catch {
    // some mobile browsers only allow notifications from an installed app
  }
}

/** Send an alert to staff or a customer. */
export function sendAlert(alert: Omit<SiteAlert, "id" | "at">) {
  if (typeof window === "undefined") return;
  const full: SiteAlert = {
    ...alert,
    id: `AL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
  };
  try {
    // other open tabs hear this through the "storage" event
    window.localStorage.setItem(LATEST_KEY, JSON.stringify(full));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent<SiteAlert>(ALERT_EVENT, { detail: full }));
  pushItem("alerts", full.id, full); // other devices show it within a few seconds
}

export function parseStoredAlert(key: string | null, value: string | null): SiteAlert | null {
  if (key !== LATEST_KEY || !value) return null;
  try {
    return JSON.parse(value) as SiteAlert;
  } catch {
    return null;
  }
}
