
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

import BookingDetailsClient from "@/components/logistics/BookingDetailsClient";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function BookingContent({ params }: Props) {
  const { id } = await params;

  return <BookingDetailsClient id={id} />;
}

export default function LogisticsBookingDetailsPage({
  params,
}: Props) {
  return (
    <main className="min-h-screen bg-slate-50 text-[#10213b]">
      <section className="bg-[#10213b] px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/logistics/bookings"
            className="inline-flex items-center gap-2 text-amber-300"
          >
            <ArrowLeft size={17} />
            Back to Booking History
          </Link>

          <ClipboardList
            size={34}
            className="mt-8 text-amber-300"
          />

          <h1 className="mt-5 text-4xl font-bold">
            Booking Details
          </h1>

          <p className="mt-4 text-slate-300">
            Review the information in your
            transportation request.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl px-5 py-16 text-slate-600">
            Loading booking details...
          </div>
        }
      >
        <BookingContent params={params} />
      </Suspense>
    </main>
  );
}
