"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import BankDetails from "@/components/orders/BankDetails";
import HelpContacts from "@/components/orders/HelpContacts";
import ReceiptUpload from "@/components/orders/ReceiptUpload";
import { formatNaira, removeOrder, type Order } from "@/lib/orders";

/*
  ORDER PLACED → PAY → UPLOAD RECEIPT
  Shown straight after checkout. Payment on the website is by bank transfer
  only, and the receipt is required: the window cannot be dismissed until a
  receipt is uploaded (or the customer cancels the order).
*/

type Props = {
  order: Order;
  trackHref: string; // e.g. "/cement/track"
  onChange: (order: Order) => void;
  onClose: () => void;
  dark?: string; // text colour on the orange buttons
};

function Step({
  number,
  title,
  done,
  children,
}: {
  number: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-12">
      <span
        className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
          done ? "bg-green-600 text-white" : "bg-[#ef850f] text-[#0f1a3d]"
        }`}
      >
        {done ? <CheckCircle2 size={18} /> : number}
      </span>
      <h3 className="pt-1.5 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function OrderPlaced({ order, trackHref, onChange, onClose, dark = "#0f1a3d" }: Props) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const receiptDone = Boolean(order.receipt);

  function cancelOrder() {
    removeOrder(order.id);
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-placed-title"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="my-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        {/* ---------- Order summary ---------- */}
        <aside className="bg-[var(--surface)] p-6 sm:p-8">
          <CheckCircle2 size={48} className="text-[#ef850f]" />
          <h2
            id="order-placed-title"
            className="mt-3 font-heading text-4xl font-semibold sm:text-5xl"
            style={{ color: "var(--foreground)" }}
          >
            Order placed!
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Your order reference
          </p>
          <p className="text-3xl font-bold tracking-wider" style={{ color: "var(--gold-text)" }}>
            {order.id}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Keep this reference. Use it as your transfer narration and to track your order.
          </p>

          <ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--background)]">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {item.name}
                  </span>
                  <span className="block text-xs" style={{ color: "var(--muted)" }}>
                    {item.quantity} × {formatNaira(item.unitPrice)} / {item.unit}
                  </span>
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {formatNaira(item.quantity * item.unitPrice)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
            <div className="flex justify-between">
              <dt>Products</dt>
              <dd>{formatNaira(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{order.fulfillment === "Delivery" ? "Delivery fee" : "Pickup"}</dt>
              <dd>{order.fulfillment === "Delivery" ? formatNaira(order.deliveryFee) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 text-lg font-bold" style={{ color: "var(--foreground)" }}>
              <dt>Total to pay</dt>
              <dd style={{ color: "var(--gold-text)" }}>{formatNaira(order.total)}</dd>
            </div>
          </dl>

          <p className="mt-4 flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <MapPin size={16} className="mt-0.5 shrink-0" />
            {order.fulfillment === "Delivery"
              ? `Delivery to ${order.customer.address} (${order.location})`
              : `Pickup at ${order.location}`}
          </p>
        </aside>

        {/* ---------- Payment steps ---------- */}
        <section className="space-y-8 p-6 sm:p-8">
          <Step number={1} title={`Transfer ${formatNaira(order.total)}`} done={receiptDone}>
            <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
              We accept payment by bank transfer only. Pay before{" "}
              {order.fulfillment === "Delivery" ? "dispatch" : "pickup"}: there is
              no payment on delivery.
            </p>
            {!receiptDone && <BankDetails compact orderId={order.id} />}
          </Step>

          <Step number={2} title="Upload your receipt" done={receiptDone}>
            <ReceiptUpload order={order} onUpdated={onChange} required allowReplace={!receiptDone} />
          </Step>

          {receiptDone ? (
            <Step number={3} title="We confirm and process your order" done>
              <p className="flex items-start gap-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-green-700" />
                Thank you. Our accounts team will check your transfer, and your order
                will be {order.fulfillment === "Delivery" ? "dispatched" : "made ready for pickup"} once
                payment is confirmed. You can follow every step on the tracking page.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`${trackHref}?id=${order.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold transition hover:bg-[#ff9a26]"
                  style={{ color: dark }}
                >
                  Track this order
                  <ArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-[var(--border)] px-6 py-3.5 font-semibold text-[var(--foreground)]"
                >
                  Continue shopping
                </button>
              </div>
            </Step>
          ) : (
            <div className="rounded-xl bg-[var(--surface)] p-4 text-sm" style={{ color: "var(--muted)" }}>
              <p className="flex items-start gap-2">
                <Clock3 size={16} className="mt-0.5 shrink-0" />
                <span>
                  Your order is saved as <strong style={{ color: "var(--foreground)" }}>{order.id}</strong>{" "}
                  but will not be processed until your receipt is uploaded.
                </span>
              </p>
              {confirmCancel ? (
                <p className="mt-3 flex flex-wrap items-center gap-3">
                  Cancel this order?
                  <button type="button" onClick={cancelOrder} className="font-bold text-red-700 underline">
                    Yes, cancel it
                  </button>
                  <button type="button" onClick={() => setConfirmCancel(false)} className="font-semibold underline">
                    No, keep it
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="mt-3 text-xs font-semibold underline"
                >
                  Cancel this order
                </button>
              )}
            </div>
          )}

          <HelpContacts
            compact
            subsidiary={order.subsidiary}
            productIds={order.items.map((item) => item.productId)}
            orderId={order.id}
          />
        </section>
      </motion.div>
    </motion.div>
  );
}
