"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Expand,
  PackageCheck,
  Truck,
  Wallet,
  X,
} from "lucide-react";

/* Real Yusfaith photographs only */
const CATEGORIES = ["All", "Head Office", "Fleet & Stock", "Lagos State Depot", "Recognition"] as const;
type Category = (typeof CATEGORIES)[number];

const PHOTOS: { src: string; title: string; category: Exclude<Category, "All"> }[] = [
  {
    src: "/images/corporate/Headquarters.jpeg",
    title: "Corporate head office, Abeokuta",
    category: "Head Office",
  },
  {
    src: "/images/corporate/Headquarters2.jpeg",
    title: "Head office on the Lagos–Abeokuta Expressway",
    category: "Head Office",
  },
  {
    src: "/images/corporate/Ceo's office.jpeg",
    title: "CEO's office and award cabinet",
    category: "Head Office",
  },
  {
    src: "/images/corporate/yusfaith-depot-truck.jpeg",
    title: "Head office and depot with a Yusfaith truck",
    category: "Head Office",
  },
  {
    src: "/images/logistics/yusfaith-truck-loaded.jpeg",
    title: "A loaded truck leaving the depot",
    category: "Fleet & Stock",
  },
  {
    src: "/images/logistics/yusfaith-truck-depot.jpeg",
    title: "Yusfaith truck at the warehouse",
    category: "Fleet & Stock",
  },
  {
    src: "/images/logistics/yusfaith-truck-yard.jpeg",
    title: "Truck loaded and covered in the depot yard",
    category: "Fleet & Stock",
  },
  {
    src: "/images/cement/stock-dangote-3x.jpeg",
    title: "Dangote 3X cement in the warehouse",
    category: "Fleet & Stock",
  },
  {
    src: "/images/cement/stock-warehouse.jpeg",
    title: "Cement stock ready for delivery",
    category: "Fleet & Stock",
  },
  {
    src: "/images/cement/stock-warehouse2.jpeg",
    title: "Warehouse stock at the depot",
    category: "Fleet & Stock",
  },
  {
    src: "/images/cement/Epe warehouse.jpeg",
    title: "Epe depot grounds",
    category: "Lagos State Depot",
  },
  {
    src: "/images/cement/Epe warehouse1.jpeg",
    title: "Epe depot building and gate",
    category: "Lagos State Depot",
  },
  {
    src: "/images/cement/Epe warehouse2.jpeg",
    title: "Cement stocked at the Epe store",
    category: "Lagos State Depot",
  },
  {
    src: "/images/cement/Epe warehouse3.jpeg",
    title: "Epe office with Yusfaith and Lafarge signage",
    category: "Lagos State Depot",
  },
  {
    src: "/images/corporate/awards/award12.jpeg",
    title: "Lafarge award presented to Yusfaith Global Enterprises",
    category: "Recognition",
  },
  {
    src: "/images/corporate/awards/award15.jpeg",
    title: "Recognition award to our Chairman / CEO",
    category: "Recognition",
  },
  {
    src: "/images/corporate/awards/award17.jpeg",
    title: "Trophy and plaque presented to Yusfaith",
    category: "Recognition",
  },
  {
    src: "/images/corporate/awards/award18.jpeg",
    title: "Awards for outstanding contribution",
    category: "Recognition",
  },
];

