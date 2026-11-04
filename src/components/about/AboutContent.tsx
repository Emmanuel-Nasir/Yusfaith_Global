"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import {
  AWARD_IMAGES,
  BUSINESSES,
  COMPANY,
  CORE_VALUES,
  LEADERSHIP,
  LOCATIONS,
  MISSION,
  VISION,
} from "@/data/company";

const VALUE_ICONS = [HeartHandshake, Briefcase, Scale, ShieldCheck, Users];

/* Fade-up on scroll, shared by every section */
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
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Small orange label above each section heading */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
      style={{ color: "var(--gold-text)" }}
    >
      <span className="h-px w-8" style={{ background: "var(--gold)" }} />
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </h2>
  );
}

function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

export default function AboutContent() {
  const [ceo, ...team] = LEADERSHIP;

  // Award lightbox
  const [openAward, setOpenAward] = useState<number | null>(null);

  const closeAward = useCallback(() => setOpenAward(null), []);
  const showNext = useCallback(
    () =>
      setOpenAward((i) => (i === null ? i : (i + 1) % AWARD_IMAGES.length)),
    []
  );
  const showPrevious = useCallback(
    () =>
      setOpenAward((i) =>
        i === null ? i : (i - 1 + AWARD_IMAGES.length) % AWARD_IMAGES.length
      ),
    []
  );

  useEffect(() => {
    if (openAward === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeAward();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openAward, closeAward, showNext, showPrevious]);

  return (
    <main>
      {/* ================= PAGE HEADER ================= */}
      <section className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-[#0f1a3d] text-white sm:min-h-[520px]">
        <Image
          src="/images/corporate/Headquarters.jpeg"
          alt="Yusfaith Global Enterprises corporate head office in Abeokuta"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/75 to-[#0a1230]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/80 via-transparent to-transparent" />

        <div className="container-main relative z-10 pb-16 pt-32 sm:pb-20">
          <FadeUp>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
              <Link href="/" className="transition hover:text-[#ff9a26]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">About Us</span>
            </nav>

            <h1 className="font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              About{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                Yusfaith
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              {COMPANY.tagline}. A Nigerian enterprise with a corporate head
              office in Abeokuta and offices in Epe and Ibadan.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="section-padding overflow-hidden">
        <div className="container-main grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <FadeUp className="relative pb-10 pr-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/corporate/Headquarters2.jpeg"
                alt="Yusfaith Global Enterprises head office building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 right-0 w-[48%] overflow-hidden rounded-2xl border-[6px] shadow-2xl"
              style={{ borderColor: "var(--background)" }}
            >
              <div className="relative aspect-square">
                <Image
                  src="/images/corporate/Headquarters figurine.jpeg"
                  alt="Model of the Yusfaith Cement head office"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <Eyebrow>Who We Are</Eyebrow>
            <SectionTitle>
              Rooted in Trust.{" "}
              <span className="block" style={{ color: "var(--gold-text)" }}>
                Built to Serve.
              </span>
            </SectionTitle>

            <div
              className="mt-7 space-y-5 text-base leading-8"
              style={{ color: "var(--muted)" }}
            >
              <p>
                Yusfaith Global Enterprises is a Nigerian business enterprise
                and a distributor of HBM and Dangote cement, serving both
                wholesale and retail customers.
              </p>
              <p>
                From our corporate head office on the Lagos–Abeokuta
                Expressway and our offices in Epe and Ibadan, we supply
                building materials, deliver orders with our own logistics
                team, and are growing into real estate and bakery.
              </p>
              <p>
                Everything we do is guided by our core values: trust in God,
                professionalism, prudency, integrity and teamwork.
              </p>
            </div>

            <div
              className="mt-9 grid grid-cols-3 gap-4 border-y py-7"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                { value: "5", label: "Businesses" },
                { value: "3", label: "Locations" },
                { value: "2", label: "Cement brands" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-heading text-4xl font-semibold sm:text-5xl"
                    style={{ color: "var(--gold-text)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Our Purpose</Eyebrow>
            </div>
            <SectionTitle>Vision &amp; Mission</SectionTitle>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { title: "Our Vision", text: VISION, Icon: Eye },
              { title: "Our Mission", text: MISSION, Icon: Target },
            ].map(({ title, text, Icon }, index) => (
              <FadeUp key={title} delay={index * 0.1}>
                <article
                  className="group relative h-full overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: "var(--gold)" }}
                  />
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--gold-text)",
                    }}
                  >
                    <Icon size={26} />
                  </span>
                  <h3
                    className="mt-6 font-heading text-3xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-4 text-base leading-8"
                    style={{ color: "var(--muted)" }}
                  >
                    {text}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>What Guides Us</Eyebrow>
            <SectionTitle>Our Core Values</SectionTitle>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_VALUES.map((value, index) => {
              const Icon = VALUE_ICONS[index];

              return (
                <FadeUp key={value.title} delay={index * 0.08}>
                  <article
                    className="group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)] text-[var(--gold-text)] transition-colors duration-300 group-hover:bg-[var(--gold)] group-hover:text-[#0f1a3d]"
                      >
                        <Icon size={22} />
                      </span>
                      <span
                        className="font-heading text-3xl font-semibold opacity-40"
                        style={{ color: "var(--muted)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3
                      className="mt-6 text-lg font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {value.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-6"
                      style={{ color: "var(--muted)" }}
                    >
                      {value.description}
                    </p>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP ================= */}
      <section
        id="leadership"
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>Our Leadership</Eyebrow>
            <SectionTitle>The People Behind Yusfaith</SectionTitle>
          </FadeUp>

          {/* CEO feature */}
          <FadeUp>
            <article
              className="grid overflow-hidden rounded-2xl border shadow-sm md:grid-cols-[2fr_3fr]"
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[420px]">
                <Image
                  src={ceo.image}
                  alt={`${ceo.name}, ${ceo.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <span
                  className="w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--gold-text)",
                  }}
                >
                  {ceo.role}
                </span>
                <h3
                  className="mt-5 font-heading text-4xl font-semibold leading-tight sm:text-5xl"
                  style={{ color: "var(--foreground)" }}
                >
                  {ceo.name}
                </h3>
                <p
                  className="mt-5 max-w-lg text-base leading-8"
                  style={{ color: "var(--muted)" }}
                >
                  Leads Yusfaith Global Enterprises across its cement
                  distribution, building materials, logistics, real estate
                  and bakery businesses.
                </p>
              </div>
            </article>
          </FadeUp>

          {/* Management team */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person, index) => (
              <FadeUp key={person.name} delay={(index % 3) * 0.08}>
                <article
                  className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={person.image}
                      alt={`${person.name}, ${person.role}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6">
                    <p
                      className="text-xs font-bold uppercase tracking-[0.15em]"
                      style={{ color: "var(--gold-text)" }}
                    >
                      {person.role}
                    </p>
                    <h3
                      className="mt-2 text-xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {person.name}
                    </h3>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RECOGNITION ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>Recognition</Eyebrow>
            <SectionTitle>Awards &amp; Honours</SectionTitle>
            <p
              className="mt-5 text-base leading-8"
              style={{ color: "var(--muted)" }}
            >
              Awards presented to Yusfaith Global Enterprises and its
              leadership. Select any award to view it larger.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {AWARD_IMAGES.map((src, index) => (
              <FadeUp key={src} delay={(index % 4) * 0.06}>
                <button
                  type="button"
                  onClick={() => setOpenAward(index)}
                  aria-label={`View award ${index + 1} of ${AWARD_IMAGES.length}`}
                  className="group relative block aspect-square w-full overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Image
                    src={src}
                    alt={`Award presented to Yusfaith Global Enterprises (${index + 1})`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-[#0f1a3d]/0 transition-colors duration-300 group-hover:bg-[#0f1a3d]/45">
                    <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowUpRight size={20} />
                    </span>
                  </span>
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR BUSINESSES ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>What We Do</Eyebrow>
            <SectionTitle>Our Businesses</SectionTitle>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {BUSINESSES.map((business, index) => (
              <FadeUp key={business.href} delay={index * 0.06}>
                <Link
                  href={business.href}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-lg"
                >
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {business.name}
                  </h3>
                  <p
                    className="mt-2 flex-1 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {business.description}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: "var(--gold-text)" }}
                  >
                    Explore
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>Where to Find Us</Eyebrow>
            <SectionTitle>Our Locations</SectionTitle>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-3">
            {LOCATIONS.map((location, index) => (
              <FadeUp key={location.city} delay={index * 0.08}>
                <article
                  className="flex h-full flex-col rounded-2xl border p-7"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--gold-text)",
                    }}
                  >
                    {location.label}
                  </span>
                  <h3
                    className="mt-5 font-heading text-3xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {location.city}
                    <span
                      className="ml-2 text-base font-medium"
                      style={{
                        color: "var(--muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {location.state}
                    </span>
                  </h3>
                  <p
                    className="mt-4 flex flex-1 gap-3 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--gold-text)" }}
                    />
                    {location.address}
                  </p>
                  <a
                    href={mapsLink(location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: "var(--gold-text)" }}
                  >
                    Open in Google Maps
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-8">
            <div
              className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border px-7 py-5 text-sm"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 font-medium transition hover:text-[var(--gold-text)]"
              >
                <Mail size={17} style={{ color: "var(--gold-text)" }} />
                {COMPANY.email}
              </a>
              <a
                href={`tel:+234${COMPANY.officeLine.slice(1)}`}
                className="inline-flex items-center gap-2 font-medium transition hover:text-[var(--gold-text)]"
              >
                <Phone size={17} style={{ color: "var(--gold-text)" }} />
                Office: {COMPANY.officeLine}
              </a>
              {COMPANY.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:+234${phone.slice(1)}`}
                  className="inline-flex items-center gap-2 font-medium transition hover:text-[var(--gold-text)]"
                >
                  <Phone size={17} style={{ color: "var(--gold-text)" }} />
                  {phone}
                </a>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-[#0f1a3d] py-20 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ef850f]/15 blur-3xl" />
        <div className="container-main relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <FadeUp>
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl">
              Let&apos;s build something{" "}
              <span className="text-[#ff9a26]">together.</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/85">
              Talk to our team about cement, building materials, deliveries or
              any of our businesses.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Contact Us
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/#businesses"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0f1a3d]"
            >
              Explore Our Businesses
              <ArrowRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ================= AWARD LIGHTBOX ================= */}
      {openAward !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Award photo"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closeAward}
        >
          <button
            type="button"
            onClick={closeAward}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d]"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous award"
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d] sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={AWARD_IMAGES[openAward]}
              alt={`Award presented to Yusfaith Global Enterprises (${openAward + 1})`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next award"
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d] sm:right-8"
          >
            <ChevronRight size={24} />
          </button>

          <p className="absolute bottom-6 text-sm tracking-widest text-white/80">
            {openAward + 1} / {AWARD_IMAGES.length}
          </p>
        </div>
      )}
    </main>
  );
}