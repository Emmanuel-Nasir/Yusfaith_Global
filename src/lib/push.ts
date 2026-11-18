/*
  PUSH NOTIFICATIONS (server side)
  Sends a real phone/computer notification, even when the website is closed.
  Staff alerts go to every staff device that turned alerts on. Customer alerts
  go only to the devices of the customer who owns that order.

  Needs three environment variables (in .env and in Vercel):
    VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@example.com)
  Without them nothing is sent and the site keeps working with in-page alerts.
*/
import * as webpush from "web-push";
import { prisma } from "@/lib/db";

export type PushAlert = {
  id: string;
  audience: "staff" | "customer";
  title: string;
  body: string;
  url: string;
};

let configured: boolean | null = null;

export function pushConfigured() {
  if (configured !== null) return configured;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  configured = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && prisma);
  if (configured) {
    webpush.setVapidDetails(VAPID_SUBJECT || "mailto:admin@yusfaith.com", VAPID_PUBLIC_KEY!, VAPID_PRIVATE_KEY!);
  }
  return configured;
}

/** The order id inside a customer alert link, e.g. /cement/track?id=YC-AB12CD */
export function orderIdFromUrl(url: string) {
  try {
    return new URL(url, "https://x").searchParams.get("id")?.toUpperCase() ?? "";
  } catch {
    return "";
  }
}

/** Send one alert to every device that should get it. Never throws. */
export async function sendPush(alert: PushAlert) {
  if (!pushConfigured() || !prisma) return;
  try {
    const where =
      alert.audience === "staff"
        ? { audience: "staff" }
        : { audience: "customer", orderId: orderIdFromUrl(alert.url) };
    if (where.audience === "customer" && !("orderId" in where && where.orderId)) return;

    const subs = await prisma.pushSubscription.findMany({ where });
    const payload = JSON.stringify({ title: alert.title, body: alert.body, url: alert.url, tag: alert.id });
    const gone: string[] = [];

    // one device per endpoint, even if it signed up twice
    const seen = new Set<string>();
    await Promise.all(
      subs
        .filter((s) => (seen.has(s.endpoint) ? false : (seen.add(s.endpoint), true)))
        .map(async (s) => {
          try {
            await webpush.sendNotification(
              { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
              payload,
              { TTL: 60 * 60 * 24, urgency: "high" }
            );
          } catch (error) {
            const status = (error as { statusCode?: number }).statusCode;
            if (status === 404 || status === 410) gone.push(s.endpoint); // phone unsubscribed or app removed
          }
        })
    );
    if (gone.length) await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: gone } } });
  } catch {
    // a failed notification must never break saving the order
  }
}
