/*
  TEST ALERT
  POST { endpoint } → sends a test notification to this one device and
  reports exactly what happened, so problems can be seen instead of guessed.
*/
import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";
import { prisma } from "@/lib/db";
import { pushConfigured } from "@/lib/push";

export async function POST(request: NextRequest) {
  if (!pushConfigured() || !prisma) {
    return NextResponse.json({ ok: false, step: "server", message: "Push is not set up on the server (keys or database missing)." });
  }
  const { endpoint } = (await request.json().catch(() => ({}))) as { endpoint?: string };
  if (!endpoint) return NextResponse.json({ ok: false, step: "device", message: "This device has no alert sign-up. Turn alerts off and on again." });

  const sub = await prisma.pushSubscription.findFirst({ where: { endpoint } });
  if (!sub) {
    return NextResponse.json({ ok: false, step: "saved", message: "This device's sign-up was not saved. Turn alerts off and on again." });
  }
  try {
    const res = await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ title: "Test alert from Yusfaith", body: "Alerts are working on this device.", url: "/admin", tag: `test-${Date.now()}` }),
      { TTL: 600, urgency: "high" }
    );
    return NextResponse.json({ ok: true, step: "sent", message: `Sent (status ${res.statusCode}). It should appear in a few seconds.` });
  } catch (error) {
    const e = error as { statusCode?: number; body?: string; message?: string };
    if (e.statusCode === 404 || e.statusCode === 410) {
      await prisma.pushSubscription.deleteMany({ where: { endpoint } });
      return NextResponse.json({ ok: false, step: "expired", message: "This device's sign-up has expired. Turn alerts off and on again." });
    }
    return NextResponse.json({
      ok: false,
      step: "send",
      message: `The alert service refused it (status ${e.statusCode ?? "?"}): ${(e.body || e.message || "").slice(0, 200)}`,
    });
  }
}
