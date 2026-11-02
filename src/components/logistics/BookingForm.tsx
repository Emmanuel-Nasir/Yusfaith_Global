
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";

import {
  CARGO_TYPES,
  CARGO_UNITS,
  type LogisticsBooking,
} from "@/lib/logistics/types";

import {
  createBookingId,
  saveBooking,
} from "@/lib/logistics/storage";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  cargoType: string;
  description: string;
  quantity: string;
  unit: string;
  pickup: string;
  destination: string;
  preferredDate: string;
  notes: string;
};

const initial: FormValues = {
  name: "",
  phone: "",
  email: "",
  cargoType: "Cement",
  description: "",
  quantity: "",
  unit: "bags",
  pickup: "",
  destination: "",
  preferredDate: "",
  notes: "",
};

const field =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500";

const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#10213b] px-6 py-3 font-semibold text-amber-300";

const secondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800";

export default function BookingForm() {
  const [values, setValues] = useState<FormValues>(initial);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  function update(key: keyof FormValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
    setError("");
  }

  function validateCargo(): boolean {
    const quantity = Number(values.quantity);
    const today = new Date().toLocaleDateString("en-CA");

    if (
      !values.description.trim() ||
      !values.pickup.trim() ||
      !values.destination.trim() ||
      !values.preferredDate
    ) {
      setError("Complete all required cargo and route fields.");
      return false;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Enter a valid whole-number quantity.");
      return false;
    }

    if (values.preferredDate < today) {
      setError("Select today or a future pickup date.");
      return false;
    }

    return true;
  }

  function validateCustomer(): boolean {
    if (!values.name.trim() || !values.phone.trim()) {
      setError("Your name and phone number are required.");
      return false;
    }

    if (!/^[+\d\s()-]{7,20}$/.test(values.phone.trim())) {
      setError("Enter a valid phone number.");
      return false;
    }

    if (
      values.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      setError("Enter a valid email address.");
      return false;
    }

    return true;
  }

  function continueForm() {
    if (step === 1 && !validateCargo()) return;
    if (step === 2 && !validateCustomer()) return;

    setError("");
    setStep((current) => Math.min(current + 1, 3));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCargo() || !validateCustomer()) return;

    const booking: LogisticsBooking = {
      id: createBookingId(),
      createdAt: new Date().toISOString(),
      status: "request-received",
      demo: true,
      customer: {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      },
      cargo: {
        type: values.cargoType,
        description: values.description.trim(),
        quantity: Number(values.quantity),
        unit: values.unit,
      },
      pickup: values.pickup.trim(),
      destination: values.destination.trim(),
      preferredDate: values.preferredDate,
      notes: values.notes.trim(),
    };

    try {
      saveBooking(booking);
      setReference(booking.id);
      setStep(4);
      setError("");
    } catch {
      setError(
        "Unable to save this request. Enable browser storage and try again."
      );
    }
  }

  if (step === 4) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2
          size={60}
          className="mx-auto text-emerald-600"
        />

        <h2 className="mt-6 text-3xl font-bold">
          Demo Request Saved
        </h2>

        <p className="mt-4 text-slate-600">
          Your transportation request has been saved
          in this browser.
        </p>

        <div className="mt-7 rounded-2xl bg-slate-100 p-6">
          <p className="text-sm text-slate-500">
            Booking Reference
          </p>
          <p className="mt-2 break-all font-mono text-xl font-bold">
            {reference}
          </p>
        </div>

        <p className="mt-5 text-sm text-amber-800">
          This is a demonstration only. No real
          transportation has been booked.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/logistics/track?ref=${encodeURIComponent(reference)}`}
            className={primary}
          >
            Track Request
          </Link>

          <Link
            href="/logistics/bookings"
            className={secondary}
          >
            Booking History
          </Link>

          <button
            type="button"
            onClick={() => {
              setValues(initial);
              setReference("");
              setError("");
              setStep(1);
            }}
            className={secondary}
          >
            New Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
        Step {step} of 3
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {step === 1
          ? "Cargo & Route"
          : step === 2
            ? "Customer Information"
            : "Review Your Request"}
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((number) => (
          <div
            key={number}
            className={`h-2 rounded-full ${
              number <= step ? "bg-amber-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <form onSubmit={submit} className="mt-8">
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Cargo Type *
              <select
                className={field}
                value={values.cargoType}
                onChange={(event) =>
                  update("cargoType", event.target.value)
                }
              >
                {CARGO_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold">
              Quantity *
              <input
                className={field}
                type="number"
                min="1"
                step="1"
                value={values.quantity}
                onChange={(event) =>
                  update("quantity", event.target.value)
                }
                placeholder="500"
              />
            </label>

            <label className="text-sm font-semibold">
              Unit *
              <select
                className={field}
                value={values.unit}
                onChange={(event) =>
                  update("unit", event.target.value)
                }
              >
                {CARGO_UNITS.map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold">
              Preferred Pickup Date *
              <input
                className={field}
                type="date"
                value={values.preferredDate}
                onChange={(event) =>
                  update("preferredDate", event.target.value)
                }
              />
            </label>

            <label className="text-sm font-semibold sm:col-span-2">
              Cargo Description *
              <textarea
                className={field}
                rows={3}
                value={values.description}
                onChange={(event) =>
                  update("description", event.target.value)
                }
                placeholder="Describe the goods to be transported"
              />
            </label>

            <label className="text-sm font-semibold">
              Pickup Location *
              <input
                className={field}
                value={values.pickup}
                onChange={(event) =>
                  update("pickup", event.target.value)
                }
                placeholder="Pickup address"
              />
            </label>

            <label className="text-sm font-semibold">
              Destination *
              <input
                className={field}
                value={values.destination}
                onChange={(event) =>
                  update("destination", event.target.value)
                }
                placeholder="Delivery address"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Full Name *
              <input
                className={field}
                value={values.name}
                onChange={(event) =>
                  update("name", event.target.value)
                }
              />
            </label>

            <label className="text-sm font-semibold">
              Phone Number *
              <input
                className={field}
                type="tel"
                value={values.phone}
                onChange={(event) =>
                  update("phone", event.target.value)
                }
              />
            </label>

            <label className="text-sm font-semibold sm:col-span-2">
              Email (Optional)
              <input
                className={field}
                type="email"
                value={values.email}
                onChange={(event) =>
                  update("email", event.target.value)
                }
              />
            </label>

            <label className="text-sm font-semibold sm:col-span-2">
              Additional Instructions
              <textarea
                className={field}
                rows={4}
                value={values.notes}
                onChange={(event) =>
                  update("notes", event.target.value)
                }
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-lg font-bold">
                Cargo Information
              </h3>
              <p className="mt-3">{values.cargoType}</p>
              <p className="mt-2">{values.description}</p>
              <p className="mt-2">
                {values.quantity} {values.unit}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-lg font-bold">
                Route Information
              </h3>
              <p className="mt-3">
                <strong>From:</strong> {values.pickup}
              </p>
              <p className="mt-2">
                <strong>To:</strong> {values.destination}
              </p>
              <p className="mt-2">
                <strong>Date:</strong> {values.preferredDate}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <h3 className="text-lg font-bold">
                Customer Information
              </h3>
              <p className="mt-3">{values.name}</p>
              <p className="mt-2">{values.phone}</p>
              {values.email && (
                <p className="mt-2">{values.email}</p>
              )}
              {values.notes && (
                <p className="mt-2">{values.notes}</p>
              )}
            </div>

            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              Submitting saves a demo booking locally.
              It does not notify a dispatch team.
            </p>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t pt-6">
          {step > 1 ? (
            <button
              type="button"
              className={secondary}
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
            >
              <ArrowLeft size={18} />
              Previous
            </button>
          ) : (
            <Link href="/logistics" className={secondary}>
              <ArrowLeft size={18} />
              Back
            </Link>
          )}

          {step < 3 ? (
            <button
              type="button"
              className={primary}
              onClick={continueForm}
            >
              Continue
              <ArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" className={primary}>
              <ClipboardCheck size={18} />
              Save Demo Booking
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
