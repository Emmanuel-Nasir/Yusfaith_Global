"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Truck,
} from "lucide-react";

import SpareParts from "@/components/logistics/SpareParts";

/* ---------- helpers ---------- */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LogisticsContent() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#0f1a3d] text-white">
        <Image
          src="/images/logistics/yusfaith-truck-depot.jpeg"
          alt="Yusfaith delivery truck at a warehouse"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/75 to-[#0a1230]/25" />

        <div className="container-main relative z-10 py-28">
          <FadeUp>
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>

            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#ffb347]">
              <Truck size={18} />
              Yusfaith Logistics &amp; Truck Spare Parts
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Our trucks.{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                Our drivers. Your delivery.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              Every Yusfaith delivery is made by our own logistics team, from
              the depot to your location, once your order is confirmed. We also
              sell spare parts for heavy-duty trucks.
            </p>

            <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
              {["On-time delivery", "Customer satisfaction is our priority", "Truck spare parts"].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-white">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Ask About Delivery
              </Link>
              <Link
                href="/logistics/spare-parts"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Shop Truck Spare Parts
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= OUR FLEET (real photos) ================= */}
      <section className="section-padding pb-0">
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <p
              className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
              style={{ color: "var(--gold-text)" }}
            >
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
              Our Fleet
            </p>
            <h2 className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl" style={{ color: "var(--foreground)" }}>
              Our own trucks, on the road every day.
            </h2>
            <p className="mt-5 text-base leading-8" style={{ color: "var(--muted)" }}>
              Every delivery is loaded at our depots and carried by Yusfaith
              trucks and drivers. Our fleet is maintained to strict standards
              for safety, reliability and on-time delivery.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
            {[
              { src: "/images/logistics/yusfaith-truck-loaded.jpeg", alt: "A loaded Yusfaith truck leaving the depot", big: true },
              { src: "/images/logistics/yusfaith-truck-front.jpeg", alt: "Yusfaith truck at the depot" },
              { src: "/images/logistics/yusfaith-truck-yard.jpeg", alt: "Truck loaded and covered in the depot yard" },
              { src: "/images/corporate/yusfaith-depot-truck.jpeg", alt: "Head office and depot with a Yusfaith truck" },
              { src: "/images/cement/stock-warehouse.jpeg", alt: "Cement stock ready for delivery" },
            ].map((photo, index) => (
              <FadeUp
                key={photo.src}
                delay={index * 0.06}
                className={photo.big ? "col-span-2 row-span-2" : ""}
              >
                <div className={`group relative overflow-hidden rounded-2xl ${photo.big ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={photo.big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SPARE PARTS ================= */}
      <SpareParts />

      {/* Staff tools (Dispatch Centre) are in the staff area: Admin → Logistics */}
        <section className="section-padding">
          <div className="container-main max-w-3xl text-center">
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
              Need goods delivered?
            </h2>
            <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
              Order from any Yusfaith business and our logistics team handles
              the delivery. Talk to us about delivery to your location.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Contact Our Team
            </Link>
          </div>
        </section>
    </main>
  );
}