"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, X } from "lucide-react";
import {
  ALERT_EVENT,
  alertsEnabled,
  parseStoredAlert,
  showSystemNotification,
  type SiteAlert,
} from "@/lib/alerts";

/** Pop-up alerts for new requests, messages, prices and receipts (demo). */
export default function AlertToaster() {
  const [alerts, setAlerts] = useState<SiteAlert[]>([]);

  useEffect(() => {
    function show(alert: SiteAlert) {
      if (!alertsEnabled(alert.audience)) return;
      // staff alerts appear in the staff area, customer alerts on the public pages
      const inStaffArea = window.location.pathname.startsWith("/admin");
      if ((alert.audience === "staff") !== inStaffArea) return;
      showSystemNotification(alert); // same tag in several tabs = one notification
      setAlerts((list) => [alert, ...list.filter((a) => a.id !== alert.id)].slice(0, 3));
      window.setTimeout(() => setAlerts((list) => list.filter((a) => a.id !== alert.id)), 9000);
    }
    const onLocal = (e: Event) => show((e as CustomEvent<SiteAlert>).detail);
    const onStorage = (e: StorageEvent) => {
      const alert = parseStoredAlert(e.key, e.newValue);
      if (alert) show(alert);
    };
    window.addEventListener(ALERT_EVENT, onLocal);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(ALERT_EVENT, onLocal);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[200] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef850f]/15">
                <BellRing size={18} style={{ color: "var(--gold-text)" }} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--gold-text)" }}>
                  {alert.audience === "staff" ? "Staff alert" : "Customer alert"}
                </p>
                <p className="font-bold" style={{ color: "var(--foreground)" }}>
                  {alert.title}
                </p>
                <p className="mt-0.5 text-sm leading-5" style={{ color: "var(--muted)" }}>
                  {alert.body}
                </p>
                <Link
                  href={alert.url}
                  className="mt-2 inline-block text-sm font-bold underline-offset-4 hover:underline"
                  style={{ color: "var(--gold-text)" }}
                  onClick={() => setAlerts((list) => list.filter((a) => a.id !== alert.id))}
                >
                  Open
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setAlerts((list) => list.filter((a) => a.id !== alert.id))}
                aria-label="Dismiss alert"
                className="rounded-full p-1"
                style={{ color: "var(--muted)" }}
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
