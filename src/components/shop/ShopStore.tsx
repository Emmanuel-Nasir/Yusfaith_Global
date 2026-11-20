"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HelpContacts from "@/components/orders/HelpContacts";
import RequestSent from "@/components/orders/RequestSent";
import { logActivity } from "@/lib/activity-log";
import { sendAlert } from "@/lib/alerts";
import { recipientsFor } from "@/lib/order-contacts";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  ShoppingBasket,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  addOrder,
  createOrderId,
  type Fulfillment,
  type Order,
  type PaymentTerms,
  type Subsidiary,
  CONTACT_METHODS,
  type ContactMethod,
} from "@/lib/orders";

/* ---------- configuration ---------- */

export type ShopProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  unit: string;
  price: number; // reference only: not shown, prices are quoted by staff
  badge?: string;
  contact?: string; // label of the sales contact for this product
};

export type SalesContact = {
  label: string; // e.g. "Dangote Cement"
  name: string;
  role: string;
  phone: string;
};

export type ShopZone = { name: string; fee: number };

export type ShopConfig = {
  subsidiary: Subsidiary;
  idPrefix: string; // e.g. "YC" -> YC-4K2P9Q
  eyebrow: string;
  headline: string;
  highlight: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  menuEyebrow: string;
  menuTitle: string;
  priceNote: string;
  products: ShopProduct[];
  filters: string[]; // category names, "All" is added automatically
  zones: ShopZone[];
  maxQuantity: number;
  imageFit: "cover" | "contain";
  highlights: { title: string; text: string }[]; // first three are shown
  notesPlaceholder: string;
  trackHref: string;
  salesContacts?: SalesContact[];
};

/* ---------- helpers ---------- */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const PICKUP_BRANCHES = [
  "Head office, Ogun State",
  "Office & depot, Lagos State",
  "Office, Oyo State",
  "Depot, Osun State",
];

/*
  PRICE REQUESTS
  Cement, building materials and spare parts have no fixed prices. Customers
  send a request; the branch manager, Head of Sales, GM and CEO are told, and
  staff send the price. The customer then pays by bank transfer (before
  dispatch or pickup) and uploads the receipt on the tracking page.
*/
const TERMS_FOR: Record<Fulfillment, PaymentTerms> = {
  Delivery: "Pay before dispatch",
  Pickup: "Pay before pickup",
};

const HIGHLIGHT_ICONS = [PackageCheck, Store, Truck];

type Basket = Record<string, number>; // productId -> quantity

/* ---------- component ---------- */

