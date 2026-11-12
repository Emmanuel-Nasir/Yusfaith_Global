"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  ClipboardList,
  Eye,
  Info,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";
import StaffGate, { AccessPanel, type StaffSession } from "@/components/admin/StaffGate";
import { PRODUCTS as CEMENT_PRODUCTS } from "@/lib/cement/catalog";
import { PRODUCTS as MATERIAL_PRODUCTS } from "@/lib/building-materials/catalog";
import { BAKERY_PRODUCTS } from "@/lib/bakery/catalog";
import { CATEGORY_IMAGES, SPARE_PARTS } from "@/lib/logistics/spare-parts";
import {
  addOrder,
  createOrderId,
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
  | "Inventory Officer"
  | "Logistics Officer"
  | "Driver";

type Section =
  | "overview"
  | "orders"
  | "payments"
  | "inventory"
  | "prices"
  | "logistics"
  | "access";

type Business = "Cement Depot" | "Building Materials" | "Truck Spare Parts" | "Bakery";

const ROLES: Role[] = [
  "Super Admin",
  "Management",
  "Sales Rep",
  "Finance Officer",
  "Inventory Officer",
  "Logistics Officer",
  "Driver",
];

const SECTIONS: { id: Section; label: string; Icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "orders", label: "Orders", Icon: ClipboardList },
  { id: "payments", label: "Payments", Icon: Wallet },
  { id: "inventory", label: "Inventory", Icon: Boxes },
  { id: "prices", label: "Prices", Icon: Tag },
  { id: "logistics", label: "Logistics", Icon: Truck },
  { id: "access", label: "Staff & access", Icon: Users },
];

const ACCESS: Record<Role, Section[]> = {
  "Super Admin": ["overview", "orders", "payments", "inventory", "prices", "logistics", "access"],
  Management: ["overview", "orders", "payments", "inventory", "prices", "logistics"],
  "Sales Rep": ["orders", "prices"],
  "Finance Officer": ["overview", "orders", "payments"],
  "Inventory Officer": ["inventory", "prices"],
  "Logistics Officer": ["orders", "logistics"],
  Driver: ["logistics"],
};

const ROLE_NOTE: Record<Role, string> = {
  "Super Admin": "Full access to every part of the system.",
  Management: "Sees everything and sets product prices. Cannot take orders or confirm payments.",
  "Sales Rep": "Takes phone and WhatsApp orders. Can see prices but cannot change them.",
  "Finance Officer": "Confirms payments. Cannot change prices, stock or deliveries.",
  "Inventory Officer": "Manages products and stock. Can see prices but cannot change them.",
  "Logistics Officer": "Runs deliveries. Cannot confirm payments or change prices.",
  Driver: "Sees only the deliveries assigned to them.",
};

const CAN_CREATE_ORDER: Role[] = ["Super Admin", "Sales Rep"];
const CAN_CONFIRM_PAYMENT: Role[] = ["Super Admin", "Finance Officer"];
const CAN_EDIT_PRICES: Role[] = ["Super Admin", "Management"];
const CAN_EDIT_INVENTORY: Role[] = ["Super Admin", "Inventory Officer"];

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

