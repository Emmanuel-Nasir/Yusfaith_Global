
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
} from "lucide-react";

import {
  PRODUCTS,
  CEMENT_BRANDS,
  formatNaira,
} from "@/lib/cement/catalog";

/* =========================================
   YUSFAITH CEMENT DEPOT
   CORPORATE HOMEPAGE
   ========================================= */

const warehouses = [
  {
    image: "/images/cement/Epe warehouse.jpeg",
    alt: "Yusfaith cement distribution warehouse in Epe",
  },
  {
    image: "/images/cement/Epe warehouse1.jpeg",
    alt: "Yusfaith Epe cement warehouse photograph",
  },
  {
    image: "/images/cement/Epe warehouse2.jpeg",
    alt: "Yusfaith cement distribution facilities",
  },
  {
    image: "/images/cement/Epe warehouse3.jpeg",
    alt: "Yusfaith cement warehouse operations",
  },
];

const locations = [
  {
    name: "Abeokuta",
    state: "Ogun State",
    type: "Corporate Head Office",
    address:
      "KM 6, Lagos–Abeokuta Expressway, Ile-Ise Awo, beside Sholanke Filling Station, Abeokuta, Ogun State.",
  },
  {
    name: "Epe",
    state: "Lagos State",
    type: "Business Location",
    address:
      "No. 33/34 Lagos Road, beside Benjude Supermarket, Epe, Lagos State.",
  },
  {
    name: "Ibadan",
    state: "Oyo State",
    type: "Business Location",
    address:
      "Adeoyo, off Ring Road, Ibadan, Oyo State.",
  },
];

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#0b1629] px-6 py-4 text-center text-sm font-bold !text-[#f2c85b] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1c3555] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500";

const goldButton =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#f2c85b] px-7 py-4 text-center text-sm font-bold !text-[#0b1629] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffda76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const outlineButton =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-md border px-6 py-4 text-center text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5";

const brandNames = [
  "Dangote",
  "HBM",
  "BUA",
  "Mangal",
  "Purechem",
];

