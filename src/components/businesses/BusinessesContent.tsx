"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building,
  CakeSlice,
  Check,
  Hammer,
  Truck,
  Warehouse,
} from "lucide-react";

const BUSINESS_DETAILS = [
  {
    id: "cement",
    name: "Cement Depot",
    Icon: Warehouse,
    tagline: "Strong foundations, reliable supply.",
    description:
      "Our flagship business. Yusfaith is a distributor of Dangote, HBM, BUA, Mangal and Purechem cement, supplying contractors, retailers and individual builders, wholesale and retail.",
    highlights: [
      "Dangote, HBM, BUA, Mangal and Purechem cement",
      "Wholesale and retail supply",
      "Bulk orders for contractors and retailers",
      "Serving customers across Ogun, Lagos, Oyo and Osun States",
    ],
    image: "/images/cement/Epe warehouse.jpeg",
    imageAlt: "the Yusfaith Epe store",
    href: "/cement",
    cta: "Visit Cement Depot",
  },
  {
    id: "building-materials",
    name: "Building Materials",
    Icon: Hammer,
    tagline: "Everything you need to build better.",
    description:
      "Beyond cement, we supply the materials that take a project from foundation to roof, so customers can source more of their build in one place.",
    highlights: [
      "Blocks, iron rods and roofing sheets",
      "Tiles, paints, pipes and plumbing fittings",
      "Timber, ceiling boards and doors",
      "Order alongside your cement",
    ],
    image: "/images/building-materials/materials-warehouse.jpg",
    imageAlt: "Building materials stacked in a warehouse",
    href: "/building-materials",
    cta: "Visit Building Materials",
  },
  {
    id: "logistics",
    name: "Logistics",
    Icon: Truck,
    tagline: "Moving goods, delivering on time.",
    description:
      "Our own logistics team, trucks and drivers deliver customer orders from our depots to their sites, and we sell spare parts for heavy-duty trucks.",
    highlights: [
      "On-time delivery",
      "Customer satisfaction is our priority",
      "Yusfaith's own trucks and drivers",
      "Truck spare parts for sale",
    ],
    image: "/images/logistics/yusfaith-truck-depot.jpeg",
    imageAlt: "Delivery truck loading at a warehouse",
    href: "/logistics",
    cta: "Visit Logistics",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    Icon: Building,
    tagline: "Spaces for today, value for tomorrow.",
    description:
      "Building on our experience in construction supply, Yusfaith Real Estate focuses on property and development for growing communities.",
    highlights: [
      "Residential properties",
      "Property development",
      "Enquiries and site inspections",
    ],
    image: "/images/real-estate/real-estate-hero.jpg",
    imageAlt: "Modern residential property",
    href: "/real-estate",
    cta: "Visit Real Estate",
  },
  {
    id: "bakery",
    name: "Bakery",
    Icon: CakeSlice,
    tagline: "Made with care, shared with joy.",
    description:
      "Yusfaith Bakery brings the same commitment to quality to everyday food: fresh bread and baked goods for homes, shops and events.",
    highlights: [
      "Bread, rolls and soft buns",
      "Pastries, doughnuts and pies",
      "Cakes for every occasion",
      "Orders for homes and retailers",
    ],
    image: "/images/bakery/product-bread-assortment.jpg",
    imageAlt: "Freshly baked bread and rolls",
    href: "/bakery",
    cta: "Visit Bakery",
  },
];

function FadeUp({
  children,
  delay = 0,
  x = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  x?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: x ? 0 : 32, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function BusinessesContent() {
  return (
    <main>
      {/* ================= PAGE HEADER ================= */}
      <section className="relative isolate overflow-hidden bg-[#0f1a3d] pb-16 pt-36 text-white sm:pb-20">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#ef850f]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#2263a3]/25 blur-3xl" />

        <div className="container-main relative z-10">
          <FadeUp>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
              <Link href="/" className="transition hover:text-[#ff9a26]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Our Businesses</span>
            </nav>

            <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Five businesses.{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                One Yusfaith.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              From cement distribution to fresh bread, every Yusfaith business
              is built on the same values: trust, professionalism, prudency,
              integrity and teamwork.
            </p>
          </FadeUp>

          {/* Quick jump */}
          <FadeUp delay={0.15} className="mt-10 flex flex-wrap gap-3">
            {BUSINESS_DETAILS.map(({ id, name, Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#ef850f] hover:bg-[#ef850f] hover:text-[#0f1a3d]"
              >
                <Icon size={16} />
                {name}
              </a>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ================= BUSINESS SECTIONS ================= */}
      {BUSINESS_DETAILS.map((business, index) => {
        const imageFirst = index % 2 === 0;
        const { Icon } = business;

        return (
          <section
            key={business.id}
            id={business.id}
            className="section-padding scroll-mt-20 overflow-hidden"
            style={{
              backgroundColor:
                index % 2 === 0 ? "var(--background)" : "var(--surface)",
            }}
          >
            <div className="container-main grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Image */}
              <FadeUp
                x={imageFirst ? -40 : 40}
                className={imageFirst ? "" : "lg:order-2"}
              >
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={business.image}
                    alt={business.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/50 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#ef850f] text-[#0f1a3d] shadow-lg">
                    <Icon size={26} />
                  </span>
                  <span className="absolute bottom-5 right-6 font-heading text-6xl font-semibold text-white/85">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </FadeUp>

              {/* Text */}
              <FadeUp delay={0.1}>
                <p
                  className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
                  style={{ color: "var(--gold-text)" }}
                >
                  <span
                    className="h-px w-8"
                    style={{ background: "var(--gold)" }}
                  />
                  Yusfaith {business.name}
                </p>

                <h2
                  className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl"
                  style={{ color: "var(--foreground)" }}
                >
                  {business.tagline}
                </h2>

                <p
                  className="mt-6 text-base leading-8"
                  style={{ color: "var(--muted)" }}
                >
                  {business.description}
                </p>

                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {business.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-4">
                  <Link
                    href={business.href}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--button-bg)] px-7 py-3.5 text-[15px] font-bold text-[var(--button-text)] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--button-hover-bg)] hover:shadow-lg"
                  >
                    {business.cta}
                    <ArrowUpRight
                      size={18}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] px-7 py-3.5 text-[15px] font-semibold text-[var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--gold)]"
                  >
                    Make an Enquiry
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </FadeUp>
            </div>
          </section>
        );
      })}

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-[#0f1a3d] py-20 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ef850f]/15 blur-3xl" />
        <div className="container-main relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <FadeUp>
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl">
              Not sure where to start?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/85">
              Tell us what you need and the right Yusfaith team will get back
              to you.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Contact Our Team
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}