const ZONES: Record<Business, { name: string; fee: number }[]> = {
  "Cement Depot": [
    { name: "Ogun State", fee: 25000 },
    { name: "Lagos State", fee: 30000 },
    { name: "Oyo State", fee: 35000 },
    { name: "Osun State", fee: 40000 },
  ],
  "Building Materials": [
    { name: "Ogun State", fee: 25000 },
    { name: "Lagos State", fee: 30000 },
    { name: "Oyo State", fee: 35000 },
    { name: "Osun State", fee: 40000 },
  ],
  "Truck Spare Parts": [
    { name: "Ogun State", fee: 5000 },
    { name: "Lagos State", fee: 8000 },
    { name: "Oyo State", fee: 8000 },
    { name: "Osun State", fee: 10000 },
  ],
  Bakery: [
    { name: "Ogun State", fee: 1500 },
    { name: "Lagos State", fee: 2000 },
    { name: "Oyo State", fee: 2000 },
    { name: "Osun State", fee: 2500 },
  ],
};

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
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
      {order.paymentStatus}
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
          {formatNaira(order.total)}
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
  const confirmed = orders.filter((o) => o.paymentStatus === "Payment confirmed");
  const revenue = confirmed.reduce((n, o) => n + o.total, 0);
  const awaitingPayment = orders.filter((o) => o.paymentStatus === "Awaiting payment").length;
  const inProgress = orders.filter((o) => o.status !== "Delivered" && o.status !== "Collected").length;

  const stats = [
    { label: "Orders", value: String(orders.length) },
    { label: "Awaiting payment", value: String(awaitingPayment) },
    { label: "In progress", value: String(inProgress) },
    { label: "Confirmed payments", value: formatNaira(revenue) },
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
          No orders yet. Place one on the Cement, Building Materials or Bakery pages.
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
  onCreated: () => void;
  onClose: () => void;
}) {
  const [business, setBusiness] = useState<Business>("Cement Depot");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [zone, setZone] = useState(ZONES["Cement Depot"][0].name);
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState<PaymentTerms>("Pay before dispatch");
  const [channel, setChannel] = useState<PaymentChannel>("Bank transfer");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const list = products.filter((p) => p.business === business);
  const selected = list.find((p) => p.id === productId) ?? list[0];
  const qty = Math.max(0, Math.floor(Number(quantity)) || 0);
  const zones = ZONES[business];
  const fee =
    fulfillment === "Delivery"
      ? zones.find((z) => z.name === zone)?.fee ?? zones[0].fee
      : 0;
  const subtotal = selected ? qty * selected.price : 0;

  function chooseBusiness(next: Business) {
    setBusiness(next);
    setProductId("");
    setZone(ZONES[next][0].name);
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
          unitPrice: selected.price,
        },
      ],
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      history: [{ status: "Received", at: now }],
      demo: true,
    };

    addOrder(order);
    onCreated();
    onClose();
  }

  return (
    <form onSubmit={submit} noValidate className="mb-8 rounded-2xl border border-[var(--gold)] bg-[var(--surface)] p-6">
      <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
        New phone or WhatsApp order
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Enter an order the customer gave by phone or WhatsApp. It joins the same
        order list as online orders. This demo form takes one product line.
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
          <select className={inputClass} value={selected ? selected.id : ""} onChange={(e) => setProductId(e.target.value)}>
            {list.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatNaira(p.price)} / {p.unit})
              </option>
            ))}
          </select>
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
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>Delivery area</span>
              <select className={inputClass} value={zone} onChange={(e) => setZone(e.target.value)}>
                {zones.map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name} (delivery {formatNaira(z.fee)})
                  </option>
                ))}
              </select>
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
  onChange: () => void;
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
        <NewOrderForm products={products} onCreated={onChange} onClose={() => setFormOpen(false)} />
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
  onChange: () => void;
}) {
  const awaiting = orders.filter((o) => o.paymentStatus === "Awaiting payment");
  const confirmed = orders.filter((o) => o.paymentStatus === "Payment confirmed").slice(0, 8);

  function confirm(order: Order) {
    const now = new Date().toISOString();
    updateOrder(order.id, {
      paymentStatus: "Payment confirmed",
      history: [...order.history, { status: "Payment confirmed", at: now }],
    });
    onChange();
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

function StockRow({
  product,
  canEdit,
  onStock,
  onRemove,
}: {
  product: DisplayProduct;
  canEdit: boolean;
  onStock: (id: string, value: number) => void;
  onRemove: (id: string) => void;
}) {
  const [value, setValue] = useState(String(product.stock));
  useEffect(() => {
    setValue(String(product.stock));
  }, [product.stock]);

  const low = product.stock < 150;

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3.5">
      <span>
        <span className="block font-bold" style={{ color: "var(--foreground)" }}>{product.name}</span>
        <span className="block text-xs" style={{ color: "var(--muted)" }}>
          {product.business} · {product.category} · per {product.unit}
        </span>
      </span>
      <span className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${low ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {low ? "Low stock" : "In stock"}
        </span>
        {canEdit ? (
          <>
            <input
              className={`${inputClass} w-24`}
              type="number"
              min={0}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                const n = Math.max(0, Math.floor(Number(value)) || 0);
                setValue(String(n));
                if (n !== product.stock) onStock(product.id, n);
              }}
              aria-label={`Stock of ${product.name}`}
            />
            <button
              type="button"
              aria-label={`Remove ${product.name}`}
              onClick={() => onRemove(product.id)}
              className="text-[var(--muted)] transition hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </>
        ) : (
          <span className="w-24 text-right font-bold" style={{ color: "var(--foreground)" }}>
            {product.stock.toLocaleString()}
          </span>
        )}
      </span>
    </li>
  );
}

