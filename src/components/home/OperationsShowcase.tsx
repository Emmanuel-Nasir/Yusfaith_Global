
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Images } from "lucide-react";

const operations = [
  {
    title: "Cement Distribution",
    location: "Epe, Lagos",
    image: "/images/cement/Epe warehouse.jpeg",
    category: "Distribution",
  },
  {
    title: "Warehouse Operations",
    location: "Epe, Lagos",
    image: "/images/cement/Epe warehouse1.jpeg",
    category: "Facilities",
  },
  {
    title: "Business Facilities",
    location: "Abeokuta, Ogun",
    image: "/images/corporate/Headquarters.jpeg",
    category: "Corporate",
  },
  {
    title: "Distribution Facilities",
    location: "Epe, Lagos",
    image: "/images/cement/Epe warehouse2.jpeg",
    category: "Operations",
  },
];

function GalleryImage({
  item,
  large = false,
}: {
  item: (typeof operations)[number];
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl ${
        large ? "h-[420px] lg:h-full" : "h-[240px] sm:h-[280px]"
      }`}
    >
      {!failed ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 25vw"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-[#17243a] text-[#f2c85b]">
          <Images size={42} />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#06101e]/90 via-[#06101e]/15 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f2c85b]">
          {item.category}
        </span>

        <h3 className="font-heading text-2xl font-semibold sm:text-3xl">
          {item.title}
        </h3>

        <p className="mt-2 text-sm text-white/75">
          {item.location}
        </p>
      </div>
    </div>
  );
}

export default function OperationsShowcase() {
  return (
    <section
      id="operations"
      className="section-padding"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="container-main">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="hero-accent mb-4">A CLOSER LOOK</p>

            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl lg:text-6xl"
              style={{ color: "var(--foreground)" }}
            >
              Behind the Business.
              <span
                className="block"
                style={{ color: "var(--gold-text)" }}
              >
                Beyond the Promise.
              </span>
            </h2>
          </div>

          <p
            className="max-w-md text-base leading-8"
            style={{ color: "var(--muted)" }}
          >
            Take a closer look at the facilities and operations
            supporting Yusfaith Global Enterprises.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <GalleryImage item={operations[0]} large />

          <div className="grid gap-5 sm:grid-cols-2">
            <GalleryImage item={operations[1]} />
            <GalleryImage item={operations[2]} />

            <div className="sm:col-span-2">
              <GalleryImage item={operations[3]} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="max-w-xl text-sm leading-7"
            style={{ color: "var(--muted)" }}
          >
            Discover more about our facilities, business
            activities and ongoing developments.
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center gap-3 rounded-md border px-6 py-4 font-semibold"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
              borderColor: "var(--gold)",
            }}
          >
            Explore Our Projects
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
