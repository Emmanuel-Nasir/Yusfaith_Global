/*
  5-MINUTE RULE (runs on the server, every minute)
  cron-job.org calls  https://<site>/api/cron/escalate?key=<CRON_SECRET>
  every minute. Any price request nobody has picked up within 5 minutes is
  escalated: staff get a phone alert even if every browser is closed.
*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPush } from "@/lib/push";
import { ESCALATE_AFTER_MINUTES } from "@/lib/orders";
import type { Prisma } from "@/generated/prisma/client";

type Order = {
  id: string;
  createdAt: string;
  pricing?: string;
  paymentStatus?: string;
  handledBy?: unknown;
  escalatedAt?: string;
  notified?: { name: string; role: string }[];
  messages?: { id: string; at: string; from: string; name: string; text: string; staffOnly?: boolean }[];
};

const rid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

async function run(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !prisma) return NextResponse.json({ enabled: false }, { status: 503 });
  const given =
    request.nextUrl.searchParams.get("key") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (given !== secret) return NextResponse.json({ error: "Not allowed" }, { status: 401 });

  const cutoff = Date.now() - ESCALATE_AFTER_MINUTES * 60_000;
  const rows = await prisma.sharedItem.findMany({ where: { collection: "orders", deleted: false } });
  const escalated: string[] = [];

  for (const row of rows) {
    const order = row.data as unknown as Order;
    const waiting =
      order.pricing === "quote" &&
      order.paymentStatus === "Awaiting quote" &&
      !order.handledBy &&
      !order.escalatedAt &&
      new Date(order.createdAt).getTime() <= cutoff;
    if (!waiting) continue;

    const now = new Date();
    const at = now.toISOString();
    const targets = (order.notified ?? []).filter((r) => /Branch Manager|Head of Sales|Logistics Manager/.test(r.role));
    const names = targets.map((t) => t.name).join(", ") || "the branch manager and Head of Sales";
    const updated: Order = {
      ...order,
      escalatedAt: at,
      messages: [
        ...(order.messages ?? []),
        {
          id: rid("M"),
          at,
          from: "system",
          name: "Yusfaith",
          text: `Nobody picked this up within ${ESCALATE_AFTER_MINUTES} minutes: alert sent to ${names}`,
          staffOnly: true,
        },
      ],
    };
    const alert = {
      id: rid("AL"),
      at,
      audience: "staff" as const,
      title: `Request ${order.id} still waiting`,
      body: `No one has picked it up in ${ESCALATE_AFTER_MINUTES} minutes. Alert sent to ${names}.`,
      url: "/admin",
    };
    const activity = {
      id: rid("A"),
      at,
      actor: "System",
      actorType: "Staff",
      role: "Automatic alert",
      category: "Order",
      action: `Escalated ${order.id} after ${ESCALATE_AFTER_MINUTES} minutes`,
      detail: names,
      page: "/api/cron/escalate",
      device: "Server",
    };

    await prisma.$transaction([
      prisma.sharedItem.update({
        where: { collection_id: { collection: "orders", id: row.id } },
        data: { data: updated as unknown as Prisma.InputJsonValue, updatedAt: now },
      }),
      prisma.sharedItem.create({ data: { collection: "alerts", id: alert.id, data: alert, updatedAt: now } }),
      prisma.sharedItem.create({ data: { collection: "activity", id: activity.id, data: activity, updatedAt: now } }),
    ]);
    await sendPush(alert);
    escalated.push(order.id);
  }

  return NextResponse.json({ ok: true, checked: rows.length, escalated });
}

export const GET = run;
export const POST = run;
