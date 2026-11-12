"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BatteryCharging,
  CircleDot,
  Cog,
  Disc3,
  Droplets,
  Filter,
  MessageCircle,
  Phone,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { LOGISTICS_PHONE, WHATSAPP_NUMBER, telLink } from "@/data/company";
import {
  PART_CATEGORIES,
  SPARE_PARTS,
  type PartCategory,
  type SparePart,
} from "@/lib/logistics/spare-parts";

const ICONS: Record<PartCategory, LucideIcon> = {
  "Engine & Filters": Filter,
  Brakes: Disc3,
  "Clutch & Transmission": Cog,
  "Suspension & Steering": Wrench,
  "Electrical & Lighting": BatteryCharging,
  "Tyres & Wheels": CircleDot,
  "Oils & Lubricants": Droplets,
  "Body & Accessories": Shield,
};

function whatsappFor(part?: SparePart) {
  const text = part
    ? `Hello Yusfaith Logistics, I would like the price and availability of: ${part.name}.\nTruck make and model: `
    : "Hello Yusfaith Logistics, I am looking for truck spare parts.\nTruck make and model: \nPart needed: ";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function SpareParts() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<"All" | PartCategory>("All");

  const parts = useMemo(
    () => (filter === "All" ? SPARE_PARTS : SPARE_PARTS.filter((p) => p.category === filter)),
    [filter]
  );

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
              Yusfaith Logistics sells spare parts for heavy-duty trucks to
              fleet owners, transporters and drivers. Tell us your truck make,
              model and the part you need, and our team will confirm price and
              availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a
              href={whatsappFor()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 text-sm font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              <MessageCircle size={18} />
              Enquire on WhatsApp
            </a>
            <a
              href={telLink(LOGISTICS_PHONE)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
            >
              <Phone size={18} style={{ color: "var(--gold-text)" }} />
              {LOGISTICS_PHONE}
            </a>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(["All", ...PART_CATEGORIES] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                filter === category
                  ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                  : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Parts */}
        <motion.div layout={!reduceMotion} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {parts.map((part) => {
            const Icon = ICONS[part.category];
            return (
              <motion.article
                layout={!reduceMotion}
                key={part.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] transition-colors group-hover:bg-[#ef850f]" style={{ color: "var(--gold-text)" }}>
                    <Icon size={20} className="group-hover:text-[#0f1a3d]" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
                      {part.category}
                    </span>
                    <span className="mt-0.5 block font-bold leading-snug" style={{ color: "var(--foreground)" }}>
                      {part.name}
                    </span>
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  {part.description}
                </p>
                <a
                  href={whatsappFor(part)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold"
                  style={{ color: "var(--gold-text)" }}
                >
                  <MessageCircle size={15} />
                  Ask for price
                </a>
              </motion.article>
            );
          })}
        </motion.div>

        <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
          Prices are confirmed by our team on enquiry. Availability depends on
          your truck make and model.
        </p>
      </div>
    </section>
  );
}
