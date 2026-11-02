
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package,
  Truck,
  UserRound,
} from "lucide-react";

import { getBooking } from "@/lib/logistics/storage";
import {
  STATUS_LABELS,
  type LogisticsBooking,
} from "@/lib/logistics/types";

type Props = {
  id: string;
};

export default function BookingDetailsClient({ id }: Props) {
  const [booking, setBooking] =
    useState<LogisticsBooking | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBooking(getBooking(id) ?? null);
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-slate-600">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold">
            Booking Not Found
          </h2>
          <p className="mt-3 text-slate-600">
            This booking was not found in the current browser.
          </p>
          <Link
            href="/logistics/bookings"
            className="mt-6 inline-block rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300"
          >
            View Booking History
          </Link>
        </div>
      </div>
    );
  }

  const details = [
    {
      title: "Cargo Details",
      icon: Package,
      items: [
        ["Cargo Type", booking.cargo.type],
        ["Description", booking.cargo.description],
        [
          "Quantity",
          `${booking.cargo.quantity.toLocaleString()} ${booking.cargo.unit}`,
        ],
      ],
    },
    {
      title: "Route Details",
      icon: MapPin,
      items: [
        ["Pickup", booking.pickup],
        ["Destination", booking.destination],
        ["Preferred Date", booking.preferredDate],
      ],
    },
    {
      title: "Customer Details",
      icon: UserRound,
      items: [
        ["Full Name", booking.customer.name],
        ["Phone", booking.customer.phone],
        ["Email", booking.customer.email || "Not provided"],
      ],
    },
    {
      title: "Dispatch Information",
      icon: Truck,
      items: [
        ["Status", STATUS_LABELS[booking.status]],
        ["Vehicle", "Not assigned — demo"],
        ["Driver", "Not assigned — demo"],
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Booking Reference
            </p>
            <h2 className="mt-2 break-all font-mono text-xl font-bold">
              {booking.id}
            </h2>
          </div>

          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
            {STATUS_LABELS[booking.status]}
          </span>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={16} />
          Created{" "}
          {new Date(booking.createdAt).toLocaleString("en-NG")}
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {details.map((section) => {
          const Icon = section.icon;

          return (
            <section
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <Icon size={23} className="text-amber-700" />
                {section.title}
              </h3>

              <dl className="mt-6 space-y-5">
                {section.items.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words font-semibold">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>

      {booking.notes && (
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">
            Additional Instructions
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">
            {booking.notes}
          </p>
        </section>
      )}

      <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        This booking is for demonstration purposes.
        No live transportation or dispatch has been arranged.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={`/logistics/track?ref=${encodeURIComponent(booking.id)}`}
          className="rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300"
        >
          Track Request
        </Link>

        <Link
          href="/logistics/bookings"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold"
        >
          <ArrowLeft size={18} />
          Booking History
        </Link>
      </div>
    </div>
  );
}
