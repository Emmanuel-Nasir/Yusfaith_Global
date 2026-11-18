/*
  SHARED STORAGE (Prisma)
  Keeps orders, chats, receipts, delivery fees, alerts and the activity log the
  same on every device. Data lives in one table (shared_items), read and
  written through Prisma.

  Needs DATABASE_URL (Vercel → Settings → Environment Variables).
  Without it the route answers 503 and the site keeps working per browser.
*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPush, type PushAlert } from "@/lib/push";
import type { Prisma } from "@/generated/prisma/client";

const COLLECTIONS = new Set(["orders", "activity", "settings", "alerts"]);
const MAX_ITEM_BYTES = 400_000; // a receipt preview is well under this
const PAGE = 1000;

const off = () => NextResponse.json({ enabled: false }, { status: 503 });

/** GET /api/sync?since=<ISO time> → every item changed after that time. */
export async function GET(request: NextRequest) {
  if (!prisma) return off();
  const sinceParam = request.nextUrl.searchParams.get("since");
  const since = new Date(sinceParam || 0);
  if (Number.isNaN(since.getTime())) return NextResponse.json({ error: "Bad time" }, { status: 400 });

  try {
    const rows = await prisma.sharedItem.findMany({
      where: { updatedAt: { gt: since } },
      orderBy: { updatedAt: "asc" },
      take: PAGE,
    });
    const items = rows.map((r) => ({
      collection: r.collection,
      id: r.id,
      data: r.data,
      deleted: r.deleted,
      updated_at: r.updatedAt.toISOString(),
    }));
    return NextResponse.json(
      { enabled: true, items, more: items.length === PAGE },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Could not read shared data" }, { status: 502 });
  }
}

type Order = { messages?: { id: string; at: string }[]; history?: { status: string; at: string }[] };

/* Two people can change one order at the same moment (a chat message while
   a price is sent). Keep every message and history step from both. */
function mergeOrder(existing: Order | undefined, incoming: Order): Order {
  if (!existing) return incoming;
  const byId = new Map<string, { id: string; at: string }>();
  for (const m of [...(existing.messages ?? []), ...(incoming.messages ?? [])]) byId.set(m.id, m);
  const messages = [...byId.values()].sort((a, b) => a.at.localeCompare(b.at));
  const steps = new Map<string, { status: string; at: string }>();
  for (const h of [...(existing.history ?? []), ...(incoming.history ?? [])]) steps.set(`${h.status}|${h.at}`, h);
  const history = [...steps.values()].sort((a, b) => a.at.localeCompare(b.at));
  return { ...incoming, messages, history };
}

/** POST /api/sync  { collection, id, data } | { collection, id, deleted: true } | { collection, clearAll: true } */
export async function POST(request: NextRequest) {
  if (!prisma) return off();
  let body: { collection?: string; id?: string; data?: unknown; deleted?: boolean; clearAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { collection, id } = body;
  if (!collection || !COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400 });
  }
  const now = new Date();

  try {
    if (body.clearAll) {
      await prisma.sharedItem.updateMany({
        where: { collection },
        data: { deleted: true, data: {}, updatedAt: now },
      });
      return NextResponse.json({ ok: true });
    }

    if (!id || typeof id !== "string" || id.length > 120) {
      return NextResponse.json({ error: "Bad id" }, { status: 400 });
    }
    let data: unknown = body.deleted ? {} : body.data;
    if (!body.deleted && (data === undefined || JSON.stringify(data).length > MAX_ITEM_BYTES)) {
      return NextResponse.json({ error: "Item missing or too large" }, { status: 400 });
    }

    if (collection === "orders" && !body.deleted) {
      const existing = await prisma.sharedItem.findUnique({ where: { collection_id: { collection, id } } });
      if (existing && !existing.deleted) data = mergeOrder(existing.data as Order, data as Order);
    }

    // a brand-new alert also goes out as a phone notification
    const isNewAlert =
      collection === "alerts" &&
      !body.deleted &&
      !(await prisma.sharedItem.findUnique({ where: { collection_id: { collection, id } }, select: { id: true } }));

    const json = data as Prisma.InputJsonValue;
    await prisma.sharedItem.upsert({
      where: { collection_id: { collection, id } },
      create: { collection, id, data: json, deleted: Boolean(body.deleted), updatedAt: now },
      update: { data: json, deleted: Boolean(body.deleted), updatedAt: now },
    });
    if (isNewAlert) await sendPush(data as PushAlert);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 502 });
  }
}
