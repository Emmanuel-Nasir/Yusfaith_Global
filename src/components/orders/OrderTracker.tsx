"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  PackageSearch,
  Search,
  Wallet,
} from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";
import {
  findOrder,
  formatNaira,
  loadOrders,
  nextStep,
  statusSteps,
  updateOrder,
  type Order,
  type Subsidiary,
} from "@/lib/orders";

const inputClass =
  "w-full rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-3.5 text-[15px] uppercase tracking-wider text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTracker({
  subsidiary,
  idPrefix,
  backHref,
  backLabel,
}: {
  subsidiary: Subsidiary;
  idPrefix: string;
  backHref: string;
  backLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [recent, setRecent] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  // Load recent orders and any ?id= from the link on first visit
  useEffect(() => {
    setRecent(loadOrders().filter((o) => o.subsidiary === subsidiary));
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setQuery(id);
      const found = findOrder(id);
      setOrder(found ?? null);
      setNotFound(!found);
    }
  }, [subsidiary]);

  function search(event?: React.FormEvent) {
    event?.preventDefault();
    const found = findOrder(query);
    setOrder(found ?? null);
    setNotFound(!found);
    setMessage("");
  }

  function refresh(updated?: Order) {
    if (updated) setOrder(updated);
    setRecent(loadOrders().filter((o) => o.subsidiary === subsidiary));
  }

  function confirmPayment() {
    if (!order) return;
    const now = new Date().toISOString();
    refresh(
      updateOrder(order.id, {
        paymentStatus: "Payment confirmed",
        history: [...order.history, { status: "Payment confirmed", at: now }],
      })
    );
    setMessage("");
  }

  function advance() {
    if (!order) return;
    const { status, blockedReason } = nextStep(order);
    if (blockedReason) return setMessage(blockedReason);
    if (!status) return;
    const now = new Date().toISOString();
    refresh(
      updateOrder(order.id, {
        status,
        history: [...order.history, { status, at: now }],
      })
    );
    setMessage("");
  }

  const steps = order ? statusSteps(order.fulfillment) : [];
  const currentIndex = order ? steps.indexOf(order.status) : -1;
  const finished = order ? currentIndex === steps.length - 1 : false;

  return (
    <main className="section-padding">
      <div className="container-main max-w-4xl">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--gold-text)" }}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

        <h1
          className="mt-6 font-heading text-5xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Track your order
        </h1>
        <p className="mt-3" style={{ color: "var(--muted)" }}>
          Enter the reference you received, for example {idPrefix}-4K2P9Q.
        </p>

        <form onSubmit={search} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            className={inputClass}
            placeholder={`${idPrefix}-XXXXXX`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Order reference"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef850f] px-8 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
          >
            <Search size={18} />
            Track
          </button>
        </form>

        {notFound && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            <CircleAlert size={18} />
            No order found with that reference on this device.
          </p>
        )}

        {/* ---------- Order details ---------- */}
        {order && (
          <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Order {formatDate(order.createdAt)}
                </p>
                <p className="text-2xl font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
                  {order.id}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {order.customer.name} · {order.fulfillment} · {order.location}
                </p>
              </div>
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  order.paymentStatus === "Payment confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {/* Progress */}
            <ol className="mt-8 grid gap-4 sm:grid-cols-4">
              {steps.map((step, index) => {
                const done = index <= currentIndex;
                const at = order.history.find((h) => h.status === step)?.at;
                return (
                  <li key={step} className="flex items-center gap-3 sm:flex-col sm:text-center">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                        done
                          ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                          : "border-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {done ? <Check size={20} strokeWidth={3} /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {step}
                      </span>
                      <span className="block text-xs" style={{ color: "var(--muted)" }}>
                        {at ? formatDate(at) : "Pending"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* Items */}
            <ul className="mt-8 divide-y divide-[var(--border)] rounded-2xl bg-[var(--background)] px-5">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-4">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                    <Image src={item.image} alt="" fill sizes="48px" className="object-contain p-1" />
                  </span>
                  <span className="flex-1 text-sm" style={{ color: "var(--foreground)" }}>
                    <span className="font-semibold">{item.name}</span>
                    <span className="block" style={{ color: "var(--muted)" }}>
                      {item.quantity.toLocaleString()} × {formatNaira(item.unitPrice)} / {item.unit}
                    </span>
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {formatNaira(item.quantity * item.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 text-sm" style={{ color: "var(--foreground)" }}>
              <div className="flex justify-between">
                <span>Products</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>{order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total</span>
                <span style={{ color: "var(--gold-text)" }}>{formatNaira(order.total)}</span>
              </div>
              <p className="pt-1 text-xs" style={{ color: "var(--muted)" }}>
                {order.paymentTerms} · {order.paymentChannel}
              </p>
            </div>

            {/* Demo staff controls: only visible in demo mode */}
            {DEMO_MODE && (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-[var(--border)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--gold-text)" }}>
                  Demo controls · what Yusfaith staff will do
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={confirmPayment}
                    disabled={order.paymentStatus === "Payment confirmed"}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--button-bg)] px-5 py-2.5 text-sm font-bold text-[var(--button-text)] transition hover:bg-[var(--button-hover-bg)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Wallet size={16} />
                    Accounts: confirm payment
                  </button>
                  <button
                    type="button"
                    onClick={advance}
                    disabled={finished}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-5 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <PackageSearch size={16} />
                    {finished ? "Order complete" : `Move to “${steps[currentIndex + 1]}”`}
                  </button>
                </div>
                {message && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700">
                    <CircleAlert size={16} />
                    {message}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ---------- Recent orders on this device ---------- */}
        {recent.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Your recent orders on this device
            </h2>
            <ul className="mt-4 space-y-3">
              {recent.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(o.id);
                      setOrder(o);
                      setNotFound(false);
                      setMessage("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-left transition hover:border-[var(--gold)]"
                  >
                    <span>
                      <span className="block font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
                        {o.id}
                      </span>
                      <span className="block text-xs" style={{ color: "var(--muted)" }}>
                        {formatDate(o.createdAt)} · {o.items.length} product
                        {o.items.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--gold-text)" }}>
                      {o.status} · {formatNaira(o.total)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}