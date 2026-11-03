"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/*
  Hero always sits on a dark photo, so it uses fixed brand colours:
  Logo orange #EF850F, vivid orange #FF9A26, navy #0F1A3D.
*/

const slides = [
  {
    id: 1,
    eyebrow: "Welcome to Yusfaith Global Enterprises",
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
    eyebrow: "Cement Distribution",
    title: "Strong Foundations.",
    highlight: "Reliable Supply.",
    description:
      "Distributors of Dangote and HBM cement, wholesale and retail, serving customers through our depots in Abeokuta, Epe and Ibadan.",
    image: "/images/cement/Epe warehouse2.jpeg",
    primaryText: "Explore Cement Depot",
    primaryHref: "/cement",
    secondaryText: "Contact Our Team",
    secondaryHref: "/contact",
  },
  {
    id: 3,
    eyebrow: "Bakery & Food Production",
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
    eyebrow: "Logistics & Delivery",
    title: "Moving Goods.",
    highlight: "Delivering on Time.",
    description:
      "Our own logistics team, trucks and drivers deliver customer orders from our depots to their sites.",
    image: "/images/logistics/logistics-hero.jpg",
    primaryText: "Explore Logistics",
    primaryHref: "/logistics",
    secondaryText: "Get in Touch",
    secondaryHref: "/contact",
  },
  {
    id: 5,
    eyebrow: "Real Estate & Development",
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
    eyebrow: "Building Materials",
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

const SLIDE_DURATION = 7000; // ms each slide stays
const SWIPE_DISTANCE = 50; // px a finger must move to count as a swipe

// Text: the container staggers its children; each child rises in
const textContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  // Autoplay — restarts the timer whenever the slide changes
  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, [paused, active]);

  const nextSlide = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActive(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  // Mobile swipe
  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    setPaused(true);
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const distance =
      event.changedTouches[0].clientX - touchStartX.current;

    if (distance <= -SWIPE_DISTANCE) nextSlide();
    if (distance >= SWIPE_DISTANCE) previousSlide();

    touchStartX.current = null;
    window.setTimeout(() => setPaused(false), 5000);
  }

  const slide = slides[active];

  return (
    <section
      aria-label="Yusfaith Global Enterprises introduction"
      className="relative isolate min-h-[700px] overflow-hidden bg-[#0f1a3d] text-white lg:min-h-[780px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background photographs: all stacked; the active one fades in on
          top and slowly zooms out. No dark gap between slides. */}
      {slides.map((item, index) => {
        const isActive = index === active;

        return (
          <div
            key={item.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              isActive ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Image
              src={item.image}
              alt={isActive ? `${item.title} ${item.highlight}` : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover ease-out ${
                reduceMotion
                  ? ""
                  : "transition-transform duration-[8000ms]"
              } ${isActive ? "scale-100" : "scale-110"}`}
            />
          </div>
        );
      })}

      {/* Dark gradient for readable text */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/70 to-[#0a1230]/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a1230]/70 via-transparent to-[#0a1230]/20" />

      {/* Decorative accent */}
      <div className="pointer-events-none absolute left-0 top-1/3 z-[3] hidden h-32 w-1 bg-[#ef850f] lg:block" />

      <div className="container-main relative z-10 flex min-h-[700px] items-center py-32 lg:min-h-[780px]">
        <div className="max-w-[790px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              variants={textContainer}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              exit="exit"
            >
              {/* Eyebrow badge — sharp white text, orange accents */}
              <motion.div variants={textItem} className="mb-7">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#ef850f]/70 bg-[#0f1a3d]/60 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-black/20 backdrop-blur-md sm:text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef850f] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ef850f]" />
                  </span>
                  {slide.eyebrow}
                </span>
              </motion.div>

              <h1 className="font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-[82px]">
                <motion.span
                  variants={textItem}
                  className="block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
                >
                  {slide.title}
                </motion.span>
                <motion.span
                  variants={textItem}
                  className="block bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text pb-2 text-transparent drop-shadow-[0_2px_18px_rgba(239,133,15,0.35)]"
                >
                  {slide.highlight}
                </motion.span>
              </h1>

              <motion.p
                variants={textItem}
                className="mt-6 max-w-[620px] text-base leading-8 text-white/90 sm:text-lg"
              >
                {slide.description}
              </motion.p>

              <motion.div
                variants={textItem}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                {/* Primary — clean solid logo orange, navy text */}
                <Link
                  href={slide.primaryHref}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#ef850f] px-8 py-4 text-[15px] font-bold text-[#0f1a3d] shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff9a26] hover:shadow-lg hover:shadow-black/30"
                >
                  {slide.primaryText}
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                {/* Secondary — frosted glass, fills white on hover */}
                <Link
                  href={slide.secondaryHref}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0f1a3d]"
                >
                  {slide.secondaryText}
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
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
                    ? "w-12 bg-[#ef850f]"
                    : "w-6 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium tracking-widest text-white/85">
              {String(active + 1).padStart(2, "0")}
              {" / "}
              {String(slides.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/5 text-white backdrop-blur-sm transition hover:border-[#ef850f] hover:bg-[#ef850f] hover:text-[#0f1a3d]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/5 text-white backdrop-blur-sm transition hover:border-[#ef850f] hover:bg-[#ef850f] hover:text-[#0f1a3d]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}