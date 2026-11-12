"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  ShoppingBasket,
  Store,
  Trash2,
  Truck,
  Wheat,
  X,
} from "lucide-react";
import {
  BAKERY_CATEGORIES,
  BAKERY_PRODUCTS,
  BAKERY_ZONES,
  type BakeryCategory,
} from "@/lib/bakery/catalog";
import {
  addOrder,
  createOrderId,
  formatNaira,
  type Fulfillment,
  type Order,
  type PaymentChannel,
  type PaymentTerms,
} from "@/lib/orders";

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

const TERMS_FOR: Record<Fulfillment, PaymentTerms[]> = {
  Delivery: ["Pay before dispatch", "Pay on arrival"],
  Pickup: ["Cash & Carry (pickup)"],
};

const CHANNELS: PaymentChannel[] = ["Bank transfer", "POS", "Cash", "Online"];

type Basket = Record<string, number>; // productId -> quantity

/* ---------- component ---------- */

export default function BakeryStore() {
  const [category, setCategory] = useState<BakeryCategory | "All">("All");
  const [basket, setBasket] = useState<Basket>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // checkout form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [zone, setZone] = useState(BAKERY_ZONES[0].name);
  const [branch, setBranch] = useState(PICKUP_BRANCHES[0]);
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState<PaymentTerms>("Pay before dispatch");
  const [channel, setChannel] = useState<PaymentChannel>("Bank transfer");
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
      category === "All"
        ? BAKERY_PRODUCTS
        : BAKERY_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  const lines = BAKERY_PRODUCTS.filter((p) => (basket[p.id] ?? 0) > 0).map(
    (p) => ({ product: p, quantity: basket[p.id] })
  );
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.quantity * l.product.price, 0);
  const deliveryFee =
    fulfillment === "Delivery"
      ? BAKERY_ZONES.find((z) => z.name === zone)?.fee ?? 0
      : 0;
  const total = subtotal + deliveryFee;

  function setQuantity(id: string, quantity: number) {
    const safe = Math.max(0, Math.min(999, Math.floor(quantity) || 0));
    setBasket((b) => ({ ...b, [id]: safe }));
  }

  function chooseFulfillment(value: Fulfillment) {
    setFulfillment(value);
    setTerms(TERMS_FOR[value][0]);
    if (value === "Pickup") setChannel("Cash");
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(cleanPhone))
      return setError("Enter a valid Nigerian phone number, e.g. 08012345678.");
    if (fulfillment === "Delivery" && address.trim().length < 5)
      return setError("Please enter your delivery address.");
    if (lines.length === 0) return setError("Your basket is empty.");

    const now = new Date().toISOString();
    const order: Order = {
      id: createOrderId("YB"),
      subsidiary: "Bakery",
      createdAt: now,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: fulfillment === "Delivery" ? address.trim() : "",
        notes: notes.trim(),
      },
      location: fulfillment === "Delivery" ? zone : branch,
      fulfillment,
      paymentTerms: terms,
      paymentChannel: channel,
      paymentStatus: "Awaiting payment",
      status: "Received",
      items: lines.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        image: product.image,
        unit: product.unit,
        quantity,
        unitPrice: product.price,
      })),
      subtotal,
      deliveryFee,
      total,
      history: [{ status: "Received", at: now }],
      demo: true,
    };

    addOrder(order);
    setPlacedOrder(order);
    setCheckoutOpen(false);
    setBasket({});
    setError("");
    setNotes("");
  }

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#2a1608] text-white">
        <Image
          src="/images/bakery/product-bread-assortment.jpg"
          alt="Freshly baked bread from Yusfaith Bakery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c0f05]/95 via-[#1c0f05]/75 to-[#1c0f05]/20" />

        <div className="container-main relative z-10 py-28">
          <FadeUp>
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1c0f05]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>

            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb347]">
              <Wheat size={18} />
              Yusfaith Bakery
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Baked fresh.{" "}
              <span className="text-[#ffb347]">Delivered warm.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              Bread, pastries, doughnuts and celebration cakes for homes,
              shops and events. Order online for delivery or pickup.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#1c0f05] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Order Now
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <Link
                href="/bakery/track"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#1c0f05]"
              >
                Track an Order
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main grid gap-6 py-10 sm:grid-cols-3">
          {[
            { Icon: Clock, title: "Baked fresh daily", text: "Every order is prepared fresh." },
            { Icon: Store, title: "Homes and retailers", text: "Single items or bulk orders." },
            { Icon: Truck, title: "Delivery or pickup", text: "Ogun, Lagos, Oyo and Osun States." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#1c0f05]">
                <Icon size={22} />
              </span>
              <span>
                <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                  {title}
                </span>
                <span className="block text-sm" style={{ color: "var(--muted)" }}>
                  {text}
                </span>
              </span>
            </div>
          ))}
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
                Our Menu
              </p>
              <h2
                className="font-heading text-4xl font-semibold sm:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                What would you like today?
              </h2>
              <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                Demo prices: sample estimates, not confirmed Yusfaith prices.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", ...BAKERY_CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    category === c
                      ? "border-[#ef850f] bg-[#ef850f] text-[#1c0f05]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

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
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#1c0f05]">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                          {product.name}
                        </h3>
                        <p className="mt-1 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                          {product.description}
                        </p>
                        <p className="mt-3 text-xl font-bold" style={{ color: "var(--gold-text)" }}>
                          {formatNaira(product.price)}
                          <span className="ml-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
                            / {product.unit}
                          </span>
                        </p>

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() => setQuantity(product.id, 1)}
                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] px-5 py-3 text-sm font-bold text-[var(--button-text)] transition hover:-translate-y-0.5 hover:bg-[var(--button-hover-bg)]"
                          >
                            <Plus size={16} />
                            Add to basket
                          </button>
                        ) : (
                          <div className="mt-4 flex items-center justify-between rounded-full border border-[var(--gold)] p-1">
                            <button
                              type="button"
                              aria-label={`Remove one ${product.name}`}
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground)] transition hover:bg-[#ef850f] hover:text-[#1c0f05]"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              aria-label={`Quantity of ${product.name}`}
                              value={quantity}
                              onChange={(e) => setQuantity(product.id, Number(e.target.value))}
                              className="w-16 bg-transparent text-center text-lg font-bold text-[var(--foreground)] outline-none"
                            />
                            <button
                              type="button"
                              aria-label={`Add one ${product.name}`}
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef850f] text-[#1c0f05] transition hover:bg-[#ff9a26]"
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
                  Your basket
                  {itemCount > 0 && (
                    <span className="ml-auto rounded-full bg-[#ef850f] px-2.5 py-0.5 text-sm text-[#1c0f05]">
                      {itemCount}
                    </span>
                  )}
                </h3>

                {lines.length === 0 ? (
                  <p className="mt-6 text-sm leading-6" style={{ color: "var(--muted)" }}>
                    Your basket is empty. Add bread, pastries or cakes from the
                    menu.
                  </p>
                ) : (
                  <>
                    <ul className="mt-5 space-y-4">
                      {lines.map(({ product, quantity }) => (
                        <li key={product.id} className="flex items-center gap-3">
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                            <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                              {product.name}
                            </span>
                            <span className="block text-xs" style={{ color: "var(--muted)" }}>
                              {quantity} × {formatNaira(product.price)}
                            </span>
                          </span>
                          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                            {formatNaira(quantity * product.price)}
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

                    <div className="mt-5 flex justify-between border-t border-[var(--border)] pt-4 font-bold" style={{ color: "var(--foreground)" }}>
                      <span>Subtotal</span>
                      <span>{formatNaira(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      Delivery fee is added at checkout.
                    </p>

                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(true)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#1c0f05] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                    >
                      Checkout
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>

              <Link
                href="/bakery/track"
                className="mt-4 block text-center text-sm font-semibold underline-offset-4 hover:underline"
                style={{ color: "var(--gold-text)" }}
              >
                Track an existing order
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= MOBILE BASKET BAR ================= */}
      {itemCount > 0 && !checkoutOpen && (
        <a
          href="#basket"
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full bg-[#ef850f] px-6 py-4 font-bold text-[#1c0f05] shadow-2xl lg:hidden"
        >
          <span className="flex items-center gap-2">
            <ShoppingBasket size={20} />
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
          <span>{formatNaira(subtotal)}</span>
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
                    Checkout
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    Demo order: saved on this device, nothing is charged.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close checkout"
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
                        Delivery area
                      </span>
                      <select className={inputClass} value={zone} onChange={(e) => setZone(e.target.value)}>
                        {BAKERY_ZONES.map((z) => (
                          <option key={z.name} value={z.name}>
                            {z.name} (delivery {formatNaira(z.fee)})
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

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    When will you pay?
                  </span>
                  <select className={inputClass} value={terms} onChange={(e) => setTerms(e.target.value as PaymentTerms)}>
                    {TERMS_FOR[fulfillment].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    How will you pay?
                  </span>
                  <select className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value as PaymentChannel)}>
                    {CHANNELS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Notes (optional)
                  </span>
                  <textarea
                    rows={2}
                    className={inputClass}
                    placeholder="e.g. Write 'Happy Birthday Tolu' on the cake"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>

              {/* Summary */}
              <div className="mt-6 space-y-2 rounded-2xl bg-[var(--surface)] p-5 text-sm" style={{ color: "var(--foreground)" }}>
                <div className="flex justify-between">
                  <span>Products ({itemCount})</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{fulfillment === "Delivery" ? `Delivery to ${zone}` : "Pickup"}</span>
                  <span>{deliveryFee ? formatNaira(deliveryFee) : "Free"}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span style={{ color: "var(--gold-text)" }}>{formatNaira(total)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-4 text-base font-bold text-[#1c0f05] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Place Demo Order · {formatNaira(total)}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONFIRMATION ================= */}
      <AnimatePresence>
        {placedOrder && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md rounded-3xl bg-[var(--background)] p-8 text-center"
            >
              <CheckCircle2 size={56} className="mx-auto text-[#ef850f]" />
              <h2 className="mt-4 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                Order placed!
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Your order reference is
              </p>
              <p className="mt-1 text-2xl font-bold tracking-wider" style={{ color: "var(--gold-text)" }}>
                {placedOrder.id}
              </p>
              <p className="mt-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
                Total {formatNaira(placedOrder.total)} · {placedOrder.paymentTerms}.
                This is a demo: no payment has been taken and Yusfaith has not
                been notified.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/bakery/track?id=${placedOrder.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#1c0f05] transition hover:bg-[#ff9a26]"
                >
                  Track this order
                  <ArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => setPlacedOrder(null)}
                  className="rounded-full border border-[var(--border)] px-6 py-3.5 font-semibold text-[var(--foreground)]"
                >
                  Continue shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}