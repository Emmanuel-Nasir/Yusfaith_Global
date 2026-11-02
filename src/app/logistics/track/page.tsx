
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import TrackingClient from "@/components/logistics/TrackingClient";

type Props = {
  searchParams: Promise<{
    ref?: string | string[];
  }>;
};

async function TrackingResults({
  searchParams,
}: Props) {
  const query = await searchParams;

  const reference = Array.isArray(query.ref)
    ? query.ref[0] ?? ""
    : query.ref ?? "";

  return (
    <TrackingClient initialReference={reference} />
  );
}

export default function LogisticsTrackingPage({
  searchParams,
}: Props) {
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

          <Search size={34} className="mt-8 text-amber-300" />

          <h1 className="mt-5 text-4xl font-bold">
            Track Your Booking
          </h1>

          <p className="mt-4 text-slate-300">
            Enter your booking reference to view
            its demonstration status.
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-4xl px-5 py-12">
            Loading tracking information...
          </div>
        }
      >
        <TrackingResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
