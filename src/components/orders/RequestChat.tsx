"use client";

import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Send } from "lucide-react";
import { logActivity } from "@/lib/activity-log";
import { sendAlert } from "@/lib/alerts";
import { addMessage, findOrder, ORDERS_EVENT, updateOrder, type Order } from "@/lib/orders";

/*
  REQUEST CHAT
  One conversation per request between the customer and Yusfaith staff.
  Everyone who was told about the request can read and reply, and the
  Super Admin can read every conversation.
*/

const TRACK_PATH: Record<string, string> = {
  "Cement Depot": "/cement/track",
  "Building Materials": "/building-materials/track",
  "Truck Spare Parts": "/logistics/spare-parts/track",
  Bakery: "/bakery/track",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  order: Order;
  as: "customer" | "staff";
  staffName?: string;
  staffRole?: string;
  onUpdated?: (order: Order) => void;
  compact?: boolean;
};

export default function RequestChat({ order, as, staffName = "Yusfaith staff", staffRole, onUpdated, compact = false }: Props) {
  const [current, setCurrent] = useState(order);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setCurrent(order), [order]);

  // pick up new messages from other tabs (e.g. staff replying in Admin)
  useEffect(() => {
    const refresh = () => {
      const latest = findOrder(order.id);
      if (latest) setCurrent(latest);
    };
    window.addEventListener(ORDERS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ORDERS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [order.id]);

  const messages = current.messages ?? [];

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  function send(event: React.FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    const name = as === "customer" ? current.customer.name : staffName;
    const updated = addMessage(current.id, {
      from: as,
      name,
      role: as === "staff" ? staffRole : undefined,
      text: clean.slice(0, 1000),
    });
    setText("");
    if (!updated) return;
    if (as === "staff" && !updated.handledBy && updated.paymentStatus === "Awaiting quote") {
      updateOrder(updated.id, { handledBy: { name: staffName, role: staffRole, at: new Date().toISOString() } });
    }
    setCurrent(updated);
    onUpdated?.(updated);

    logActivity({
      actor: name,
      actorType: as === "customer" ? "Customer" : "Staff",
      role: as === "staff" ? staffRole : undefined,
      category: "Order",
      action: `Sent a message on ${current.id}`,
      detail: clean.slice(0, 80),
    });
    sendAlert(
      as === "customer"
        ? {
            audience: "staff",
            title: `New message on ${current.id}`,
            body: `${name}: ${clean.slice(0, 90)}`,
            url: "/admin",
          }
        : {
            audience: "customer",
            title: `Yusfaith replied on ${current.id}`,
            body: `${name}: ${clean.slice(0, 90)}`,
            url: `${TRACK_PATH[current.subsidiary] ?? "/"}?id=${current.id}`,
          }
    );
  }

  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-[var(--background)] ${compact ? "mt-4 p-4" : "mt-8 p-5 sm:p-6"}`}>
      <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        <MessagesSquare size={20} style={{ color: "var(--gold-text)" }} />
        {as === "customer" ? "Chat with Yusfaith" : `Chat with ${current.customer.name}`}
      </h3>
      <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
        {as === "customer"
          ? "Ask about price, quantity or delivery. Our team replies here."
          : "Everyone told about this request can see and reply to this conversation."}
      </p>

      <ul ref={listRef} className={`mt-4 space-y-3 overflow-y-auto pr-1 ${compact ? "max-h-64" : "max-h-96"}`}>
        {messages.length === 0 && (
          <li className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-sm" style={{ color: "var(--muted)" }}>
            No messages yet.
          </li>
        )}
        {messages.map((m) => {
          if (m.from === "system") {
            return (
              <li key={m.id} className="text-center text-xs" style={{ color: "var(--muted)" }}>
                <span className="rounded-full bg-[var(--surface)] px-3 py-1">
                  {m.text} · {formatTime(m.at)}
                </span>
              </li>
            );
          }
          const mine = m.from === as;
          return (
            <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  mine ? "rounded-br-sm bg-[#0f1a3d] text-white" : "rounded-bl-sm bg-[var(--surface)]"
                }`}
                style={mine ? undefined : { color: "var(--foreground)" }}
              >
                <p className={`text-[11px] font-bold ${mine ? "text-white/70" : ""}`} style={mine ? undefined : { color: "var(--gold-text)" }}>
                  {m.name}
                  {m.role ? ` · ${m.role}` : m.from === "customer" ? " · Customer" : ""}
                </p>
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className={`mt-0.5 text-right text-[10px] ${mine ? "text-white/60" : ""}`} style={mine ? undefined : { color: "var(--muted)" }}>
                  {formatTime(m.at)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25"
          placeholder={as === "customer" ? "Type your message…" : "Reply to the customer…"}
          value={text}
          maxLength={1000}
          onChange={(e) => setText(e.target.value)}
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-5 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26] disabled:opacity-40"
        >
          <Send size={16} />
          Send
        </button>
      </form>
    </section>
  );
}
