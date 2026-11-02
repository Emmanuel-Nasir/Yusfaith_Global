
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  CATEGORIES,
  PRODUCTS,
  PAYMENT_LABELS,
  MAX_QUANTITY_PER_PRODUCT,
  calculateDeliveryEstimate,
  formatNaira,
  type CartItem,
  type Fulfillment,
  type MaterialOrder,
  type PaymentMethod,
} from "@/lib/building-materials/catalog";

import {
  createOrderId,
  getCart,
  saveCart,
  saveOrder,
} from "@/lib/building-materials/storage";

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl !bg-[#0b1629] px-5 py-3 text-center text-sm font-bold !text-[#f2c85b] no-underline disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 !bg-white px-5 py-3 text-center text-sm font-bold !text-[#0b1629] no-underline";

const inputStyle =
  "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#0b1629] outline-none focus:border-amber-600";

const steps = [
  "Products",
  "Customer",
  "Payment",
  "Confirmation",
] as const;

type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  notes: string;
};

const emptyCustomer: CustomerDetails = {
  name: "",
  phone: "",
  email: "",
  location: "",
  address: "",
  notes: "",
};

type QuantityEditorProps = {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  onQuantityChange: (
    productId: string,
    quantity: number
  ) => void;
};

function QuantityEditor({
  productId,
  productName,
  unit,
  quantity,
  onQuantityChange,
}: QuantityEditorProps) {
  const [draft, setDraft] = useState(String(quantity));
  const [editing, setEditing] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!editing) {
      setDraft(String(quantity));
    }
  }, [quantity, editing]);

  function commit() {
    setEditing(false);

    const value = Number(draft);

    if (
      draft.trim() === "" ||
      !Number.isSafeInteger(value) ||
      value < 0 ||
      value > MAX_QUANTITY_PER_PRODUCT
    ) {
      setInvalid(true);
      setDraft(String(quantity));
      return;
    }

    setInvalid(false);
    onQuantityChange(productId, value);
    setDraft(String(value));
  }

  function adjust(amount: number) {
    const current = Number(draft);
    const base =
      draft.trim() !== "" &&
      Number.isSafeInteger(current) &&
      current >= 0
        ? current
        : quantity;

    const next = Math.max(
      0,
      Math.min(MAX_QUANTITY_PER_PRODUCT, base + amount)
    );

    setEditing(false);
    setInvalid(false);
    setDraft(String(next));
    onQuantityChange(productId, next);
  }

  return (
    <div className="mt-5">
      <label
        htmlFor={`bm-quantity-${productId}`}
        className="mb-2 block text-xs font-semibold text-slate-600"
      >
        Quantity ({unit})
      </label>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => adjust(-1)}
          aria-label={`Decrease ${productName}`}
          className="flex h-12 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 !bg-white !text-[#0b1629]"
        >
          <Minus size={17} />
        </button>

        <input
          id={`bm-quantity-${productId}`}
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_QUANTITY_PER_PRODUCT}
          step={1}
          value={draft}
          onFocus={(event) => {
            setEditing(true);
            event.currentTarget.select();
          }}
          onChange={(event) => {
            setDraft(event.target.value);
            setInvalid(false);
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          aria-label={`Quantity of ${productName}`}
          aria-invalid={invalid}
          className={`h-12 w-full min-w-0 rounded-lg border bg-white px-2 text-center text-lg font-bold text-[#0b1629] outline-none ${
            invalid
              ? "border-red-500"
              : "border-slate-300 focus:border-amber-600"
          }`}
        />

        <button
          type="button"
          onClick={() => adjust(1)}
          aria-label={`Increase ${productName}`}
          className="flex h-12 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 !bg-white !text-[#0b1629]"
        >
          <Plus size={17} />
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Type a bulk quantity and press Enter, or click outside.
      </p>

      {invalid && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          Enter a whole number between 0 and{" "}
          {MAX_QUANTITY_PER_PRODUCT.toLocaleString()}.
        </p>
      )}
    </div>
  );
}

