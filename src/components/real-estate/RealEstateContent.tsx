"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarCheck,
  Check,
  CheckCircle2,
  Home,
  MapPin,
  MessageCircle,
  Ruler,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  CITIES,
  LISTINGS,
  PROPERTY_TYPES,
  type Listing,
} from "@/lib/real-estate/listings";
import { WHATSAPP_NUMBER } from "@/data/company";
import { formatNaira } from "@/lib/orders";

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

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const PRICE_RANGES = [
  { label: "Any price", max: Infinity },
  { label: "Up to ₦5M", max: 5_000_000 },
  { label: "Up to ₦20M", max: 20_000_000 },
  { label: "Up to ₦50M", max: 50_000_000 },
  { label: "Up to ₦100M", max: 100_000_000 },
];

const STATUS_STYLES: Record<Listing["status"], string> = {
  "For Sale": "bg-[#ef850f] text-[#0f1a3d]",
  "For Rent": "bg-[#2263a3] text-white",
  "Off-plan": "bg-white text-[#0f1a3d]",
};

function priceLabel(listing: Listing) {
  return `${formatNaira(listing.price)}${listing.priceNote ? ` ${listing.priceNote}` : ""}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- component ---------- */

export default function RealEstateContent() {
  const [type, setType] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selected, setSelected] = useState<Listing | null>(null);

  const results = useMemo(
    () =>
      LISTINGS.filter(
        (l) =>
          (type === "All" || l.type === type) &&
          (city === "All" || l.city === city) &&
          l.price <= maxPrice
      ),
    [type, city, maxPrice]
  );

  function resetFilters() {
    setType("All");
    setCity("All");
    setMaxPrice(Infinity);
  }

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#0f1a3d] text-white">
        <Image
          src="/images/real-estate/real-estate-hero.jpg"
          alt="Modern residential property"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/75 to-[#0a1230]/20" />

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
              <Home size={18} />
              Yusfaith Real Estate
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Spaces for today.{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                Value for tomorrow.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              Homes, apartments and land across Ogun, Lagos and Oyo States. Find a
              property and book an inspection with our team.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#listings"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                View Properties
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Talk to Our Team
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="relative z-10 -mt-10">
        <div className="container-main">
          <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                Property type
              </span>
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                Location
              </span>
              <select className={inputClass} value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="All">All locations</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                Budget
              </span>
              <select
                className={inputClass}
                value={String(maxPrice)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.label} value={String(r.max)}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 self-end rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* ================= LISTINGS ================= */}
      <section id="listings" className="section-padding scroll-mt-20">
        <div className="container-main">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold-text)" }}>
                Available Properties
              </p>
              <h2 className="font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
                {results.length} {results.length === 1 ? "property" : "properties"} found
              </h2>
            </div>
            <p className="max-w-sm text-sm" style={{ color: "var(--muted)" }}>
              Sample listings for this demo. Yusfaith&apos;s real properties and
              prices will replace them.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
              <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                No properties match those filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 text-sm font-bold underline-offset-4 hover:underline"
                style={{ color: "var(--gold-text)" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((listing) => (
                  <motion.button
                    layout
                    key={listing.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelected(listing)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] text-left transition-shadow hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[listing.status]}`}>
                        {listing.status}
                      </span>
                      <span className="absolute bottom-3 left-3 rounded-lg bg-[#0f1a3d]/85 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                        {priceLabel(listing)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
                        <MapPin size={15} style={{ color: "var(--gold-text)" }} />
                        {listing.city} · {listing.type}
                      </p>
                      <h3 className="mt-2 text-lg font-bold" style={{ color: "var(--foreground)" }}>
                        {listing.title}
                      </h3>
                      <p className="mt-1 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                        {listing.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--border)] pt-4 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {listing.bedrooms && (
                          <span className="flex items-center gap-1.5">
                            <BedDouble size={16} style={{ color: "var(--gold-text)" }} />
                            {listing.bedrooms} beds
                          </span>
                        )}
                        {listing.bathrooms && (
                          <span className="flex items-center gap-1.5">
                            <Bath size={16} style={{ color: "var(--gold-text)" }} />
                            {listing.bathrooms} baths
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Ruler size={16} style={{ color: "var(--gold-text)" }} />
                          {listing.size}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main grid gap-10 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/real-estate/real-estate-development.jpg"
                alt="A Yusfaith-style property under construction"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold-text)" }}>
              Why Yusfaith Real Estate
            </p>
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl" style={{ color: "var(--foreground)" }}>
              Built on our construction supply experience.
            </h2>
            <ul className="mt-7 space-y-4">
              {[
                "Backed by a building materials distributor of Dangote and HBM cement",
                "Inspections arranged with our team before you commit",
                "Homes for sale and rent, land, and off-plan options",
                "Presence across Ogun, Lagos, Oyo and Osun States",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] font-medium" style={{ color: "var(--foreground)" }}>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ================= PROPERTY DETAIL ================= */}
      <AnimatePresence>
        {selected && (
          <PropertyDetail listing={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------- Property detail + inspection form ---------- */

function PropertyDetail({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function book(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(cleanPhone))
      return setError("Enter a valid Nigerian phone number, e.g. 08012345678.");
    if (!date) return setError("Please choose a preferred date.");
    setError("");
    setBooked(true);
  }

  const whatsappText = encodeURIComponent(
    `Hello Yusfaith Real Estate, I would like to inspect "${listing.title}" in ${listing.city} (${priceLabel(listing)}).` +
      (name ? `\nName: ${name.trim()}` : "") +
      (phone ? `\nPhone: ${phone.trim()}` : "") +
      (date ? `\nPreferred date: ${date}` : "")
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={listing.title}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-[var(--background)] sm:rounded-3xl"
      >
        <div className="grid lg:grid-cols-[3fr_2fr]">
          {/* Gallery */}
          <div className="p-4 sm:p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={listing.images[imageIndex]}
                alt={`${listing.title}, photo ${imageIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[listing.status]}`}>
                {listing.status}
              </span>
            </div>
            <div className="mt-3 flex gap-3">
              {listing.images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  className={`relative h-20 w-28 overflow-hidden rounded-xl border-2 transition ${
                    index === imageIndex ? "border-[#ef850f]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="112px" className="object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-6 px-1">
              <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
                <MapPin size={15} style={{ color: "var(--gold-text)" }} />
                {listing.city} · {listing.type} · {listing.size}
              </p>
              <h2 className="mt-2 font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
                {listing.title}
              </h2>
              <p className="mt-2 text-2xl font-bold" style={{ color: "var(--gold-text)" }}>
                {priceLabel(listing)}
              </p>
              <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
                {listing.summary}
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {listing.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    <Check size={16} className="text-[#ef850f]" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inspection booking */}
          <div className="relative border-t border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)] transition hover:bg-[#ef850f] hover:text-[#0f1a3d]"
            >
              <X size={20} />
            </button>

            {booked ? (
              <div className="pt-8 text-center">
                <CheckCircle2 size={52} className="mx-auto text-[#ef850f]" />
                <h3 className="mt-4 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                  Inspection requested
                </h3>
                <p className="mt-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                  <strong style={{ color: "var(--foreground)" }}>Demo only:</strong>{" "}
                  this request has not been sent. To reach the team now, send it
                  on WhatsApp:
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
                >
                  <MessageCircle size={18} />
                  Send on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={book} noValidate>
                <h3 className="flex items-center gap-2 pr-10 text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  <CalendarCheck size={22} style={{ color: "var(--gold-text)" }} />
                  Book an inspection
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Choose a date and our team will confirm a time with you.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Your name *
                    </span>
                    <input className={inputClass} value={name} onChange={(e) => { setName(e.target.value); setError(""); }} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Phone number *
                    </span>
                    <input className={inputClass} type="tel" placeholder="08012345678" value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} autoComplete="tel" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Preferred date *
                    </span>
                    <input className={inputClass} type="date" min={todayISO()} value={date} onChange={(e) => { setDate(e.target.value); setError(""); }} />
                  </label>
                </div>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-4 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                >
                  Request Inspection
                </button>
                <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>
                  Demo form: requests are not sent yet.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}