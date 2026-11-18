"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import {
  ALERT_SETTINGS_EVENT,
  alertsEnabled,
  disableAlerts,
  enableAlerts,
  notificationsSupported,
  subscribePush,
  type AlertAudience,
} from "@/lib/alerts";

const COPY: Record<AlertAudience, { off: string; on: string }> = {
  staff: {
    off: "Get an alert when a new request, message or receipt comes in.",
    on: "Alerts are on for new requests, messages and receipts.",
  },
  customer: {
    off: "Get an alert when your price is ready or we reply to you.",
    on: "Alerts are on. We'll alert you when your price is ready or we reply.",
  },
};

/** "Turn on alerts" switch for staff (Admin) or customers (tracking page). */
export default function AlertsToggle({ audience, orderId }: { audience: AlertAudience; orderId?: string }) {
  const [on, setOn] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setOn(alertsEnabled(audience));
      setBlocked(notificationsSupported() && Notification.permission === "denied");
    };
    refresh();
    // alerts already on in this browser: make sure this device is signed up for push
    if (alertsEnabled(audience)) void subscribePush(audience, orderId);
    window.addEventListener(ALERT_SETTINGS_EVENT, refresh);
    return () => window.removeEventListener(ALERT_SETTINGS_EVENT, refresh);
  }, [audience, orderId]);

  async function toggle() {
    if (on) {
      disableAlerts(audience);
    } else {
      const permission = await enableAlerts(audience, orderId);
      setBlocked(permission === "denied");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <p className="flex items-start gap-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
        {on ? (
          <BellRing size={20} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
        ) : (
          <Bell size={20} className="mt-0.5 shrink-0" style={{ color: "var(--muted)" }} />
        )}
        <span>
          <span className="block font-bold" style={{ color: "var(--foreground)" }}>
            {on ? "Alerts on" : "Turn on alerts"}
          </span>
          {on ? COPY[audience].on : COPY[audience].off}
          {blocked && (
            <span className="block text-xs text-red-700">
              Notifications are blocked in this browser, so alerts show on the website only.
              Allow notifications for this site in the browser settings.
            </span>
          )}
          <span className="block text-xs">
            Alerts reach this device even when the site is closed. On iPhone, add the site to your Home Screen first.
          </span>
        </span>
      </p>
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
          on
            ? "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
            : "bg-[#ef850f] text-[#0f1a3d] hover:bg-[#ff9a26]"
        }`}
      >
        {on ? <BellOff size={16} /> : <BellRing size={16} />}
        {on ? "Turn off" : "Turn on alerts"}
      </button>
    </div>
  );
}
