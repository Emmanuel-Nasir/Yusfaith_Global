
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  MoveUpRight,
} from "lucide-react";

const locations = [
  {
    city: "Abeokuta",
    state: "Ogun State",
    type: "Corporate Head Office",
  },
  {
    city: "Epe",
    state: "Lagos State",
    type: "Business Location",
  },
  {
    city: "Ibadan",
    state: "Oyo State",
    type: "Business Location",
  },
];

export default function CorporateIntroduction() {
  return (
    <section
      id="about-preview"
      className="section-padding overflow-hidden"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="container-main">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75 }}
            className="relative pb-12 pr-8 sm:pb-16 sm:pr-16"
          >
            <div className="relative h-[440px] overflow-hidden rounded-xl sm:h-[550px]">
              <Image
                src="/images/corporate/Headquarters.jpeg"
                alt="Yusfaith Global Enterprises headquarters"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/45 to-transparent" />
            </div>

            <div className="absolute bottom-0 right-0 h-48 w-[52%] overflow-hidden rounded-xl border-[6px] border-[var(--surface)] shadow-2xl sm:h-60">
              <Image
                src="/images/corporate/Headquarters2.jpeg"
                alt="Yusfaith business facilities"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            <div className="absolute left-5 top-5 rounded-md bg-[#101b30]/90 px-5 py-4 text-white shadow-xl backdrop-blur-md sm:left-7 sm:top-7">
              <div className="flex items-center gap-3">
                <Building2 className="text-[#f2c85b]" size={25} />
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[#f2c85b]">
                    OUR PRESENCE
                  </p>
                  <p className="font-heading text-2xl font-semibold">
                    3 Locations
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-1 left-4 h-24 w-24 border-b-2 border-l-2 border-[#d9ad45] sm:left-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <p className="hero-accent mb-5">WHO WE ARE</p>

            <h2
              className="font-heading text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-[60px]"
              style={{ color: "var(--foreground)" }}
            >
              Rooted in Trust.
              <span
                className="mt-1 block"
                style={{ color: "var(--gold-text)" }}
              >
                Driven by Possibility.
              </span>
            </h2>

            <div
              className="mt-7 space-y-5 text-base leading-8"
              style={{ color: "var(--muted)" }}
            >
              <p>
                Yusfaith Global Enterprises is a Nigerian business
                enterprise with activities spanning cement distribution,
                bakery, logistics, real estate, and building materials.
              </p>

              <p>
                With its corporate head office in Abeokuta, Ogun State,
                and additional business locations in Epe and Ibadan,
                Yusfaith is positioned to serve customers, businesses,
                and communities across multiple markets.
              </p>

              <p>
                Our approach is built around dependable service,
                meaningful business relationships, and a commitment
                to delivering value across the sectors in which we
                operate.
              </p>
            </div>

            <div
              className="mt-9 grid gap-5 border-y py-7 sm:grid-cols-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p
                  className="font-heading text-4xl font-semibold"
                  style={{ color: "var(--gold-text)" }}
                >
                  05
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Business Sectors
                </p>
              </div>

              <div>
                <p
                  className="font-heading text-4xl font-semibold"
                  style={{ color: "var(--gold-text)" }}
                >
                  03
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Listed Locations
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center justify-center gap-3 rounded-md border px-7 py-4 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
                borderColor: "var(--gold)",
              }}
            >
              Discover Our Story
              <ArrowUpRight size={19} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="mt-20 border-t pt-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="hero-accent mb-2">OUR PRESENCE</p>
              <h3
                className="font-heading text-3xl font-semibold sm:text-4xl"
                style={{ color: "var(--foreground)" }}
              >
                Serving Across Locations
              </h3>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "var(--gold-text)" }}
            >
              Contact Our Team
              <MoveUpRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {locations.map((location) => (
              <div
                key={location.city}
                className="rounded-lg border p-6 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                }}
              >
                <MapPin
                  size={24}
                  style={{ color: "var(--gold-text)" }}
                />

                <p
                  className="mt-5 font-heading text-3xl font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {location.city}
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {location.state}
                </p>

                <div
                  className="mt-5 border-t pt-4 text-xs font-semibold uppercase tracking-widest"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--gold-text)",
                  }}
                >
                  {location.type}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
