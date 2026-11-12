"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Award, Mail, Phone, X } from "lucide-react";
import { LEADERSHIP, telLink, type Person } from "@/data/company";

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
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function initials(name: string) {
  return name
    .replace(/^(Alhaji|Mr|Mrs|Miss|Ms|Dr)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/* Photo, or the person's initials until a photo is supplied */
function Portrait({
  person,
  sizes,
  className = "",
}: {
  person: Person;
  sizes: string;
  className?: string;
}) {
  if (person.image) {
    return (
      <Image
        src={person.image}
        alt={`${person.name}, ${person.role}`}
        fill
        sizes={sizes}
        className={`object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${person.name}, ${person.role}`}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#18265f] to-[#2263a3]"
    >
      <span className="font-heading text-6xl font-semibold text-white/90">
        {initials(person.name)}
      </span>
    </div>
  );
}

function ContactLinks({ person, light = false }: { person: Person; light?: boolean }) {
  if (!person.phone && !person.email) return null;
  const linkClass = light
    ? "inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#0f1a3d]"
    : "inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]";

  return (
    <div className="flex flex-wrap gap-2">
      {person.phone && (
        <a href={telLink(person.phone)} className={linkClass}>
          <Phone size={15} style={light ? undefined : { color: "var(--gold-text)" }} />
          {person.phone}
        </a>
      )}
      {person.email && (
        <a href={`mailto:${person.email}`} className={linkClass}>
          <Mail size={15} style={light ? undefined : { color: "var(--gold-text)" }} />
          {person.email}
        </a>
      )}
    </div>
  );
}

/* Full profile in a pop-up */
function ProfileDialog({ person, onClose }: { person: Person; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${person.name}, ${person.role}`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-[var(--background)] sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground)] transition hover:bg-[#ef850f] hover:text-[#0f1a3d]"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[460px]">
            <Portrait person={person} sizes="(max-width: 768px) 100vw, 40vw" />
          </div>

          <div className="p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--gold-text)" }}>
              {person.role}
            </p>
            <h3 className="mt-2 pr-10 font-heading text-4xl font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
              {person.name}
            </h3>
            {person.credentials && (
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                {person.credentials}
              </p>
            )}

            <div className="mt-6 space-y-4 text-[15px] leading-7" style={{ color: "var(--muted)" }}>
              {(person.bio ?? [person.summary]).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            {person.highlights && person.highlights.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {person.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    <Award size={17} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7">
              <ContactLinks person={person} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadershipProfiles() {
  const [ceo, ...team] = LEADERSHIP;
  const [open, setOpen] = useState<Person | null>(null);

  return (
    <section id="leadership" className="section-padding scroll-mt-20" style={{ backgroundColor: "var(--surface)" }}>
      <div className="container-main">
        <FadeUp className="mb-12 max-w-2xl">
          <p
            className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
            style={{ color: "var(--gold-text)" }}
          >
            <span className="h-px w-8" style={{ background: "var(--gold)" }} />
            Our Leadership
          </p>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl" style={{ color: "var(--foreground)" }}>
            The People Behind Yusfaith
          </h2>
          <p className="mt-5 text-base leading-8" style={{ color: "var(--muted)" }}>
            A management team with strong backgrounds in finance, operations,
            logistics and customer service, supported by dedicated staff
            committed to operational excellence.
          </p>
        </FadeUp>

        {/* ---------- CEO feature ---------- */}
        <FadeUp>
          <article className="grid overflow-hidden rounded-3xl bg-[#0f1a3d] text-white shadow-xl md:grid-cols-[2fr_3fr]">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[520px]">
              <Portrait person={ceo} sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <span className="w-fit rounded-full bg-[#ef850f] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#0f1a3d]">
                {ceo.role}
              </span>
              <h3 className="mt-5 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
                {ceo.name}
              </h3>
              {ceo.credentials && (
                <p className="mt-2 text-sm font-semibold text-[#ffb347]">{ceo.credentials}</p>
              )}
              <div className="mt-6 space-y-4 text-[15px] leading-7 text-white/85">
                {(ceo.bio ?? [ceo.summary]).slice(0, 2).map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              {ceo.highlights && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {ceo.highlights.map((item) => (
                    <span key={item} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen(ceo)}
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#ef850f] px-7 py-3.5 text-sm font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                Read full profile
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </article>
        </FadeUp>

        {/* ---------- Management team ---------- */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((person, index) => (
            <FadeUp key={person.name} delay={(index % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Portrait
                    person={person}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--gold-text)" }}>
                    {person.role}
                  </p>
                  <h3 className="mt-2 text-xl font-bold" style={{ color: "var(--foreground)" }}>
                    {person.name}
                  </h3>
                  {person.credentials && (
                    <p className="mt-0.5 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                      {person.credentials}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
                    {person.summary}
                  </p>

                  <div className="mt-5 space-y-3">
                    <ContactLinks person={person} />
                    {person.bio && (
                      <button
                        type="button"
                        onClick={() => setOpen(person)}
                        className="inline-flex items-center gap-2 text-sm font-bold"
                        style={{ color: "var(--gold-text)" }}
                      >
                        View profile
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProfileDialog person={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
