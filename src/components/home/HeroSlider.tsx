
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "WELCOME TO YUSFAITH GLOBAL ENTERPRISES",
    title: "Building Trust.",
    highlight: "Creating Possibilities.",
    description:
      "A growing Nigerian enterprise connecting people, businesses, and communities through cement distribution, bakery, logistics, real estate, and building materials.",
    image: "/images/corporate/Headquarters.jpeg",
    primaryText: "Explore Our Businesses",
    primaryHref: "/#businesses",
    secondaryText: "Discover Our Story",
    secondaryHref: "/about",
  },
  {
    id: 2,
    eyebrow: "CEMENT DISTRIBUTION",
    title: "Strong Foundations.",
    highlight: "Reliable Supply.",
    description:
      "Wholesale and retail cement distribution, serving customers through our depot network.",
    image: "/images/cement/cement-brands-dropdown.png",
    primaryText: "Explore Cement Depot",
    primaryHref: "/cement",
    secondaryText: "Contact Our Team",
    secondaryHref: "/contact",
  },
  {
    id: 3,
    eyebrow: "BAKERY & FOOD PRODUCTION",
    title: "Made With Care.",
    highlight: "Shared With Joy.",
    description:
      "Discover our bakery business, focused on quality products and memorable customer experiences.",
    image: "/images/bakery/bakery-hero.jpg",
    primaryText: "Explore Our Bakery",
    primaryHref: "/bakery",
    secondaryText: "Our Businesses",
    secondaryHref: "/#businesses",
  },
  {
    id: 4,
    eyebrow: "LOGISTICS & DISTRIBUTION",
    title: "Moving Goods.",
    highlight: "Connecting Markets.",
    description:
      "Supporting business operations with transportation, distribution, and dependable logistics services.",
    image: "/images/logistics/logistics-hero.jpg",
    primaryText: "Explore Logistics",
    primaryHref: "/logistics",
    secondaryText: "Get in Touch",
    secondaryHref: "/contact",
  },
  {
    id: 5,
    eyebrow: "REAL ESTATE & DEVELOPMENT",
    title: "Spaces for Today.",
    highlight: "Value for Tomorrow.",
    description:
      "Explore our vision for property, development, and opportunities that support growing communities.",
    image: "/images/real-estate/real-estate-hero.jpg",
    primaryText: "Explore Real Estate",
    primaryHref: "/real-estate",
    secondaryText: "Contact Us",
    secondaryHref: "/contact",
  },
  {
    id: 6,
    eyebrow: "BUILDING MATERIALS",
    title: "Everything You Need.",
    highlight: "To Build Better.",
    description:
      "Discover our building materials business, connecting construction projects with essential supplies.",
    image: "/images/building-materials/materials-hero.jpg",
    primaryText: "Explore Materials",
    primaryHref: "/building-materials",
    secondaryText: "Our Businesses",
    secondaryHref: "/#businesses",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [paused]);

  const nextSlide = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActive(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[active];

  return (
    <section
      aria-label="Yusfaith Global Enterprises introduction"
      className="relative isolate min-h-[700px] overflow-hidden bg-[#101b30] text-white lg:min-h-[780px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background photographs */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.15, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.eyebrow}
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient for readable text */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07101f]/95 via-[#07101f]/75 to-[#07101f]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/70 via-transparent to-[#07101f]/20" />

      {/* Decorative accent */}
      <div className="pointer-events-none absolute left-0 top-1/3 hidden h-32 w-1 bg-[#d9ad45] lg:block" />

      <div className="container-main relative z-10 flex min-h-[700px] items-center py-32 lg:min-h-[780px]">
        <div className="max-w-[790px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.65 }}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#f2c85b]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#f2c85b] sm:text-sm">
                  {slide.eyebrow}
                </span>
              </div>

              <h1 className="font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-[82px]">
                <span className="block text-white">
                  {slide.title}
                </span>
                <span className="block text-[#f2c85b]">
                  {slide.highlight}
                </span>
              </h1>

              <p className="mt-7 max-w-[620px] text-base leading-8 text-white/85 sm:text-lg">
                {slide.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.primaryHref}
                  className="inline-flex min-h-13 items-center gap-3 rounded-md bg-[#d9ad45] px-7 py-4 font-semibold text-[#101b30] transition hover:bg-[#f2c85b]"
                >
                  {slide.primaryText}
                  <ArrowUpRight size={18} />
                </Link>

                <Link
                  href={slide.secondaryHref}
                  className="inline-flex min-h-13 items-center gap-3 rounded-md border border-white/50 px-7 py-4 font-medium text-white transition hover:border-[#f2c85b] hover:text-[#f2c85b]"
                >
                  {slide.secondaryText}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-7 left-0 right-0 z-20">
        <div className="container-main flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={active === index ? "true" : undefined}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  active === index
                    ? "w-12 bg-[#f2c85b]"
                    : "w-6 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm tracking-widest text-white/80">
              {String(active + 1).padStart(2, "0")}
              {" / "}
              {String(slides.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white transition hover:border-[#f2c85b] hover:bg-[#d9ad45] hover:text-[#101b30]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-white transition hover:border-[#f2c85b] hover:bg-[#d9ad45] hover:text-[#101b30]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
