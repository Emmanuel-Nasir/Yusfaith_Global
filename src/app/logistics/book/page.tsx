
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";
import BookingForm from "@/components/logistics/BookingForm";

export default function LogisticsBookPage() {
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

          <Truck size={34} className="mt-8 text-amber-300" />

          <h1 className="mt-5 text-4xl font-bold">
            Request Transportation
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Complete the form to create a demonstration
            logistics booking.
          </p>
        </div>
      </section>

      <div className="px-5 py-12">
        <BookingForm />
      </div>
    </main>
  );
}
