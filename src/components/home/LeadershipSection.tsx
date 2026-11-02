
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const values = [
  {
    title: "Integrity",
    description:
      "We believe that trust, honesty and accountability are essential to lasting business relationships.",
    Icon: ShieldCheck,
  },
  {
    title: "Partnership",
    description:
      "We aim to build meaningful relationships with customers, suppliers and communities.",
    Icon: Handshake,
  },
  {
    title: "Progress",
    description:
      "We continually look for opportunities to improve our services and support business growth.",
    Icon: TrendingUp,
  },
];

export default function LeadershipSection() {
  return (
    <section
      id="leadership"
      className="section-padding"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="container-main">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Leadership Image */}
          <div className="relative">
            <div className="relative h-[380px] overflow-hidden rounded-2xl sm:h-[480px] lg:h-[570px]">
              <Image
                src="/images/corporate/Ceo's office.jpeg"
                alt="Yusfaith Global Enterprises executive office"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071425]/65 via-transparent to-transparent" />

              <div className="absolute bottom-7 left-7 right-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f2c85b]">
                  Corporate Leadership
                </p>
                <p className="mt-2 font-heading text-2xl font-semibold text-white">
                  A Vision for Sustainable Growth
                </p>
              </div>
            </div>

            <div
              className="absolute -bottom-5 right-5 rounded-xl border px-6 py-5 shadow-xl sm:right-8"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--gold-text)" }}
              >
                Our Commitment
              </p>
              <p
                className="mt-1 font-heading text-xl font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Trust. Service. Growth.
              </p>
            </div>
          </div>

          {/* Leadership Content */}
          <div className="pt-8 lg:pt-0">
            <p className="hero-accent mb-5">
              OUR LEADERSHIP PHILOSOPHY
            </p>

            <h2
              className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              style={{ color: "var(--foreground)" }}
            >
              Leadership Built
              <span
                className="block"
                style={{ color: "var(--gold-text)" }}
              >
                on Purpose.
              </span>
            </h2>

            <p
              className="mt-7 text-base leading-8"
              style={{ color: "var(--muted)" }}
            >
              At Yusfaith Global Enterprises, our approach to
              business is guided by a commitment to dependable
              service, strong relationships and long-term progress.
            </p>

            <p
              className="mt-5 text-base leading-8"
              style={{ color: "var(--muted)" }}
            >
              Across our business interests, we aim to create
              practical value for customers while developing
              opportunities that contribute to the communities
              we serve.
            </p>

            <div
              className="mt-8 border-l-4 py-2 pl-6"
              style={{ borderColor: "var(--gold)" }}
            >
              <p
                className="font-heading text-xl italic leading-relaxed sm:text-2xl"
                style={{ color: "var(--foreground)" }}
              >
                Our direction is shaped by the belief that
                lasting success begins with trust and is
                sustained through consistent service.
              </p>
            </div>

            <p
              className="mt-4 text-xs italic"
              style={{ color: "var(--muted)" }}
            >
              Corporate philosophy — not an attributed executive quote.
            </p>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-3 rounded-md px-7 py-4 text-sm font-semibold"
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              Learn More About Yusfaith
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        {/* Corporate Values */}
        <div className="mt-24">
          <div className="mb-9">
            <p className="hero-accent mb-4">
              WHAT GUIDES US
            </p>

            <h3
              className="font-heading text-3xl font-semibold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              Our Corporate Values
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="flex h-full flex-col rounded-xl border p-7"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="mb-6 flex h-13 w-13 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--gold-text)",
                  }}
                >
                  <Icon size={26} strokeWidth={1.7} />
                </div>

                <h4
                  className="font-heading text-2xl font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {title}
                </h4>

                <p
                  className="mt-4 text-sm leading-7"
                  style={{ color: "var(--muted)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