export default function CementPage() {
  const [brand, setBrand] = useState<string>("All");

  const visibleProducts = useMemo(() => {
    return PRODUCTS.filter(
      (product) =>
        brand === "All" || product.brand === brand
    );
  }, [brand]);

  const productCount = PRODUCTS.length;

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* =====================================
          1. HERO SECTION
      ===================================== */}

      <section className="relative flex min-h-[680px] items-center overflow-hidden bg-[#0b1629] text-white lg:min-h-[760px]">
        <Image
          src="/images/cement/Epe warehouse.jpeg"
          alt="Yusfaith cement distribution warehouse in Epe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/95 via-[#07111f]/85 to-[#07111f]/45" />

        <div className="container-main relative z-10 grid w-full items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <span className="h-[2px] w-10 bg-[#f2c85b]" />

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f2c85b]">
                YUSFAITH GLOBAL ENTERPRISES
              </p>
            </div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Cement Distribution Division
            </p>

            <h1 className="font-heading text-5xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl">
              Your Cement.
              <span className="mt-2 block text-[#f2c85b]">
                Your Project.
              </span>
              <span className="mt-2 block">
                Our Priority.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              Supporting construction projects through
              cement distribution, wholesale and retail
              supply, and a convenient digital ordering
              experience.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              Explore Dangote, HBM, BUA, Mangal and Purechem
              products, discover our distribution facilities
              and prepare your cement order online.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/cement/order"
                className={goldButton}
              >
                <ShoppingCart size={19} />
                Order Cement
                <ArrowUpRight size={18} />
              </Link>

              <a
                href="#cement-products"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/50 px-7 py-4 text-sm font-semibold !text-white transition hover:bg-white/10"
              >
                Explore Products
                <ArrowRight size={18} />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/20 pt-7 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <PackageCheck
                  size={19}
                  className="text-[#f2c85b]"
                />
                Wholesale & Retail
              </span>

              <span className="flex items-center gap-2">
                <Truck
                  size={19}
                  className="text-[#f2c85b]"
                />
                Delivery Requests
              </span>

              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={19}
                  className="text-[#f2c85b]"
                />
                Multi-brand Supply
              </span>
            </div>
          </div>

          <div className="relative mx-auto hidden h-[470px] w-full max-w-[540px] lg:block">
            <div className="absolute inset-10 rounded-full bg-[#f2c85b]/10 blur-3xl" />

            <Image
              src="/images/cement/dangote-stacked.png"
              alt="Stacked cement product bags"
              fill
              sizes="540px"
              className="relative object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* =====================================
          2. FEATURED CEMENT BRANDS
      ===================================== */}

      <section
        className="border-b py-10 sm:py-14"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="container-main">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div>
              <p
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--gold-text)" }}
              >
                FEATURED CEMENT BRANDS
              </p>

              <h2
                className="font-heading text-3xl font-semibold sm:text-4xl"
                style={{ color: "var(--foreground)" }}
              >
                Trusted Names for Building Projects.
              </h2>

              <p
                className="mt-4 max-w-2xl text-sm leading-7"
                style={{ color: "var(--muted)" }}
              >
                Explore our multi-brand cement catalogue and
                prepare retail or wholesale supply requests
                through the Yusfaith ordering platform.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {brandNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border px-4 py-2 text-xs font-bold"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto h-48 w-full max-w-md sm:h-56">
              <Image
                src="/images/cement/all-brands.png"
                alt="Cement brand product illustration"
                fill
                sizes="(max-width: 768px) 100vw, 430px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          3. DISTRIBUTION HIGHLIGHTS
      ===================================== */}

      <section
        className="border-b py-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container-main grid gap-6 sm:grid-cols-3">
          {[
            {
              Icon: Building2,
              title: "Multi-location Presence",
              description:
                "Abeokuta, Epe and Ibadan.",
            },
            {
              Icon: PackageCheck,
              title: "Wholesale & Retail",
              description:
                "Ordering options for different project sizes.",
            },
            {
              Icon: ClipboardList,
              title: "Digital Order Requests",
              description:
                "Prepare, review and track demo orders.",
            },
          ].map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <Icon
                  size={23}
                  style={{ color: "var(--gold-text)" }}
                />
              </div>

              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {title}
                </h3>

                <p
                  className="mt-1 text-sm leading-6"
                  style={{ color: "var(--muted)" }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================
          4. PRODUCT CATALOGUE
      ===================================== */}

      <section
        id="cement-products"
        className="section-padding scroll-mt-24 py-16 sm:py-24"
      >
        <div className="container-main">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="hero-accent mb-4">
                OUR CEMENT COLLECTION
              </p>

              <h2
                className="font-heading text-4xl font-semibold sm:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                Find the Cement You Need.
              </h2>

              <p
                className="mt-5 max-w-2xl leading-8"
                style={{ color: "var(--muted)" }}
              >
                Browse our catalogue, compare illustrative
                prices and prepare an order for your building
                project.
              </p>
            </div>

            <Link
              href="/cement/order"
              className={primaryButton}
            >
              <ShoppingCart size={19} />
              Start an Order
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* BRAND FILTERS */}

          <div className="mb-7 flex flex-wrap gap-3">
            {CEMENT_BRANDS.map((option) => {
              const selected = brand === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBrand(option)}
                  aria-pressed={selected}
                  className="rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: selected
                      ? "#0b1629"
                      : "var(--surface)",
                    color: selected
                      ? "#f2c85b"
                      : "var(--foreground)",
                    borderColor: selected
                      ? "#0b1629"
                      : "var(--border)",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div
            className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <p>
              Showing{" "}
              <strong style={{ color: "var(--foreground)" }}>
                {visibleProducts.length}
              </strong>{" "}
              of {productCount} catalogue options
            </p>

            <p>
              All prices are demo estimates in Nigerian naira.
            </p>
          </div>

          {/* PRODUCT CARDS */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="relative h-72 overflow-hidden bg-[#f1f0ec] sm:h-80">
                  <Image
                    src={product.image}
                    alt={`${product.name} cement`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-[#0b1629] px-3 py-2 text-[11px] font-bold !text-[#f2c85b]">
                    {product.bulkOption
                      ? "Bulk Order"
                      : product.brand}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: "var(--gold-text)" }}
                  >
                    {product.brand}
                  </p>

                  <h3
                    className="font-heading text-2xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {product.name}
                  </h3>

                  <p
                    className="mt-3 flex-1 text-sm leading-7"
                    style={{ color: "var(--muted)" }}
                  >
                    {product.description}
                  </p>

                  <div
                    className="mt-6 border-t pt-5"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Estimated Price Per Bag
                    </p>

                    <p
                      className="mt-2 text-2xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {formatNaira(product.samplePrice)}
                    </p>

                    <p
                      className="mt-2 text-xs leading-5"
                      style={{ color: "var(--gold-text)" }}
                    >
                      Sample price · Final quote required
                    </p>
                  </div>

                  <Link
                    href="/cement/order"
                    className={`${primaryButton} mt-6 w-full`}
                  >
                    <ShoppingCart size={17} />
                    Continue to Ordering
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-8 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs leading-7"
              style={{ color: "var(--muted)" }}
            >
              <strong
                style={{ color: "var(--foreground)" }}
              >
                Demo pricing notice:
              </strong>{" "}
              Product prices are illustrative and editable.
              Availability, actual prices and delivery
              charges must be confirmed by Yusfaith before
              any real transaction. The two bulk-order
              configurations are not separate cement brands
              or product formulations.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================
          5. WAREHOUSE GALLERY
      ===================================== */}

      <section
        className="section-padding py-16 sm:py-24"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <div className="mb-12">
            <p className="hero-accent mb-4">
              OUR DISTRIBUTION FACILITIES
            </p>

            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Inside Yusfaith Cement Depot.
            </h2>

            <p
              className="mt-5 max-w-2xl leading-8"
              style={{ color: "var(--muted)" }}
            >
              Explore photographs of our Epe warehouse and
              cement distribution facilities.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {warehouses.map((warehouse, index) => (
              <div
                key={warehouse.image}
                className={`group relative overflow-hidden rounded-xl bg-[#eae7df] ${
                  index === 0
                    ? "h-80 lg:col-span-2 lg:row-span-2 lg:h-full"
                    : "h-72"
                }`}
              >
                <Image
                  src={warehouse.image}
                  alt={warehouse.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/45 via-transparent to-transparent" />

                {index === 0 && (
                  <span className="absolute bottom-5 left-5 rounded-md bg-[#0b1629]/90 px-4 py-2 text-xs font-bold text-[#f2c85b]">
                    Yusfaith Epe Warehouse
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================
          6. HOW ORDERING WORKS
      ===================================== */}

      <section className="section-padding py-16 sm:py-24">
        <div className="container-main">
          <div className="mb-12 text-center">
            <p className="hero-accent mb-4">
              CUSTOMER ORDERING
            </p>

            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              A Simpler Way to Order Cement.
            </h2>

            <p
              className="mx-auto mt-5 max-w-2xl leading-8"
              style={{ color: "var(--muted)" }}
            >
              From choosing products to reviewing estimated
              costs, our demo ordering experience makes the
              process easy to follow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Select Your Products",
                description:
                  "Choose from the listed cement brands, add products to your basket and specify the number of bags required.",
                Icon: PackageCheck,
              },
              {
                number: "02",
                title: "Review Your Estimate",
                description:
                  "Enter customer details, select depot pickup or delivery, and review automatically calculated sample costs.",
                Icon: Wallet,
              },
              {
                number: "03",
                title: "Choose & Track",
                description:
                  "Select a simulated payment preference, create a demo order and follow its demonstration tracking progress.",
                Icon: Truck,
              },
            ].map(
              ({ number, title, description, Icon }) => (
                <article
                  key={number}
                  className="rounded-xl border p-7 transition-shadow duration-300 hover:shadow-lg sm:p-8"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span
                      className="font-heading text-5xl font-semibold"
                      style={{ color: "var(--gold-text)" }}
                    >
                      {number}
                    </span>

                    <Icon
                      size={30}
                      style={{ color: "var(--gold-text)" }}
                    />
                  </div>

                  <h3
                    className="font-heading text-2xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </h3>

                  <p
                    className="mt-4 text-sm leading-8"
                    style={{ color: "var(--muted)" }}
                  >
                    {description}
                  </p>
                </article>
              )
            )}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/cement/order"
              className={primaryButton}
            >
              Place a Demo Order
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/cement/track"
              className={outlineButton}
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              }}
            >
              Track Demo Order
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================
          7. DIGITAL ORDERING FEATURES
      ===================================== */}

      <section
        className="section-padding py-16 sm:py-24"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="hero-accent mb-4">
                DIGITAL ORDERING EXPERIENCE
              </p>

              <h2
                className="font-heading text-4xl font-semibold sm:text-5xl"
                style={{ color: "var(--foreground)" }}
              >
                Plan Your Cement Purchase With Clarity.
              </h2>

              <p
                className="mt-6 max-w-xl leading-8"
                style={{ color: "var(--muted)" }}
              >
                Our interactive demo brings product
                selection, quantity management, estimated
                pricing and order tracking together in one
                experience.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Browse and select all listed cement brands.",
                  "Calculate estimated costs as quantities change.",
                  "Choose delivery or depot pickup.",
                  "Select a simulated payment preference.",
                  "Review saved orders and demo tracking.",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={21}
                      className="mt-1 shrink-0 text-amber-700"
                    />

                    <p
                      className="leading-7"
                      style={{ color: "var(--foreground)" }}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/cement/order"
                className={`${primaryButton} mt-9`}
              >
                Explore Ordering System
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  Icon: ShoppingCart,
                  title: "Smart Basket",
                  description:
                    "Add multiple cement products and adjust quantities.",
                },
                {
                  Icon: CreditCard,
                  title: "Payment Preferences",
                  description:
                    "Explore bank transfer, card and quotation options without making a payment.",
                },
                {
                  Icon: ClipboardList,
                  title: "Order History",
                  description:
                    "Review orders saved in your current browser.",
                },
                {
                  Icon: Truck,
                  title: "Demo Tracking",
                  description:
                    "Follow simulated order progress using a reference.",
                },
              ].map(({ Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b1629]">
                    <Icon
                      size={23}
                      className="text-[#f2c85b]"
                    />
                  </div>

                  <h3
                    className="mt-5 font-heading text-xl font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </h3>

                  <p
                    className="mt-3 text-sm leading-7"
                    style={{ color: "var(--muted)" }}
                  >
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          8. LOCATIONS
      ===================================== */}

      <section className="section-padding py-16 sm:py-24">
        <div className="container-main">
          <div className="mb-12">
            <p className="hero-accent mb-4">
              OUR LOCATIONS
            </p>

            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Where to Find Us.
            </h2>

            <p
              className="mt-5 max-w-2xl leading-8"
              style={{ color: "var(--muted)" }}
            >
              Yusfaith Global Enterprises has business
              locations across Ogun, Lagos and Oyo States.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location.name}
                className="flex h-full flex-col rounded-xl border p-7 transition-shadow duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <MapPin
                  size={28}
                  style={{ color: "var(--gold-text)" }}
                />

                <p
                  className="mt-6 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gold-text)" }}
                >
                  {location.type}
                </p>

                <h3
                  className="mt-3 font-heading text-3xl font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {location.name}
                </h3>

                <p
                  className="mt-1 text-sm font-semibold"
                  style={{ color: "var(--gold-text)" }}
                >
                  {location.state}
                </p>

                <p
                  className="mt-5 flex-1 text-sm leading-8"
                  style={{ color: "var(--muted)" }}
                >
                  {location.address}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================
          9. FINAL CALL TO ACTION
      ===================================== */}

      <section className="relative overflow-hidden bg-[#0b1629] py-20 text-white sm:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f2c85b]/10 blur-3xl" />

        <div className="container-main relative z-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f2c85b]">
              CEMENT ORDERS
            </p>

            <h2 className="font-heading text-4xl font-semibold sm:text-5xl">
              Ready to Get Started?
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-white/75">
              Choose your cement products, specify
              quantities, review estimated costs and
              prepare your order through our interactive
              platform.
            </p>

            <p className="mt-3 text-xs font-semibold text-[#f2c85b]">
              Demo only — no real payment is collected.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/cement/order"
              className={goldButton}
            >
              <ShoppingCart size={19} />
              Order Cement
              <ArrowUpRight size={18} />
            </Link>

            <Link
              href="/cement/orders"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/40 px-7 py-4 text-sm font-semibold !text-white transition hover:bg-white/10"
            >
              View Demo Orders
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
