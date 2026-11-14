import { Headset, Phone } from "lucide-react";
import { contactsFor, telLink } from "@/lib/order-contacts";
import type { Subsidiary } from "@/lib/orders";

type Props = {
  subsidiary: Subsidiary;
  productIds: string[];
  orderId?: string;
  compact?: boolean; // smaller layout for checkout and confirmation pop-ups
};

/** "Need help?" box with the right people to call about an order. */
export default function HelpContacts({ subsidiary, productIds, orderId, compact = false }: Props) {
  const contacts = contactsFor(subsidiary, productIds);
  if (contacts.length === 0) return null;

  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left ${
        compact ? "mt-5 p-4" : "mt-8 p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef850f]/15">
          <Headset size={18} style={{ color: "var(--gold-text)" }} />
        </span>
        <div>
          <h3 className={`font-bold ${compact ? "text-base" : "text-lg"}`} style={{ color: "var(--foreground)" }}>
            Need help with your order?
          </h3>
          <p className="mt-0.5 text-sm leading-6" style={{ color: "var(--muted)" }}>
            Questions about price, payment or delivery? Call or WhatsApp us
            {orderId ? (
              <>
                {" "}and quote your order reference{" "}
                <strong style={{ color: "var(--foreground)" }}>{orderId}</strong>
              </>
            ) : null}
            .
          </p>
        </div>
      </div>

      <ul className={`grid gap-2 ${compact ? "mt-3" : "mt-4 sm:grid-cols-2"}`}>
        {contacts.map((c) => (
          <li key={c.label + c.phone}>
            <a
              href={telLink(c.phone)}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 transition hover:border-[var(--gold)]"
            >
              <Phone size={16} className="shrink-0" style={{ color: "var(--gold-text)" }} />
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {c.label === c.role ? c.label : `${c.role} · ${c.label}`}
                </span>
                <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                  {c.phone}
                </span>
                {c.name && (
                  <span className="block truncate text-xs" style={{ color: "var(--muted)" }}>
                    {c.name}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
