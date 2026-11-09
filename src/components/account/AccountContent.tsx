"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";
import { formatNaira, loadOrders, type Order } from "@/lib/orders";

type Account = { name: string; email: string; phone: string };
type SavedAddress = { id: string; label: string; address: string };
type Tab = "orders" | "addresses" | "profile";
type AuthMode = "signin" | "signup";

const ACCOUNTS_KEY = "yusfaith-demo-accounts";
const SESSION_KEY = "yusfaith-demo-session";
const addressKey = (email: string) => `yusfaith-demo-addresses:${email}`;

const TRACK_PATH: Record<string, string> = {
  "Cement Depot": "/cement/track",
  "Building Materials": "/building-materials/track",
  Bakery: "/bakery/track",
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const plainInputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
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

        <h1 className="mt-6 font-heading text-5xl font-semibold" style={{ color: "var(--foreground)" }}>
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [tab, setTab] = useState<Tab>("orders");
  const [showAll, setShowAll] = useState(false);

  // sign in / sign up form
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // profile editing
  const [draft, setDraft] = useState({ name: "", phone: "" });
  const [profileMessage, setProfileMessage] = useState("");

  // new address
  const [addressLabel, setAddressLabel] = useState("");
  const [addressText, setAddressText] = useState("");
  const [addressError, setAddressError] = useState("");

  const account = accounts.find((a) => a.email === sessionEmail) ?? null;

  useEffect(() => {
    setAccounts(read<Account[]>(ACCOUNTS_KEY, []));
    setSessionEmail(read<string | null>(SESSION_KEY, null));
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

  useEffect(() => {
    if (!account) {
      setAddresses([]);
      return;
    }
    setAddresses(read<SavedAddress[]>(addressKey(account.email), []));
    setDraft({ name: account.name, phone: account.phone });
  }, [account]);

  const myOrders = useMemo(() => {
    if (!account) return [];
    if (showAll) return orders;
    const mine = lastTenDigits(account.phone);
    return orders.filter((o) => lastTenDigits(o.customer.phone) === mine);
  }, [orders, account, showAll]);

  const inProgress = myOrders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Collected"
  ).length;

  function switchMode(next: AuthMode) {
    setMode(next);
    setError("");
    setPassword("");
  }

  function signUp(event: React.FormEvent) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!EMAIL_PATTERN.test(cleanEmail)) return setError("Enter a valid email address.");
    if (!PHONE_PATTERN.test(cleanPhone))
      return setError("Enter a valid Nigerian phone number, e.g. 08012345678.");
    if (password.length < 8) return setError("Choose a password of at least 8 characters.");
    if (accounts.some((a) => a.email === cleanEmail))
      return setError("An account with this email already exists. Please sign in.");

    const created: Account = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
    };
    const next = [...accounts, created];
    write(ACCOUNTS_KEY, next);
    write(SESSION_KEY, created.email);
    setAccounts(next);
    setSessionEmail(created.email);
    setPassword("");
    setError("");
  }

  function signIn(event: React.FormEvent) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(cleanEmail)) return setError("Enter a valid email address.");
    if (password.length === 0) return setError("Enter your password.");

    const found = accounts.find((a) => a.email === cleanEmail);
    if (!found)
      return setError("No account found with that email. Create an account first.");

    write(SESSION_KEY, found.email);
    setSessionEmail(found.email);
    setPassword("");
    setError("");
  }

  function signOut() {
    remove(SESSION_KEY);
    setSessionEmail(null);
    setPassword("");
    setMode("signin");
    setTab("orders");
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!account) return;
    const cleanPhone = draft.phone.replace(/[\s-]/g, "");

    if (draft.name.trim().length < 2) {
      setProfileMessage("Please enter your name.");
      return;
    }
    if (!PHONE_PATTERN.test(cleanPhone)) {
      setProfileMessage("Enter a valid Nigerian phone number.");
      return;
    }

    const updated: Account = {
      ...account,
      name: draft.name.trim(),
      phone: draft.phone.trim(),
    };
    const next = accounts.map((a) => (a.email === account.email ? updated : a));
    write(ACCOUNTS_KEY, next);
    setAccounts(next);
    setProfileMessage("Saved.");
  }

  function addAddress(event: React.FormEvent) {
    event.preventDefault();
    if (!account) return;
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
    write(addressKey(account.email), next);
    setAddresses(next);
    setAddressLabel("");
    setAddressText("");
    setAddressError("");
  }

  function removeAddress(id: string) {
    if (!account) return;
    const next = addresses.filter((a) => a.id !== id);
    write(addressKey(account.email), next);
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

  /* ================= SIGNED OUT ================= */
  if (!account) {
    const benefits = [
      "Follow orders from every Yusfaith business",
      "Save your delivery addresses",
      "One account for Cement, Building Materials and Bakery",
    ];

    return (
      <main className="grid min-h-[680px] lg:grid-cols-[5fr_6fr]">
        {/* Left: brand panel */}
        <section className="relative isolate flex min-h-[320px] flex-col justify-between overflow-hidden bg-[#0f1a3d] p-8 text-white sm:p-12">
          <Image
            src="/images/corporate/Headquarters.jpeg"
            alt="Yusfaith Global Enterprises head office"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1230]/85 via-[#0a1230]/80 to-[#0a1230]/95" />

          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>
          </div>

          <div className="relative mt-10">
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              One account for{" "}
              <span className="bg-gradient-to-r from-[#ef850f] via-[#ff9a26] to-[#ffb347] bg-clip-text text-transparent">
                every Yusfaith business.
              </span>
            </h1>
            <ul className="mt-8 space-y-4">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
              {(
                [
                  { id: "signin", label: "Sign in" },
                  { id: "signup", label: "Create account" },
                ] as { id: AuthMode; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchMode(item.id)}
                  aria-pressed={mode === item.id}
                  className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                    mode === item.id
                      ? "bg-[#ef850f] text-[#0f1a3d]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <h2 className="mt-8 font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
              {mode === "signin"
                ? "Sign in to see your orders. You never need an account to browse or to order."
                : "It takes a minute. Use the phone number you give when you order, so your orders show up here."}
            </p>

            <form
              onSubmit={mode === "signin" ? signIn : signUp}
              noValidate
              className="mt-7 space-y-4"
            >
              {mode === "signup" && (
                <Field label="Full name" icon={User}>
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    autoComplete="name"
                  />
                </Field>
              )}

              <Field label="Email address" icon={Mail}>
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                />
              </Field>

              {mode === "signup" && (
                <Field label="Phone number" icon={Phone}>
                  <input
                    className={inputClass}
                    type="tel"
                    placeholder="08012345678"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    autoComplete="tel"
                  />
                </Field>
              )}

              <Field label="Password" icon={Lock}>
                <input
                  className={inputClass}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-4 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
              >
                {mode === "signin" ? "Sign in" : "Create account"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p
              className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-xs leading-5"
              style={{ color: "var(--muted)" }}
            >
              <Info size={16} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
              <span>
                <strong style={{ color: "var(--foreground)" }}>Demo only.</strong>{" "}
                Passwords are not checked or stored, and nothing is sent
                anywhere. Please do not enter a real password. The real website
                will use a secure login.
              </span>
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ================= SIGNED IN ================= */
  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "My orders" },
    { id: "addresses", label: "Saved addresses" },
    { id: "profile", label: "Profile" },
  ];

  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "Orders", value: myOrders.length, Icon: Package },
    { label: "In progress", value: inProgress, Icon: Clock },
    { label: "Saved addresses", value: addresses.length, Icon: MapPin },
  ];

  return (
    <main>
      {/* Greeting banner */}
      <section className="relative overflow-hidden bg-[#0f1a3d] text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ef850f]/15 blur-3xl" />
        <div className="container-main relative flex flex-wrap items-center justify-between gap-6 py-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-[#ff9a26]"
            >
              <ArrowLeft size={16} />
              Back to Yusfaith
            </Link>
            <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
              Hello, {account.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {account.email} · {account.phone} · demo account
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#0f1a3d]"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </section>

      <div className="container-main max-w-4xl py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <Icon size={20} style={{ color: "var(--gold-text)" }} />
              <p className="mt-3 font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
                {value}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
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
            <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
              Showing orders placed with the phone number on your account (
              {account.phone}).
            </p>
            <label className="mt-3 flex items-center gap-3 text-sm" style={{ color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="h-4 w-4 accent-[#ef850f]"
              />
              Demo: show all orders placed on this device
            </label>

            {myOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                <Package size={36} className="mx-auto" style={{ color: "var(--gold-text)" }} />
                <p className="mt-3 font-semibold" style={{ color: "var(--foreground)" }}>
                  No orders yet.
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
                  Place an order using the same phone number as your account and
                  it will appear here.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/cement/order"
                    className="rounded-full bg-[#ef850f] px-5 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
                  >
                    Order Cement
                  </Link>
                  <Link
                    href="/building-materials/order"
                    className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
                  >
                    Order Building Materials
                  </Link>
                </div>
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
                className={plainInputClass}
                placeholder="Label, e.g. Site 1"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                aria-label="Address label"
              />
              <input
                className={plainInputClass}
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
              <Field label="Full name" icon={User}>
                <input
                  className={inputClass}
                  value={draft.name}
                  onChange={(e) => {
                    setDraft({ ...draft, name: e.target.value });
                    setProfileMessage("");
                  }}
                />
              </Field>
              <Field label="Email address (cannot be changed in the demo)" icon={Mail}>
                <input
                  className={`${inputClass} opacity-70`}
                  value={account.email}
                  readOnly
                />
              </Field>
              <Field label="Phone number" icon={Phone}>
                <input
                  className={inputClass}
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => {
                    setDraft({ ...draft, phone: e.target.value });
                    setProfileMessage("");
                  }}
                />
              </Field>

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