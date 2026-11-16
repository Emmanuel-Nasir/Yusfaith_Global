"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Inbox,
  Eye,
  History,
  Info,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Tag,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";
import ActivityPanel from "@/components/admin/ActivityPanel";
import DeliveryFeesPanel from "@/components/admin/DeliveryFeesPanel";
import RequestsPanel from "@/components/admin/RequestsPanel";
import { recipientsFor } from "@/lib/order-contacts";
import { sendAlert } from "@/lib/alerts";
import { useDeliveryFees } from "@/lib/delivery-fees";
import StaffGate, { AccessPanel, type StaffSession } from "@/components/admin/StaffGate";
import { PRODUCTS as CEMENT_PRODUCTS } from "@/lib/cement/catalog";
import { PRODUCTS as MATERIAL_PRODUCTS } from "@/lib/building-materials/catalog";
import { BAKERY_PRODUCTS } from "@/lib/bakery/catalog";
import { CATEGORY_IMAGES, SPARE_PARTS } from "@/lib/logistics/spare-parts";
import {
  addMessage,
  addOrder,
  createOrderId,
  ORDERS_EVENT,
  formatNaira,
  loadOrders,
  updateOrder,
  type Fulfillment,
  type Order,
  type PaymentChannel,
  type PaymentTerms,
} from "@/lib/orders";

/* ---------- roles and permissions ---------- */

type Role =
  | "Super Admin"
  | "Management"
  | "Sales Rep"
  | "Finance Officer"
  | "Branch Manager"
  | "Logistics Officer"
  | "Driver";

type Section =
  | "overview"
  | "requests"
  | "orders"
  | "payments"
  | "delivery"
  | "logistics"
  | "access"
  | "activity";

type Business = "Cement Depot" | "Building Materials" | "Truck Spare Parts" | "Bakery";

const ROLES: Role[] = [
  "Super Admin",
  "Management",
  "Sales Rep",
  "Finance Officer",
  "Branch Manager",
  "Logistics Officer",
  "Driver",
];

const SECTIONS: { id: Section; label: string; Icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "requests", label: "Price requests", Icon: Inbox },
  { id: "orders", label: "Orders", Icon: ClipboardList },
  { id: "payments", label: "Payments", Icon: Wallet },
  { id: "delivery", label: "Delivery fees", Icon: Tag },
  { id: "logistics", label: "Logistics", Icon: Truck },
  { id: "access", label: "Staff & access", Icon: Users },
  { id: "activity", label: "Activity log", Icon: History },
];

// Stock and bookkeeping stay in Yusfaith's own accounting app.
const ACCESS: Record<Role, Section[]> = {
  "Super Admin": ["overview", "requests", "orders", "payments", "delivery", "logistics", "access", "activity"],
  Management: ["overview", "requests", "orders", "payments", "delivery", "logistics"],
  "Sales Rep": ["requests", "orders"],
  "Finance Officer": ["overview", "orders", "payments"],
  "Branch Manager": ["requests", "orders", "logistics"],
  "Logistics Officer": ["orders", "logistics"],
  Driver: ["logistics"],
};

const ROLE_NOTE: Record<Role, string> = {
  "Super Admin": "Full access to every part of the system, including the activity log.",
  Management: "Sees everything, sends prices and sets delivery fees. Cannot confirm payments.",
  "Sales Rep": "Handles price requests and takes phone and WhatsApp orders.",
  "Finance Officer": "Checks receipts and confirms payments. Cannot send prices or run deliveries.",
  "Branch Manager": "Handles price requests and orders for their branch. In the main app they see only their state.",
  "Logistics Officer": "Runs deliveries. Cannot confirm payments or send prices.",
  Driver: "Sees only the deliveries assigned to them.",
};