export default function BuildingMaterialsStore() {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<MaterialOrder | null>(null);

  const [customer, setCustomer] =
    useState<CustomerDetails>({ ...emptyCustomer });

  const [fulfillment, setFulfillment] =
    useState<Fulfillment>("delivery");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("quotation");

  useEffect(() => {
    setCart(getCart());
    setReady(true);
  }, []);

  const lines = useMemo(() => {
    return cart.flatMap((entry) => {
      const product = PRODUCTS.find(
        (item) => item.id === entry.productId
      );

      if (!product) return [];

      return [
        {
          ...product,
          quantity: entry.quantity,
          lineTotal:
            product.samplePrice * entry.quantity,
        },
      ];
    });
  }, [cart]);

  const subtotal = lines.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  const totalUnits = lines.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deliveryEstimate = calculateDeliveryEstimate(
    fulfillment,
    totalUnits
  );

  const estimatedTotal = subtotal + deliveryEstimate;

  const visibleProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      category === "All" ||
      product.category === category;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(query);

    return matchesCategory && matchesSearch;
  });

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 0 ||
      quantity > MAX_QUANTITY_PER_PRODUCT
    ) {
      setError("Please enter a valid quantity.");
      return;
    }

    const nextCart = cart.filter(
      (item) => item.productId !== productId
    );

    if (quantity > 0) {
      nextCart.push({ productId, quantity });
    }

    try {
      saveCart(nextCart);
      setCart(nextCart);
      setError("");
    } catch {
      setError("Unable to save the basket.");
    }
  }

  function validateCustomer(): string {
    if (customer.name.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (
      !/^[+()\d\s-]{7,20}$/.test(
        customer.phone.trim()
      )
    ) {
      return "Please enter a valid phone number.";
    }

    if (
      customer.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customer.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!customer.location.trim()) {
      return "Please enter your town or preferred depot.";
    }

    if (
      fulfillment === "delivery" &&
      !customer.address.trim()
    ) {
      return "Please enter your delivery address.";
    }

    return "";
  }

  function nextStep() {
    setError("");

    if (step === 0) {
      if (lines.length === 0) {
        setError(
          "Add at least one material to your basket."
        );
        return;
      }

      setStep(1);
      return;
    }

    if (step === 1) {
      const validationError = validateCustomer();

      if (validationError) {
        setError(validationError);
        return;
      }

      setStep(2);
    }
  }

  function submitOrder() {
    setError("");

    if (lines.length === 0) {
      setStep(0);
      setError("Your basket is empty.");
      return;
    }

    const validationError = validateCustomer();

    if (validationError) {
      setStep(1);
      setError(validationError);
      return;
    }

    const newOrder: MaterialOrder = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),

      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        location: customer.location.trim(),
        address:
          fulfillment === "delivery"
            ? customer.address.trim()
            : "",
        notes: customer.notes.trim(),
      },

      fulfillment,
      paymentMethod,
      paymentStatus: "not-paid",
      status: "received",

      items: lines.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.samplePrice,
        subtotal: item.lineTotal,
      })),

      subtotal,
      deliveryEstimate,
      estimatedTotal,
      demo: true,
    };

    try {
      saveOrder(newOrder);
      saveCart([]);
      setCart([]);
      setOrder(newOrder);
      setStep(3);
    } catch {
      setError("Unable to save the demo order.");
    }
  }

  function resetOrder() {
    setStep(0);
    setOrder(null);
    setError("");
    setCustomer({ ...emptyCustomer });
    setFulfillment("delivery");
    setPaymentMethod("quotation");
  }

  function updateCustomer(
    key: keyof CustomerDetails,
    value: string
  ) {
    setCustomer((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f6f5f1]">
        <div className="container-main py-16 text-[#0b1629]">
          Loading Building Materials...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f5f1] text-[#0b1629]">
      {/* PAGE HEADER */}
      <section className="bg-[#0b1629] py-14 text-white">
        <div className="container-main">
          <p className="text-xs font-bold uppercase tracking-widest !text-[#f2c85b]">
            Yusfaith Global Enterprises
          </p>

          <h1 className="mt-4 font-heading text-4xl font-semibold !text-white sm:text-5xl">
            Building Materials Ordering
          </h1>

          <p className="mt-4 max-w-2xl !text-white/80">
            Browse building materials, enter bulk quantities,
            and prepare your order estimate.
          </p>

          <p className="mt-3 text-sm font-semibold !text-[#f2c85b]">
            Demo only — no real payment or order submission.
          </p>

          <nav className="mt-7 flex flex-wrap gap-5 text-sm">
            <Link
              href="/building-materials"
              className="!text-white underline"
            >
              Homepage
            </Link>

            <Link
              href="/building-materials/orders"
              className="!text-white underline"
            >
              Order History
            </Link>

            <Link
              href="/building-materials/track"
              className="!text-white underline"
            >
              Track Order
            </Link>
          </nav>
        </div>
      </section>

      <div className="container-main py-10">
        {/* PROGRESS INDICATOR */}
        <div className="mb-9 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <div
              key={label}
              aria-current={
                index === step ? "step" : undefined
              }
              className={`rounded-xl px-2 py-4 text-center text-xs font-bold sm:text-sm ${
                index === step
                  ? "bg-[#0b1629] !text-[#f2c85b]"
                  : index < step
                    ? "bg-amber-100 !text-[#0b1629]"
                    : "bg-white !text-slate-500"
              }`}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>

        {error && (
          <p
            role="alert"
            className="mb-7 rounded-xl border border-red-300 bg-red-50 p-4 text-sm !text-red-800"
          >
            {error}
          </p>
        )}

        {/* STEP 1: PRODUCTS */}
        {step === 0 && (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0">
              <h2 className="font-heading text-3xl font-semibold">
                Select Your Materials
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Enter quantities directly for bulk orders.
                Prices are illustrative.
              </p>

              <div className="relative mt-6">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search building materials..."
                  aria-label="Search materials"
                  className={`${inputStyle} pl-12`}
                />
              </div>

              <div className="my-6 flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      category === item
                        ? "border-[#0b1629] !bg-[#0b1629] !text-[#f2c85b]"
                        : "border-slate-300 !bg-white !text-[#0b1629]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => {
                  const quantity =
                    cart.find(
                      (item) =>
                        item.productId === product.id
                    )?.quantity ?? 0;

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative h-52 bg-slate-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                          {product.category}
                        </p>

                        <h3 className="mt-3 font-heading text-xl font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>

                        <p className="mt-5 text-xl font-bold">
                          {formatNaira(product.samplePrice)}
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            / {product.unit}
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-amber-800">
                          Illustrative price
                        </p>

                        <QuantityEditor
                          productId={product.id}
                          productName={product.name}
                          unit={product.unit}
                          quantity={quantity}
                          onQuantityChange={updateQuantity}
                        />

                        <div className="mt-4">
                          {quantity > 0 ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-emerald-800">
                                In Basket
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    0
                                  )
                                }
                                className="text-xs font-semibold !text-red-700 underline"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500">
                              Enter a quantity to add this material.
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleProducts.length === 0 && (
                <p className="mt-6 rounded-xl bg-white p-8 text-center">
                  No materials match your search.
                </p>
              )}
            </section>

            {/* LIVE BASKET */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold">
                <ShoppingCart size={23} />
                Your Basket
              </h2>

              {lines.length === 0 ? (
                <p className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Your basket is empty.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {lines.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-slate-200 pb-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.quantity.toLocaleString()}{" "}
                            {item.unit} ×{" "}
                            {formatNaira(item.samplePrice)}
                          </p>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() =>
                            updateQuantity(item.id, 0)
                          }
                          className="shrink-0 !text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <p className="mt-2 text-right font-bold">
                        {formatNaira(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-xl bg-amber-50 p-5">
                <div className="flex justify-between gap-2 text-sm">
                  <span>Total Units</span>
                  <strong>
                    {totalUnits.toLocaleString()}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-2">
                  <span>Subtotal</span>
                  <strong>{formatNaira(subtotal)}</strong>
                </div>
              </div>

              <button
                type="button"
                disabled={lines.length === 0}
                onClick={nextStep}
                className={`${primaryButton} mt-6 w-full`}
              >
                Continue to Customer
                <ArrowRight size={17} />
              </button>
            </aside>
          </div>
        )}

        {/* STEP 2: CUSTOMER */}
        {step === 1 && (
          <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-9">
            <h2 className="font-heading text-3xl font-semibold">
              Customer & Delivery Details
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Use fictional customer information for this demo.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["name", "Full Name", "text"],
                  ["phone", "Phone Number", "tel"],
                  ["email", "Email (Optional)", "email"],
                  [
                    "location",
                    "Town / Preferred Depot",
                    "text",
                  ],
                ] as const
              ).map(([key, label, type]) => (
                <label
                  key={key}
                  className="block text-sm font-semibold"
                >
                  {label}

                  <input
                    type={type}
                    value={customer[key]}
                    onChange={(event) =>
                      updateCustomer(
                        key,
                        event.target.value
                      )
                    }
                    className={`${inputStyle} mt-2`}
                  />
                </label>
              ))}
            </div>

            <fieldset className="mt-8">
              <legend className="font-semibold">
                Fulfillment Method
              </legend>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  ["delivery", "pickup"] as const
                ).map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                      fulfillment === option
                        ? "border-amber-600 bg-amber-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillment === option}
                      onChange={() =>
                        setFulfillment(option)
                      }
                    />

                    <span className="capitalize">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {fulfillment === "delivery" && (
              <label className="mt-6 block text-sm font-semibold">
                Delivery Address

                <textarea
                  rows={3}
                  value={customer.address}
                  onChange={(event) =>
                    updateCustomer(
                      "address",
                      event.target.value
                    )
                  }
                  className={`${inputStyle} mt-2`}
                />
              </label>
            )}

            <label className="mt-6 block text-sm font-semibold">
              Additional Instructions

              <textarea
                rows={3}
                value={customer.notes}
                onChange={(event) =>
                  updateCustomer(
                    "notes",
                    event.target.value
                  )
                }
                className={`${inputStyle} mt-2`}
              />
            </label>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setError("");
                }}
                className={secondaryButton}
              >
                <ArrowLeft size={17} />
                Back to Products
              </button>

              <button
                type="button"
                onClick={nextStep}
                className={primaryButton}
              >
                Continue to Payment
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: PAYMENT */}
        {step === 2 && (
          <div className="mx-auto grid max-w-5xl items-start gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-heading text-3xl font-semibold">
                Payment Preference
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Choose a preferred payment method.
                This demonstration does not collect
                card details or process payments.
              </p>

              <fieldset className="mt-7 space-y-3">
                <legend className="mb-4 font-semibold">
                  Select a Payment Option
                </legend>

                {(
                  [
                    "quotation",
                    "bank-transfer",
                    "card",
                  ] as const
                ).map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-5 ${
                      paymentMethod === method
                        ? "border-amber-600 bg-amber-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={
                        paymentMethod === method
                      }
                      onChange={() =>
                        setPaymentMethod(method)
                      }
                    />

                    <span className="font-semibold">
                      {PAYMENT_LABELS[method]}
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="mt-8 rounded-xl bg-slate-50 p-5 text-sm">
                <h3 className="font-semibold">
                  Customer Summary
                </h3>

                <p className="mt-3">
                  {customer.name}
                </p>

                <p className="mt-2">
                  {customer.phone}
                </p>

                <p className="mt-2">
                  {customer.location}
                </p>

                <p className="mt-2 capitalize">
                  {fulfillment}
                </p>

                {fulfillment === "delivery" && (
                  <p className="mt-2 break-words">
                    {customer.address}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className={`${secondaryButton} mt-7`}
              >
                <ArrowLeft size={17} />
                Edit Customer Details
              </button>
            </section>

            {/* ORDER SUMMARY */}
            <aside className="rounded-2xl bg-white p-6 shadow-sm">
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
                      {item.quantity.toLocaleString()}{" "}
                      {item.unit}
                    </p>

                    <p className="mt-2 font-bold">
                      {formatNaira(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span>Subtotal</span>
                  <strong>
                    {formatNaira(subtotal)}
                  </strong>
                </div>

                <div className="flex justify-between gap-2">
                  <span>Delivery Estimate</span>
                  <strong>
                    {formatNaira(deliveryEstimate)}
                  </strong>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="text-slate-500">
                    Estimated Total
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {formatNaira(estimatedTotal)}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-6 text-slate-500">
                All prices and delivery charges are
                illustrative and subject to confirmation.
              </p>

              <button
                type="button"
                onClick={submitOrder}
                className={`${primaryButton} mt-6 w-full`}
              >
                Create Demo Order
                <CheckCircle2 size={17} />
              </button>
            </aside>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 3 && order && (
          <section className="mx-auto max-w-2xl rounded-2xl bg-white p-7 text-center shadow-sm sm:p-12">
            <CheckCircle2
              size={56}
              className="mx-auto text-emerald-700"
            />

            <h2 className="mt-6 font-heading text-3xl font-semibold">
              Demo Order Created
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Your order has been saved in this browser.
              It has not been submitted to Yusfaith.
            </p>

            <div className="mt-7 rounded-xl bg-amber-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Order Reference
              </p>

              <p className="mt-3 break-all font-mono text-xl font-bold">
                {order.id}
              </p>

              <p className="mt-4 text-2xl font-bold">
                {formatNaira(order.estimatedTotal)}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                href={`/building-materials/track?ref=${encodeURIComponent(order.id)}`}
                className={primaryButton}
              >
                Track Order
              </Link>

              <Link
                href="/building-materials/orders"
                className={primaryButton}
              >
                Order History
              </Link>

              <button
                type="button"
                onClick={resetOrder}
                className={secondaryButton}
              >
                New Order
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