const ORDER_FLOW = [
  {
    Icon: ClipboardList,
    title: "Order placed",
    text: "Online, on WhatsApp, by phone or at our office.",
  },
  {
    Icon: Wallet,
    title: "Payment confirmed",
    text: "Our accounts team confirms payment before dispatch.",
  },
  {
    Icon: PackageCheck,
    title: "Loaded at the depot",
    text: "Stock is checked and loaded at the nearest location.",
  },
  {
    Icon: Truck,
    title: "Delivered by our team",
    text: "Our own trucks and drivers take it to your site.",
  },
  {
    Icon: BadgeCheck,
    title: "Received and confirmed",
    text: "Delivery is confirmed and recorded.",
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

export default function ProjectsContent() {
  const [filter, setFilter] = useState<Category>("All");
  const [open, setOpen] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      filter === "All"
        ? PHOTOS
        : PHOTOS.filter((photo) => photo.category === filter),
    [filter]
  );

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? i : (i + 1) % visible.length)),
    [visible.length]
  );
  const previous = useCallback(
    () =>
      setOpen((i) =>
        i === null ? i : (i - 1 + visible.length) % visible.length
      ),
    [visible.length]
  );

  useEffect(() => {
    if (open === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, previous]);

  const current = open === null ? null : visible[open];

  return (
    <main>
      {/* ================= PAGE HEADER ================= */}
      <section className="relative isolate flex min-h-[440px] items-end overflow-hidden bg-[#0f1a3d] text-white sm:min-h-[500px]">
        <Image
          src="/images/corporate/Headquarters2.jpeg"
          alt="Yusfaith Global Enterprises head office"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/80 to-[#0a1230]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/80 via-transparent to-transparent" />

        <div className="container-main relative z-10 pb-16 pt-32 sm:pb-20">
          <FadeUp>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
              <Link href="/" className="transition hover:text-[#ff9a26]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Projects &amp; Operations</span>
            </nav>

            <h1 className="font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Our Operations{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                in Pictures.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              A look inside Yusfaith: our head office, our Epe depot, and the
              recognition we have received along the way.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="section-padding">
        <div className="container-main">
          <FadeUp className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow>Gallery</Eyebrow>
              <h2
                className="font-heading text-4xl font-semibold sm:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                Where we work
              </h2>
            </div>

            {/* Filters */}
            <div
              role="tablist"
              aria-label="Filter photos"
              className="flex flex-wrap gap-2"
            >
              {CATEGORIES.map((category) => {
                const isActive = filter === category;
                const count =
                  category === "All"
                    ? PHOTOS.length
                    : PHOTOS.filter((p) => p.category === category).length;

                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setFilter(category)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                        : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
                    }`}
                  >
                    {category}
                    <span className="ml-2 opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </FadeUp>

          <motion.div layout className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((photo, index) => (
                <motion.button
                  layout
                  key={photo.src}
                  type="button"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setOpen(index)}
                  aria-label={`View photo: ${photo.title}`}
                  className={`group relative overflow-hidden rounded-xl border border-[var(--border)] text-left ${
                    index % 5 === 0 ? "aspect-square lg:col-span-2 lg:row-span-2" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/85 via-[#0a1230]/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <Expand size={16} />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff9a26]">
                      {photo.category}
                    </span>
                    <span className="mt-1 block text-sm font-semibold leading-5 text-white">
                      {photo.title}
                    </span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          <p
            className="mt-6 text-sm"
            style={{ color: "var(--muted)" }}
          >
            More photos of our fleet, branches and projects will be added as
            they become available.
          </p>
        </div>
      </section>

      {/* ================= HOW WE OPERATE ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-12 max-w-2xl">
            <Eyebrow>How We Operate</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              From order to delivery
            </h2>
          </FadeUp>

          <div className="relative grid gap-6 md:grid-cols-5">
            {/* connecting line on desktop */}
            <span
              aria-hidden
              className="absolute left-[10%] right-[10%] top-8 hidden h-0.5 md:block"
              style={{ background: "var(--border)" }}
            />
            {ORDER_FLOW.map(({ Icon, title, text }, index) => (
              <FadeUp key={title} delay={index * 0.1} className="relative">
                <div className="flex flex-col items-start md:items-center md:text-center">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d] shadow-lg ring-8 ring-[var(--surface)]">
                    <Icon size={26} />
                  </span>
                  <span
                    className="mt-5 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--gold-text)" }}
                  >
                    Step {index + 1}
                  </span>
                  <span
                    className="mt-1 text-lg font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </span>
                  <span
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--muted)" }}
                  >
                    {text}
                  </span>
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
              Browse cement and building materials, or speak to our team.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="flex flex-wrap gap-4">
            <Link
              href="/cement"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Order Cement
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0f1a3d]"
            >
              Contact Us
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ================= LIGHTBOX ================= */}
      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d]"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previous();
            }}
            aria-label="Previous photo"
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d] sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>

          <figure
            className="flex h-full w-full max-w-4xl flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[75vh] w-full">
              <Image
                src={current.src}
                alt={current.title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-white">
              <span className="block text-xs font-bold uppercase tracking-[0.15em] text-[#ff9a26]">
                {current.category} · {open + 1} / {visible.length}
              </span>
              <span className="mt-1 block text-base font-semibold">
                {current.title}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#ef850f] hover:text-[#0f1a3d] sm:right-8"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </main>
  );
}