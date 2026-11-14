"use client";

import { useEffect, useState } from "react";
import { Eye, Truck } from "lucide-react";
import { formatNaira } from "@/lib/orders";
import {
  DELIVERY_BUSINESSES,
  saveDeliveryFee,
  useDeliveryFees,
  type DeliveryBusiness,
} from "@/lib/delivery-fees";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

function FeeRow({
  business,
  zone,
  fee,
  canEdit,
  onSave,
}: {
  business: DeliveryBusiness;
  zone: string;
  fee: number;
  canEdit: boolean;
  onSave: (business: DeliveryBusiness, zone: string, oldFee: number, newFee: number) => void;
}) {
  const [value, setValue] = useState(String(fee));
  const [message, setMessage] = useState("");
  useEffect(() => setValue(String(fee)), [fee]);

  function save() {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      setMessage("Enter 0 or more.");
      return;
    }
    if (Math.round(n) === fee) {
      setMessage("No change");
      return;
    }
    onSave(business, zone, fee, Math.round(n));
    setMessage("Saved");
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <span className="font-semibold" style={{ color: "var(--foreground)" }}>
        {zone}
      </span>
      {canEdit ? (
        <span className="flex items-center gap-3">
          {message && (
            <span className={`text-xs font-semibold ${message === "Saved" ? "text-green-700" : "text-red-700"}`}>
              {message}
            </span>
          )}
          <span className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>
              ₦
            </span>
            <input
              className={`${inputClass} w-36 pl-7`}
              type="number"
              min={0}
              step={500}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setMessage("");
              }}
              aria-label={`${business} delivery fee to ${zone}`}
            />
          </span>
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-[var(--button-bg)] px-5 py-2 text-sm font-bold text-[var(--button-text)] transition hover:bg-[var(--button-hover-bg)]"
          >
            Save
          </button>
        </span>
      ) : (
        <span className="font-bold" style={{ color: "var(--foreground)" }}>
          {formatNaira(fee)}
        </span>
      )}
    </li>
  );
}

/** Delivery fee per business and state. Saved fees show at checkout straight away. */
export default function DeliveryFeesPanel({
  canEdit,
  onChanged,
}: {
  canEdit: boolean;
  onChanged: (text: string) => void;
}) {
  const fees = useDeliveryFees();
  const [business, setBusiness] = useState<DeliveryBusiness>("Cement Depot");

  function save(b: DeliveryBusiness, zone: string, oldFee: number, newFee: number) {
    saveDeliveryFee(b, zone, newFee);
    onChanged(`Changed delivery fee: ${b} to ${zone} from ${formatNaira(oldFee)} to ${formatNaira(newFee)}`);
  }

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-10" id="delivery-fees">
      <h3 className="flex items-center gap-2 font-heading text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
        <Truck size={22} style={{ color: "var(--gold-text)" }} />
        Delivery fees
      </h3>
      <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
        The delivery fee customers pay for each state. It is always shown
        separately from the product total. A saved fee is used at checkout for
        new orders; orders already placed keep the fee they were placed with.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Business">
          {DELIVERY_BUSINESSES.map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={business === b}
              onClick={() => setBusiness(b)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                business === b
                  ? "bg-[#ef850f] text-[#0f1a3d]"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        {!canEdit && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold" style={{ color: "var(--muted)" }}>
            <Eye size={14} />
            View only
          </span>
        )}
      </div>

      <ul className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--background)]">
        {fees[business].map((zone) => (
          <FeeRow
            key={`${business}-${zone.name}`}
            business={business}
            zone={zone.name}
            fee={zone.fee}
            canEdit={canEdit}
            onSave={save}
          />
        ))}
      </ul>
      <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
        Demo: fees are saved on this device only. In the main app they are saved
        in the database for every customer.
      </p>
    </section>
  );
}
