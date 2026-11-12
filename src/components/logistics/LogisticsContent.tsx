"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Navigation,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  User,
  Wallet,
  Warehouse,
} from "lucide-react";
import { DRIVERS, TRUCKS } from "@/lib/logistics/fleet";
import {
  clearDemoData,
  loadAssignments,
  saveAssignment,
  seedSampleOrders,
  type Assignment,
} from "@/lib/logistics/dispatch";
import {
  formatNaira,
  loadOrders,
  nextStep,
  statusSteps,
  updateOrder,
  type Order,
} from "@/lib/orders";

import { DEMO_MODE } from "@/lib/demo";
import SpareParts from "@/components/logistics/SpareParts";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type CardMode = "staff" | "driver";

/* ---------- one delivery order ---------- */

function OrderCard({
  order,
  assignment,
  mode,
  busyTrucks,
  busyDrivers,
  onChange,
}: {
  order: Order;
  assignment?: Assignment;
  mode: CardMode;
  busyTrucks: Set<string>;
  busyDrivers: Set<string>;
  onChange: () => void;
}) {
  const [truckId, setTruckId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");

  const paid = order.paymentStatus === "Payment confirmed";
  const steps = statusSteps(order.fulfillment);
  const nextLabel = steps[steps.indexOf(order.status) + 1];
  const done = order.status === "Delivered";
  const assignedTruck = assignment
    ? TRUCKS.find((t) => t.id === assignment.truckId)
    : undefined;
  const assignedDriver = assignment
    ? DRIVERS.find((d) => d.id === assignment.driverId)
    : undefined;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${order.customer.address}, ${order.location}`
  )}`;

  // Drivers can only start a delivery once the order is ready, and finish it
  const canAdvance =
    Boolean(nextLabel) &&
    (mode === "staff" ||
      order.status === "Preparing" ||
      order.status === "Out for delivery");

  function confirmPayment() {
    const now = new Date().toISOString();
    updateOrder(order.id, {
      paymentStatus: "Payment confirmed",
      history: [...order.history, { status: "Payment confirmed", at: now }],
    });
    setMessage("");
    onChange();
  }

  function chooseTruck(value: string) {
    setTruckId(value);
    const defaultDriver = DRIVERS.find((d) => d.truckId === value);
    setDriverId(defaultDriver ? defaultDriver.id : "");
  }

  function assign() {
    if (!truckId || !driverId) {
      setMessage("Choose a truck and a driver.");
      return;
    }
    saveAssignment({
      orderId: order.id,
      truckId,
      driverId,
      assignedAt: new Date().toISOString(),
    });
    setMessage("");
    onChange();
  }

  function advance() {
    const { status, blockedReason } = nextStep(order);

    if (blockedReason) {
      setMessage(
        mode === "driver" && order.status === "Out for delivery"
          ? "Do not offload yet. Accounts has not confirmed payment."
          : blockedReason
      );
      return;
    }
    if (!status) return;

    const now = new Date().toISOString();

    if (status === "Out for delivery") {
      if (!assignment) {
        setMessage("Assign a truck and a driver first.");
        return;
      }
      if (
        busyTrucks.has(assignment.truckId) ||
        busyDrivers.has(assignment.driverId)
      ) {
        setMessage("This truck or driver is already out on another delivery.");
        return;
      }
    }

    if (status === "Delivered") {
      if (receiver.trim().length < 2) {
        setMessage("Enter the receiver's name as proof of delivery.");
        return;
      }
      if (assignment) {
        saveAssignment({
          ...assignment,
          receiver: receiver.trim(),
          deliveredAt: now,
        });
      }
    }

    updateOrder(order.id, {
      status,
      history: [...order.history, { status, at: now }],
    });
    setMessage("");
    onChange();
  }

  const advanceText =
    nextLabel === "Out for delivery"
      ? mode === "driver"
        ? "Start delivery"
        : "Dispatch: out for delivery"
      : nextLabel === "Delivered"
        ? "Mark delivered"
        : `Move to ${nextLabel}`;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
            {order.id}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {order.subsidiary} · {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold" style={{ color: "var(--gold-text)" }}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="mt-4 flex items-center gap-3">
        {order.items[0] && (
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
            <Image src={order.items[0].image} alt="" fill sizes="56px" className="object-cover" />
          </span>
        )}
        <span className="min-w-0 text-sm" style={{ color: "var(--foreground)" }}>
          <span className="block font-semibold">
            {order.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}
          </span>
          <span className="block" style={{ color: "var(--muted)" }}>
            Total {formatNaira(order.total)} (delivery {formatNaira(order.deliveryFee)} separate)
          </span>
        </span>
      </div>

      {/* Customer and place */}
      <div className="mt-4 space-y-1.5 text-sm" style={{ color: "var(--muted)" }}>
        <p className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
          {order.customer.address}, {order.location}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={16} className="shrink-0" style={{ color: "var(--gold-text)" }} />
          {order.customer.name} · {order.customer.phone}
        </p>
      </div>

      {/* Payment */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {order.paymentStatus}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {order.paymentTerms} · {order.paymentChannel}
        </span>
      </div>

      {/* Assignment */}
      {assignment && assignedTruck && assignedDriver && (
        <div className="mt-4 rounded-xl bg-[var(--surface)] p-3 text-sm" style={{ color: "var(--foreground)" }}>
          <p className="flex items-center gap-2 font-semibold">
            <Truck size={16} style={{ color: "var(--gold-text)" }} />
            {assignedTruck.plate} · {assignedTruck.type}
          </p>
          <p className="mt-1 flex items-center gap-2">
            <User size={16} style={{ color: "var(--gold-text)" }} />
            {assignedDriver.name} · {assignedDriver.phone}
          </p>
          {assignment.receiver && (
            <p className="mt-1 flex items-center gap-2 font-semibold text-green-700">
              <CheckCircle2 size={16} />
              Received by {assignment.receiver}
              {assignment.deliveredAt ? ` · ${formatDate(assignment.deliveredAt)}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      {!done && (
        <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
          {mode === "staff" && !paid && (
            <button
              type="button"
              onClick={confirmPayment}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--button-bg)] px-5 py-2.5 text-sm font-bold text-[var(--button-text)] transition hover:bg-[var(--button-hover-bg)]"
            >
              <Wallet size={16} />
              Accounts: confirm payment
            </button>
          )}

          {mode === "staff" && !assignment && (
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                className={inputClass}
                value={truckId}
                onChange={(e) => chooseTruck(e.target.value)}
                aria-label="Truck"
              >
                <option value="">Choose truck</option>
                {TRUCKS.map((t) => (
                  <option key={t.id} value={t.id} disabled={busyTrucks.has(t.id)}>
                    {t.plate}
                    {busyTrucks.has(t.id) ? " (on delivery)" : ""}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                aria-label="Driver"
              >
                <option value="">Choose driver</option>
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id} disabled={busyDrivers.has(d.id)}>
                    {d.name}
                    {busyDrivers.has(d.id) ? " (on delivery)" : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={assign}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef850f] px-5 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26] sm:col-span-2"
              >
                <Truck size={16} />
                Assign truck and driver
              </button>
            </div>
          )}

          {order.status === "Out for delivery" && (
            <input
              className={inputClass}
              placeholder="Receiver's name (proof of delivery)"
              value={receiver}
              onChange={(e) => {
                setReceiver(e.target.value);
                setMessage("");
              }}
              aria-label="Receiver's name"
            />
          )}

          {canAdvance && (
            <button
              type="button"
              onClick={advance}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-5 py-3 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
            >
              <Package size={16} />
              {advanceText}
            </button>
          )}

          {mode === "driver" && order.status === "Out for delivery" && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
            >
              <Navigation size={16} />
              Open in Google Maps
            </a>
          )}

          {message && (
            <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              {message}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

/* ---------- page ---------- */

type View = "board" | "fleet" | "driver";

export default function LogisticsContent() {
  const [view, setView] = useState<View>("board");
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [driverId, setDriverId] = useState(DRIVERS[0].id);

  const reload = useCallback(() => {
    setOrders(loadOrders().filter((o) => o.fulfillment === "Delivery"));
    setAssignments(loadAssignments());
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("storage", reload);
    window.addEventListener("focus", reload);
    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("focus", reload);
    };
  }, [reload]);

  const assignmentFor = (orderId: string) =>
    assignments.find((a) => a.orderId === orderId);

  const { busyTrucks, busyDrivers } = useMemo(() => {
    const trucks = new Set<string>();
    const drivers = new Set<string>();
    for (const a of assignments) {
      const order = orders.find((o) => o.id === a.orderId);
      if (order && order.status === "Out for delivery") {
        trucks.add(a.truckId);
        drivers.add(a.driverId);
      }
    }
    return { busyTrucks: trucks, busyDrivers: drivers };
  }, [orders, assignments]);

  const awaiting = orders.filter(
    (o) => o.status === "Received" || o.status === "Preparing"
  );
  const onRoad = orders.filter((o) => o.status === "Out for delivery");
  const delivered = orders.filter((o) => o.status === "Delivered");

  const myJobs = orders.filter((o) => {
    const a = assignmentFor(o.id);
    return a !== undefined && a.driverId === driverId && o.status !== "Delivered";
  });
  const currentDriver = DRIVERS.find((d) => d.id === driverId) ?? DRIVERS[0];

  function resetDemo() {
    if (window.confirm("Remove ALL demo orders (every business) and assignments?")) {
      clearDemoData();
      reload();
    }
  }

  const tabs: { id: View; label: string }[] = [
    { id: "board", label: "Dispatch board" },
    { id: "fleet", label: "Fleet and drivers" },
    { id: "driver", label: "Driver view" },
  ];

  const stats = [
    { label: "Awaiting dispatch", value: awaiting.length },
    { label: "On the road", value: onRoad.length },
    { label: "Delivered", value: delivered.length },
    { label: "Trucks available", value: TRUCKS.length - busyTrucks.size },
  ];

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#0f1a3d] text-white">
        <Image
          src="/images/logistics/yusfaith-truck-depot.jpeg"
          alt="Yusfaith delivery truck at a warehouse"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/75 to-[#0a1230]/25" />

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
              <Truck size={18} />
              Yusfaith Logistics &amp; Truck Spare Parts
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Our trucks.{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                Our drivers. Your delivery.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              Every Yusfaith delivery is made by our own logistics team, from
              the depot to your location, once your order is confirmed. We also
              sell spare parts for heavy-duty trucks.
            </p>

            <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
              {["On-time delivery", "Customer satisfaction is our priority", "Truck spare parts"].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-white">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              {DEMO_MODE && (
              <a
                href="#dispatch"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                See the Dispatch Centre
              </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Ask About Delivery
              </Link>
              <Link
                href="/logistics/spare-parts"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Shop Truck Spare Parts
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= HOW DELIVERY WORKS ================= */}
      <section style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Wallet, title: "Payment confirmed", text: "Accounts confirms payment according to your terms." },
            { Icon: Warehouse, title: "Loaded at the depot", text: "Your order is prepared and loaded." },
            { Icon: Truck, title: "Our truck and driver", text: "A Yusfaith truck and driver are assigned to you." },
            { Icon: ShieldCheck, title: "Proof of delivery", text: "The receiver's name is recorded on arrival." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
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

      {/* ================= OUR FLEET (real photos) ================= */}
      <section className="section-padding pb-0">
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <p
              className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
              style={{ color: "var(--gold-text)" }}
            >
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
              Our Fleet
            </p>
            <h2 className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl" style={{ color: "var(--foreground)" }}>
              Our own trucks, on the road every day.
            </h2>
            <p className="mt-5 text-base leading-8" style={{ color: "var(--muted)" }}>
              Every delivery is loaded at our depots and carried by Yusfaith
              trucks and drivers. Our fleet is maintained to strict standards
              for safety, reliability and on-time delivery.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
            {[
              { src: "/images/logistics/yusfaith-truck-loaded.jpeg", alt: "A loaded Yusfaith truck leaving the depot", big: true },
              { src: "/images/logistics/yusfaith-truck-front.jpeg", alt: "Yusfaith truck at the depot" },
              { src: "/images/logistics/yusfaith-truck-yard.jpeg", alt: "Truck loaded and covered in the depot yard" },
              { src: "/images/corporate/yusfaith-depot-truck.jpeg", alt: "Head office and depot with a Yusfaith truck" },
              { src: "/images/cement/stock-warehouse.jpeg", alt: "Cement stock ready for delivery" },
            ].map((photo, index) => (
              <FadeUp
                key={photo.src}
                delay={index * 0.06}
                className={photo.big ? "col-span-2 row-span-2" : ""}
              >
                <div className={`group relative overflow-hidden rounded-2xl ${photo.big ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={photo.big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SPARE PARTS ================= */}
      <SpareParts />

      {/* ================= DISPATCH CENTRE ================= */}
     
      {DEMO_MODE ? (
      <section id="dispatch" className="section-padding scroll-mt-20">
        <div className="container-main">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold-text)" }}>
                Dispatch Centre · Demo
              </p>
              <h2 className="font-heading text-4xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
                How our team runs deliveries
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                This is a preview of the staff tools. Orders come from the shared
                demo order list. Trucks and drivers are sample data.
              </p>
            </div>

            <div role="tablist" aria-label="Dispatch views" className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={view === tab.id}
                  onClick={() => setView(tab.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    view === tab.id
                      ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="font-heading text-4xl font-semibold" style={{ color: "var(--gold-text)" }}>
                  {s.value}
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* ---------- Dispatch board ---------- */}
          {view === "board" && (
            <>
              {orders.length === 0 && (
                <div className="mb-8 rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
                  <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                    No delivery orders yet.
                  </p>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6" style={{ color: "var(--muted)" }}>
                    Place a delivery order on the Bakery page and it will appear
                    here, or load three sample orders to try the board straight
                    away.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      seedSampleOrders();
                      reload();
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-3 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
                  >
                    Load sample orders
                  </button>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: "Awaiting dispatch", list: awaiting },
                  { title: "On the road", list: onRoad },
                  { title: "Delivered", list: delivered },
                ].map((column) => (
                  <div key={column.title}>
                    <h3 className="mb-4 flex items-center justify-between text-lg font-bold" style={{ color: "var(--foreground)" }}>
                      {column.title}
                      <span className="rounded-full bg-[var(--surface)] px-3 py-0.5 text-sm" style={{ color: "var(--gold-text)" }}>
                        {column.list.length}
                      </span>
                    </h3>
                    <div className="space-y-4">
                      {column.list.length === 0 && (
                        <p className="rounded-xl border border-dashed border-[var(--border)] p-5 text-center text-sm" style={{ color: "var(--muted)" }}>
                          Nothing here.
                        </p>
                      )}
                      {column.list.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          assignment={assignmentFor(order.id)}
                          mode="staff"
                          busyTrucks={busyTrucks}
                          busyDrivers={busyDrivers}
                          onChange={reload}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {orders.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      seedSampleOrders();
                      reload();
                    }}
                    className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
                  >
                    Add sample orders
                  </button>
                  <button
                    type="button"
                    onClick={resetDemo}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-red-400 hover:text-red-700"
                  >
                    <RotateCcw size={15} />
                    Reset demo data
                  </button>
                </div>
              )}
            </>
          )}

          {/* ---------- Fleet and drivers ---------- */}
          {view === "fleet" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  Trucks
                </h3>
                <div className="space-y-3">
                  {TRUCKS.map((t) => {
                    const busy = busyTrucks.has(t.id);
                    return (
                      <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ef850f] text-[#0f1a3d]">
                          <Truck size={22} />
                        </span>
                        <span className="flex-1 text-sm" style={{ color: "var(--foreground)" }}>
                          <span className="block font-bold">{t.plate}</span>
                          <span className="block" style={{ color: "var(--muted)" }}>
                            {t.type} · {t.capacity} · {t.branch}
                          </span>
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${busy ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                          {busy ? "On delivery" : "Available"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  Drivers
                </h3>
                <div className="space-y-3">
                  {DRIVERS.map((d) => {
                    const busy = busyDrivers.has(d.id);
                    const truck = TRUCKS.find((t) => t.id === d.truckId);
                    return (
                      <div key={d.id} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]" style={{ color: "var(--gold-text)" }}>
                          <User size={22} />
                        </span>
                        <span className="flex-1 text-sm" style={{ color: "var(--foreground)" }}>
                          <span className="block font-bold">{d.name}</span>
                          <span className="block" style={{ color: "var(--muted)" }}>
                            {d.phone} · usual truck {truck ? truck.plate : "none"}
                          </span>
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${busy ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                          {busy ? "On delivery" : "Available"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-sm lg:col-span-2" style={{ color: "var(--muted)" }}>
                Sample fleet data for this demo. In the main app, staff add and
                edit trucks and drivers themselves.
              </p>
            </div>
          )}

          {/* ---------- Driver view ---------- */}
          {view === "driver" && (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <label className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
                  <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                    Signed in as
                  </span>
                  <select
                    className={inputClass}
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                  >
                    {DRIVERS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  A driver only sees the deliveries assigned to them. They can
                  start a delivery, open the address in Google Maps, and record
                  the receiver. They cannot confirm payment or change prices.
                </p>
              </div>

              <h3 className="mb-4 text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {currentDriver.name}&apos;s deliveries ({myJobs.length})
              </h3>

              {myJobs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
                  No deliveries assigned to this driver. Assign one from the
                  Dispatch board.
                </p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {myJobs.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      assignment={assignmentFor(order.id)}
                      mode="driver"
                      busyTrucks={busyTrucks}
                      busyDrivers={busyDrivers}
                      onChange={reload}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
            </section>
      ) : (
        <section className="section-padding">
          <div className="container-main max-w-3xl text-center">
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
              Need goods delivered?
            </h2>
            <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
              Order from any Yusfaith business and our logistics team handles
              the delivery. Talk to us about delivery to your location.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}