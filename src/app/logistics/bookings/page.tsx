
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Plus,
  Truck,
} from "lucide-react";

import { getBookings } from "@/lib/logistics/storage";
import {
  STATUS_LABELS,
  type LogisticsBooking,
} from "@/lib/logistics/types";

export default function LogisticsBookingsPage() {
  const [bookings, setBookings] =
    useState<LogisticsBooking[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookings(getBookings());
    setReady(true);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-[#10213b]">
      <section className="bg-[#10213b] px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/logistics"
            className="inline-flex items-center gap-2 text-amber-300"
          >
            <ArrowLeft size={17} />
            Back to Logistics
          </Link>

          <ClipboardList
            size={34}
            className="mt-8 text-amber-300"
          />

          <h1 className="mt-5 text-4xl font-bold">
            Booking History
          </h1>

          <p className="mt-4 text-slate-300">
            Review your saved demo transportation requests.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Your Requests
            </h2>
            <p className="mt-2 text-slate-600">
              {ready
                ? `${bookings.length} saved booking(s)`
                : "Loading bookings..."}
            </p>
          </div>

          <Link
            href="/logistics/book"
            className="inline-flex items-center gap-2 rounded-xl bg-[#10213b] px-5 py-3 font-semibold text-amber-300"
          >
            <Plus size={18} />
            New Booking
          </Link>
        </div>

        {ready && bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Truck
              size={44}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-5 text-2xl font-bold">
              No Bookings Yet
            </h3>

            <p className="mt-3 text-slate-600">
              You haven't created a demo booking in this browser.
            </p>

            <Link
              href="/logistics/book"
              className="mt-6 inline-block rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300"
            >
              Create a Booking
            </Link>
          </div>
        )}

        <div className="grid gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Booking Reference
                  </p>

                  <h3 className="mt-2 break-all font-mono text-lg font-bold">
                    {booking.id}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {new Date(
                      booking.createdAt
                    ).toLocaleDateString("en-NG")}
                  </p>
                </div>

                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>

              <div className="mt-6 grid gap-5 border-t pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">
                    Cargo
                  </p>
                  <p className="mt-2 font-semibold">
                    {booking.cargo.type}
                  </p>
                  <p className="text-sm text-slate-600">
                    {booking.cargo.quantity} {booking.cargo.unit}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Pickup
                  </p>
                  <p className="mt-2 font-semibold">
                    {booking.pickup}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Destination
                  </p>
                  <p className="mt-2 font-semibold">
                    {booking.destination}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/logistics/bookings/${encodeURIComponent(booking.id)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#10213b] px-5 py-3 font-semibold text-amber-300"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href={`/logistics/track?ref=${encodeURIComponent(booking.id)}`}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
                >
                  Track Request
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
