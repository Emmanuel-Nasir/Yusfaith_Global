"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  MapPin,
  PackageCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { LOCATIONS } from "@/data/company";

export type LandingItem = { name: string; text: string; image: string };

export type LandingConfig = {
  eyebrow: string;
  headline: string;
  highlight: string;
  intro: string;
  heroImage: string;
  heroAlt: string;
  orderHref: string;
  trackHref: string;
  listEyebrow: string;
  listTitle: string;
  listIntro: string;
  items: LandingItem[];
  imageFit: "cover" | "contain";
};

const STEPS = [
  {
    Icon: ClipboardList,
    title: "Choose your products",
    text: "Pick products and quantities. Type any quantity for bulk orders.",
  },
  {
    Icon: Wallet,
    title: "Check out",
    text: "Choose delivery or pickup, pay by bank transfer and upload your receipt.",
  },
  {
    Icon: PackageCheck,
    title: "We confirm and prepare",
    text: "Our accounts team confirms your transfer, and your order is prepared.",
  },
  {
    Icon: Truck,
    title: "Delivered or collected",
    text: "Our own trucks and drivers deliver to your site, or you collect from the depot.",
  },
];

const PAYMENT_TERMS = [
  {
    title: "1. Transfer",
    text: "Place your order and pay the total by bank transfer, using your order reference as the narration.",
  },
  {
    title: "2. Upload your receipt",
    text: "Upload your transfer receipt straight after paying. It is required before we process your order.",
  },
  {
    title: "3. We confirm and deliver",
    text: "Our accounts team confirms the payment, then your order is dispatched or made ready for pickup.",
  },
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em]"
      style={{ color: "var(--gold-text)" }}
    >
      <span className="h-px w-8" style={{ background: "var(--gold)" }} />
      {children}
    </p>
  );
}

export default function DepotLanding({ config }: { config: LandingConfig }) {
  const itemImageClass =
    config.imageFit === "contain"
      ? "object-contain p-6 transition-transform duration-700 group-hover:scale-105"
      : "object-cover transition-transform duration-700 group-hover:scale-105";

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#0f1a3d] text-white">
        <Image
          src={config.heroImage}
          alt={config.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/80 to-[#0a1230]/30" />

        <div className="container-main relative z-10 py-28">
          <FadeUp>
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffb347]">
              {config.eyebrow}
            </p>

            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              {config.headline}{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                {config.highlight}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
              {config.intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={config.orderHref}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Order Now
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={config.trackHref}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
              >
                Track an Order
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= BRANDS / CATEGORIES ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <Eyebrow>{config.listEyebrow}</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              {config.listTitle}
            </h2>
            <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
              {config.listIntro}
            </p>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {config.items.map((item, index) => (
              <FadeUp key={item.name} delay={(index % 3) * 0.08}>
                <Link
                  href={config.orderHref}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-[var(--surface)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={itemImageClass}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="mt-2 flex-1 text-sm leading-6"
                      style={{ color: "var(--muted)" }}
                    >
                      {item.text}
                    </p>
                    <span
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
                      style={{ color: "var(--gold-text)" }}
                    >
                      Order now
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW ORDERING WORKS ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>How It Works</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              From order to delivery
            </h2>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, text }, index) => (
              <FadeUp key={title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Icon size={24} />
                  </span>
                  <p
                    className="mt-5 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--gold-text)" }}
                  >
                    Step {index + 1}
                  </p>
                  <h3
                    className="mt-1 text-lg font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PAYMENT TERMS ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <Eyebrow>Payment</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              How payment works
            </h2>
            <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
              Online orders are paid by bank transfer before dispatch or pickup.
              There is no payment on delivery. Prices are set by Yusfaith staff,
              and delivery is charged separately.
            </p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {PAYMENT_TERMS.map((term, index) => (
              <FadeUp key={term.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {term.title}
                  </h3>
                  <p
                    className="mt-3 leading-7"
                    style={{ color: "var(--muted)" }}
                  >
                    {term.text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DEPOTS ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <Eyebrow>Where to Find Us</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Our locations
            </h2>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {LOCATIONS.map((location, index) => (
              <FadeUp key={location.city} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--background)] p-7">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ color: "var(--gold-text)" }}
                  >
                    {location.label}
                  </span>
                  <h3
                    className="mt-3 font-heading text-3xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {location.state}
                  </h3>
                  <p
                    className="mt-3 flex gap-3 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--gold-text)" }}
                    />
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
              Ready to place an order?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/85">
              Choose your products online, or speak to our team.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="flex flex-wrap gap-4">
            <Link
              href={config.orderHref}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Order Now
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0f1a3d]"
            >
              Contact Us
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}