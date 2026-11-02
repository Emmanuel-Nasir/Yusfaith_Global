
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const businesses = [
  {
    number: "01",
    name: "Cement Depot",
    category: "CEMENT DISTRIBUTION",
    description:
      "Reliable wholesale and retail cement supply, supporting construction projects, contractors and businesses across our service locations.",
    image: "/images/cement/Epe warehouse3.jpeg",
    href: "/cement",
  },
  {
    number: "02",
    name: "Bakery",
    category: "BAKERY & FOOD PRODUCTION",
    description:
      "Quality bakery products made with care, bringing freshness and convenience to the communities we serve.",
    image: "/images/bakery/bakery-hero.jpg",
    href: "/bakery",
  },
  {
    number: "03",
    name: "Logistics",
    category: "TRANSPORTATION & DISTRIBUTION",
    description:
      "Supporting efficient movement of goods through dependable transportation and distribution services.",
    image: "/images/logistics/logistics-fleet.jpg",
    href: "/logistics",
  },
  {
    number: "04",
    name: "Real Estate",
    category: "PROPERTY & DEVELOPMENT",
    description:
      "Exploring property development and real estate opportunities that support growing communities.",
    image: "/images/real-estate/real-estate-hero.jpg",
    href: "/real-estate",
  },
  {
    number: "05",
    name: "Building Materials",
    category: "CONSTRUCTION SUPPLIES",
    description:
      "Connecting builders and contractors with essential construction materials and supplies.",
    image: "/images/building-materials/materials-hero.jpg",
    href: "/building-materials",
  },
];

export default function BusinessShowcase() {
  return (
    <section
      id="businesses"
      className="section-padding overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="container-main">
        {/* Section heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="hero-accent mb-4">OUR BUSINESSES</p>

            <h2
              className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              style={{ color: "var(--foreground)" }}
            >
              One Enterprise.
              <span
                className="block"
                style={{ color: "var(--gold-text)" }}
              >
                Multiple Possibilities.
              </span>
            </h2>
          </div>

          <p className="text-muted max-w-md text-base leading-8">
            Discover the businesses that make up Yusfaith Global
            Enterprises and the services they provide.
          </p>
        </div>

        {/* Business cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {businesses.map((business, index) => (
            <motion.article
              key={business.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
              }}
              className={`group relative isolate min-h-[390px] overflow-hidden rounded-xl sm:min-h-[450px] ${
                index === 0
                  ? "md:col-span-2 md:min-h-[510px]"
                  : ""
              }`}
            >
              <Image
                src={business.image}
                alt={business.name}
                fill
                sizes={
                  index === 0
                    ? "100vw"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Image overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/95 via-[#07101f]/50 to-[#07101f]/10" />

              {/* Gold corner detail */}
              <div className="absolute right-6 top-6 h-12 w-12 border-r-2 border-t-2 border-[#d9ad45]/80" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 text-white sm:p-10 lg:p-12">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#f2c85b]">
                    {business.number}
                  </span>
                  <span className="h-px w-8 bg-[#f2c85b]" />
                  <span className="text-xs font-semibold tracking-[0.15em] text-[#f2c85b]">
                    {business.category}
                  </span>
                </div>

                <h3 className="font-heading text-4xl font-semibold sm:text-5xl">
                  {business.name}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                  {business.description}
                </p>

                <Link
                  href={business.href}
                  className="mt-6 inline-flex w-fit items-center gap-3 border-b border-[#f2c85b] pb-2 text-sm font-semibold text-[#f2c85b] transition-all hover:gap-5"
                >
                  Explore Business
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Closing statement */}
        <div
          className="mt-12 border-t pt-8"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="max-w-3xl font-heading text-2xl italic leading-relaxed sm:text-3xl"
            style={{ color: "var(--foreground)" }}
          >
            Different industries. One shared commitment to quality,
            reliability and meaningful growth.
          </p>
        </div>
      </div>
    </section>
  );
}
