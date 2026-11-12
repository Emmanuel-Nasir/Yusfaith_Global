
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  UserRound,
  ArrowRight,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";


const businesses = [
  {
    name: "Cement Depot",
    href: "/cement",
    description:
      "Wholesale and retail cement distribution across our locations.",
    image: "/images/cement/cement-brands-dropdown.png",
  },
  {
    name: "Building Materials",
    href: "/building-materials",
    description:
      "Construction materials, paints and building supplies.",
    image: "/images/building-materials/materials-hero.jpg",
  },
  {
    name: "Logistics",
    href: "/logistics",
    description:
      "Our own fleet, on-time delivery and truck spare parts.",
    image: "/images/logistics/yusfaith-truck-depot.jpeg",
  },
  {
    name: "Real Estate",
    href: "/real-estate",
    description:
      "Property development and real estate opportunities.",
    image: "/images/real-estate/real-estate-hero.jpg",
  },
  {
    name: "Bakery",
    href: "/bakery",
    description:
      "Freshly baked products and quality bakery services.",
    image: "/images/bakery/product-bread-assortment.jpg",
  },
];


const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [businessesOpen, setBusinessesOpen] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState(0);

  const active = businesses[activeBusiness];

  function closeMenus() {
    setMobileOpen(false);
    setBusinessesOpen(false);
  }

  useEffect(() => {
    // Close menus after route navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setBusinessesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-sm">
      <nav
        className="container-main flex h-20 items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        {/* Corporate logo */}

        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.07, rotate: -2 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
            className="relative h-12 w-12 overflow-hidden rounded-lg bg-white p-1"
          >
            <Image
              src="/images/corporate/Official Yusfaith Company Logo.png"
              alt="Yusfaith company logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </motion.div>

          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wide text-[var(--foreground)] transition-colors group-hover:text-[var(--secondary)]">
              YUSFAITH
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--secondary)]">
              Global Enterprises
            </span>
          </div>
        </Link>

        {/* Desktop links */}

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className="nav-link text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => {
              setBusinessesOpen(!businessesOpen);
              setActiveBusiness(0);
            }}
            aria-expanded={businessesOpen}
            aria-controls="business-mega-menu"
            className="nav-link text-sm font-medium"
          >
            Our Businesses

            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                businessesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className="nav-link text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop controls */}

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          <Link
            href="/account"
            onClick={closeMenus}
            className="group flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-[#e5b72e] hover:shadow-[0_0_18px_rgba(229,183,46,0.35)]"
          >
            <UserRound size={17} />
            Account
            <ArrowUpRight
              size={14}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        </div>

        {/* Mobile controls */}

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setBusinessesOpen(false);
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="rounded-xl border border-[var(--border)] p-2 transition-colors hover:border-[#e5b72e]"
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </nav>

      {/* ======================================
          DESKTOP PHOTOGRAPHIC MEGA-MENU
      ====================================== */}

      <AnimatePresence>
        {businessesOpen && (
          <motion.div
            id="business-mega-menu"
            initial={{ opacity: 0, y: -22, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 27,
              mass: 0.75,
            }}
            className="absolute inset-x-0 top-full hidden border-t border-[var(--border)] bg-[var(--background)] shadow-2xl lg:block"
          >
            <div className="container-main grid grid-cols-12 gap-10 py-10">
              {/* Business list */}

              <div className="col-span-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">
                  Discover Yusfaith
                </p>

                <h2 className="mb-6 text-4xl font-semibold">
                  Our Businesses
                </h2>

                <div className="space-y-2">
                  {businesses.map((business, index) => (
                    <Link
                      key={business.href}
                      href={business.href}
                      data-active={activeBusiness === index}
                      onMouseEnter={() => setActiveBusiness(index)}
                      onFocus={() => setActiveBusiness(index)}
                      onClick={closeMenus}
                      className="mega-business-link group flex items-center justify-between rounded-xl px-5 py-4"
                    >
                      <span className="font-semibold">
                        {business.name}
                      </span>

                      <ArrowUpRight
                        size={19}
                        className="text-[var(--secondary)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Featured business photograph */}

              <div className="col-span-7">
                <div className="relative h-[380px] overflow-hidden rounded-2xl bg-[var(--surface)] shadow-xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.href}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.image}
                        alt={active.name}
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      <div className="absolute bottom-0 left-0 p-8 text-white">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f1cb61]">
                          Yusfaith Global Enterprises
                        </p>

                        <h3 className="text-4xl font-semibold">
                          {active.name}
                        </h3>

                        <p className="mt-2 text-sm text-white/85">
                          {active.description}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#f1cb61]">
                          Explore Business
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================
          MOBILE FULL-SCREEN MENU
      ====================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 35 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-[var(--border)] bg-[var(--background)] px-6 py-8 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className="rounded-xl px-4 py-4 text-lg font-semibold transition-colors hover:bg-[var(--surface)]"
                >
                  {link.name}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => setBusinessesOpen(!businessesOpen)}
                aria-expanded={businessesOpen}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-left text-lg font-semibold transition-colors hover:bg-[var(--surface)]"
              >
                Our Businesses

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    businessesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {businessesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 flex flex-col border-l-2 border-[#e5b72e] pl-4">
                      {businesses.map((business) => (
                        <Link
                          key={business.href}
                          href={business.href}
                          onClick={closeMenus}
                          className="rounded-lg px-3 py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                        >
                          {business.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className="rounded-xl px-4 py-4 text-lg font-semibold transition-colors hover:bg-[var(--surface)]"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/account"
                onClick={closeMenus}
                className="btn-primary mt-6"
              >
                <UserRound size={18} />
                Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
