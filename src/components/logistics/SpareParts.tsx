"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, PackageSearch } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/company";
import { formatNaira } from "@/lib/orders";
import {
  CATEGORY_IMAGES,
  PART_CATEGORIES,
  SPARE_PARTS,
} from "@/lib/logistics/spare-parts";

const ENQUIRY = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Yusfaith Logistics, I am looking for a truck spare part that is not on your website.\nTruck make and model: \nPart needed: "
)}`;

/* Truck spare parts preview on the Logistics page; the store is /logistics/spare-parts */
export default function SpareParts() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="spare-parts" className="section-padding scroll-mt-20">
      <div className="container-main">
        <div className="mb-10 grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-end">
          <div>
            <p
              className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
              style={{ color: "var(--gold-text)" }}
            >
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
              Truck Spare Parts
            </p>
            <h2
              className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              The parts that keep trucks moving.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8" style={{ color: "var(--muted)" }}>
              We run our own fleet, so we know what keeps a truck on the road.
              Order spare parts for heavy-duty trucks online, the same way as
              cement and building materials, and our team delivers them or has
              them ready for pickup.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/logistics/spare-parts"
              className="group inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-7 py-3.5 text-sm font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Shop Spare Parts
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/logistics/spare-parts/track"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
            >
              <PackageSearch size={17} style={{ color: "var(--gold-text)" }} />
              Track a parts order
            </Link>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PART_CATEGORIES.map((category, index) => {
            const parts = SPARE_PARTS.filter((p) => p.category === category);
            const from = Math.min(...parts.map((p) => p.price));
            return (
              <motion.div
                key={category}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
              >
                <Link
                  href="/logistics/spare-parts"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={CATEGORY_IMAGES[category]}
                      alt={category}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
                      {parts.map((p) => p.name).join(", ")}
                    </p>
                    <p className="mt-4 text-sm font-bold" style={{ color: "var(--gold-text)" }}>
                      {parts.length} parts · from {formatNaira(from)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm" style={{ color: "var(--muted)" }}>
          Prices are rough estimates and are confirmed by our team before you pay.
          Can&apos;t find a part?
          <a
            href={ENQUIRY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold"
            style={{ color: "var(--gold-text)" }}
          >
            <MessageCircle size={15} />
            Ask us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
