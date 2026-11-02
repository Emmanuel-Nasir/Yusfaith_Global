
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Package,
  Truck,
} from "lucide-react";

const cementBrands = [
  {
    name: "Dangote Cement",
    image: "/images/cement/dangote-3x.png",
    description:
      "Explore Dangote cement products for residential, commercial and large-scale construction projects.",
    featured: true,
  },
  {
    name: "HBM Cement",
    image: "/images/cement/hbm-classic.png",
    description:
      "Discover HBM cement products and enquire about available quantities for your building projects.",
    featured: true,
  },
  {
    name: "BUA Cement",
    image: "/images/cement/bua-cement.png",
    description:
      "Explore additional cement options for builders, contractors and business customers.",
    featured: false,
  },
];

type CementBrand = (typeof cementBrands)[number];

function CementBrandCard({ brand }: { brand: CementBrand }) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-xl"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Product image */}
      <div className="relative flex h-64 shrink-0 items-center justify-center overflow-hidden bg-[#f1efe9] sm:h-72">
        {!imageError ? (
          <Image
            src={brand.image}
            alt={`${brand.name} cement product illustration`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-5 transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-[#17243a]">
            <Package size={52} strokeWidth={1.2} />
            <span className="text-base font-semibold">
              {brand.name}
            </span>
          </div>
        )}

        {brand.featured && (
          <div className="absolute left-4 top-4 rounded-full bg-[#101b30] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#f2c85b]">
            Featured Brand
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3
          className="font-heading text-3xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {brand.name}
        </h3>

        <p
          className="mt-4 flex-1 text-sm leading-7"
          style={{ color: "var(--muted)" }}
        >
          {brand.description}
        </p>

        <Link
          href="/cement"
          className="mt-7 inline-flex w-fit items-center gap-2 border-b pb-2 text-sm font-semibold transition-all duration-300 hover:gap-4"
          style={{
            color: "var(--gold-text)",
            borderColor: "var(--gold)",
          }}
        >
          Explore Products
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </motion.article>
  );
}

export default function CementBrands() {
  return (
    <section
      id="cement-brands"
      className="section-padding overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container-main">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="hero-accent mb-4">
            OUR CEMENT DISTRIBUTION
          </p>

          <h2
            className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            style={{ color: "var(--foreground)" }}
          >
            Building With
            <span
              className="block"
              style={{ color: "var(--gold-text)" }}
            >
              Trusted Cement Brands.
            </span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-8"
            style={{ color: "var(--muted)" }}
          >
            From individual building projects to bulk
            construction requirements, explore selected
            cement brands and enquire about product
            availability through Yusfaith Global Enterprises.
          </p>
        </motion.div>

        {/* Equal-height cards */}
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {cementBrands.map((brand) => (
            <CementBrandCard
              key={brand.name}
              brand={brand}
            />
          ))}
        </div>

        {/* More products */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p
            className="mb-6 text-sm leading-7"
            style={{ color: "var(--muted)" }}
          >
            Looking for more cement brands, product
            variants or bulk supply options?
          </p>

          <Link
            href="/cement"
            className="inline-flex items-center justify-center gap-3 rounded-md border px-8 py-4 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
              borderColor: "var(--gold)",
            }}
          >
            View More Cement Products
            <ArrowRight size={19} />
          </Link>
        </motion.div>

        {/* Supply highlight */}
        <div
          className="mt-16 flex flex-col items-start justify-between gap-6 rounded-xl border p-7 sm:p-9 lg:flex-row lg:items-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[#d9ad45]/15 p-3">
              <Truck
                size={27}
                style={{ color: "var(--gold-text)" }}
              />
            </div>

            <div>
              <h3
                className="font-heading text-2xl font-semibold sm:text-3xl"
                style={{ color: "var(--foreground)" }}
              >
                Need Cement in Bulk?
              </h3>

              <p
                className="mt-2 max-w-xl text-sm leading-7"
                style={{ color: "var(--muted)" }}
              >
                Speak with our distribution team about
                wholesale quantities, pricing and
                delivery arrangements.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-3 rounded-md px-7 py-4 font-semibold transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            Request a Quotation
            <ArrowRight size={18} />
          </Link>
        </div>

        <p
          className="mt-6 text-center text-xs leading-6"
          style={{ color: "var(--muted)" }}
        >
          Demo product images are illustrative.
          Confirm actual stock and packaging before launch.
        </p>
      </div>
    </section>
  );
}
