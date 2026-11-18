"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BellRing, Clock3, Eye, Hand, Mail, MapPin, MessageCircle, Phone, Send, Siren } from "lucide-react";
import AlertsToggle from "@/components/alerts/AlertsToggle";
import InstallAppGuide from "@/components/alerts/InstallAppGuide";
import RequestChat from "@/components/orders/RequestChat";
import { sendAlert } from "@/lib/alerts";
import { loadDeliveryFees, type DeliveryBusiness } from "@/lib/delivery-fees";
import { stateOf, telLink } from "@/lib/order-contacts";
import { logActivity } from "@/lib/activity-log";
import { addMessage, ESCALATE_AFTER_MINUTES, formatNaira, updateOrder, type Order } from "@/lib/orders";

/*
  PRICE REQUESTS
  Cement, building materials and spare parts are quoted per order. Requests
  go to the branch manager for the customer's state, the Head of Sales, the
  GM and the CEO. Whoever handles it enters the price here; the customer then
  sees it on their tracking page with the bank details and pays by transfer.
*/

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const TRACK_PATH: Record<string, string> = {
  "Cement Depot": "/cement/track",
  "Building Materials": "/building-materials/track",
  "Truck Spare Parts": "/logistics/spare-parts/track",
};

const STATES = ["Ogun State", "Lagos State", "Oyo State", "Osun State"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappLink(order: Order) {
  const phone = order.customer.phone.replace(/\D/g, "").replace(/^0/, "234");
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const track = TRACK_PATH[order.subsidiary] ?? "";
  const lines = [
    `Hello ${order.customer.name}, thank you for your request ${order.id} with Yusfaith Global Enterprises.`,
    "",
    ...order.items.map((i) => `${i.quantity} ${i.unit}${i.quantity === 1 ? "" : "s"} ${i.name}: ${formatNaira(i.quantity * i.unitPrice)}`),
    order.fulfillment === "Delivery" ? `Delivery to ${order.location}: ${formatNaira(order.deliveryFee)}` : "Pickup: free",
    `Total to pay: ${formatNaira(order.total)}`,
    "",
    `Please pay by bank transfer using ${order.id} as the narration, then upload your receipt here: ${origin}${track}?id=${order.id}`,
  ];
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** Who gets the escalation alert when nobody picks a request up in time. */
export function escalationTargets(order: Order) {
  return (order.notified ?? []).filter((r) => /Branch Manager|Head of Sales|Logistics Manager/.test(r.role));
}

/** Send the 5-minute escalation (the server also does this every minute). */
export function escalate(order: Order) {
  if (order.escalatedAt || order.handledBy || order.paymentStatus !== "Awaiting quote") return undefined;
  const targets = escalationTargets(order);
  const names = targets.map((t) => t.name).join(", ") || "the branch manager and Head of Sales";
  const updated = updateOrder(order.id, { escalatedAt: new Date().toISOString() });
  addMessage(order.id, {
    from: "system",
    name: "Yusfaith",
    text: `Nobody picked this up within ${ESCALATE_AFTER_MINUTES} minutes: alert sent to ${names}`,
    staffOnly: true,
  });
  logActivity({
    actor: "System",
    actorType: "Staff",
    role: "Automatic alert",
    category: "Order",
    action: `Escalated ${order.id} after ${ESCALATE_AFTER_MINUTES} minutes`,
    detail: names,
  });
  sendAlert({
    audience: "staff",
    title: `Request ${order.id} still waiting`,
    body: `No one has picked it up in ${ESCALATE_AFTER_MINUTES} minutes. Alert sent to ${names}.`,
    url: "/admin",
  });
  return updated;
}

function QuoteForm({
  order,
  staffName,
  onQuoted,
}: {
  order: Order;
  staffName: string;
  onQuoted: (order: Order, text: string) => void;
}) {
  const suggestedFee =
    order.fulfillment === "Delivery"
      ? loadDeliveryFees()[order.subsidiary as DeliveryBusiness]?.find((z) => z.name === order.location)?.fee ?? 0
      : 0;
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [fee, setFee] = useState(String(suggestedFee));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const unit = (id: string) => Math.max(0, Number(prices[id] ?? "") || 0);
  const subtotal = order.items.reduce((n, i) => n + i.quantity * unit(i.productId), 0);
  const delivery = Math.max(0, Number(fee) || 0);

  function send(event: React.FormEvent) {
    event.preventDefault();
    if (order.items.some((i) => unit(i.productId) <= 0)) {
      setError("Enter a price for every product.");
      return;
    }
    const now = new Date().toISOString();
    const items = order.items.map((i) => ({ ...i, unitPrice: Math.round(unit(i.productId)) }));
    const total = subtotal + delivery;
    const updated = updateOrder(order.id, {
      items,
      subtotal,
      deliveryFee: order.fulfillment === "Delivery" ? delivery : 0,
      total: order.fulfillment === "Delivery" ? total : subtotal,
      paymentStatus: "Awaiting payment",
      quote: { at: now, by: staffName, note: note.trim() || undefined },
      handledBy: order.handledBy ?? { name: staffName, at: now },
      history: [...order.history, { status: "Price sent", at: now }],
    });
    if (updated) {
      addMessage(order.id, {
        from: "system",
        name: "Yusfaith",
        text: `Price sent by ${staffName}: ${formatNaira(updated.total)}${note.trim() ? ` (${note.trim()})` : ""}`,
      });
      sendAlert({
        audience: "customer",
        title: `Your price is ready: ${order.id}`,
        body: `Total to pay ${formatNaira(updated.total)}. Pay by bank transfer and upload your receipt.`,
        url: `${TRACK_PATH[order.subsidiary] ?? "/"}?id=${order.id}`,
      });
      onQuoted(updated, `Sent price for ${order.id}: ${formatNaira(updated.total)} to ${order.customer.name}`);
    }
  }

  return (
    <form onSubmit={send} noValidate className="mt-4 rounded-2xl bg-[var(--surface)] p-4">
      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
        Send the price
      </p>
      <ul className="mt-3 space-y-2">
        {order.items.map((item) => (
          <li key={item.productId} className="grid items-center gap-2 sm:grid-cols-[1fr_170px_120px]">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>
              {item.quantity.toLocaleString()} × {item.name}
            </span>
            <label className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>₦</span>
              <input
                className={`${inputClass} pl-7`}
                type="number"
                min={0}
                placeholder={`per ${item.unit}`}
                value={prices[item.productId] ?? ""}
                onChange={(e) => {
                  setPrices((p) => ({ ...p, [item.productId]: e.target.value }));
                  setError("");
                }}
                aria-label={`Price per ${item.unit} for ${item.name}`}
              />
            </label>
            <span className="text-right text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {formatNaira(item.quantity * unit(item.productId))}
            </span>
          </li>
        ))}
        {order.fulfillment === "Delivery" && (
          <li className="grid items-center gap-2 sm:grid-cols-[1fr_170px_120px]">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>
              Delivery to {order.location}
              <span className="block text-xs" style={{ color: "var(--muted)" }}>
                Suggested from Delivery fees: {formatNaira(suggestedFee)}
              </span>
            </span>
            <label className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>₦</span>
              <input
                className={`${inputClass} pl-7`}
                type="number"
                min={0}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                aria-label="Delivery fee"
              />
            </label>
            <span className="text-right text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {formatNaira(delivery)}
            </span>
          </li>
        )}
      </ul>
      <input
        className={`${inputClass} mt-3`}
        placeholder="Note to the customer (optional), e.g. price valid until Friday"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm" style={{ color: "var(--foreground)" }}>
          Total to pay:{" "}
          <strong style={{ color: "var(--gold-text)" }}>
            {formatNaira(subtotal + (order.fulfillment === "Delivery" ? delivery : 0))}
          </strong>
        </span>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
        >
          <Send size={16} />
          Send price to customer
        </button>
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
    </form>
  );
}

function RequestCard({
  order,
  canQuote,
  staffName,
  staffRole,
  onQuoted,
}: {
  order: Order;
  canQuote: boolean;
  staffName: string;
  staffRole: string;
  onQuoted: (order: Order, text: string) => void;
}) {
  const waiting = order.paymentStatus === "Awaiting quote";
  const paid = order.paymentStatus === "Payment confirmed";
  const [chatOpen, setChatOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!waiting || order.handledBy || order.escalatedAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [waiting, order.handledBy, order.escalatedAt]);
  const deadline = new Date(order.createdAt).getTime() + ESCALATE_AFTER_MINUTES * 60_000;
  const left = Math.max(0, deadline - now);
  const countdown = `${Math.floor(left / 60_000)}:${String(Math.floor((left % 60_000) / 1000)).padStart(2, "0")}`;

  function pickUp() {
    const updated = updateOrder(order.id, { handledBy: { name: staffName, role: staffRole, at: new Date().toISOString() } });
    if (updated) {
      addMessage(order.id, { from: "system", name: "Yusfaith", text: `${staffName} (${staffRole}) is handling this request`, staffOnly: true });
      onQuoted(updated, `Picked up request ${order.id}`);
    }
  }
  const last = order.messages?.filter((m) => m.from !== "system").at(-1);
  const newMessage = last?.from === "customer";
  return (
    <li className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold tracking-wider" style={{ color: "var(--foreground)" }}>{order.id}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {order.subsidiary} · received {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="flex flex-wrap items-center gap-2">
          {newMessage && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">New message</span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              waiting ? "bg-amber-100 text-amber-800" : paid ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {waiting ? "Waiting for price" : paid ? `Paid · ${formatNaira(order.total)}` : `Price sent · ${formatNaira(order.total)}`}
          </span>
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="text-sm" style={{ color: "var(--foreground)" }}>
          <p className="font-semibold">{order.customer.name}</p>
          <p className="mt-1 flex flex-wrap gap-3">
            <a href={telLink(order.customer.phone)} className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--gold-text)" }}>
              <Phone size={14} /> {order.customer.phone}
            </a>
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
            <MapPin size={14} className="mt-0.5 shrink-0" />
            {order.fulfillment === "Delivery" ? `Delivery to ${order.customer.address} (${order.location})` : `Pickup at ${order.location}`}
          </p>
          {order.customer.email && (
            <p className="mt-1">
              <a href={`mailto:${order.customer.email}`} className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--gold-text)" }}>
                <Mail size={13} /> {order.customer.email}
              </a>
            </p>
          )}
          {order.customer.contactBy && (
            <p className="mt-1 text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              Prefers: {order.customer.contactBy}
            </p>
          )}
          {order.customer.notes && (
            <p className="mt-2 text-xs italic" style={{ color: "var(--muted)" }}>“{order.customer.notes}”</p>
          )}
        </div>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 text-sm">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span className="flex-1" style={{ color: "var(--foreground)" }}>{item.name}</span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                {item.quantity.toLocaleString()} {item.unit}{item.quantity === 1 ? "" : "s"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {order.notified && order.notified.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
          <BellRing size={14} style={{ color: "var(--gold-text)" }} />
          Sent to:
          {order.notified.map((r) => (
            <span key={r.name} className="rounded-full bg-[var(--surface)] px-2.5 py-1 font-semibold" style={{ color: "var(--foreground)" }}>
              {r.name} <span style={{ color: "var(--muted)" }}>· {r.role}</span>
            </span>
          ))}
        </p>
      )}

      {waiting && (
        <div className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: order.handledBy ? "rgba(22,163,74,0.08)" : order.escalatedAt ? "rgba(220,38,38,0.08)" : "rgba(239,133,15,0.08)" }}>
          {order.handledBy ? (
            <p className="flex items-center gap-2 font-semibold text-green-800">
              <Hand size={16} />
              Handled by {order.handledBy.name}
              {order.handledBy.role ? ` (${order.handledBy.role})` : ""} since {formatDate(order.handledBy.at)}
            </p>
          ) : order.escalatedAt ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-semibold text-red-700">
                <Siren size={16} />
                Escalated at {formatDate(order.escalatedAt)}: alert sent to{" "}
                {escalationTargets(order).map((t) => t.name).join(", ") || "branch manager and Head of Sales"}
              </p>
              {canQuote && (
                <button type="button" onClick={pickUp} className="rounded-full bg-[#0f1a3d] px-4 py-2 text-xs font-bold text-white">
                  I&apos;m handling this
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                <Clock3 size={16} style={{ color: "var(--gold-text)" }} />
                <span>
                  <strong>Nobody has picked this up.</strong> If no one does in {countdown}, an alert goes to the
                  branch manager and Head of Sales.
                </span>
              </p>
              <span className="flex flex-wrap gap-2">
                {canQuote && (
                  <button type="button" onClick={pickUp} className="rounded-full bg-[#0f1a3d] px-4 py-2 text-xs font-bold text-white">
                    I&apos;m handling this
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const updated = escalate(order);
                    if (updated) onQuoted(updated, "");
                  }}
                  className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold"
                  style={{ color: "var(--muted)" }}
                  title="For the demo: skip the 5-minute wait"
                >
                  Demo: escalate now
                </button>
              </span>
            </div>
          )}
        </div>
      )}

      {waiting ? (
        canQuote ? (
          <QuoteForm order={order} staffName={staffName} onQuoted={onQuoted} />
        ) : (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold" style={{ color: "var(--muted)" }}>
            <Eye size={14} /> View only: sales staff send the price
          </p>
        )
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span style={{ color: "var(--muted)" }}>
            Price sent by {order.quote?.by} · {order.quote ? formatDate(order.quote.at) : ""}
            {order.receipt ? " · receipt uploaded" : " · waiting for payment"}
          </span>
          <a
            href={whatsappLink(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white"
          >
            <MessageCircle size={14} />
            Send price on WhatsApp
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((v) => !v)}
        className="mt-4 text-sm font-bold underline-offset-4 hover:underline"
        style={{ color: "var(--gold-text)" }}
      >
        {chatOpen ? "Hide chat" : `Open chat (${order.messages?.filter((m) => m.from !== "system").length ?? 0} messages)`}
      </button>
      {chatOpen && <RequestChat order={order} as="staff" staffName={staffName} staffRole={staffRole} compact />}
    </li>
  );
}

export default function RequestsPanel({
  orders,
  canQuote,
  staffName,
  staffRole,
  onQuoted,
}: {
  orders: Order[];
  canQuote: boolean;
  staffName: string;
  staffRole: string;
  onQuoted: (order: Order, text: string) => void;
}) {
  const [tab, setTab] = useState<"waiting" | "sent" | "paid">("waiting");

  // the 5-minute rule (in the main app this runs on the server, even with nobody signed in)
  useEffect(() => {
    const check = () => {
      for (const o of orders) {
        if (o.pricing !== "quote" || o.paymentStatus !== "Awaiting quote" || o.handledBy || o.escalatedAt) continue;
        if (Date.now() - new Date(o.createdAt).getTime() >= ESCALATE_AFTER_MINUTES * 60_000) {
          const updated = escalate(o);
          if (updated) onQuoted(updated, "");
        }
      }
    };
    check();
    const timer = window.setInterval(check, 15_000);
    return () => window.clearInterval(timer);
  }, [orders, onQuoted]);
  const [state, setState] = useState("All");

  const requests = orders.filter(
    (o) => o.pricing === "quote" && (state === "All" || stateOf(o.location) === state)
  );
  const waiting = requests.filter((o) => o.paymentStatus === "Awaiting quote");
  const sent = requests.filter((o) => o.paymentStatus === "Awaiting payment" && o.quote);
  const paid = requests.filter((o) => o.paymentStatus === "Payment confirmed");
  const shown = tab === "waiting" ? waiting : tab === "sent" ? sent : paid;

  return (
    <div>
      <p className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
        Cement, building materials and spare parts have no fixed prices. Each
        request is sent to the branch manager for the customer&apos;s state, the
        Head of Sales, the General Manager and the CEO. Call the customer, then
        enter the agreed price here: they see it on their tracking page with our
        bank details. Click <strong>I&apos;m handling this</strong> so others know.
        If nobody picks a request up within {ESCALATE_AFTER_MINUTES} minutes, the
        branch manager and Head of Sales get an extra alert. Turn on alerts below
        and install the app, and alerts reach your phone even when the site is closed.
      </p>

      <div className="mb-6 space-y-3">
        <AlertsToggle audience="staff" />
        <InstallAppGuide />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {([
            ["waiting", `Waiting for price (${waiting.length})`],
            ["sent", `Price sent, awaiting payment (${sent.length})`],
            ["paid", `Paid (${paid.length})`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-[#ef850f] text-[#0f1a3d]"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          className={`${inputClass} w-auto`}
          value={state}
          onChange={(e) => setState(e.target.value)}
          aria-label="Filter by branch"
        >
          <option value="All">All branches</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          {tab === "waiting" ? "No requests waiting for a price." : tab === "sent" ? "No prices waiting for payment." : "No paid requests yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {shown.map((o) => (
            <RequestCard key={o.id} order={o} canQuote={canQuote} staffName={staffName} staffRole={staffRole} onQuoted={onQuoted} />
          ))}
        </ul>
      )}
    </div>
  );
}
