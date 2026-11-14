"use client";

import { useState } from "react";
import { Check, Copy, Landmark } from "lucide-react";
import { BANK_ACCOUNTS, SALES_CONTACTS } from "@/data/company";
import { telLink } from "@/lib/order-contacts";

type Props = {
  orderId?: string;
  compact?: boolean; // smaller layout for checkout and confirmation pop-ups
};

/** Company bank account(s) for customers paying by transfer. */
export default function BankDetails({ orderId, compact = false }: Props) {
  const [copied, setCopied] = useState("");

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // clipboard blocked: the number is still on screen to copy by hand
    }
  }

  const gm = SALES_CONTACTS.generalManager;

  return (
    <section
      className={`rounded-2xl border border-[#ef850f]/40 bg-[#ef850f]/5 text-left ${
        compact ? "mt-5 p-4" : "mt-8 p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef850f]/15">
          <Landmark size={18} style={{ color: "var(--gold-text)" }} />
        </span>
        <div>
          <h3 className={`font-bold ${compact ? "text-base" : "text-lg"}`} style={{ color: "var(--foreground)" }}>
            Pay by bank transfer
          </h3>
          <p className="mt-0.5 text-sm leading-6" style={{ color: "var(--muted)" }}>
            {BANK_ACCOUNTS.length > 0 ? (
              <>
                Transfer to the account below
                {orderId ? (
                  <>
                    {" "}and use{" "}
                    <strong style={{ color: "var(--foreground)" }}>{orderId}</strong> as the
                    narration
                  </>
                ) : null}
                , then send your receipt {compact ? "on the tracking page" : "below"}.
              </>
            ) : (
              <>
                Please call our General Manager on{" "}
                <a href={telLink(gm.phone)} className="font-bold" style={{ color: "var(--foreground)" }}>
                  {gm.phone}
                </a>{" "}
                for our account details before you pay. Only pay into a Yusfaith
                account confirmed by our staff.
              </>
            )}
          </p>
        </div>
      </div>

      {BANK_ACCOUNTS.length > 0 && (
        <ul className={`grid gap-2 ${compact ? "mt-3" : "mt-4 sm:grid-cols-2"}`}>
          {BANK_ACCOUNTS.map((account) => (
            <li
              key={account.accountNumber}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {account.bank}
                </span>
                <span className="block text-lg font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
                  {account.accountNumber}
                </span>
                <span className="block truncate text-xs" style={{ color: "var(--muted)" }}>
                  {account.accountName}
                </span>
              </span>
              <button
                type="button"
                onClick={() => copy(account.accountNumber)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold transition hover:border-[var(--gold)]"
                style={{ color: "var(--foreground)" }}
              >
                {copied === account.accountNumber ? <Check size={14} /> : <Copy size={14} />}
                {copied === account.accountNumber ? "Copied" : "Copy"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
