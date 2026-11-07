"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  LogOut,
  MapPin,
  Package,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";
import { formatNaira, loadOrders, type Order } from "@/lib/orders";

type Profile = { name: string; phone: string; email: string };
type SavedAddress = { id: string; label: string; address: string };
type Tab = "orders" | "addresses" | "profile";

const PROFILE_KEY = "yusfaith-demo-profile";
const ADDRESS_KEY = "yusfaith-demo-addresses";

const TRACK_PATH: Record<string, string> = {
  "Cement Depot": "/cement/track",
  "Building Materials": "/building-materials/track",
  Bakery: "/bakery/track",
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const PHONE_PATTERN = /^(\+?234|0)[789][01]\d{8}$/;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // demo only, ignore
  }
}

function lastTenDigits(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------- shown on the public site (demo mode off) ---------- */

function PublicNotice() {
  const links = [
    { label: "Track a Cement order", href: "/cement/track" },
    { label: "Track a Building Materials order", href: "/building-materials/track" },
    { label: "Track a Bakery order", href: "/bakery/track" },
  ];

  return (
    <main className="section-padding">
      <div className="container-main max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--gold-text)" }}
        >
          <ArrowLeft size={16} />
          Back to Yusfaith
        </Link>

        <h1
          className="mt-6 font-heading text-5xl font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Customer accounts are coming soon
        </h1>
        <p className="mt-4 leading-8" style={{ color: "var(--muted)" }}>
          You do not need an account to browse or to place an order. To follow
          an order, use the reference number you received.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold transition hover:border-[var(--gold)]"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
              <ArrowRight size={16} style={{ color: "var(--gold-text)" }} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ---------- demo account (demo mode on) ---------- */

function DemoAccount() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<Tab>("orders");
  const [showAll, setShowAll] = useState(false);

  // sign-in form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // profile editing
  const [draft, setDraft] = useState<Profile>({ name: "", phone: "", email: "" });
  const [profileMessage, setProfileMessage] = useState("");

  // new address
  const [addressLabel, setAddressLabel] = useState("");
  const [addressText, setAddressText] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    const stored = read<Profile | null>(PROFILE_KEY, null);
    setProfile(stored);
    if (stored) setDraft(stored);
    setAddresses(read<SavedAddress[]>(ADDRESS_KEY, []));
    setOrders(loadOrders());
    setReady(true);

    function refresh() {
      setOrders(loadOrders());
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const myOrders = useMemo(() => {
    if (!profile) return [];
    if (showAll) return orders;
    const mine = lastTenDigits(profile.phone);
    return orders.filter((o) => lastTenDigits(o.customer.phone) === mine);
  }, [orders, profile, showAll]);

  function signIn(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!PHONE_PATTERN.test(cleanPhone))
      return setError("Enter a valid Nigerian phone number, e.g. 08012345678.");

    const created: Profile = {
      name: name.trim(),
      phone: phone.trim(),
      email: "",
    };
    write(PROFILE_KEY, created);
    setProfile(created);
    setDraft(created);
    setError("");
  }

  function signOut() {
    try {
      window.localStorage.removeItem(PROFILE_KEY);
    } catch {
      // ignore
    }
    setProfile(null);
    setName("");
    setPhone("");
    setTab("orders");
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const cleanPhone = draft.phone.replace(/[\s-]/g, "");

    if (draft.name.trim().length < 2) {
      setProfileMessage("Please enter your name.");
      return;
    }
    if (!PHONE_PATTERN.test(cleanPhone)) {
      setProfileMessage("Enter a valid Nigerian phone number.");
      return;
    }

    const updated: Profile = {
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
    };
    write(PROFILE_KEY, updated);
    setProfile(updated);
    setProfileMessage("Saved.");
  }

  function addAddress(event: React.FormEvent) {
    event.preventDefault();
    if (addressText.trim().length < 5) {
      setAddressError("Please enter the full address.");
      return;
    }
    const next: SavedAddress[] = [
      {
        id: `A-${Date.now()}`,
        label: addressLabel.trim() || "Address",
        address: addressText.trim(),
      },
      ...addresses,
    ];
    write(ADDRESS_KEY, next);
    setAddresses(next);
    setAddressLabel("");
    setAddressText("");
    setAddressError("");
  }

  function removeAddress(id: string) {
    const next = addresses.filter((a) => a.id !== id);
    write(ADDRESS_KEY, next);
    setAddresses(next);
  }

  if (!ready) {
    return (
      <main className="section-padding">
        <div className="container-main" style={{ color: "var(--muted)" }}>
          Loading...
        </div>
      </main>
    );
  }

  /* ----- not signed in ----- */
  if (!profile) {
    return (
      <main className="section-padding">
        <div className="container-main max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--gold-text)" }}
          >
            <ArrowLeft size={16} />
            Back to Yusfaith
          </Link>

          <h1
            className="mt-6 font-heading text-5xl font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Your account
          </h1>
          <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
            See your orders from every Yusfaith business in one place. You never
            need an account to browse or to order.
          </p>

          <p
            className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--gold)] bg-[var(--surface)] p-4 text-sm leading-6"
            style={{ color: "var(--foreground)" }}
          >
            <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
            Demo sign-in: no password is checked and nothing is sent anywhere.
            The real website will use a secure login.
          </p>

          <form onSubmit={signIn} noValidate className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Your name
              </span>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Phone number
              </span>
              <input
                className={inputClass}
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-4 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
            >
              Continue (demo)
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ----- signed in ----- */
  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "My orders" },
    { id: "addresses", label: "Saved addresses" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <main className="section-padding">
      <div className="container-main max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--gold-text)" }}
        >
          <ArrowLeft size={16} />
          Back to Yusfaith
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
              <User size={26} />
            </span>
            <span>
              <span className="block text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {profile.name}
              </span>
              <span className="block text-sm" style={{ color: "var(--muted)" }}>
                {profile.phone} · demo account
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        <div role="tablist" aria-label="Account sections" className="mt-8 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                tab === item.id
                  ? "border-[#ef850f] bg-[#ef850f] text-[#0f1a3d]"
                  : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ----- orders ----- */}
        {tab === "orders" && (
          <section className="mt-8">
            <label className="flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="h-4 w-4 accent-[#ef850f]"
              />
              Show all demo orders on this device (not only those placed with my
              phone number)
            </label>

            {myOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                <Package size={36} className="mx-auto" style={{ color: "var(--gold-text)" }} />
                <p className="mt-3 font-semibold" style={{ color: "var(--foreground)" }}>
                  No orders found for this phone number.
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Place an order with the same phone number and it will appear
                  here.
                </p>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {myOrders.map((order) => {
                  const track = TRACK_PATH[order.subsidiary];
                  return (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4"
                    >
                      <span>
                        <span className="block font-bold tracking-wider" style={{ color: "var(--foreground)" }}>
                          {order.id}
                        </span>
                        <span className="block text-xs" style={{ color: "var(--muted)" }}>
                          {order.subsidiary} · {formatDate(order.createdAt)} ·{" "}
                          {order.items.length} product
                          {order.items.length === 1 ? "" : "s"}
                        </span>
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="text-right text-sm font-semibold" style={{ color: "var(--gold-text)" }}>
                          {order.status}
                          <span className="block" style={{ color: "var(--foreground)" }}>
                            {formatNaira(order.total)}
                          </span>
                        </span>
                        {track && (
                          <Link
                            href={`${track}?id=${order.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#ef850f] px-4 py-2 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
                          >
                            Track
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* ----- addresses ----- */}
        {tab === "addresses" && (
          <section className="mt-8">
            <form
              onSubmit={addAddress}
              noValidate
              className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[1fr_2fr_auto]"
            >
              <input
                className={inputClass}
                placeholder="Label, e.g. Site 1"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                aria-label="Address label"
              />
              <input
                className={inputClass}
                placeholder="Full delivery address"
                value={addressText}
                onChange={(e) => {
                  setAddressText(e.target.value);
                  setAddressError("");
                }}
                aria-label="Delivery address"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
              >
                <Plus size={16} />
                Add
              </button>
            </form>
            {addressError && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {addressError}
              </p>
            )}

            {addresses.length === 0 ? (
              <p className="mt-6 text-sm" style={{ color: "var(--muted)" }}>
                No saved addresses yet.
              </p>
            ) : (
              <ul className="mt-6 space-y-3">
                {addresses.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4"
                  >
                    <span className="flex items-start gap-3 text-sm" style={{ color: "var(--foreground)" }}>
                      <MapPin size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
                      <span>
                        <span className="block font-bold">{item.label}</span>
                        <span style={{ color: "var(--muted)" }}>{item.address}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${item.label}`}
                      onClick={() => removeAddress(item.id)}
                      className="text-[var(--muted)] transition hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ----- profile ----- */}
        {tab === "profile" && (
          <section className="mt-8">
            <form onSubmit={saveProfile} noValidate className="grid max-w-xl gap-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Name
                </span>
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(e) => {
                    setDraft({ ...draft, name: e.target.value });
                    setProfileMessage("");
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Phone number
                </span>
                <input
                  className={inputClass}
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => {
                    setDraft({ ...draft, phone: e.target.value });
                    setProfileMessage("");
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Email (optional)
                </span>
                <input
                  className={inputClass}
                  type="email"
                  value={draft.email}
                  onChange={(e) => {
                    setDraft({ ...draft, email: e.target.value });
                    setProfileMessage("");
                  }}
                />
              </label>

              {profileMessage && (
                <p
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                    profileMessage === "Saved."
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {profileMessage}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#ef850f] px-8 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
              >
                Save profile
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}

export default function AccountContent() {
  return DEMO_MODE ? <DemoAccount /> : <PublicNotice />;
}