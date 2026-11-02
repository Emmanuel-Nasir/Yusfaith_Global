
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Building2,
} from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="enquiries"
      className="relative overflow-hidden bg-[#0b1629] py-20 text-white sm:py-24 lg:py-28"
    >
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d9ad45]/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 h-[450px] w-[450px] rounded-full border border-[#d9ad45]/10"
      />

      <div className="container-main relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          {/* Main content */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#f2c85b]">
              LET&apos;S CONNECT
            </p>

            <h2 className="max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Let&apos;s Build
              <span className="block text-[#f2c85b]">
                Something Meaningful.
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70">
              Whether you&apos;re looking for dependable cement
              distribution, exploring a business partnership or
              making enquiries about our services, we welcome
              the opportunity to hear from you.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-md bg-[#f2c85b] px-7 py-4 text-sm font-semibold text-[#0b1629] transition-colors hover:bg-[#e5b847]"
              >
                Contact Our Team
                <ArrowUpRight size={18} />
              </Link>

              <a
                href="mailto:olasunkanmidepot1985@gmail.com"
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-md border border-white/30 px-7 py-4 text-sm font-semibold text-white transition-colors hover:border-[#f2c85b] hover:text-[#f2c85b]"
              >
                <Mail size={18} />
                Send an Email
              </a>
            </div>
          </div>

          {/* Contact information */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-7 sm:p-9">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f2c85b]/10 text-[#f2c85b]">
                <Building2 size={24} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/50">
                  Yusfaith Global Enterprises
                </p>
                <h3 className="mt-1 font-heading text-2xl font-semibold text-white">
                  Get in Touch
                </h3>
              </div>
            </div>

            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-[#f2c85b]"
                />

                <div>
                  <p className="font-semibold text-white">
                    Corporate Head Office
                  </p>

                  <p className="mt-2 text-sm leading-7 text-white/65">
                    KM 6, Lagos–Abeokuta Expressway,
                    Ile-Ise Awo, beside Sholanke Filling
                    Station, Abeokuta, Ogun State.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/15 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#f2c85b]">
                  Other Locations
                </p>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  Epe, Lagos
                  <span className="mx-2 text-[#f2c85b]">•</span>
                  Ibadan, Oyo State
                </p>
              </div>

              <div className="border-t border-white/15 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#f2c85b]">
                  Email Enquiries
                </p>

                <a
                  href="mailto:olasunkanmidepot1985@gmail.com"
                  className="mt-3 block break-all text-sm text-white/80 hover:text-[#f2c85b]"
                >
                  olasunkanmidepot1985@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
