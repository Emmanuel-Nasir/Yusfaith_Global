
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

const services = [
  {
    title: "Cement Transportation",
    description:
      "Transportation requests for bagged cement and bulk construction supplies.",
    icon: Package,
  },
  {
    title: "Building Materials Delivery",
    description:
      "Movement of construction materials from suppliers and depots to project locations.",
    icon: Truck,
  },
  {
    title: "Commercial Haulage",
    description:
      "Logistics support for general merchandise and business transportation needs.",
    icon: MapPin,
  },
];

export default function LogisticsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-[#10213b]">
      <section className="bg-[#10213b] px-5 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
            Yusfaith Global Enterprises
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            Logistics & Transportation
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Supporting the movement of cement, building
            materials, and commercial goods through
            practical transportation solutions.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/logistics/book"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 font-bold text-[#10213b]"
            >
              Request Transportation
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/logistics/track"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-bold text-white"
            >
              <Search size={19} />
              Track a Request
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="font-semibold uppercase tracking-widest text-amber-700">
            What We Do
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Transportation Services
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Explore the transportation requirements
            our Logistics division is designed to support.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                  <Icon size={27} />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">
            Explore Our Logistics Demo
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Book Transportation",
                description:
                  "Submit a sample cargo transportation request.",
                href: "/logistics/book",
                icon: Truck,
              },
              {
                title: "Track a Booking",
                description:
                  "Look up the recorded status of a demo request.",
                href: "/logistics/track",
                icon: Search,
              },
              {
                title: "Booking History",
                description:
                  "View transportation requests saved in this browser.",
                href: "/logistics/bookings",
                icon: ClipboardList,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 p-7 transition hover:border-amber-400 hover:shadow-md"
                >
                  <Icon size={28} className="text-amber-700" />
                  <h3 className="mt-5 text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-amber-800">
                    Explore
                    <ArrowRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#10213b] px-5 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <ShieldCheck
              size={30}
              className="text-amber-300"
            />
            <h2 className="mt-4 text-2xl font-bold">
              Plan Your Next Delivery
            </h2>
            <p className="mt-3 max-w-xl text-slate-300">
              Explore how transportation requests
              could be managed through Yusfaith's
              proposed digital platform.
            </p>
          </div>

          <Link
            href="/logistics/book"
            className="rounded-xl bg-amber-400 px-7 py-4 font-bold text-[#10213b]"
          >
            Start Demo Booking
          </Link>
        </div>
      </section>
    </main>
  );
}