export default function ShopStore({ config }: { config: ShopConfig }) {
  const [filter, setFilter] = useState<string>("All");
  const [basket, setBasket] = useState<Basket>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // checkout form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactBy, setContactBy] = useState<ContactMethod>("WhatsApp");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [zone, setZone] = useState(config.zones[0].name);
  const [branch, setBranch] = useState(PICKUP_BRANCHES[0]);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<
    { id: string; label: string; address: string }[]
  >([]);

  // If a demo account is signed in, pre-fill checkout from it
  useEffect(() => {
    try {
      const email = JSON.parse(
        window.localStorage.getItem("yusfaith-demo-session") ?? "null"
      ) as string | null;
      if (!email) return;
      setEmail((current) => current || email);
      const accounts = JSON.parse(
        window.localStorage.getItem("yusfaith-demo-accounts") ?? "[]"
      ) as { name: string; email: string; phone: string }[];
      const found = accounts.find((a) => a.email === email);
      if (found) {
        setName(found.name);
        setPhone(found.phone);
      }
      setSavedAddresses(
        JSON.parse(
          window.localStorage.getItem("yusfaith-demo-addresses:" + email) ?? "[]"
        )
      );
    } catch {
      // ignore
    }
  }, []);

  const products = useMemo(
    () =>
      filter === "All"
        ? config.products
        : config.products.filter((p) => p.category === filter),
    [filter, config.products]
  );

  const lines = config.products
    .filter((p) => (basket[p.id] ?? 0) > 0)
    .map((p) => ({ product: p, quantity: basket[p.id] }));
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  function setQuantity(id: string, quantity: number) {
    const safe = Math.max(
      0,
      Math.min(config.maxQuantity, Math.floor(quantity) || 0)
    );
    setBasket((b) => ({ ...b, [id]: safe }));
  }

  function chooseFulfillment(value: Fulfillment) {
    setFulfillment(value);
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (name.trim().length < 2) return setError("Please enter your name.");
    const cleanEmail = email.trim();
    if (contactBy === "Email" && !cleanEmail)
      return setError("Enter your email address, or choose another way to reach you.");
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setError("Enter a valid email address, e.g. you@example.com.");
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(cleanPhone))
      return setError("Enter a valid Nigerian phone number, e.g. 08012345678.");
    if (fulfillment === "Delivery" && address.trim().length < 5)
      return setError("Please enter your delivery address.");
    if (fulfillment === "Delivery" && landmark.trim().length < 3)
      return setError("Please enter the nearest landmark to your address, e.g. a bus stop, church or filling station.");
    if (lines.length === 0) return setError("Your list is empty.");

    const now = new Date().toISOString();
    const location = fulfillment === "Delivery" ? zone : branch;
    const order: Order = {
      id: createOrderId(config.idPrefix),
      subsidiary: config.subsidiary,
      createdAt: now,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: fulfillment === "Delivery" ? address.trim() : "",
        landmark: fulfillment === "Delivery" ? landmark.trim() : undefined,
        notes: notes.trim(),
        email: email.trim() || undefined,
        contactBy,
      },
      location,
      fulfillment,
      paymentTerms: TERMS_FOR[fulfillment],
      paymentChannel: "Bank transfer",
      paymentStatus: "Awaiting quote",
      status: "Received",
      items: lines.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        unit: product.unit,
        quantity,
        unitPrice: 0, // set by staff when they send the price
      })),
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      history: [{ status: "Price request received", at: now }],
      pricing: "quote",
      messages: [
        { id: `M-${Date.now()}-0`, at: now, from: "system", name: "Yusfaith", text: "Request received" },
        ...(notes.trim()
          ? [{ id: `M-${Date.now()}-1`, at: now, from: "customer" as const, name: name.trim(), text: notes.trim() }]
          : []),
      ],
      notified: recipientsFor(
        config.subsidiary,
        lines.map((l) => l.product.id),
        location
      ),
      demo: true,
    };

    addOrder(order);
    logActivity({
      actor: order.customer.name,
      actorType: "Customer",
      category: "Order",
      action: `Sent price request ${order.id}`,
      detail: `${order.subsidiary} · ${itemCount.toLocaleString()} item(s) · ${order.fulfillment} · ${order.location}`,
    });
    sendAlert({
      audience: "staff",
      title: `New price request ${order.id}`,
      body: `${order.customer.name} · ${order.items.length} product(s) · ${order.subsidiary} · ${order.location}`,
      url: "/admin",
    });
    setPlacedOrder(order);
    setCheckoutOpen(false);
    setBasket({});
    setError("");
    setNotes("");
  }

  const imageClass =
    config.imageFit === "contain"
      ? "object-contain p-4 transition-transform duration-700 group-hover:scale-105"
      : "object-cover transition-transform duration-700 group-hover:scale-105";

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-[#0f1a3d] text-white">
        <Image
          src={config.heroImage}
          alt={config.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/80 to-[#0a1230]/30" />

        <div className="container-main relative z-10 py-28">
          <FadeUp>
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>

            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb347]">
              <PackageCheck size={18} />
              {config.eyebrow}
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              {config.headline}{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                {config.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              {config.intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Request a Price
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <Link
                href={config.trackHref}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Track a Request
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main grid gap-6 py-10 sm:grid-cols-3">
          {config.highlights.slice(0, 3).map((item, index) => {
            const Icon = HIGHLIGHT_ICONS[index];
            return (
              <div key={item.title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </span>
                  <span className="block text-sm" style={{ color: "var(--muted)" }}>
                    {item.text}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= MENU + BASKET ================= */}
      <section id="menu" className="section-padding scroll-mt-20">
        <div className="container-main">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p
                className="mb-3 text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--gold-text)" }}
              >
                {config.menuEyebrow}
              </p>
              <h2
                className="font-heading text-4xl font-semibold sm:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                {config.menuTitle}
              </h2>
              <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                {config.priceNote}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", ...config.filters].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    filter === c
                      ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {config.salesContacts && config.salesContacts.length > 0 && (
            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {config.salesContacts.map((contact) => (
                <a
                  key={contact.label + contact.phone}
                  href={`tel:+234${contact.phone.slice(1)}`}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--gold)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Phone size={18} />
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--gold-text)" }}>
                      {contact.label}
                    </span>
                    <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                      {contact.phone}
                    </span>
                    <span className="block truncate text-xs" style={{ color: "var(--muted)" }}>
                      {contact.name} · {contact.role}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Products */}
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {products.map((product) => {
                  const quantity = basket[product.id] ?? 0;
                  return (
                    <motion.article
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-shadow hover:shadow-xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className={imageClass}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0f1a3d]">
                          {product.badge ?? product.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                          {product.name}
                        </h3>
                        <p className="mt-1 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                          {product.description}
                        </p>
                        <p className="mt-3 text-sm font-bold" style={{ color: "var(--gold-text)" }}>
                          Price on request
                          <span className="ml-1 font-medium" style={{ color: "var(--muted)" }}>
                            · sold per {product.unit}
                          </span>
                        </p>
                        {(() => {
                          const contact = config.salesContacts?.find((c) => c.label === product.contact);
                          return contact ? (
                            <a
                              href={`tel:+234${contact.phone.slice(1)}`}
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold"
                              style={{ color: "var(--muted)" }}
                            >
                              <Phone size={13} style={{ color: "var(--gold-text)" }} />
                              {contact.role}: {contact.phone}
                            </a>
                          ) : null;
                        })()}

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, 1)}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] px-5 py-3 text-sm font-bold text-[var(--button-text)] transition hover:-translate-y-0.5 hover:bg-[var(--button-hover-bg)]"
                          >
                            <Plus size={16} />
                            Add to request
                          </button>
                        ) : (
                          <div className="mt-4 flex items-center justify-between rounded-full border border-[var(--gold)] p-1">
                            <button
                              type="button"
                              aria-label={`Remove one ${product.name}`}
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground)] transition hover:bg-[#ef850f] hover:text-[#0f1a3d]"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              max={config.maxQuantity}
                              aria-label={`Quantity of ${product.name}`}
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(product.id, Number(e.target.value))
                              }
                              className="w-20 bg-transparent text-center text-lg font-bold text-[var(--foreground)] outline-none"
                            />
                            <button
                              type="button"
                              aria-label={`Add one ${product.name}`}
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d] transition hover:bg-[#ff9a26]"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Basket */}
            <aside id="basket" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h3
                  className="flex items-center gap-2 text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  <ShoppingBasket size={22} style={{ color: "var(--gold-text)" }} />
                  Your request
                  {itemCount > 0 && (
                    <span className="ml-auto rounded-full bg-[#ef850f] px-2.5 py-0.5 text-sm text-[#0f1a3d]">
                      {itemCount.toLocaleString()}
                    </span>
                  )}
                </h3>

                {lines.length === 0 ? (
                  <p className="mt-6 text-sm leading-6" style={{ color: "var(--muted)" }}>
                    Add the products you need and how many. We&apos;ll send you
                    the price.
                  </p>
                ) : (
                  <>
                    <ul className="mt-5 space-y-4">
                      {lines.map(({ product, quantity }) => (
                        <li key={product.id} className="flex items-center gap-3">
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--background)]">
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="56px"
                              className={config.imageFit === "contain" ? "object-contain p-1" : "object-cover"}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                              {product.name}
                            </span>
                            <span className="block text-xs" style={{ color: "var(--muted)" }}>
                              {quantity.toLocaleString()} {product.unit}
                              {quantity === 1 ? "" : "s"}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => setQuantity(product.id, 0)}
                            className="text-[var(--muted)] transition hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-5" style={{ color: "var(--muted)" }}>
                      No payment now. Our team will send you the price, with
                      delivery worked out from your address and nearest landmark.
                    </p>

                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(true)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                    >
                      Request a price
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>

              <Link
                href={config.trackHref}
                className="mt-4 block text-center text-sm font-semibold underline-offset-4 hover:underline"
                style={{ color: "var(--gold-text)" }}
              >
                Track an existing request
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= MOBILE BASKET BAR ================= */}
      {itemCount > 0 && !checkoutOpen && (
        <a
          href="#basket"
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full bg-[#ef850f] px-6 py-4 font-bold text-[#0f1a3d] shadow-2xl lg:hidden"
        >
          <span className="flex items-center gap-2">
            <ShoppingBasket size={20} />
            {itemCount.toLocaleString()} item{itemCount === 1 ? "" : "s"}
          </span>
          <span>Request a price</span>
        </a>
      )}

      {/* ================= CHECKOUT MODAL ================= */}
      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutOpen(false)}
          >
            <motion.form
              onSubmit={placeOrder}
              noValidate
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[var(--background)] p-6 sm:rounded-3xl sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                    Request a price
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    No payment now. Tell us where you need it and we&apos;ll call you with the price.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setCheckoutOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Your name *
                  </span>
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Phone number *
                  </span>
                  <input className={inputClass} type="tel" placeholder="08012345678" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
                </label>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Email {contactBy === "Email" ? "*" : "(recommended)"}
                  </span>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
                    We email you every update on your order.
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    How should we reach you?
                  </span>
                  <select
                    className={inputClass}
                    value={contactBy}
                    onChange={(e) => setContactBy(e.target.value as ContactMethod)}
                    aria-label="How should we reach you?"
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Delivery or pickup */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(["Delivery", "Pickup"] as Fulfillment[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => chooseFulfillment(option)}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition ${
                      fulfillment === option
                        ? "border-[#ef850f] bg-[#ef850f]/10 text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {option === "Delivery" ? <Truck size={18} /> : <Store size={18} />}
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {fulfillment === "Delivery" ? (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Delivery state
                      </span>
                      <select className={inputClass} value={zone} onChange={(e) => setZone(e.target.value)}>
                        {config.zones.map((z) => (
                          <option key={z.name} value={z.name}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Delivery address *
                      </span>
                      <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" list="saved-addresses" />
<datalist id="saved-addresses">{savedAddresses.map((a) => (<option key={a.id} value={a.address}>{a.label}</option>))}</datalist>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Nearest landmark *
                      </span>
                      <input
                        className={inputClass}
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. opposite Total filling station, Kuto bus stop"
                      />
                      <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
                        Your delivery cost is worked out from your address and nearest landmark.
                      </span>
                    </label>
                  </>
                ) : (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Pickup location
                    </span>
                    <select className={inputClass} value={branch} onChange={(e) => setBranch(e.target.value)}>
                      {PICKUP_BRANCHES.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                )}

                <div className="rounded-xl border border-[#ef850f]/40 bg-[#ef850f]/5 px-4 py-3 text-sm leading-6 sm:col-span-2" style={{ color: "var(--muted)" }}>
                  <span className="font-bold" style={{ color: "var(--foreground)" }}>How it works:</span>{" "}
                  our sales team gets your request straight away and sends you the price.
                  Delivery is priced from your address and nearest landmark, so it is
                  fair for short and long trips. You then pay by
                  bank transfer before {fulfillment === "Delivery" ? "dispatch" : "pickup"} and upload
                  your receipt on the tracking page. No payment on delivery.
                </div>

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Notes (optional)
                  </span>
                  <textarea
                    rows={2}
                    className={inputClass}
                    placeholder={config.notesPlaceholder}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-2xl bg-[var(--surface)] p-5 text-sm" style={{ color: "var(--foreground)" }}>
                <p className="font-bold">Your request ({itemCount.toLocaleString()} item{itemCount === 1 ? "" : "s"})</p>
                <ul className="mt-2 space-y-1" style={{ color: "var(--muted)" }}>
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex justify-between gap-3">
                      <span>{product.name}</span>
                      <span className="shrink-0">
                        {quantity.toLocaleString()} {product.unit}
                        {quantity === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <HelpContacts
                compact
                subsidiary={config.subsidiary}
                productIds={Object.keys(basket).filter((id) => (basket[id] ?? 0) > 0)}
                location={fulfillment === "Delivery" ? zone : branch}
              />

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-4 text-base font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Send request
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONFIRMATION ================= */}
      <AnimatePresence>
        {placedOrder && (
          <RequestSent
            order={placedOrder}
            trackHref={config.trackHref}
            onClose={() => setPlacedOrder(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}