
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import {
  formatNaira,
  PAYMENT_LABELS,
  type MaterialOrder,
} from "@/lib/building-materials/catalog";
import { getOrders } from "@/lib/building-materials/storage";

export default function BuildingMaterialsOrdersPage() {
  const [orders, setOrders] = useState<MaterialOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f5f1] py-16 text-[#0b1629]">
      <div className="container-main">
        <Link href="/building-materials" className="font-semibold text-amber-800">
          ← Building Materials
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <ClipboardList size={30} className="text-amber-700" />
          <h1 className="font-heading text-4xl font-semibold">
            Order History
          </h1>
        </div>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Orders created in this browser for demonstration only.
          They are not real orders or confirmed quotations.
        </p>

        {!ready ? (
          <p className="mt-10">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center">
            <h2 className="font-heading text-2xl font-semibold">
              No Demo Orders Yet
            </h2>
            <p className="mt-3 text-slate-600">
              Start by choosing building materials.
            </p>
            <Link
              href="/building-materials/order"
              className="mt-6 inline-flex rounded-xl bg-[#0b1629] px-6 py-3 font-bold !text-[#f2c85b]"
            >
              Create Demo Order
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                      Order Reference
                    </p>
                    <h2 className="mt-2 break-all font-heading text-2xl font-semibold">
                      {order.id}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                  <span className="h-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-900">
                    Received — Demo
                  </span>
                </div>

                <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <strong className="text-sm">
                        {formatNaira(item.subtotal)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-slate-200 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Estimated Total</p>
                    <p className="mt-1 text-2xl font-bold">
                      {formatNaira(order.estimatedTotal)}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {order.fulfillment} · {PAYMENT_LABELS[order.paymentMethod]}
                    </p>
                  </div>
                  <Link
                    href={`/building-materials/track?ref=${encodeURIComponent(order.id)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0b1629] px-6 py-3 text-sm font-bold !text-[#f2c85b]"
                  >
                    Track Order <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
