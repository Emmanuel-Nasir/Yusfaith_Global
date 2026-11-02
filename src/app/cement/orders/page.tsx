
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Plus,
} from "lucide-react";

import {
  formatNaira,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from "@/lib/cement/catalog";

import { getOrders } from "@/lib/cement/storage";
import type { CementOrder } from "@/lib/cement/types";

export default function CementOrdersPage() {
  const [orders, setOrders] = useState<CementOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f5f1] text-[#0b1629]">
      <section className="bg-[#0b1629] py-14 text-white">
        <div className="container-main">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2c85b]">
            Yusfaith Cement Depot · Demo
          </p>

          <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
            Order History
          </h1>

          <p className="mt-4 text-white/75">
            View your saved demo orders and estimated costs.
          </p>

          <div className="mt-6 flex flex-wrap gap-5 text-sm">
            <Link
              href="/cement"
              className="!text-white underline"
            >
              Cement Homepage
            </Link>

            <Link
              href="/cement/track"
              className="!text-white underline"
            >
              Track an Order
            </Link>
          </div>
        </div>
      </section>

      <section className="container-main py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl font-semibold">
              Saved Orders
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {ready
                ? `${orders.length} demo order${orders.length === 1 ? "" : "s"}`
                : "Loading orders..."}
            </p>
          </div>

          <Link
            href="/cement/order"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-5 py-3 font-bold !text-[#f2c85b]"
          >
            <Plus size={17} />
            New Order
          </Link>
        </div>

        {!ready ? (
          <div className="rounded-2xl bg-white p-8">
            Loading order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <ClipboardList
              size={44}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-5 font-heading text-3xl font-semibold">
              No Orders Yet
            </h3>

            <p className="mt-3 text-sm text-slate-600">
              Create a demo order to see it here.
            </p>

            <Link
              href="/cement/order"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0b1629] px-6 py-3 font-bold !text-[#f2c85b]"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                      Demo Reference
                    </p>

                    <h3 className="mt-2 break-all font-mono text-base font-bold sm:text-lg">
                      {order.id}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-950">
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-slate-500">
                      Customer
                    </p>
                    <p className="mt-1 break-words font-semibold">
                      {order.customer.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Quantity
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
                      Estimated Total
                    </p>
                    <p className="mt-1 font-bold">
                      {order.estimatedTotal !== undefined
                        ? formatNaira(order.estimatedTotal)
                        : "Not recorded"}
                    </p>
                  </div>
                </div>

                <h4 className="mt-7 font-semibold">
                  Ordered Products
                </h4>

                <div className="mt-3 space-y-3">
                  {order.lines.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-wrap justify-between gap-3 border-b border-slate-100 pb-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.name}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {item.quantity.toLocaleString()} bags
                          {item.unitPrice !== undefined &&
                            ` × ${formatNaira(item.unitPrice)}`}
                        </p>
                      </div>

                      <strong>
                        {item.subtotal !== undefined
                          ? formatNaira(item.subtotal)
                          : "—"}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm">
                  <p>
                    <span className="font-semibold">
                      Payment Preference:
                    </span>{" "}
                    {order.paymentMethod
                      ? PAYMENT_LABELS[order.paymentMethod]
                      : "Not recorded"}
                  </p>

                  <p className="mt-2 font-semibold text-amber-950">
                    Payment Status: Not Paid — Demo Only
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    Estimated prices are illustrative,
                    not a confirmed invoice.
                  </p>
                </div>

                <Link
                  href={`/cement/track?ref=${encodeURIComponent(order.id)}`}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-6 py-3 text-sm font-bold !text-[#f2c85b] sm:w-auto"
                >
                  View Tracking
                  <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
