"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Eye, MapPin, Target } from "lucide-react";
import {
  BUSINESSES,
  CORE_VALUES,
  LEADERSHIP,
  LOCATIONS,
  MISSION,
  VISION,
} from "@/data/company";

const BUSINESS_IMAGES: Record<string, string> = {
  "/cement": "/images/cement/Epe warehouse.jpeg",
  "/building-materials": "/images/building-materials/materials-warehouse.jpg",
  "/logistics": "/images/logistics/yusfaith-truck-depot.jpeg",
  "/real-estate": "/images/real-estate/real-estate-hero.jpg",
  "/bakery": "/images/bakery/product-bread-assortment.jpg",
};

const BRANDS = [
  { name: "Dangote", image: "/images/cement/dangote-3x-large.png" },
  { name: "HBM", image: "/images/cement/hbm-classic.png" },
  { name: "BUA", image: "/images/cement/bua-cement.png" },
  { name: "Mangal", image: "/images/cement/mangal-cement.png" },
  { name: "Purechem", image: "/images/cement/purechem-cement.png" },
];

const GALLERY = [
  { src: "/images/corporate/Headquarters.jpeg", alt: "Yusfaith head office" },
  { src: "/images/corporate/Headquarters2.jpeg", alt: "Head office on the Lagos-Abeokuta Expressway" },
  { src: "/images/cement/Epe warehouse2.jpeg", alt: "Cement stocked at the Epe store" },
  { src: "/images/cement/Epe warehouse3.jpeg", alt: "Epe office with Yusfaith signage" },
];

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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl"
      style={{ color: "var(--foreground)" }}
    >
      {children}
    </h2>
  );
}

export default function HomeContent() {
  const [ceo, ...team] = LEADERSHIP;

  return (
    <>
      {/* ================= WHO WE ARE ================= */}
      <section className="section-padding overflow-hidden">
        <div className="container-main grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <FadeUp>
            <Eyebrow>Who We Are</Eyebrow>
            <Title>
              A Nigerian group,{" "}
              <span style={{ color: "var(--gold-text)" }}>built on trust.</span>
            </Title>
            <p className="mt-7 text-base leading-8" style={{ color: "var(--muted)" }}>
              Yusfaith Global Enterprises is a group of five businesses:
              cement distribution, building materials, logistics, real estate
              and a bakery. From our head office in Abeokuta and our offices
              in Epe and Ibadan, we serve builders, retailers and families
              with trusted products and our own delivery team.
            </p>

            <div
              className="mt-9 grid grid-cols-3 gap-4 border-y py-7"
              style={{ borderColor: "var(--border)" }}
            >
              {[
                { value: "5", label: "Businesses" },
                { value: "3", label: "Locations" },
                { value: "5", label: "Cement brands" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-4xl font-semibold sm:text-5xl" style={{ color: "var(--gold-text)" }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-[var(--button-bg)] px-8 py-4 text-[15px] font-bold text-[var(--button-text)] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--button-hover-bg)]"
            >
              Our Story
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/corporate/Headquarters2.jpeg"
                alt="Yusfaith Global Enterprises head office"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= OUR BUSINESSES ================= */}
      <section
        id="businesses"
        className="section-padding scroll-mt-20"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>Our Businesses</Eyebrow>
            <Title>Five businesses, one Yusfaith.</Title>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUSINESSES.map((business, index) => (
              <FadeUp key={business.href} delay={(index % 3) * 0.08}>
                <Link
                  href={business.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={BUSINESS_IMAGES[business.href]}
                      alt={business.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                      {business.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                      {business.description}
                    </p>
                    <span
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
                      style={{ color: "var(--gold-text)" }}
                    >
                      Explore
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CEMENT BRANDS ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>Cement Depot</Eyebrow>
            <Title>Five cement brands, one depot.</Title>
            <p className="mt-5 leading-8" style={{ color: "var(--muted)" }}>
              Order Dangote, HBM, BUA, Mangal and Purechem cement, wholesale or
              retail, for delivery by our own trucks or pickup from our depots.
            </p>
          </FadeUp>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {BRANDS.map((brand, index) => (
              <FadeUp key={brand.name} delay={index * 0.06}>
                <Link
                  href="/cement/order"
                  className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-lg"
                >
                  <div className="relative aspect-square bg-[var(--surface)]">
                    <Image
                      src={brand.image}
                      alt={`${brand.name} cement`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="py-3 text-center font-bold" style={{ color: "var(--foreground)" }}>
                    {brand.name}
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-10">
            <Link
              href="/cement"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Visit Cement Depot
              <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ================= VISION, MISSION, VALUES ================= */}
      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main">
          <FadeUp className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Our Purpose</Eyebrow>
            </div>
            <Title>Vision, mission and values</Title>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              { title: "Our Vision", text: VISION, Icon: Eye },
              { title: "Our Mission", text: MISSION, Icon: Target },
            ].map(({ title, text, Icon }, index) => (
              <FadeUp key={title} delay={index * 0.1}>
                <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--surface)]" style={{ color: "var(--gold-text)" }}>
                    <Icon size={26} />
                  </span>
                  <h3 className="mt-6 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {title}
                  </h3>
                  <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
                    {text}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {CORE_VALUES.map((value, index) => (
              <FadeUp key={value.title} delay={index * 0.06}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-center">
                  <p className="font-heading text-3xl font-semibold" style={{ color: "var(--gold-text)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-bold" style={{ color: "var(--foreground)" }}>
                    {value.title}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Our Leadership</Eyebrow>
              <Title>The people behind Yusfaith</Title>
            </div>
            <Link
              href="/about#leadership"
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ color: "var(--gold-text)" }}
            >
              Meet the team
              <ArrowRight size={16} />
            </Link>
          </FadeUp>

          <FadeUp>
            <article className="grid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] md:grid-cols-[2fr_3fr]">
              <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[380px]">
                <Image
                  src={ceo.image}
                  alt={`${ceo.name}, ${ceo.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <span className="w-fit rounded-full bg-[var(--background)] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--gold-text)" }}>
                  {ceo.role}
                </span>
                <h3 className="mt-5 font-heading text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: "var(--foreground)" }}>
                  {ceo.name}
                </h3>
              </div>
            </article>
          </FadeUp>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {team.map((person, index) => (
              <FadeUp key={person.name} delay={(index % 6) * 0.05}>
                <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={person.image}
                      alt={`${person.name}, ${person.role}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--gold-text)" }}>
                      {person.role}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-5" style={{ color: "var(--foreground)" }}>
                      {person.name}
                    </p>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="section-padding" style={{ backgroundColor: "var(--surface)" }}>
        <div className="container-main">
          <FadeUp className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Operations</Eyebrow>
              <Title>Where we work</Title>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ color: "var(--gold-text)" }}
            >
              See the gallery
              <ArrowRight size={16} />
            </Link>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GALLERY.map((photo, index) => (
              <FadeUp key={photo.src} delay={index * 0.06}>
                <Link href="/projects" className="group relative block aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <Eyebrow>Where to Find Us</Eyebrow>
            <Title>Our locations</Title>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-3">
            {LOCATIONS.map((location, index) => (
              <FadeUp key={location.city} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
                  <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--gold-text)" }}>
                    {location.label}
                  </span>
                  <h3 className="mt-3 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {location.city}
                  </h3>
                  <p className="mt-3 flex gap-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
                    <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
                    {location.address}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-[#0f1a3d] py-20 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ef850f]/15 blur-3xl" />
        <div className="container-main relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <FadeUp>
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl">
              Let us build something <span className="text-[#ff9a26]">together.</span>
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
              <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
            >
              Our Businesses
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}