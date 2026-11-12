"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import {
  BUSINESSES,
  COMPANY,
  LOCATIONS,
  WHATSAPP_NUMBER,
  mapsEmbed,
  mapsLink,
  telLink,
} from "@/data/company";

/* ---------- Small shared pieces ---------- */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
      style={{ color: "var(--gold-text)" }}
    >
      <span className="h-px w-8" style={{ background: "var(--gold)" }} />
      {children}
    </p>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ---------- Form ---------- */

type FormValues = {
  name: string;
  phone: string;
  email: string;
  business: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  name: "",
  phone: "",
  email: "",
  business: "General enquiry",
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const phone = values.phone.replace(/[\s-]/g, "");

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!/^(\+?234|0)[789][01]\d{8}$/.test(phone)) {
    errors.phone = "Enter a valid Nigerian phone number, e.g. 08012345678.";
  }

  if (
    values.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = "Enter a valid email address, or leave it blank.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please tell us a little more (at least 10 characters).";
  }

  return errors;
}

function enquirySummary(values: FormValues) {
  return [
    `Hello Yusfaith, my name is ${values.name.trim()}.`,
    `Enquiry: ${values.business}`,
    "",
    values.message.trim(),
    "",
    `Phone: ${values.phone.trim()}`,
    values.email.trim() ? `Email: ${values.email.trim()}` : "",
  ]
    .filter((line, index, all) => line !== "" || all[index - 1] !== "")
    .join("\n");
}

/* ---------- Page ---------- */

