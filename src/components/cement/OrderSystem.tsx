
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";

import {
  PRODUCTS,
  CEMENT_BRANDS,
  PAYMENT_LABELS,
  calculateDeliveryEstimate,
  formatNaira,
} from "@/lib/cement/catalog";

import {
  getCart,
  saveCart,
  saveOrder,
  makeOrderId,
  MAX_BAGS_PER_PRODUCT,
} from "@/lib/cement/storage";

import type {
  CartLine,
  CementOrder,
  Fulfillment,
  PaymentMethod,
} from "@/lib/cement/types";

const primary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-5 py-3 text-center text-sm font-bold !text-[#f2c85b] transition hover:bg-[#1c3555] disabled:cursor-not-allowed disabled:opacity-50";

const secondary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold !text-[#0b1629] transition hover:bg-slate-100";

const input =
  "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0b1629] outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

const label =
  "mb-2 block text-sm font-semibold text-[#0b1629]";

const steps = [
  "Products",
  "Customer",
  "Payment",
  "Confirmation",
];

export default function OrderSystem() {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [brand, setBrand] = useState("All");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<CementOrder | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fulfillment, setFulfillment] =
    useState<Fulfillment>("delivery");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("quotation");

  useEffect(() => {
    setCart(getCart());
    setReady(true);
  }, []);

  const lines = useMemo(
    () =>
      cart.flatMap((entry) => {
        const product = PRODUCTS.find(
          (p) => p.id === entry.productId
        );
        return product
          ? [
              {
                ...product,
                quantity: entry.quantity,
                subtotal:
                  product.samplePrice * entry.quantity,
              },
            ]
          : [];
      }),
    [cart]
  );

  const totalBags = lines.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  const subtotal = lines.reduce(
    (sum, line) => sum + line.subtotal,
    0
  );

  const deliveryEstimate = calculateDeliveryEstimate(
    fulfillment,
    totalBags
  );

  const estimatedTotal = subtotal + deliveryEstimate;

  const visibleProducts = PRODUCTS.filter(
    (p) => brand === "All" || p.brand === brand
  );

  function changeQuantity(id: string, amount: number) {
    const current =
      cart.find((line) => line.productId === id)
        ?.quantity ?? 0;

    const quantity = Math.max(
      0,
      Math.min(MAX_BAGS_PER_PRODUCT, current + amount)
    );

    setQuantity(id, quantity);
  }

  function setQuantity(id: string, quantity: number) {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 0 ||
      quantity > MAX_BAGS_PER_PRODUCT
    ) {
      setError("Enter a valid quantity.");
      return;
    }

    const next = cart.filter(
      (line) => line.productId !== id
    );

    if (quantity > 0) {
      next.push({ productId: id, quantity });
    }

    try {
      saveCart(next);
      setCart(next);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update basket."
      );
    }
  }

  function validateCustomer() {
    if (name.trim().length < 2)
      return "Enter your full name.";

    if (!/^[+()\d\s-]{7,20}$/.test(phone.trim()))
      return "Enter a valid phone number.";

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    )
      return "Enter a valid email address.";

    if (!location.trim())
      return "Enter your town or preferred depot.";

    if (fulfillment === "delivery" && !address.trim())
      return "Enter a delivery address.";

    return "";
  }

  function continueStep() {
    setError("");

    if (step === 0) {
      if (totalBags < 1) {
        setError("Select at least one product.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      const message = validateCustomer();
      if (message) {
        setError(message);
        return;
      }
      setStep(2);
    }
  }

  function createOrder() {
    if (saving) return;
    if (totalBags < 1) {
      setError("Your basket is empty.");
      setStep(0);
      return;
    }

    const message = validateCustomer();
    if (message) {
      setError(message);
      setStep(1);
      return;
    }

    const order: CementOrder = {
      id: makeOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      },
      fulfillment,
      location: location.trim(),
      address:
        fulfillment === "delivery" ? address.trim() : "",
      notes: notes.trim(),
      lines: lines.map((item) => ({
        productId: item.id,
        name: item.name,
        brand: item.brand,
        image: item.image,
        quantity: item.quantity,
        unitPrice: item.samplePrice,
        subtotal: item.subtotal,
      })),
      totalBags,
      subtotal,
      deliveryEstimate,
      estimatedTotal,
      paymentMethod,
      paymentStatus: "not-paid",
      status: "received",
      demo: true,
    };

    setSaving(true);
    setError("");

    try {
      saveOrder(order);

      try {
        saveCart([]);
        setCart([]);
      } catch {
        // The completed order is still saved.
      }

      setCreated(order);
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the order."
      );
    } finally {
      setSaving(false);
    }
  }

  function newOrder() {
    setCreated(null);
    setStep(0);
    setName("");
    setPhone("");
    setEmail("");
    setLocation("");
    setAddress("");
    setNotes("");
    setFulfillment("delivery");
    setPaymentMethod("quotation");
    setError("");
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f6f5f1] p-12 text-center text-[#0b1629]">
        Loading your basket...
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f5f1] text-[#0b1629]">
      <section className="bg-[#0b1629] py-12 text-white">
        <div className="container-main">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2c85b]">
            Yusfaith Global Enterprises
          </p>

          <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
            Cement Ordering
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            Build your cement order, review estimated costs
            and choose a payment preference.
          </p>

          <p className="mt-3 text-sm font-bold text-[#f2c85b]">
            Demo only — sample prices, no real payments.
          </p>

          <nav className="mt-6 flex flex-wrap gap-5 text-sm">
            <Link href="/cement" className="!text-white underline">
              Cement homepage
            </Link>
            <Link href="/cement/orders" className="!text-white underline">
              Order history
            </Link>
            <Link href="/cement/track" className="!text-white underline">
              Track order
            </Link>
          </nav>
        </div>
      </section>

      <div className="container-main py-8 sm:py-12">
        <div className="mb-8 grid grid-cols-4 gap-2">
          {steps.map((title, index) => (
            <div
              key={title}
              aria-current={step === index ? "step" : undefined}
              className={`min-w-0 rounded-xl px-1 py-3 text-center text-[10px] font-bold sm:text-sm ${
                index === step
                  ? "bg-[#0b1629] text-[#f2c85b]"
                  : index < step
                  ? "bg-amber-100 text-[#0b1629]"
                  : "bg-white text-slate-500"
              }`}
            >
              {index + 1}. {title}
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {/* PRODUCTS */}
        {step === 0 && (
          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
            <section className="min-w-0">
              <h2 className="font-heading text-3xl font-semibold">
                Select Your Cement
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                All prices below are editable demo estimates
                per bag, not live selling prices.
              </p>

              <div className="my-7 flex flex-wrap gap-2">
                {CEMENT_BRANDS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setBrand(option)}
                    aria-pressed={brand === option}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      brand === option
                        ? "border-[#0b1629] bg-[#0b1629] text-[#f2c85b]"
                        : "border-slate-300 bg-white text-[#0b1629]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const quantity =
                    cart.find(
                      (line) =>
                        line.productId === product.id
                    )?.quantity ?? 0;

                  return (
                    <article
                      key={product.id}
                      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative h-56 bg-[#f1eee8]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                          className="object-contain p-4"
                        />

                        {product.bulkOption && (
                          <span className="absolute left-3 top-3 rounded-full bg-[#0b1629] px-3 py-1 text-xs font-bold text-[#f2c85b]">
                            Bulk option
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                          {product.brand}
                        </p>

                        <h3 className="mt-2 font-heading text-xl font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>

                        <p className="mt-5 text-xl font-bold text-[#0b1629]">
                          {formatNaira(product.samplePrice)}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / bag
                          </span>
                        </p>

                        <p className="mt-1 text-xs font-semibold text-amber-800">
                          Sample price · Not a final quote
                        </p>

                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              changeQuantity(product.id, 1)
                            }
                            className={`${primary} mt-5 w-full`}
                          >
                            <Plus size={17} />
                            Add to Basket
                          </button>
                        ) : (
                          <div className="mt-5 flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Decrease ${product.name}`}
                              onClick={() =>
                                changeQuantity(product.id, -1)
                              }
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0b1629]"
                            >
                              <Minus size={17} />
                            </button>

                            <input
                              type="number"
                              min="0"
                              max={MAX_BAGS_PER_PRODUCT}
                              aria-label={`${product.name} quantity`}
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(
                                  product.id,
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value)
                                )
                              }
                              className="h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-1 text-center text-sm font-bold text-[#0b1629]"
                            />

                            <button
                              type="button"
                              aria-label={`Increase ${product.name}`}
                              onClick={() =>
                                changeQuantity(product.id, 1)
                              }
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-[#0b1629]"
                            >
                              <Plus size={17} />
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* LIVE BASKET SUMMARY */}
            <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <ShoppingCart size={22} />
                Your Basket
              </h2>

              {lines.length === 0 ? (
                <p className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">
                  No products selected yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {lines.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-slate-200 pb-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.quantity.toLocaleString()} ×{" "}
                            {formatNaira(item.samplePrice)}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() =>
                            setQuantity(item.id, 0)
                          }
                          className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <p className="mt-2 text-right font-bold">
                        {formatNaira(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-3 rounded-xl bg-[#fff8e8] p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span>Total bags</span>
                  <strong>{totalBags.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Products subtotal</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>

                <p className="text-xs leading-5 text-amber-900">
                  Delivery is estimated separately during
                  checkout.
                </p>
              </div>

              <button
                type="button"
                disabled={totalBags === 0}
                onClick={continueStep}
                className={`${primary} mt-6 w-full`}
              >
                Continue to Details
                <ArrowRight size={17} />
              </button>
            </aside>
          </div>
        )}

        {/* CUSTOMER DETAILS */}
        {step === 1 && (
          <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-9">
            <h2 className="font-heading text-3xl font-semibold">
              Customer & Delivery
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Use fictional customer details when presenting
              the demo.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  className={input}
                  value={name}
                  maxLength={100}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className={label} htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={input}
                  value={phone}
                  maxLength={20}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="email">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  className={input}
                  value={email}
                  maxLength={150}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="fulfillment">
                  Order Fulfillment *
                </label>
                <select
                  id="fulfillment"
                  className={input}
                  value={fulfillment}
                  onChange={(e) =>
                    setFulfillment(
                      e.target.value as Fulfillment
                    )
                  }
                >
                  <option value="delivery">
                    Request Delivery
                  </option>
                  <option value="pickup">
                    Depot Pickup
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="location">
                  Town / Preferred Depot *
                </label>
                <input
                  id="location"
                  className={input}
                  value={location}
                  maxLength={150}
                  placeholder="e.g. Abeokuta, Ogun State"
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />
              </div>

              {fulfillment === "delivery" && (
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="address">
                    Delivery Address *
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    className={input}
                    value={address}
                    maxLength={300}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className={label} htmlFor="notes">
                  Additional Instructions
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className={input}
                  value={notes}
                  maxLength={500}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(0);
                }}
                className={secondary}
              >
                <ArrowLeft size={17} />
                Back to Products
              </button>

              <button
                type="button"
                onClick={continueStep}
                className={primary}
              >
                Continue to Payment
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* PAYMENT & REVIEW */}
        {step === 2 && (
          <div className="mx-auto grid max-w-5xl items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-3 font-heading text-3xl font-semibold">
                <CreditCard size={28} className="text-amber-700" />
                Payment Preference
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Choose how you would prefer to pay after
                Yusfaith confirms the final quotation.
                No payment is collected in this demo.
              </p>

              <fieldset className="mt-8 space-y-3">
                <legend className="mb-3 font-semibold">
                  Select Payment Method
                </legend>

                {(
                  [
                    "bank-transfer",
                    "card",
                    "quotation",
                  ] as PaymentMethod[]
                ).map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-5 transition ${
                      paymentMethod === method
                        ? "border-amber-600 bg-amber-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mt-1 accent-[#0b1629]"
                    />

                    <span className="min-w-0">
                      <span className="block font-semibold">
                        {PAYMENT_LABELS[method]}
                      </span>

                      <span className="mt-2 block text-xs leading-6 text-slate-600">
                        {method === "bank-transfer"
                          ? "Bank account details will be supplied after a real quotation is approved. No transfer is requested now."
                          : method === "card"
                          ? "Card payment is a visual demo option only. No card information is collected."
                          : "Request a final confirmed quotation before arranging payment."}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="mt-8 rounded-xl bg-slate-50 p-5">
                <h3 className="font-bold">
                  Customer & Delivery Summary
                </h3>

                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Customer</dt>
                    <dd className="break-words font-semibold">
                      {name}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="font-semibold">{phone}</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Method</dt>
                    <dd className="font-semibold capitalize">
                      {fulfillment}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Location</dt>
                    <dd className="break-words font-semibold">
                      {location}
                    </dd>
                  </div>

                  {fulfillment === "delivery" && (
                    <div>
                      <dt className="text-slate-500">
                        Delivery Address
                      </dt>
                      <dd className="break-words font-semibold">
                        {address}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
                <strong>Important:</strong> These are
                illustrative prices and delivery estimates.
                Your order is saved locally for demonstration
                only. It is not a real booking, payment or
                confirmed quotation.
              </div>
            </section>

            <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-heading text-2xl font-semibold">
                Order Summary
              </h3>

              <div className="mt-6 space-y-4">
                {lines.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-slate-200 pb-4"
                  >
                    <p className="font-semibold">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.quantity.toLocaleString()} bags ×{" "}
                      {formatNaira(item.samplePrice)}
                    </p>
                    <p className="mt-2 font-bold">
                      {formatNaira(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span>Total bags</span>
                  <strong>{totalBags.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Products subtotal</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>

                <div className="flex justify-between gap-3">
                  <span>
                    {fulfillment === "pickup"
                      ? "Pickup"
                      : "Demo delivery allowance"}
                  </span>
                  <strong>
                    {formatNaira(deliveryEstimate)}
                  </strong>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-slate-500">
                    Estimated Order Total
                  </p>
                  <p className="mt-2 break-words text-3xl font-bold text-[#0b1629]">
                    {formatNaira(estimatedTotal)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={createOrder}
                className={`${primary} mt-7 w-full`}
              >
                <Check size={18} />
                {saving
                  ? "Saving..."
                  : "Create Demo Order"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                className={`${secondary} mt-3 w-full`}
              >
                <ArrowLeft size={17} />
                Edit Details
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                No money will be charged.
              </p>
            </aside>
          </div>
        )}

        {/* CONFIRMATION */}
        {step === 3 && created && (
          <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <PackageCheck
                size={44}
                className="text-emerald-700"
              />
            </div>

            <h2 className="mt-6 font-heading text-3xl font-semibold sm:text-4xl">
              Demo Order Created!
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Your order has been saved in this browser.
              No payment has been processed.
            </p>

            <div className="mt-7 rounded-xl bg-[#fff8e8] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Order Reference
              </p>

              <p className="mt-3 break-all font-mono text-base font-bold sm:text-xl">
                {created.id}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(created.id)
                    .catch(() => {})
                }
                className="mt-4 text-sm font-semibold text-[#0b1629] underline underline-offset-4"
              >
                Copy Reference
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">
                  Total Bags
                </p>
                <p className="mt-1 font-bold">
                  {created.totalBags.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Estimated Total
                </p>
                <p className="mt-1 font-bold">
                  {formatNaira(created.estimatedTotal ?? 0)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Payment Preference
                </p>
                <p className="mt-1 font-bold">
                  {PAYMENT_LABELS[
                    created.paymentMethod ?? "quotation"
                  ]}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Payment Status
                </p>
                <p className="mt-1 font-bold">
                  Not Paid — Demo Only
                </p>
              </div>
            </div>

            <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href={`/cement/track?ref=${encodeURIComponent(created.id)}`}
                className={`${primary} w-full`}
              >
                <Truck size={17} />
                Track Order
              </Link>

              <Link
                href="/cement/orders"
                className={`${secondary} w-full`}
              >
                Order History
              </Link>

              <button
                type="button"
                onClick={newOrder}
                className={`${secondary} w-full`}
              >
                <Plus size={17} />
                New Order
              </button>
            </div>

            <p className="mt-6 text-xs leading-6 text-slate-500">
              This is not a receipt, final invoice or
              proof of payment.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
