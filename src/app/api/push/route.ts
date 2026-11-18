/*
  PUSH SIGN-UP
  GET    → the public key the browser needs to sign up for alerts
  POST   { subscription, audience, orderId? } → save this device
  DELETE { endpoint, audience, orderId? }     → stop alerts on this device
*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pushConfigured } from "@/lib/push";

type Body = {
  subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  endpoint?: string;
  audience?: string;
  orderId?: string;
};

const off = () => NextResponse.json({ enabled: false }, { status: 503 });

function clean(body: Body) {
  const audience = body.audience === "staff" || body.audience === "customer" ? body.audience : null;
  const orderId = audience === "customer" ? String(body.orderId ?? "").trim().toUpperCase().slice(0, 40) : "";
  return { audience, orderId };
}

export async function GET() {
  if (!pushConfigured()) return off();
  return NextResponse.json({ enabled: true, publicKey: process.env.VAPID_PUBLIC_KEY });
}

export async function POST(request: NextRequest) {
  if (!pushConfigured() || !prisma) return off();
  const body = (await request.json().catch(() => ({}))) as Body;
  const { audience, orderId } = clean(body);
  const endpoint = body.subscription?.endpoint;
  const p256dh = body.subscription?.keys?.p256dh;
  const auth = body.subscription?.keys?.auth;
  if (!audience || !endpoint || !p256dh || !auth || !/^https:\/\//.test(endpoint) || endpoint.length > 1000) {
    return NextResponse.json({ error: "Bad subscription" }, { status: 400 });
  }
  if (audience === "customer" && !orderId) return NextResponse.json({ error: "Order id needed" }, { status: 400 });

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint_audience_orderId: { endpoint, audience, orderId } },
      create: { endpoint, p256dh, auth, audience, orderId },
      update: { p256dh, auth },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!pushConfigured() || !prisma) return off();
  const body = (await request.json().catch(() => ({}))) as Body;
  const { audience } = clean(body);
  if (!audience || !body.endpoint) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  try {
    // turning alerts off removes every order/staff alert for this device and audience
    await prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint, audience } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 502 });
  }
}
