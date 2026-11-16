/*
  ALERTS (demo)
  Staff and customers can turn on alerts. In this demo an alert pops up in the
  website and, if the browser allows it, as a phone/computer notification
  while the site is open in a tab (any tab on the same device).

  In the main app the server sends a real push notification (and an SMS or
  WhatsApp backup), so the phone is alerted even when the website is closed.
*/

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

/** Turn alerts on (asks the browser for notification permission). */
export async function enableAlerts(audience: AlertAudience) {
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
  window.dispatchEvent(new Event(ALERT_SETTINGS_EVENT));
  return permission;
}

export function disableAlerts(audience: AlertAudience) {
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
  try {
    const n = new Notification(alert.title, { body: alert.body, tag: alert.id, icon: "/favicon.ico" });
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
}

export function parseStoredAlert(key: string | null, value: string | null): SiteAlert | null {
  if (key !== LATEST_KEY || !value) return null;
  try {
    return JSON.parse(value) as SiteAlert;
  } catch {
    return null;
  }
}