function AddProductForm({
  onAdd,
}: {
  onAdd: (product: AdminProduct, stock: number) => void;
}) {
  const [business, setBusiness] = useState<Business>("Cement Depot");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("100");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const priceNumber = Number(price);
    const stockNumber = Math.max(0, Math.floor(Number(stock)) || 0);

    if (name.trim().length < 2) return setError("Enter the product name.");
    if (unit.trim().length < 1) return setError("Enter the unit, e.g. bag, piece or box.");
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) return setError("Enter a price above zero.");

    onAdd(
      {
        id: `added:${Date.now()}`,
        business,
        name: name.trim(),
        category: category.trim() || "General",
        unit: unit.trim(),
        price: priceNumber,
        image: LOGO,
      },
      stockNumber
    );
    setName("");
    setCategory("");
    setUnit("");
    setPrice("");
    setStock("100");
    setError("");
  }

  return (
    <form onSubmit={submit} noValidate className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="font-bold" style={{ color: "var(--foreground)" }}>Add a product</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select className={inputClass} value={business} onChange={(e) => setBusiness(e.target.value as Business)} aria-label="Business">
          {BUSINESS_LIST.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Product name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} />
        <input className={inputClass} placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className={inputClass} placeholder="Unit (bag, piece...)" value={unit} onChange={(e) => { setUnit(e.target.value); setError(""); }} />
        <input className={inputClass} type="number" placeholder="Price (₦)" value={price} onChange={(e) => { setPrice(e.target.value); setError(""); }} />
        <input className={inputClass} type="number" placeholder="Opening stock" value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>
      <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]">
        <Plus size={16} />
        Add product
      </button>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>}
    </form>
  );
}

