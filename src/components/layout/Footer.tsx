
import Link from "next/link";
import Image from "next/image";

import {
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa6";


const businesses = [
  { name: "Cement Depot", href: "/cement" },
  { name: "Building Materials", href: "/building-materials" },
  { name: "Logistics", href: "/logistics" },
  { name: "Real Estate", href: "/real-estate" },
  { name: "Bakery", href: "/bakery" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Businesses", href: "/businesses" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];
export default function Footer() {
  return (
    <footer className="bg-[#0b1629] text-white">
      <div className="container-main py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="mb-6 flex items-center gap-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src="/images/corporate/Official Yusfaith Company Logo.png"
                  alt="Yusfaith company logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>

              <span className="text-sm font-bold leading-5 tracking-wide text-[#ff9a26]">
                YUSFAITH GLOBAL
                <br />
                ENTERPRISES
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/70">
              Building solutions through cement distribution and
              building materials, logistics and real estate, to
              our bakery.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[#ff9a26]">
              Building Trust. Creating Possibilities.
            </p>
          </div>

          {/* Business links */}
          <div>
            <h3 className="mb-6 font-heading text-2xl font-semibold text-[#ff9a26]">
              Our Businesses
            </h3>

            <ul className="space-y-4">
              {businesses.map((business) => (
                <li key={business.name}>
                  <Link
                    href={business.href}
                    className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-[#ff9a26]"
                  >
                    {business.name}
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-6 font-heading text-2xl font-semibold text-[#ff9a26]">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-[#ff9a26]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 font-heading text-2xl font-semibold text-[#ff9a26]">
              Contact & Locations
            </h3>

            <div className="space-y-5 text-sm leading-7 text-white/75">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-1 shrink-0 text-[#ff9a26]"
                />
                <div>
                  <p className="font-semibold text-white">
                    Ogun State (Head Office)
                  </p>
                  <p>
                    KM 6, Lagos–Abeokuta Expressway,
                    Ile-Ise Awo, beside Sholanke
                    Filling Station, Abeokuta,
                    Ogun State.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Lagos State (Epe)
                </p>
                <p>
                  No. 33/34 Lagos Road, beside
                  Benjude Supermarket, Epe.
                </p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Oyo State (Ibadan)
                </p>
                <p>Adeoyo, off Ring Road, Ibadan.</p>
              </div>

              <div>
                <p className="font-semibold text-white">
                  Osun State
                </p>
                <p>Osun Depot</p>
              </div>

              <a
                href="mailto:olasunkanmidepot1985@gmail.com"
                className="inline-flex items-center gap-2 break-all text-[#ff9a26] hover:underline"
              >
                <Mail size={16} className="shrink-0" />
                olasunkanmidepot1985@gmail.com
              </a>
            </div>
          </div>
        </div>

    
        {/* Social Media Section */}
        <div className="mt-14 border-t border-white/15 pt-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-heading text-2xl font-semibold text-[#ff9a26]">
                Connect With Us
              </h3>

              <p className="mt-2 max-w-md text-sm leading-7 text-white/65">
                Follow Yusfaith Global Enterprises for company news,
                business updates, projects and opportunities.
              </p>
            </div>

            
<div className="flex flex-wrap items-center gap-3">
  {[
    { name: "Facebook", Icon: FaFacebookF },
    { name: "Instagram", Icon: FaInstagram },
    { name: "TikTok", Icon: FaTiktok },
    { name: "LinkedIn", Icon: FaLinkedinIn },
    { name: "YouTube", Icon: FaYoutube },
    { name: "WhatsApp", Icon: FaWhatsapp },
  ].map(({ name, Icon }) => (
    <div
      key={name}
      title={`${name} — official link coming soon`}
      aria-label={`${name} — official link coming soon`}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ef850f]/35 bg-white/5 text-[#ff9a26] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff9a26] hover:bg-[#ef850f]/15"
    >
      <Icon size={20} />
    </div>
  ))}
</div>

          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/20 pt-7 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            © 2026 Yusfaith Global Enterprises / Olasunkanmi Global Enterprise.
            All rights reserved.
          </p>

          <p>Quality • Reliability • Growth</p>
        </div>
      </div>
    </footer>
  );
}
