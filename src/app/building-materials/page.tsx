
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

const categories = [
  {
    title: "Roofing Materials",
    image: "/images/building-materials/materials-longspan-roofing.jpg",
    description: "Longspan and galvanized roofing sheets.",
  },
  {
    title: "Steel & Reinforcement",
    image: "/images/building-materials/materials-iron-rods.jpg",
    description: "Iron rods, steel and binding wire.",
  },
  {
    title: "Blocks & Aggregates",
    image: "/images/building-materials/materials-concrete-blocks.jpg",
    description: "Concrete blocks, sand and granite.",
  },
  {
    title: "Plumbing Supplies",
    image: "/images/building-materials/materials-pvc-pipes.jpg",
    description: "PVC pipes and plumbing fittings.",
  },
  {
    title: "Electrical Materials",
    image: "/images/building-materials/materials-electrical-conduits.jpg",
    description: "Electrical conduits and installation materials.",
  },
  {
    title: "Finishing Materials",
    image: "/images/building-materials/materials-floor-wall-tiles.jpg",
    description: "Tiles, ceiling boards and finishing essentials.",
  },
  {
    title: "Doors & Timber",
    image: "/images/building-materials/materials-doors-frames.jpg",
    description: "Doors, frames and timber products.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select Products",
    description: "Browse materials, select quantities and build your basket.",
  },
  {
    number: "02",
    title: "Customer Details",
    description: "Provide your contact details and delivery or pickup preference.",
  },
  {
    number: "03",
    title: "Payment Preference",
    description: "Review your estimated total and choose a demo payment option.",
  },
  {
    number: "04",
    title: "Order Confirmation",
    description: "Receive a demo reference for tracking and order history.",
  },
];

export default function BuildingMaterialsPage() {
  return (
    <main className="bg-[#f6f5f1] text-[#0b1629]">
      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#0b1629] text-white">
        <Image
          src="/images/building-materials/materials-hero.jpg"
          alt="Building and construction materials"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071325]/95 via-[#071325]/75 to-[#071325]/30" />

        <div className="container-main relative z-10 py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f2c85b]">
            Yusfaith Global Enterprises
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-white/75">
            Building Materials Division
          </p>
          <h1 className="mt-7 max-w-4xl font-heading text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            Building Better,
            <span className="block text-[#f2c85b]">
              From the Ground Up.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/85">
            Discover construction essentials, structural materials
            and finishing supplies through the Yusfaith Building
            Materials digital experience.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/building-materials/order"
              className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#f2c85b] px-7 py-4 font-bold !text-[#0b1629]"
            >
              Browse & Order Materials <ArrowRight size={19} />
            </Link>
            <a
              href="#categories"
              className="inline-flex min-h-12 items-center rounded-xl border border-white/50 px-7 py-4 font-semibold !text-white hover:bg-white/10"
            >
              Explore Categories
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container-main grid gap-8 md:grid-cols-3">
          {[
            {
              Icon: Package,
              title: "Construction Essentials",
              text: "A broad demonstration catalogue of building materials.",
            },
            {
              Icon: ShieldCheck,
              title: "Clear Estimates",
              text: "Review illustrative prices before confirming a demo order.",
            },
            {
              Icon: Truck,
              title: "Pickup & Delivery",
              text: "Choose your preferred fulfillment method during checkout.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <Icon className="shrink-0 text-amber-700" size={28} />
              <div>
                <h2 className="font-heading text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="container-main scroll-mt-24 py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
          Explore Our Range
        </p>
        <h2 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
          Building Materials Categories
        </h2>
        <p className="mt-5 max-w-2xl leading-8 text-slate-600">
          Explore our sample catalogue of construction products.
          Actual stock, specifications and prices require confirmation.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-2xl font-semibold">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {category.description}
                </p>
                <Link
                  href="/building-materials/order"
                  className="mt-5 inline-flex items-center gap-2 font-bold text-amber-800"
                >
                  View Products <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden rounded-3xl">
            <Image
              src="/images/building-materials/materials-warehouse.jpg"
              alt="Building materials warehouse"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Part of Yusfaith Global Enterprises
            </p>
            <h2 className="mt-5 font-heading text-4xl font-semibold sm:text-5xl">
              Supporting Every Stage of Construction
            </h2>
            <p className="mt-6 leading-8 text-slate-600">
              From foundations and structural work to roofing,
              plumbing and finishing, the Building Materials
              division is designed to connect customers with
              essential construction supplies.
            </p>
            <p className="mt-4 leading-8 text-slate-600">
              Our proposed digital experience makes it easier
              to explore materials, prepare estimates and
              request quotations.
            </p>
            <div className="mt-7 space-y-3">
              {[
                "Dedicated material categories",
                "Interactive quotation and ordering demonstration",
                "Connected to the wider Yusfaith business group",
              ].map((item) => (
                <p key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={19} className="text-amber-700" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
          Simple Digital Ordering
        </p>
        <h2 className="mt-4 font-heading text-4xl font-semibold">
          How the Ordering System Works
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="font-heading text-4xl font-semibold text-amber-700">
                {step.number}
              </p>
              <h3 className="mt-6 font-heading text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
        <Link
          href="/building-materials/order"
          className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#0b1629] px-7 py-4 font-bold !text-[#f2c85b]"
        >
          Start Demo Order <ArrowRight size={18} />
        </Link>
      </section>

      <section className="bg-white py-20">
        <div className="container-main">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Yusfaith Business Locations
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold">
            Our Locations
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Abeokuta Headquarters",
                address:
                  "KM 6 Lagos-Abeokuta Expressway, Ile-Ise Awo, beside Sholanke Filling Station, Abeokuta, Ogun State.",
              },
              {
                title: "Epe, Lagos",
                address:
                  "No. 33/34 Lagos Road, beside Benjude Supermarket, Epe, Lagos State.",
              },
              {
                title: "Ibadan, Oyo State",
                address: "Adeoyo, off Ring Road, Ibadan, Oyo State.",
              },
            ].map((place) => (
              <article key={place.title} className="rounded-2xl border border-slate-200 bg-[#f6f5f1] p-7">
                <MapPin size={27} className="text-amber-700" />
                <h3 className="mt-5 font-heading text-xl font-semibold">
                  {place.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {place.address}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            These are Yusfaith business addresses. Building
            Materials stock and pickup availability at each
            location are not yet confirmed.
          </p>
        </div>
      </section>

      <section className="bg-[#0b1629] py-20 text-white">
        <div className="container-main flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#f2c85b]">
              Build With Yusfaith
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold">
              Ready to Prepare Your Order?
            </h2>
            <p className="mt-4 max-w-xl text-white/75">
              Explore the catalogue and create a simulated order.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/building-materials/order"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f2c85b] px-6 py-4 font-bold !text-[#0b1629]"
            >
              <Building2 size={18} /> Order Materials
            </Link>
            <Link
              href="/building-materials/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-4 font-semibold !text-white"
            >
              <ClipboardList size={18} /> Demo Orders
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
