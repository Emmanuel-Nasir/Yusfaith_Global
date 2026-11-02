// simulated tracking system for the cement depot demo. It allows users to enter a demo order reference and view the order details, including the current status and progress of the order. Users can also advance the simulated status of the order to demonstrate what customers would see in a production tracking system.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";

import {
  STATUSES,
  STATUS_LABELS,
} from "@/lib/cement/catalog";

import {
  findOrder,
  updateOrderStatus,
} from "@/lib/cement/storage";

import type {
  CementOrder,
  OrderStatus,
} from "@/lib/cement/types";

function statusLabel(
  status: OrderStatus,
  order: CementOrder
) {
  if (
    status === "dispatched" &&
    order.fulfillment === "pickup"
  ) {
    return "Ready for pickup";
  }

  if (
    status === "delivered" &&
    order.fulfillment === "pickup"
  ) {
    return "Collected";
  }

  return STATUS_LABELS[status];
}

export default function CementTrackingPage() {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState<CementOrder | null>(
    null
  );
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const ref = params.get("ref");

    if (ref) {
      setReference(ref);
      setOrder(findOrder(ref));
      setSearched(true);
    }
  }, []);

  function lookupOrder(ref: string) {
    setError("");

    const result = findOrder(ref);

    setOrder(result);
    setSearched(true);
  }

  function advanceStatus() {
    if (!order) return;

    const index = STATUSES.indexOf(order.status);

    if (index === -1 || index >= STATUSES.length - 1) {
      return;
    }

    const nextStatus = STATUSES[index + 1];

    try {
      updateOrderStatus(order.id, nextStatus);

      const updated = findOrder(order.id);

      setOrder(updated);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update simulated status."
      );
    }
  }

  const currentIndex = order
    ? STATUSES.indexOf(order.status)
    : -1;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f5f1] text-[#0b1629]">
      {/* HEADER */}
      <section className="bg-[#0b1629] py-14 text-white">
        <div className="container-main">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2c85b]">
            Yusfaith Cement Depot · Tracking Demo
          </p>

          <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
            Track Your Cement Order
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            Enter a demo reference to view the order
            and follow its simulated progress.
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <Link
              href="/cement/order"
              className="text-white underline underline-offset-4"
            >
              Create an order
            </Link>

            <Link
              href="/cement/orders"
              className="text-white underline underline-offset-4"
            >
              My orders
            </Link>
          </div>
        </div>
      </section>

      <section className="container-main py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          {/* SEARCH */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold sm:text-3xl">
              <Search size={26} className="text-amber-700" />
              Find an Order
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              References work only in the browser where
              the demo order was saved.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                lookupOrder(reference);
              }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                required
                aria-label="Demo order reference"
                value={reference}
                onChange={(event) =>
                  setReference(event.target.value)
                }
                placeholder="YGE-DEMO-XXXXXXXXXXXX"
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-[#0b1629] outline-none focus:border-amber-600"
              />

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-6 py-3 font-semibold text-[#f2c85b]"
              >
                <Search size={18} />
                Find Order
              </button>
            </form>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          {/* NO MATCH */}
          {searched && !order && (
            <div
              role="status"
              className="mt-7 rounded-2xl border border-amber-200 bg-white p-7 text-center"
            >
              <Package
                size={40}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 font-heading text-2xl font-semibold">
                Order Not Found
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                No matching demo order was found in
                this browser. Check the reference or
                open your saved order history.
              </p>

              <Link
                href="/cement/orders"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0b1629] px-6 py-3 font-semibold text-[#f2c85b]"
              >
                View Order History
              </Link>
            </div>
          )}

          {/* TRACKING RESULT */}
          {order && (
            <div className="mt-8 space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                      Demo Order Reference
                    </p>

                    <h2 className="mt-2 break-all font-mono text-lg font-bold sm:text-xl">
                      {order.id}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Created{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-950">
                    {statusLabel(order.status, order)}
                  </span>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-7">
                  <h3 className="font-heading text-2xl font-semibold">
                    Order Progress
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    This timeline is simulated for demonstration.
                  </p>

                  <div className="mt-8">
                    {STATUSES.map((status, index) => {
                      const completed = index <= currentIndex;
                      const isLast =
                        index === STATUSES.length - 1;

                      return (
                        <div
                          key={status}
                          className="flex gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                                completed
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-slate-300 bg-white text-slate-400"
                              }`}
                            >
                              {completed ? (
                                <Check size={17} />
                              ) : (
                                <span className="text-xs font-bold">
                                  {index + 1}
                                </span>
                              )}
                            </div>

                            {!isLast && (
                              <div
                                className={`min-h-12 w-0.5 flex-1 ${
                                  index < currentIndex
                                    ? "bg-emerald-700"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>

                          <div
                            className={`min-w-0 ${
                              isLast ? "pb-0" : "pb-10"
                            }`}
                          >
                            <h4
                              className={`font-semibold ${
                                completed
                                  ? "text-[#0b1629]"
                                  : "text-slate-400"
                              }`}
                            >
                              {statusLabel(status, order)}
                            </h4>

                            <p className="mt-1 text-xs text-slate-500">
                              {completed
                                ? "Reached in demo simulation"
                                : "Not yet reached"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ORDER DETAILS */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <h3 className="flex items-center gap-3 font-heading text-2xl font-semibold">
                  <ClipboardCheck
                    size={25}
                    className="text-amber-700"
                  />
                  Order Summary
                </h3>

                <div className="mt-6 grid gap-5 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Customer</p>
                    <p className="mt-1 break-words font-semibold">
                      {order.customer.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Total Quantity
                    </p>
                    <p className="mt-1 font-semibold">
                      {order.totalBags.toLocaleString()} bags
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Fulfillment
                    </p>
                    <p className="mt-1 font-semibold capitalize">
                      {order.fulfillment}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Town / Depot
                    </p>
                    <p className="mt-1 break-words font-semibold">
                      {order.location}
                    </p>
                  </div>

                  {order.address && (
                    <div className="sm:col-span-2">
                      <p className="flex items-center gap-2 text-slate-500">
                        <MapPin size={15} />
                        Delivery Address
                      </p>
                      <p className="mt-1 break-words font-semibold">
                        {order.address}
                      </p>
                    </div>
                  )}
                </div>

                <h4 className="mt-7 font-semibold">
                  Selected Cement Products
                </h4>

                <div className="mt-3 space-y-3">
                  {order.lines.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-wrap justify-between gap-3 border-b border-slate-100 py-3 text-sm"
                    >
                      <span>{item.name}</span>
                      <strong>
                        {item.quantity.toLocaleString()} bags
                      </strong>
                    </div>
                  ))}
                </div>
              </section>

              {/* SIMULATION CONTROLS */}
              <section className="rounded-2xl border border-amber-200 bg-[#fff8e8] p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <Truck size={24} className="text-amber-800" />
                  <h3 className="font-heading text-2xl font-semibold">
                    Demo Simulation Controls
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Advance the order status to demonstrate
                  what customers could see in a production
                  tracking system. This does not represent
                  actual warehouse activity, vehicle movement
                  or completed delivery.
                </p>

                <button
                  type="button"
                  onClick={advanceStatus}
                  disabled={order.status === "delivered"}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-6 py-3 text-center font-semibold text-[#f2c85b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {order.status === "delivered"
                    ? "Simulation Complete"
                    : "Advance Simulated Status"}
                  {order.status !== "delivered" && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </section>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <Link
              href="/cement/order"
              className="font-semibold text-[#0b1629] underline underline-offset-4"
            >
              Create New Order
            </Link>

            <Link
              href="/cement/orders"
              className="font-semibold text-[#0b1629] underline underline-offset-4"
            >
              My Order History
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
