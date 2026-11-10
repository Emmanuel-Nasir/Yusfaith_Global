"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Lock,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";

export type AuthMode = "signin" | "signup";

type Values = { name: string; email: string; phone: string; password: string };

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-11 pr-4 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const BENEFITS = [
  "Follow orders from every Yusfaith business",
  "Save your delivery addresses",
  "Checkout fills in your details for you",
];

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      <span className="relative block">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />
        {children}
      </span>
    </label>
  );
}

export default function AuthCard({
  mode,
  onSwitch,
  values,
  onChange,
  error,
  onSubmit,
}: {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
  values: Values;
  onChange: (field: keyof Values, value: string) => void;
  error: string;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const signin = mode === "signin";

  return (
    <main className="relative isolate overflow-hidden bg-[#0f1a3d]">
      {/* Page background */}
      <Image
        src="/images/corporate/Headquarters.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1230]/95 via-[#0a1230]/88 to-[#18265f]/85" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#ef850f]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#2263a3]/30 blur-3xl" />

      <div className="container-main relative z-10 pb-14 pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
        >
          <ArrowLeft size={16} />
          Back to Yusfaith
        </Link>

        {/* The sliding card */}
        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl ring-1 ring-white/10 lg:relative lg:h-[740px]">
          {/* ---------- Picture panel ---------- */}
          <div
            className={`relative isolate flex min-h-[300px] items-end overflow-hidden bg-[#0f1a3d] p-8 text-white sm:p-10 lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 lg:transition-transform lg:duration-[800ms] lg:ease-in-out lg:motion-reduce:transition-none ${
              signin ? "lg:translate-x-0" : "lg:translate-x-full"
            }`}
          >
            <Image
              src="/images/corporate/Headquarters2.jpeg"
              alt="Yusfaith Global Enterprises head office"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1230]/95 via-[#0a1230]/70 to-[#0a1230]/30" />

            <p className="absolute left-8 top-8 text-xs font-bold uppercase tracking-[0.2em] text-white/90 sm:left-10 sm:top-10">
              Yusfaith Global Enterprises
            </p>

            <div className="relative w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <h2 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
                    {signin ? (
                      "Welcome back."
                    ) : (
                      <>
                        Join{" "}
                        <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                          Yusfaith.
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="mt-3 max-w-sm text-[15px] leading-7 text-white/85">
                    {signin
                      ? "Sign in to follow your orders from Cement, Building Materials and Bakery."
                      : "One account for every Yusfaith business. It takes a minute."}
                  </p>

                  <ul className="mt-6 hidden space-y-3 lg:block">
                    {BENEFITS.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onSwitch(signin ? "signup" : "signin")}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
                  >
                    {signin ? "Create an account" : "Sign in instead"}
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ---------- Form panel ---------- */}
          <div
            className={`relative flex items-center justify-center p-7 sm:p-10 lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 lg:transition-transform lg:duration-[800ms] lg:ease-in-out lg:motion-reduce:transition-none ${
              signin ? "lg:translate-x-full" : "lg:translate-x-0"
            }`}
          >
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
                    {signin ? "Sign in" : "Create account"}
                  </h1>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                    {signin
                      ? "You never need an account to browse or to order."
                      : "Use the phone number you give when you order, so your orders show up here."}
                  </p>

                  <form onSubmit={onSubmit} noValidate className="mt-6 space-y-3.5">
                    {!signin && (
                      <Field label="Full name" icon={User}>
                        <input
                          className={inputClass}
                          value={values.name}
                          onChange={(e) => onChange("name", e.target.value)}
                          autoComplete="name"
                        />
                      </Field>
                    )}

                    <Field label="Email address" icon={Mail}>
                      <input
                        className={inputClass}
                        type="email"
                        value={values.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        autoComplete="email"
                      />
                    </Field>

                    {!signin && (
                      <Field label="Phone number" icon={Phone}>
                        <input
                          className={inputClass}
                          type="tel"
                          placeholder="08012345678"
                          value={values.phone}
                          onChange={(e) => onChange("phone", e.target.value)}
                          autoComplete="tel"
                        />
                      </Field>
                    )}

                    <Field label="Password" icon={Lock}>
                      <input
                        className={inputClass}
                        type="password"
                        value={values.password}
                        onChange={(e) => onChange("password", e.target.value)}
                        autoComplete={signin ? "current-password" : "new-password"}
                      />
                    </Field>

                    {error && (
                      <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                    >
                      {signin ? "Sign in" : "Create account"}
                      <ArrowRight size={18} />
                    </button>
                  </form>

                  <p className="mt-5 text-center text-sm lg:hidden" style={{ color: "var(--muted)" }}>
                    {signin ? "New here? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => onSwitch(signin ? "signup" : "signin")}
                      className="font-bold underline-offset-4 hover:underline"
                      style={{ color: "var(--gold-text)" }}
                    >
                      {signin ? "Create an account" : "Sign in"}
                    </button>
                  </p>

                  <p
                    className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-xs leading-5"
                    style={{ color: "var(--muted)" }}
                  >
                    <Info size={15} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
                    <span>
                      <strong style={{ color: "var(--foreground)" }}>Demo only.</strong>{" "}
                      Passwords are not checked or stored. Please do not enter a
                      real password. The real website will use a secure login.
                    </span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}