function InventoryPanel({
  products,
  canEdit,
  onStock,
  onRemove,
  onAdd,
}: {
  products: DisplayProduct[];
  canEdit: boolean;
  onStock: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  onAdd: (product: AdminProduct, stock: number) => void;
}) {
  const [filter, setFilter] = useState("All");
  const visible = products.filter((p) => filter === "All" || p.business === filter);

  return (
    <div>
      <p className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
        Demo: stock and product changes made here do not change the public
        stores yet. In the main app they will.
      </p>

      {canEdit && <AddProductForm onAdd={onAdd} />}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <select className={`${inputClass} w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by business">
          <option value="All">All businesses</option>
          {BUSINESS_LIST.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        {!canEdit && <ViewOnly />}
      </div>

      <ul className="space-y-3">
        {visible.map((p) => (
          <StockRow key={p.id} product={p} canEdit={canEdit} onStock={onStock} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}

function PriceRow({
  product,
  canEdit,
  onSave,
}: {
  product: DisplayProduct;
  canEdit: boolean;
  onSave: (id: string, price: number) => void;
}) {
  const [value, setValue] = useState(String(product.price));
  const [message, setMessage] = useState("");
  useEffect(() => {
    setValue(String(product.price));
  }, [product.price]);

  function save() {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      setMessage("Enter a price above zero.");
      return;
    }
    onSave(product.id, n);
    setMessage("Saved");
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3.5">
      <span>
        <span className="block font-bold" style={{ color: "var(--foreground)" }}>{product.name}</span>
        <span className="block text-xs" style={{ color: "var(--muted)" }}>
          {product.business} · per {product.unit}
        </span>
      </span>
      {canEdit ? (
        <span className="flex items-center gap-3">
          {message && (
            <span className={`text-xs font-semibold ${message === "Saved" ? "text-green-700" : "text-red-700"}`}>{message}</span>
          )}
          <input
            className={`${inputClass} w-32`}
            type="number"
            min={1}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMessage("");
            }}
            aria-label={`Price of ${product.name}`}
          />
          <button type="button" onClick={save} className="rounded-full bg-[var(--button-bg)] px-5 py-2 text-sm font-bold text-[var(--button-text)] transition hover:bg-[var(--button-hover-bg)]">
            Save
          </button>
        </span>
      ) : (
        <span className="font-bold" style={{ color: "var(--foreground)" }}>{formatNaira(product.price)}</span>
      )}
    </li>
  );
}

function PricesPanel({
  products,
  canEdit,
  onSave,
}: {
  products: DisplayProduct[];
  canEdit: boolean;
  onSave: (id: string, price: number) => void;
}) {
  const [filter, setFilter] = useState("All");
  const visible = products.filter((p) => filter === "All" || p.business === filter);

  return (
    <div>
      <p className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
        Product prices are set only by authorised staff. Customers and sales
        staff cannot negotiate prices inside the system. Demo: price changes
        here do not change the public stores yet.
      </p>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <select className={`${inputClass} w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by business">
          <option value="All">All businesses</option>
          {BUSINESS_LIST.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        {!canEdit && <ViewOnly />}
      </div>

      <ul className="space-y-3">
        {visible.map((p) => (
          <PriceRow key={p.id} product={p} canEdit={canEdit} onSave={onSave} />
        ))}
      </ul>
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
    return () => {
      window.removeEventListener("focus", reload);
      window.removeEventListener("storage", reload);
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

  function resetAdminData() {
    if (window.confirm("Reset all stock, price and product changes made in this staff area?")) {
      try {
        window.localStorage.removeItem(STATE_KEY);
      } catch {
        // ignore
      }
      setState(EMPTY_STATE);
    }
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
            {role === "Super Admin" && (
              <button
                type="button"
                onClick={resetAdminData}
                className="mt-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-left text-xs font-semibold transition hover:border-red-400 hover:text-red-700"
                style={{ color: "var(--muted)" }}
              >
                Reset stock and price changes
              </button>
            )}
          </nav>

          <section>
            <h2 className="mb-6 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
              {SECTIONS.find((s) => s.id === active)?.label}
            </h2>

            {active === "overview" && <OverviewPanel orders={orders} />}
            {active === "orders" && (
              <OrdersPanel orders={orders} products={products} canCreate={CAN_CREATE_ORDER.includes(role)} onChange={reload} />
            )}
            {active === "payments" && (
              <PaymentsPanel orders={orders} canConfirm={CAN_CONFIRM_PAYMENT.includes(role)} onChange={() => { reload(); session.log("Confirmed a payment"); }} />
            )}
            {active === "inventory" && (
              <InventoryPanel
                products={products}
                canEdit={CAN_EDIT_INVENTORY.includes(role)}
                onStock={(id, value) => saveState({ ...state, stock: { ...state.stock, [id]: value } })}
                onRemove={(id) => saveState({ ...state, removed: [...state.removed, id] })}
                onAdd={(product, stock) =>
                  saveState({
                    ...state,
                    added: [...state.added, product],
                    stock: { ...state.stock, [product.id]: stock },
                  })
                }
              />
            )}
            {active === "prices" && (
              <PricesPanel
                products={products}
                canEdit={CAN_EDIT_PRICES.includes(role)}
                onSave={(id, price) => { saveState({ ...state, prices: { ...state.prices, [id]: price } }); session.log("Changed a product price"); }}
              />
            )}
            {active === "logistics" && <LogisticsPanel orders={orders} role={role} />}
            {active === "access" && <AccessPanel session={session} />}
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