const CAN_QUOTE: Role[] = ["Super Admin", "Management", "Sales Rep", "Branch Manager"];
const CAN_CREATE_ORDER: Role[] = ["Super Admin", "Sales Rep", "Branch Manager"];
const CAN_CONFIRM_PAYMENT: Role[] = ["Super Admin", "Finance Officer"];
const CAN_EDIT_DELIVERY: Role[] = ["Super Admin", "Management"];

/* ---------- products and demo state ---------- */

type AdminProduct = {
  id: string;
  business: Business;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: string;
};

type DisplayProduct = AdminProduct & { stock: number };

type AdminState = {
  prices: Record<string, number>;
  stock: Record<string, number>;
  added: AdminProduct[];
  removed: string[];
};

const STATE_KEY = "yusfaith-demo-admin";
const EMPTY_STATE: AdminState = { prices: {}, stock: {}, added: [], removed: [] };
const LOGO = "/images/corporate/Official Yusfaith Company Logo.png";

const BASE_PRODUCTS: AdminProduct[] = [
  ...CEMENT_PRODUCTS.filter((p) => !p.bulkOption).map((p) => ({
    id: `cement:${p.id}`,
    business: "Cement Depot" as Business,
    name: p.name,
    category: p.brand,
    unit: "bag",
    price: p.samplePrice,
    image: p.image,
  })),
  ...MATERIAL_PRODUCTS.map((p) => ({
    id: `materials:${p.id}`,
    business: "Building Materials" as Business,
    name: p.name,
    category: p.category,
    unit: p.unit,
    price: p.samplePrice,
    image: p.image,
  })),
  ...SPARE_PARTS.map((p) => ({
    id: `parts:${p.id}`,
    business: "Truck Spare Parts" as Business,
    name: p.name,
    category: p.category,
    unit: p.unit,
    price: p.price,
    image: CATEGORY_IMAGES[p.category],
  })),
  ...BAKERY_PRODUCTS.map((p) => ({
    id: `bakery:${p.id}`,
    business: "Bakery" as Business,
    name: p.name,
    category: p.category,
    unit: p.unit,
    price: p.price,
    image: p.image,
  })),
];

const BUSINESS_LIST: Business[] = ["Cement Depot", "Building Materials", "Truck Spare Parts", "Bakery"];

const PREFIX: Record<Business, string> = {
  "Cement Depot": "YC",
  "Building Materials": "YM",
  "Truck Spare Parts": "YP",
  Bakery: "YB",
};

// Delivery fees come from src/lib/delivery-fees.ts (editable in Prices)

const TRACK_PATH: Record<string, string> = {
  "Cement Depot": "/cement/track",
  "Building Materials": "/building-materials/track",
  Bakery: "/bakery/track",
  "Truck Spare Parts": "/logistics/spare-parts/track",
};

const TERMS_FOR: Record<Fulfillment, PaymentTerms[]> = {
  Delivery: ["Pay before dispatch", "Pay on arrival"],
  Pickup: ["Cash & Carry (pickup)"],
};

const CHANNELS: PaymentChannel[] = ["Bank transfer", "POS", "Cash", "Online"];
const PHONE_PATTERN = /^(\+?234|0)[789][01]\d{8}$/;

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

function defaultStock(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return 60 + ((sum * 37) % 940);
}

function loadState(): AdminState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<AdminState>;
    return {
      prices: parsed.prices ?? {},
      stock: parsed.stock ?? {},
      added: parsed.added ?? [],
      removed: parsed.removed ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ViewOnly() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold" style={{ color: "var(--muted)" }}>
      <Eye size={13} />
      View only
    </span>
  );
}

function PaymentBadge({ order }: { order: Order }) {
  const paid = order.paymentStatus === "Payment confirmed";
  const quote = order.paymentStatus === "Awaiting quote";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-green-100 text-green-800" : quote ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
      {quote ? "Waiting for price" : order.paymentStatus}
    </span>
  );
}

