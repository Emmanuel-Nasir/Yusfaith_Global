
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Search, Truck } from "lucide-react";
import {
  formatNaira,
  PAYMENT_LABELS,
  type MaterialOrder,
} from "@/lib/building-materials/catalog";
import { findOrder } from "@/lib/building-materials/storage";

function TrackingContent() {
  const params = useSearchParams();
  const initialReference = params.get("ref") ?? "";

  const [reference, setReference] = useState(initialReference);
  const [order, setOrder] = useState<MaterialOrder | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!initialReference) return;
    setOrder(findOrder(initialReference) ?? null);
    setSearched(true);
  }, [initialReference]);

  function searchOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrder(findOrder(reference) ?? null);
    setSearched(true);
  }

  return (
    <div className="container-main py-16">
      <Link href="/building-materials" className="font-semibold text-amber-800">
        ← Building Materials
      </Link>

      <div className="mt-9 flex items-center gap-3">
        <Truck size={32} className="text-amber-700" />
        <h1 className="font-heading text-4xl font-semibold">
          Track Your Order
        </h1>
      </div>

      <p className="mt-5 max-w-2xl leading-7 text-slate-600">
        Enter your reference to retrieve a demo order saved
        in this browser.
      </p>

      <form onSubmit={searchOrder} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <input
          required
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="YGE-BM-XXXXXXXX"
          aria-label="Order reference"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1629] px-6 py-3 font-bold !text-[#f2c85b]"
        >
          <Search size={18} /> Find Order
        </button>
      </form>

      {searched && !order && (
        <p role="status" className="mt-8 rounded-xl bg-white p-6">
          No matching demo order was found in this browser.
        </p>
      )}

      {order && (
        <article className="mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <CheckCircle2 size={45} className="text-emerald-700" />
          <h2 className="mt-5 font-heading text-3xl font-semibold">
            Order Received
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            This is a simulated order. No actual payment,
            warehouse dispatch or delivery has taken place.
          </p>

          <dl className="mt-8 space-y-4 border-t border-slate-200 pt-6">
            {[
              ["Reference", order.id],
              ["Customer", order.customer.name],
              ["Date", new Date(order.createdAt).toLocaleDateString("en-NG")],
              ["Fulfillment", order.fulfillment],
              ["Location", order.customer.location],
              ["Payment", PAYMENT_LABELS[order.paymentMethod]],
              ["Estimated Total", formatNaira(order.estimatedTotal)],
              ["Status", "Received (Demo)"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-3 text-sm">
                <dt className="text-slate-500">{label}</dt>
                <dd className="break-all font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-heading text-xl font-semibold">
              Ordered Materials
            </h3>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
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
          </div>

          <Link
            href="/building-materials/orders"
            className="mt-9 inline-flex rounded-xl bg-[#0b1629] px-6 py-3 font-bold !text-[#f2c85b]"
          >
            View Order History
          </Link>
        </article>
      )}
    </div>
  );
}

export default function BuildingMaterialsTrackingPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f1] text-[#0b1629]">
      <Suspense fallback={<div className="container-main py-16">Loading tracking...</div>}>
        <TrackingContent />
      </Suspense>
    </main>
  );
}
