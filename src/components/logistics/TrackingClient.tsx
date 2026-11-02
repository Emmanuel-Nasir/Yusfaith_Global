
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  Truck,
} from "lucide-react";

import { getBooking } from "@/lib/logistics/storage";
import {
  STATUS_LABELS,
  STATUS_STEPS,
  type LogisticsBooking,
} from "@/lib/logistics/types";

type Props = {
  initialReference: string;
};

export default function TrackingClient({
  initialReference,
}: Props) {
  const [reference, setReference] = useState(initialReference);
  const [booking, setBooking] =
    useState<LogisticsBooking | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialReference.trim()) {
      setBooking(getBooking(initialReference) ?? null);
      setSearched(true);
    }
  }, [initialReference]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBooking(getBooking(reference) ?? null);
    setSearched(true);
  }

  const currentStep = booking
    ? STATUS_STEPS.indexOf(booking.status)
    : -1;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <form
        onSubmit={search}
        className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
      >
        <label
          htmlFor="booking-reference"
          className="text-sm font-semibold"
        >
          Booking Reference
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="booking-reference"
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setSearched(false);
            }}
            placeholder="YGE-LG-XXXXXXXXXX"
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-amber-500"
            required
          />

          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300"
          >
            <Search size={18} />
            Track Booking
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Only demo bookings saved in this browser
          can be retrieved.
        </p>
      </form>

      {searched && !booking && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-7">
          <h2 className="text-xl font-bold text-amber-900">
            Booking Not Found
          </h2>
          <p className="mt-3 text-amber-800">
            Check the reference and ensure you're using
            the browser where the booking was created.
          </p>
        </div>
      )}

      {booking && (
        <>
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Booking Reference
                </p>
                <h2 className="mt-2 break-all font-mono text-xl font-bold">
                  {booking.id}
                </h2>
              </div>

              <span className="h-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                {STATUS_LABELS[booking.status]}
              </span>
            </div>

            <div className="mt-7 grid gap-6 border-t pt-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  Cargo
                </p>
                <p className="mt-1 font-semibold">
                  {booking.cargo.type}
                </p>
                <p className="text-sm text-slate-600">
                  {booking.cargo.quantity} {booking.cargo.unit}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Preferred Pickup
                </p>
                <p className="mt-1 font-semibold">
                  {booking.preferredDate}
                </p>
              </div>

              <div>
                <MapPin size={20} className="text-amber-700" />
                <p className="mt-2 text-sm text-slate-500">
                  Pickup Location
                </p>
                <p className="font-semibold">{booking.pickup}</p>
              </div>

              <div>
                <Truck size={20} className="text-amber-700" />
                <p className="mt-2 text-sm text-slate-500">
                  Destination
                </p>
                <p className="font-semibold">
                  {booking.destination}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">
              Booking Progress
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              This is a simulated progress timeline,
              not live GPS tracking.
            </p>

            <div className="mt-8">
              {STATUS_STEPS.map((status, index) => {
                const completed = index <= currentStep;

                return (
                  <div key={status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full ${
                          completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <Clock3 size={22} />
                        )}
                      </div>

                      {index < STATUS_STEPS.length - 1 && (
                        <div className="h-14 w-px bg-slate-200" />
                      )}
                    </div>

                    <div className="pt-2">
                      <h3 className="font-semibold">
                        {STATUS_LABELS[status]}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {completed
                          ? "Recorded demo status"
                          : "Not reached"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Link
            href={`/logistics/bookings/${encodeURIComponent(booking.id)}`}
            className="mt-6 inline-block rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300"
          >
            View Full Booking Details
          </Link>
        </>
      )}
    </div>
  );
}