function OrderLine({ order }: { order: Order }) {
  const track = TRACK_PATH[order.subsidiary];
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4">
      <span>
        <span className="block font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
          {order.id}
        </span>
        <span className="block text-xs" style={{ color: "var(--muted)" }}>
          {order.subsidiary} · {order.customer.name} · {order.fulfillment} · {formatDate(order.createdAt)}
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-3">
        <PaymentBadge order={order} />
        <span className="text-sm font-semibold" style={{ color: "var(--gold-text)" }}>
          {order.status}
        </span>
        <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
          {order.paymentStatus === "Awaiting quote" ? "Price pending" : formatNaira(order.total)}
        </span>
        {track && (
          <Link href={`${track}?id=${order.id}`} className="text-sm font-bold underline-offset-4 hover:underline" style={{ color: "var(--gold-text)" }}>
            Track
          </Link>
        )}
      </span>
    </li>
  );
}

/* ---------- panels ---------- */

function OverviewPanel({ orders }: { orders: Order[] }) {
  const waitingPrice = orders.filter((o) => o.paymentStatus === "Awaiting quote").length;
  const awaitingPayment = orders.filter((o) => o.paymentStatus === "Awaiting payment").length;
  const inProgress = orders.filter(
    (o) => o.paymentStatus === "Payment confirmed" && o.status !== "Delivered" && o.status !== "Collected"
  ).length;

  // Revenue and stock are kept in Yusfaith's bookkeeping app, not here.
  const stats = [
    { label: "Orders and requests", value: String(orders.length) },
    { label: "Waiting for a price", value: String(waitingPrice) },
    { label: "Waiting for payment", value: String(awaitingPayment) },
    { label: "Paid, in progress", value: String(inProgress) },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-heading text-3xl font-semibold" style={{ color: "var(--gold-text)" }}>
              {s.value}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        Orders by business
      </h3>
      <div className="space-y-3">
        {BUSINESS_LIST.map((business) => {
          const count = orders.filter((o) => o.subsidiary === business).length;
          const share = orders.length ? (count / orders.length) * 100 : 0;
          return (
            <div key={business}>
              <div className="flex justify-between text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                <span>{business}</span>
                <span>{count}</span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-[var(--surface)]">
                <div className="h-full rounded-full bg-[#ef850f]" style={{ width: `${share}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        Recent orders
      </h3>
      {orders.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No orders yet. Send a price request on the Cement, Building Materials or Spare Parts pages, or order from the Bakery.
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 5).map((o) => (
            <OrderLine key={o.id} order={o} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NewOrderForm({
  products,
  onCreated,
  onClose,
}: {
  products: DisplayProduct[];
  onCreated: (order: Order) => void;
  onClose: () => void;
}) {
  const [business, setBusiness] = useState<Business>("Cement Depot");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const fees = useDeliveryFees();
  const [zone, setZone] = useState(fees["Cement Depot"][0].name);
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState<PaymentTerms>("Pay before dispatch");
  const [channel, setChannel] = useState<PaymentChannel>("Bank transfer");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [price, setPrice] = useState(""); // agreed price per unit (no fixed prices except Bakery)
  const [feeInput, setFeeInput] = useState("");

  const list = products.filter((p) => p.business === business);
  const selected = list.find((p) => p.id === productId) ?? list[0];
  const qty = Math.max(0, Math.floor(Number(quantity)) || 0);
  const zones = fees[business];
  const suggestedFee = zones.find((z) => z.name === zone)?.fee ?? zones[0].fee;
  const fee = fulfillment === "Delivery" ? Math.max(0, Number(feeInput === "" ? suggestedFee : feeInput) || 0) : 0;
  const fixedPrice = business === "Bakery";
  const unitPrice = fixedPrice && price === "" ? selected?.price ?? 0 : Math.max(0, Number(price) || 0);
  const subtotal = selected ? qty * unitPrice : 0;

  function chooseBusiness(next: Business) {
    setBusiness(next);
    setProductId("");
    setPrice("");
    setFeeInput("");
    setZone(fees[next][0].name);
  }

  function chooseFulfillment(next: Fulfillment) {
    setFulfillment(next);
    setTerms(TERMS_FOR[next][0]);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (!selected) return setError("Choose a product.");
    if (qty < 1) return setError("Enter a quantity of 1 or more.");
    if (unitPrice <= 0) return setError("Enter the price agreed with the customer.");
    if (name.trim().length < 2) return setError("Enter the customer's name.");
    if (!PHONE_PATTERN.test(cleanPhone)) return setError("Enter a valid Nigerian phone number.");
    if (fulfillment === "Delivery" && address.trim().length < 5)
      return setError("Enter the delivery address.");

    const now = new Date().toISOString();
    const order: Order = {
      id: createOrderId(PREFIX[business]),
      subsidiary: business,
      createdAt: now,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: fulfillment === "Delivery" ? address.trim() : "",
        notes: `Taken by Sales (phone/WhatsApp). ${notes.trim()}`.trim(),
      },
      location: fulfillment === "Delivery" ? zone : "Head office, Ogun State",
      fulfillment,
      paymentTerms: terms,
      paymentChannel: channel,
      paymentStatus: "Awaiting payment",
      status: "Received",
      items: [
        {
          productId: selected.id,
          name: selected.name,
          image: selected.image,
          unit: selected.unit,
          quantity: qty,
          unitPrice,
        },
      ],
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      history: [{ status: "Received", at: now }],
      pricing: fixedPrice ? "fixed" : "quote",
      ...(fixedPrice
        ? {}
        : {
            quote: { at: now, by: "Yusfaith sales team", note: "Price agreed by phone or WhatsApp" },
            notified: recipientsFor(business, [selected.id], fulfillment === "Delivery" ? zone : "Head office, Ogun State"),
          }),
      demo: true,
    };

    addOrder(order);
    onCreated(order);
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="mb-8 rounded-2xl border border-[var(--gold)] bg-[var(--surface)] p-6">
      <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
        New phone or WhatsApp order
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Enter an order the customer gave by phone or WhatsApp, with the price you
        agreed. It joins the same order list as online orders. This demo form
        takes one product line.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Business</span>
          <select className={inputClass} value={business} onChange={(e) => chooseBusiness(e.target.value as Business)}>
            {BUSINESS_LIST.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Product</span>
          <select className={inputClass} value={selected ? selected.id : ""} onChange={(e) => { setProductId(e.target.value); setPrice(""); }}>
            {list.map((p) => (
              <option key={p.id} value={p.id}>
                {fixedPrice ? `${p.name} (${formatNaira(p.price)} / ${p.unit})` : `${p.name} (per ${p.unit})`}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {fixedPrice ? "Price per unit (menu price)" : "Agreed price per unit"}
          </span>
          <input
            className={inputClass}
            type="number"
            min={0}
            placeholder={fixedPrice ? String(selected?.price ?? "") : "₦ agreed with the customer"}
            value={price}
            onChange={(e) => { setPrice(e.target.value); setError(""); }}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quantity</span>
          <input className={inputClass} type="number" min={1} value={quantity} onChange={(e) => { setQuantity(e.target.value); setError(""); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Customer name</span>
          <input className={inputClass} value={name} onChange={(e) => { setName(e.target.value); setError(""); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Customer phone</span>
          <input className={inputClass} type="tel" placeholder="08012345678" value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Delivery or pickup</span>
          <select className={inputClass} value={fulfillment} onChange={(e) => chooseFulfillment(e.target.value as Fulfillment)}>
            <option>Delivery</option>
            <option>Pickup</option>
          </select>
        </label>
        {fulfillment === "Delivery" && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Delivery state</span>
              <select className={inputClass} value={zone} onChange={(e) => { setZone(e.target.value); setFeeInput(""); }}>
                {zones.map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Delivery fee</span>
              <input
                className={inputClass}
                type="number"
                min={0}
                placeholder={String(suggestedFee)}
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Delivery address</span>
              <input className={inputClass} value={address} onChange={(e) => { setAddress(e.target.value); setError(""); }} />
            </label>
          </>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>When will they pay?</span>
          <select className={inputClass} value={terms} onChange={(e) => setTerms(e.target.value as PaymentTerms)}>
            {TERMS_FOR[fulfillment].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>How will they pay?</span>
          <select className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value as PaymentChannel)}>
            {CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notes (optional)</span>
          <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm" style={{ color: "var(--foreground)" }}>
        <span>
          Products {formatNaira(subtotal)} + delivery {formatNaira(fee)} ={" "}
          <strong style={{ color: "var(--gold-text)" }}>{formatNaira(subtotal + fee)}</strong>
        </span>
        <span className="flex gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)]">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-[#ef850f] px-6 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]">
            Save order
          </button>
        </span>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>
      )}
    </form>
  );
}

function OrdersPanel({
  orders,
  products,
  canCreate,
  onChange,
}: {
  orders: Order[];
  products: DisplayProduct[];
  canCreate: boolean;
  onChange: (logText?: string) => void;
}) {
  const [businessFilter, setBusinessFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);

  const visible = orders.filter(
    (o) =>
      (businessFilter === "All" || o.subsidiary === businessFilter) &&
      (statusFilter === "All" || o.status === statusFilter)
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <select className={`${inputClass} w-auto`} value={businessFilter} onChange={(e) => setBusinessFilter(e.target.value)} aria-label="Filter by business">
            <option value="All">All businesses</option>
            {BUSINESS_LIST.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select className={`${inputClass} w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="All">All statuses</option>
            {["Received", "Preparing", "Out for delivery", "Ready for pickup", "Delivered", "Collected"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {canCreate ? (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
          >
            <Plus size={16} />
            New phone / WhatsApp order
          </button>
        ) : (
          <ViewOnly />
        )}
      </div>

      {formOpen && canCreate && (
        <NewOrderForm products={products} onCreated={(created) => onChange(`Created order ${created.id} for ${created.customer.name} (${formatNaira(created.total)})`)} onClose={() => setFormOpen(false)} />
      )}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          No orders match.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((o) => (
            <OrderLine key={o.id} order={o} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PaymentsPanel({
  orders,
  canConfirm,
  onChange,
}: {
  orders: Order[];
  canConfirm: boolean;
  onChange: (order: Order) => void;
}) {
  const awaiting = orders.filter((o) => o.paymentStatus === "Awaiting payment");
  const confirmed = orders.filter((o) => o.paymentStatus === "Payment confirmed").slice(0, 8);

  function confirm(order: Order) {
    const now = new Date().toISOString();
    updateOrder(order.id, {
      paymentStatus: "Payment confirmed",
      history: [...order.history, { status: "Payment confirmed", at: now }],
    });
    addMessage(order.id, { from: "system", name: "Yusfaith", text: "Payment confirmed" });
    sendAlert({
      audience: "customer",
      title: `Payment confirmed: ${order.id}`,
      body: `Thank you. Your order will be ${order.fulfillment === "Delivery" ? "dispatched" : "made ready for pickup"} soon.`,
      url: `${TRACK_PATH[order.subsidiary] ?? "/"}?id=${order.id}`,
    });
    onChange(order);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          Awaiting payment ({awaiting.length})
        </h3>
        {!canConfirm && <ViewOnly />}
      </div>

      {awaiting.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing is waiting for payment.</p>
      ) : (
        <ul className="space-y-3">
          {awaiting.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4">
              <span>
                <span className="block font-bold tracking-wider" style={{ color: "var(--foreground)" }}>{o.id}</span>
                <span className="block text-xs" style={{ color: "var(--muted)" }}>
                  {o.subsidiary} · {o.customer.name} · {o.paymentTerms} · {o.paymentChannel}
                </span>
                {o.receipt ? (
                  <span className="mt-2 flex items-center gap-3">
                    {o.receipt.preview ? (
                      <a href={o.receipt.preview} target="_blank" rel="noopener noreferrer" title="Open receipt">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={o.receipt.preview} alt={`Receipt for ${o.id}`} className="h-14 w-14 rounded-lg border border-[var(--border)] object-cover" />
                      </a>
                    ) : null}
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      Receipt uploaded · {o.receipt.name}
                    </span>
                  </span>
                ) : (
                  <span className="mt-2 inline-block rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    No receipt yet
                  </span>
                )}
              </span>
              <span className="flex items-center gap-4">
                <span className="font-bold" style={{ color: "var(--foreground)" }}>{formatNaira(o.total)}</span>
                {canConfirm && (
                  <button
                    type="button"
                    onClick={() => confirm(o)}
                    className="rounded-full bg-[var(--button-bg)] px-5 py-2 text-sm font-bold text-[var(--button-text)] transition hover:bg-[var(--button-hover-bg)]"
                  >
                    Confirm payment
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        Recently confirmed
      </h3>
      {confirmed.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>No confirmed payments yet.</p>
      ) : (
        <ul className="space-y-3">
          {confirmed.map((o) => (
            <OrderLine key={o.id} order={o} />
          ))}
        </ul>
      )}
    </div>
  );
}

function LogisticsPanel({ orders, role }: { orders: Order[]; role: Role }) {
  const delivery = orders.filter((o) => o.fulfillment === "Delivery");
  const awaiting = delivery.filter((o) => o.status === "Received" || o.status === "Preparing").length;
  const onRoad = delivery.filter((o) => o.status === "Out for delivery").length;
  const delivered = delivery.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Awaiting dispatch", value: awaiting },
    { label: "On the road", value: onRoad },
    { label: "Delivered", value: delivered },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-heading text-3xl font-semibold" style={{ color: "var(--gold-text)" }}>{s.value}</p>
            <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 leading-7" style={{ color: "var(--muted)" }}>
        {role === "Driver"
          ? "Drivers use the Driver view on the Logistics page, where they see only the deliveries assigned to them."
          : "Trucks, drivers and dispatch are managed on the Logistics page (Dispatch board, Fleet and drivers, Driver view)."}
      </p>
      <Link
        href="/logistics#dispatch"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-7 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
      >
        Open the Dispatch Centre
        <Truck size={18} />
      </Link>
    </div>
  );
}

/* ---------- the staff area ---------- */

function DemoAdmin({ session }: { session: StaffSession }) {
  const role: Role = session.role;
  const [section, setSection] = useState<Section>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<AdminState>(EMPTY_STATE);

  const reload = useCallback(() => setOrders(loadOrders()), []);

  useEffect(() => {
    reload();
    setState(loadState());
    window.addEventListener("focus", reload);
    window.addEventListener("storage", reload);
    window.addEventListener(ORDERS_EVENT, reload);
    return () => {
      window.removeEventListener("focus", reload);
      window.removeEventListener("storage", reload);
      window.removeEventListener(ORDERS_EVENT, reload);
    };
  }, [reload]);

  function saveState(next: AdminState) {
    setState(next);
    try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(next));
    } catch {
      // demo only, ignore
    }
  }

  const products: DisplayProduct[] = useMemo(
    () =>
      [...BASE_PRODUCTS, ...state.added]
        .filter((p) => !state.removed.includes(p.id))
        .map((p) => ({
          ...p,
          price: state.prices[p.id] ?? p.price,
          stock: state.stock[p.id] ?? defaultStock(p.id),
        })),
    [state]
  );

  const allowed = ACCESS[role];
  const active: Section = allowed.includes(section) ? section : allowed[0];

  function changeRole(next: Role) {
    // the role now comes from the signed-in staff member
    setSection(ACCESS[next][0]);
  }


  return (
    <main>
      {/* Header */}
      <section className="bg-[#0f1a3d] text-white">
        <div className="container-main py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[#ff9a26]">
            <ArrowLeft size={16} />
            Back to Yusfaith
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb347]">
                <ShieldCheck size={18} />
                Staff area · Demo
              </p>
              <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Yusfaith operations</h1>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-white/70">Demo: switch user</span>
                <select
                  value={session.me.id}
                  onChange={(e) => session.switchUser(e.target.value)}
                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-[15px] font-semibold text-white outline-none"
                >
                  {session.staff.filter((s) => s.active).map((s) => (
                    <option key={s.id} value={s.id} className="text-black">
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={session.signOut}
                className="rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#0f1a3d]"
              >
                Sign out
              </button>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80">
            Signed in as <strong className="text-white">{session.me.name}</strong> ·{" "}
            <strong className="text-white">{role}</strong>. {ROLE_NOTE[role]}
          </p>
        </div>
      </section>

      <div className="container-main py-8">
        <p className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--gold)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--foreground)" }}>
          <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
          This is a preview of the staff tools. In the real website this area
          is behind a secure login, and every action is checked on the server,
          so a role cannot do anything it is not allowed to, even if someone
          knows the address.
        </p>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Staff sections" className="flex flex-wrap gap-2 lg:flex-col">
            {SECTIONS.filter((s) => allowed.includes(s.id)).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                aria-current={active === id ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active === id
                    ? "bg-[#ef850f] text-[#0f1a3d]"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <section>
            <h2 className="mb-6 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
              {SECTIONS.find((s) => s.id === active)?.label}
            </h2>

            {active === "overview" && <OverviewPanel orders={orders} />}
            {active === "requests" && (
              <RequestsPanel
                orders={orders}
                canQuote={CAN_QUOTE.includes(role)}
                staffName={session.me.name}
                staffRole={role}
                onQuoted={(_order, text) => {
                  reload();
                  if (text) session.log(text);
                }}
              />
            )}
            {active === "orders" && (
              <OrdersPanel
                orders={orders}
                products={products}
                canCreate={CAN_CREATE_ORDER.includes(role)}
                onChange={(text) => { reload(); if (text) session.log(text); }}
              />
            )}
            {active === "payments" && (
              <PaymentsPanel orders={orders} canConfirm={CAN_CONFIRM_PAYMENT.includes(role)} onChange={(paid) => { reload(); session.log(`Confirmed payment for ${paid.id} (${formatNaira(paid.total)})`); }} />
            )}
            {active === "delivery" && (
              <DeliveryFeesPanel canEdit={CAN_EDIT_DELIVERY.includes(role)} onChanged={session.log} />
            )}
            {active === "logistics" && <LogisticsPanel orders={orders} role={role} />}
            {active === "access" && <AccessPanel session={session} />}
            {active === "activity" && role === "Super Admin" && <ActivityPanel />}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- shown on the public site (demo mode off) ---------- */

function StaffNotice() {
  return (
    <main className="section-padding">
      <div className="container-main max-w-2xl text-center">
        <ShieldCheck size={44} className="mx-auto" style={{ color: "var(--gold-text)" }} />
        <h1 className="mt-5 font-heading text-5xl font-semibold" style={{ color: "var(--foreground)" }}>
          Staff area
        </h1>
        <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
          This area is for Yusfaith staff. Staff sign-in will be available on
          the live website.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-8 py-4 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
        >
          Back to Yusfaith
        </Link>
      </div>
    </main>
  );
}

export default function AdminContent() {
  return DEMO_MODE ? <DemoAccessGate /> : <StaffNotice />;
}

function DemoAccessGate() {
  return <StaffGate>{(session) => <DemoAdmin session={session} />}</StaffGate>;
}