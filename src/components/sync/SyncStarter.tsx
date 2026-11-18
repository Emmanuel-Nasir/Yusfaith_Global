"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync";

/** Keeps orders, fees, alerts and the activity log the same on every device. */
export default function SyncStarter() {
  useEffect(() => {
    startSync();
  }, []);
  return null;
}
