"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BellRing, CheckCircle2, MapPin, PhoneCall, Upload, Wallet } from "lucide-react";
import HelpContacts from "@/components/orders/HelpContacts";
import type { Order } from "@/lib/orders";

/*
  REQUEST SENT
  Shown after a customer sends a price request (Cement, Building Materials,
  Spare Parts). Lists who was told and what happens next.
*/

type Props = {
  order: Order;
  trackHref: string;
  onClose: () => void;
};

const NEXT_STEPS = [
  { Icon: PhoneCall, title: "We call you with the price", text: "One of the people below will call or WhatsApp you with the price, including delivery." },
  { Icon: Wallet, title: "Pay by bank transfer", text: "The price and our account details also appear on your tracking page." },
  { Icon: Upload, title: "Upload your receipt", text: "Upload the transfer receipt on the tracking page. We process your order once payment is confirmed." },
];

export default function RequestSent({ order, trackHref, onClose }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-sent-title"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="my-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        {/* ---------- Summary ---------- */}
        <aside className="bg-[var(--surface)] p-6 sm:p-8">
          <CheckCircle2 size={48} className="text-[#ef850f]" />
          <h2
            id="request-sent-title"
            className="mt-3 font-heading text-4xl font-semibold sm:text-5xl"
            style={{ color: "var(--foreground)" }}
          >
            Request sent!
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Your request reference
          </p>
          <p className="text-3xl font-bold tracking-wider" style={{ color: "var(--gold-text)" }}>
            {order.id}
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Keep this reference. You will need it to track your request and as your transfer narration.
          </p>

          <ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--background)]">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {item.name}
                </span>
                <span className="shrink-0 text-sm" style={{ color: "var(--muted)" }}>
                  {item.quantity.toLocaleString()} {item.unit}
                  {item.quantity === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-4 flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <MapPin size={16} className="mt-0.5 shrink-0" />
            {order.fulfillment === "Delivery"
              ? `Delivery to ${order.customer.address} (${order.location})`
              : `Pickup at ${order.location}`}
          </p>
        </aside>

        {/* ---------- Who was told + next steps ---------- */}
        <section className="p-6 sm:p-8">
          <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: "var(--foreground)" }}>
            <BellRing size={20} style={{ color: "var(--gold-text)" }} />
            Your request has gone to
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(order.notified ?? []).map((person) => (
              <li
                key={person.name}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
              >
                <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                  {person.name}
                </span>
                <span className="block text-xs" style={{ color: "var(--muted)" }}>
                  {person.role}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-lg font-bold" style={{ color: "var(--foreground)" }}>
            What happens next
          </h3>
          <ol className="mt-3 space-y-4">
            {NEXT_STEPS.map(({ Icon, title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                  <Icon size={17} />
                </span>
                <span>
                  <span className="block font-semibold" style={{ color: "var(--foreground)" }}>
                    {index + 1}. {title}
                  </span>
                  <span className="block text-sm leading-6" style={{ color: "var(--muted)" }}>
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
            Payment is by bank transfer only, before{" "}
            {order.fulfillment === "Delivery" ? "dispatch" : "pickup"}. No payment on delivery.
          </p>

          <HelpContacts
            compact
            subsidiary={order.subsidiary}
            productIds={order.items.map((item) => item.productId)}
            orderId={order.id}
            location={order.location}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`${trackHref}?id=${order.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
            >
              Track this request
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--border)] px-6 py-3.5 font-semibold text-[var(--foreground)]"
            >
              Done
            </button>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