export default function ContactContent() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [activeLocation, setActiveLocation] = useState(0);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length === 0) {
      setSubmitted(values);
      setValues(EMPTY_FORM);
    }
  }

  const location = LOCATIONS[activeLocation];

  const quickContacts = [
    {
      Icon: Phone,
      title: "Call our office",
      detail: COMPANY.officeLine,
      href: telLink(COMPANY.officeLine),
      external: false,
    },
    {
      Icon: MessageCircle,
      title: "Chat on WhatsApp",
      detail: "Quick replies from our sales team",
      href: whatsappLink("Hello Yusfaith, I would like to make an enquiry."),
      external: true,
    },
    {
      Icon: Mail,
      title: "Send an email",
      detail: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
      external: false,
    },
  ];

  return (
    <main>
      {/* ================= PAGE HEADER ================= */}
      <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-[#0f1a3d] text-white sm:min-h-[480px]">
        <Image
          src="/images/cement/Epe warehouse3.jpeg"
          alt="Yusfaith Global Enterprises Epe office with company signage"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1230]/95 via-[#0a1230]/80 to-[#0a1230]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/80 via-transparent to-transparent" />

        <div className="container-main relative z-10 pb-16 pt-32 sm:pb-20">
          <FadeUp>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
              <Link href="/" className="transition hover:text-[#ff9a26]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Contact</span>
            </nav>

            <h1 className="font-heading text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Let&apos;s{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                Talk.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
              Questions about cement, building materials, deliveries or any of
              our businesses? Call, chat or send us a message.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ================= QUICK CONTACT ================= */}
      <section className="relative z-10 -mt-10">
        <div className="container-main grid gap-5 md:grid-cols-3">
          {quickContacts.map(({ Icon, title, detail, href, external }, index) => (
            <FadeUp key={title} delay={index * 0.08}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex h-full items-center gap-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-xl"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#ef850f] text-[#0f1a3d] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={24} />
                </span>
                <span className="min-w-0">
                  <span
                    className="block text-lg font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {title}
                  </span>
                  <span
                    className="block truncate text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {detail}
                  </span>
                </span>
              </a>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ================= FORM + DETAILS ================= */}
      <section className="section-padding">
        <div className="container-main grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* Enquiry form */}
          <FadeUp>
            <div
              className="rounded-2xl border p-7 sm:p-10"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <Eyebrow>Send an Enquiry</Eyebrow>
              <h2
                className="font-heading text-4xl font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                How can we help?
              </h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 rounded-2xl border p-7"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--gold)",
                    }}
                  >
                    <CheckCircle2 size={40} className="text-[#ef850f]" />
                    <h3
                      className="mt-4 text-2xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      Thank you, {submitted.name.split(" ")[0]}.
                    </h3>
                    <p
                      className="mt-3 text-[15px] leading-7"
                      style={{ color: "var(--muted)" }}
                    >
                      <strong style={{ color: "var(--foreground)" }}>
                        Demo only:
                      </strong>{" "}
                      this enquiry has not been sent to Yusfaith. In the full
                      website it will go straight to the sales team. To reach
                      them now, send the same message on WhatsApp or by email:
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={whatsappLink(enquirySummary(submitted))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-3 text-sm font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                      >
                        <MessageCircle size={17} />
                        Send on WhatsApp
                      </a>
                      <a
                        href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(
                          `Website enquiry: ${submitted.business}`
                        )}&body=${encodeURIComponent(enquirySummary(submitted))}`}
                        className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <Mail size={17} />
                        Send by email
                      </a>
                      <button
                        type="button"
                        onClick={() => setSubmitted(null)}
                        className="px-2 py-3 text-sm font-semibold underline-offset-4 hover:underline"
                        style={{ color: "var(--gold-text)" }}
                      >
                        New enquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-8 grid gap-5 sm:grid-cols-2"
                  >
                    <Field
                      label="Full name"
                      required
                      error={errors.name}
                      className="sm:col-span-2"
                    >
                      <input
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                        aria-invalid={Boolean(errors.name)}
                      />
                    </Field>

                    <Field label="Phone number" required error={errors.phone}>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="08012345678"
                        value={values.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass}
                        aria-invalid={Boolean(errors.phone)}
                      />
                    </Field>

                    <Field label="Email (optional)" error={errors.email}>
                      <input
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                        aria-invalid={Boolean(errors.email)}
                      />
                    </Field>

                    <Field label="What is it about?" className="sm:col-span-2">
                      <select
                        value={values.business}
                        onChange={(e) => update("business", e.target.value)}
                        className={inputClass}
                      >
                        <option>General enquiry</option>
                        {BUSINESSES.map((business) => (
                          <option key={business.href}>{business.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label="Message"
                      required
                      error={errors.message}
                      className="sm:col-span-2"
                    >
                      <textarea
                        rows={5}
                        placeholder="e.g. I need 300 bags of Dangote cement delivered to Abeokuta next week."
                        value={values.message}
                        onChange={(e) => update("message", e.target.value)}
                        className={`${inputClass} resize-y`}
                        aria-invalid={Boolean(errors.message)}
                      />
                    </Field>

                    <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        Demo form: messages are not sent yet.
                      </p>
                      <button
                        type="submit"
                        className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{
                          backgroundColor: "var(--button-bg)",
                          color: "var(--button-text)",
                        }}
                      >
                        Send Enquiry
                        <Send
                          size={17}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>

          {/* Direct details */}
          <FadeUp delay={0.1} className="space-y-6">
            <div>
              <Eyebrow>Direct Lines</Eyebrow>
              <ul className="space-y-3">
                {[COMPANY.officeLine, ...COMPANY.phones].map((phone, index) => (
                  <li key={phone}>
                    <a
                      href={telLink(phone)}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] px-5 py-4 transition hover:border-[var(--gold)]"
                    >
                      <span
                        className="flex items-center gap-3 font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        <Phone size={18} style={{ color: "var(--gold-text)" }} />
                        {phone}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {index === 0 ? "Office line" : "Telephone"}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-5 py-4 font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
                  >
                    <Mail size={18} style={{ color: "var(--gold-text)" }} />
                    <span className="truncate">{COMPANY.email}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div
              className="rounded-2xl p-7 text-white"
              style={{ backgroundColor: "#0f1a3d" }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a26]">
                Bulk orders
              </p>
              <p className="mt-3 font-heading text-2xl font-semibold">
                Ordering cement or materials in bulk?
              </p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Browse products and place a demo order online, then our team
                confirms price, payment and delivery.
              </p>
              <Link
                href="/cement"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ff9a26] transition hover:gap-3"
              >
                Go to Cement Depot
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================= LOCATIONS + MAP ================= */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="container-main">
          <FadeUp className="mb-10 max-w-2xl">
            <Eyebrow>Visit Us</Eyebrow>
            <h2
              className="font-heading text-4xl font-semibold sm:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              Our Locations
            </h2>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
            <FadeUp className="space-y-4">
              {LOCATIONS.map((item, index) => {
                const isActive = index === activeLocation;

                return (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => setActiveLocation(index)}
                    aria-pressed={isActive}
                    className="block w-full rounded-2xl border p-6 text-left transition-all duration-300"
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: isActive ? "var(--gold)" : "var(--border)",
                      boxShadow: isActive
                        ? "inset 4px 0 0 var(--gold)"
                        : undefined,
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-[0.12em]"
                      style={{ color: "var(--gold-text)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="mt-2 block font-heading text-2xl font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.state}
                    </span>
                    <span
                      className="mt-2 flex gap-2 text-sm leading-6"
                      style={{ color: "var(--muted)" }}
                    >
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--gold-text)" }}
                      />
                      {item.address}
                    </span>
                  </button>
                );
              })}
            </FadeUp>

            <FadeUp delay={0.1}>
              <div
                className="overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--border)" }}
              >
                <iframe
                  key={location.city}
                  title={`Map of Yusfaith ${location.state}`}
                  src={mapsEmbed(location.address)}
                  className="h-[380px] w-full sm:h-[460px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Yusfaith {location.label}
                  </span>
                  <a
                    href={mapsLink(location.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold"
                    style={{ color: "var(--gold-text)" }}
                  >
                    Get directions
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Form field wrapper ---------- */

function Field({
  label,
  required = false,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span
        className="mb-2 block text-sm font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        {label}
        {required && <span className="ml-1 text-[#ef850f]">*</span>}
      </span>
      {children}
      {error && (
        <span className="mt-2 inline-block rounded-md bg-red-50 px-2.5 py-1 text-sm font-medium text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}