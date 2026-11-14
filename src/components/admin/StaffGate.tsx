"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { categoryFor, logActivity } from "@/lib/activity-log";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Lock,
  Mail,
  Plus,
  ShieldCheck,
} from "lucide-react";

/* ---------- types ---------- */

export type StaffRole =
  | "Super Admin"
  | "Management"
  | "Sales Rep"
  | "Finance Officer"
  | "Inventory Officer"
  | "Logistics Officer"
  | "Driver";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  invitedAt: string;
};

type AuditEntry = { id: string; at: string; actor: string; text: string };

export type StaffSession = {
  me: StaffMember;
  role: StaffRole;
  staff: StaffMember[];
  audit: AuditEntry[];
  switchUser: (id: string) => void;
  signOut: () => void;
  log: (text: string) => void;
  invite: (name: string, email: string, role: StaffRole) => string | null;
  changeRole: (id: string, role: StaffRole) => string | null;
  setActive: (id: string, active: boolean) => string | null;
};

export const STAFF_ROLES: StaffRole[] = [
  "Super Admin",
  "Management",
  "Sales Rep",
  "Finance Officer",
  "Inventory Officer",
  "Logistics Officer",
  "Driver",
];

/* ---------- sample staff (replace with real staff in the main app) ---------- */

const SEED_STAFF: StaffMember[] = [
  { id: "S-1", name: "Sample Super Admin", email: "superadmin@yusfaith.demo", role: "Super Admin", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-2", name: "Sample Manager", email: "manager@yusfaith.demo", role: "Management", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-3", name: "Sample Sales Rep", email: "sales@yusfaith.demo", role: "Sales Rep", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-4", name: "Sample Finance Officer", email: "finance@yusfaith.demo", role: "Finance Officer", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-5", name: "Sample Inventory Officer", email: "inventory@yusfaith.demo", role: "Inventory Officer", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-6", name: "Sample Logistics Officer", email: "logistics@yusfaith.demo", role: "Logistics Officer", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
  { id: "S-7", name: "Sample Driver", email: "driver@yusfaith.demo", role: "Driver", active: true, invitedAt: "2026-01-01T00:00:00.000Z" },
];

const STAFF_KEY = "yusfaith-demo-staff";
const SESSION_KEY = "yusfaith-demo-staff-session";
const AUDIT_KEY = "yusfaith-demo-audit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

const plainInput =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ---------- the gate ---------- */

export default function StaffGate({
  children,
}: {
  children: (session: StaffSession) => React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fromStorage = read<StaffMember[]>(STAFF_KEY, []);
    const initial = fromStorage.length > 0 ? fromStorage : SEED_STAFF;
    if (fromStorage.length === 0) write(STAFF_KEY, SEED_STAFF);
    setStaff(initial);
    setAudit(read<AuditEntry[]>(AUDIT_KEY, []));

    const sessionId = read<string | null>(SESSION_KEY, null);
    if (sessionId && initial.some((s) => s.id === sessionId && s.active)) {
      setMeId(sessionId);
    }
    setReady(true);
  }, []);

  const me = staff.find((s) => s.id === meId && s.active) ?? null;
  const staffRef = useRef(staff);
  staffRef.current = staff;

  const addAudit = useCallback((actor: string, text: string) => {
    // Full site activity log (Super Admin only)
    logActivity({
      actor,
      actorType: "Staff",
      role: staffRef.current.find((s) => s.name === actor)?.role,
      category: categoryFor(text),
      action: text,
    });
    setAudit((current) => {
      const next: AuditEntry[] = [
        {
          id: `L-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          at: new Date().toISOString(),
          actor,
          text,
        },
        ...current,
      ].slice(0, 50);
      write(AUDIT_KEY, next);
      return next;
    });
  }, []);

  function saveStaff(next: StaffMember[]) {
    setStaff(next);
    write(STAFF_KEY, next);
  }

  function startSession(member: StaffMember, text: string) {
    write(SESSION_KEY, member.id);
    setMeId(member.id);
    setError("");
    setPassword("");
    addAudit(member.name, text);
  }

  function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(cleanEmail)) return setError("Enter your work email address.");
    if (password.length === 0) return setError("Enter your password.");

    const found = staff.find((s) => s.email === cleanEmail);
    if (!found || !found.active) {
      logActivity({
        actor: cleanEmail,
        actorType: "Staff",
        role: found?.role,
        category: "Sign-in",
        action: found ? "Failed sign-in: account deactivated" : "Failed sign-in: unknown email",
      });
    }
    if (!found)
      return setError("No staff account with that email. Ask your Super Admin to invite you.");
    if (!found.active)
      return setError("This account has been deactivated. Contact your Super Admin.");

    startSession(found, "Signed in");
  }

  /* ----- loading ----- */
  if (!ready) {
    return (
      <main className="section-padding">
        <div className="container-main" style={{ color: "var(--muted)" }}>
          Loading...
        </div>
      </main>
    );
  }

  /* ----- signed out ----- */
  if (!me) {
    return (
      <main className="relative isolate overflow-hidden bg-[#0f1a3d]">
        <Image
          src="/images/corporate/Headquarters.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1230]/95 via-[#0a1230]/90 to-[#18265f]/85" />

        <div className="container-main relative z-10 pb-16 pt-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0f1a3d]"
          >
            <ArrowLeft size={16} />
            Back to Yusfaith
          </Link>

          <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl bg-[var(--background)] shadow-2xl ring-1 ring-white/10 lg:grid lg:grid-cols-2">
            {/* Sign-in form */}
            <div className="p-8 sm:p-10">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ef850f] text-[#0f1a3d]">
                <ShieldCheck size={26} />
              </span>
              <h1 className="mt-5 font-heading text-4xl font-semibold" style={{ color: "var(--foreground)" }}>
                Staff sign-in
              </h1>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                For Yusfaith staff only. Staff cannot sign themselves up. Your
                Super Admin creates your account and gives you a role.
              </p>

              <form onSubmit={handleSignIn} noValidate className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Work email
                  </span>
                  <span className="relative block">
                    <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                    <input
                      className={inputClass}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      autoComplete="username"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Password
                  </span>
                  <span className="relative block">
                    <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                    <input
                      className={inputClass}
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="current-password"
                    />
                  </span>
                </label>

                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:-translate-y-0.5 hover:bg-[#ff9a26]"
                >
                  Sign in
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-xs leading-5" style={{ color: "var(--muted)" }}>
                <Info size={15} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
                <span>
                  <strong style={{ color: "var(--foreground)" }}>Demo only.</strong>{" "}
                  Passwords are not checked or stored. In the real website,
                  staff sign in securely, and the highest-risk roles also use
                  two-step verification.
                </span>
              </p>
            </div>

            {/* Demo shortcuts */}
            <div className="border-t border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--gold-text)" }}>
                Demo shortcuts
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold" style={{ color: "var(--foreground)" }}>
                Sign in as a sample role
              </h2>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--muted)" }}>
                One click, no typing. Each role sees and can do different things.
              </p>
              <ul className="mt-5 space-y-2.5">
                {staff
                  .filter((s) => s.active)
                  .map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => startSession(s, "Signed in (demo shortcut)")}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left transition hover:border-[var(--gold)]"
                      >
                        <span>
                          <span className="block text-sm font-bold" style={{ color: "var(--foreground)" }}>
                            {s.name}
                          </span>
                          <span className="block text-xs" style={{ color: "var(--muted)" }}>
                            {s.email}
                          </span>
                        </span>
                        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold" style={{ color: "var(--gold-text)" }}>
                          {s.role}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ----- signed in: build the session and show the staff area ----- */
  const actor = me.name;
  const activeSuperAdmins = staff.filter((s) => s.active && s.role === "Super Admin").length;

  const session: StaffSession = {
    me,
    role: me.role,
    staff,
    audit,
    switchUser: (id) => {
      const target = staff.find((s) => s.id === id && s.active);
      if (target) startSession(target, "Signed in (demo user switch)");
    },
    signOut: () => {
      addAudit(actor, "Signed out");
      remove(SESSION_KEY);
      setMeId(null);
    },
    log: (text) => addAudit(actor, text),
    invite: (name, emailValue, role) => {
      // The permission check lives here, not only in the button
      if (me.role !== "Super Admin") return "Only a Super Admin can invite staff.";
      const cleanEmail = emailValue.trim().toLowerCase();
      if (name.trim().length < 2) return "Enter the staff member's full name.";
      if (!EMAIL_PATTERN.test(cleanEmail)) return "Enter a valid work email address.";
      if (staff.some((s) => s.email === cleanEmail))
        return "A staff account with that email already exists.";

      const created: StaffMember = {
        id: `S-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        role,
        active: true,
        invitedAt: new Date().toISOString(),
      };
      saveStaff([...staff, created]);
      addAudit(actor, `Invited ${created.name} as ${role}`);
      return null;
    },
    changeRole: (id, role) => {
      if (me.role !== "Super Admin") return "Only a Super Admin can change roles.";
      const target = staff.find((s) => s.id === id);
      if (!target) return "Staff member not found.";
      if (target.id === me.id) return "You cannot change your own role.";
      if (target.role === "Super Admin" && target.active && role !== "Super Admin" && activeSuperAdmins <= 1)
        return "There must always be at least one active Super Admin.";

      saveStaff(staff.map((s) => (s.id === id ? { ...s, role } : s)));
      addAudit(actor, `Changed ${target.name}'s role from ${target.role} to ${role}`);
      return null;
    },
    setActive: (id, active) => {
      if (me.role !== "Super Admin") return "Only a Super Admin can do this.";
      const target = staff.find((s) => s.id === id);
      if (!target) return "Staff member not found.";
      if (target.id === me.id) return "You cannot deactivate your own account.";
      if (!active && target.role === "Super Admin" && target.active && activeSuperAdmins <= 1)
        return "There must always be at least one active Super Admin.";

      saveStaff(staff.map((s) => (s.id === id ? { ...s, active } : s)));
      addAudit(actor, `${active ? "Reactivated" : "Deactivated"} ${target.name}`);
      return null;
    },
  };

  return <>{children(session)}</>;
}

/* ---------- the Staff & access panel (Super Admin) ---------- */

const CAPABILITIES = [
  "Take orders",
  "Confirm payments",
  "Set prices",
  "Manage stock",
  "Run deliveries",
  "Manage staff",
];

const MATRIX: { role: StaffRole; can: boolean[] }[] = [
  { role: "Super Admin", can: [true, true, true, true, true, true] },
  { role: "Management", can: [false, false, true, false, false, false] },
  { role: "Sales Rep", can: [true, false, false, false, false, false] },
  { role: "Finance Officer", can: [false, true, false, false, false, false] },
  { role: "Inventory Officer", can: [false, false, false, true, false, false] },
  { role: "Logistics Officer", can: [false, false, false, false, true, false] },
  { role: "Driver", can: [false, false, false, false, true, false] },
];

export function AccessPanel({ session }: { session: StaffSession }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("Sales Rep");
  const [formError, setFormError] = useState("");
  const [created, setCreated] = useState("");
  const [rowMessage, setRowMessage] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const summary = `${name.trim()} can now sign in as ${role} with ${email.trim().toLowerCase()}.`;
    const result = session.invite(name, email, role);
    if (result) {
      setFormError(result);
      setCreated("");
      return;
    }
    setCreated(summary);
    setFormError("");
    setName("");
    setEmail("");
  }

  return (
    <div>
      <p className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
        Only the Super Admin can invite staff or change roles. In the real
        website, an invited person receives an email with a link that expires,
        sets their own password, and the highest-risk roles use two-step
        verification. Every action below is also recorded in the audit log.
      </p>

      {/* Invite */}
      <form onSubmit={submit} noValidate className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-bold" style={{ color: "var(--foreground)" }}>
          Invite a staff member
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className={plainInput}
            placeholder="Full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFormError("");
            }}
            aria-label="Full name"
          />
          <input
            className={plainInput}
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError("");
            }}
            aria-label="Work email"
          />
          <select className={plainInput} value={role} onChange={(e) => setRole(e.target.value as StaffRole)} aria-label="Role">
            {STAFF_ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-6 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
        >
          <Plus size={16} />
          Send invite (demo)
        </button>
        {formError && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{formError}</p>}
        {created && <p className="mt-3 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-800">{created}</p>}
      </form>

      {/* Staff list */}
      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        Staff ({session.staff.length})
      </h3>
      {rowMessage && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{rowMessage}</p>}
      <ul className="space-y-3">
        {session.staff.map((member) => {
          const isMe = member.id === session.me.id;
          return (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4">
              <span>
                <span className="block font-bold" style={{ color: "var(--foreground)" }}>
                  {member.name}
                  {isMe && <span className="ml-2 text-xs font-semibold" style={{ color: "var(--gold-text)" }}>(you)</span>}
                </span>
                <span className="block text-xs" style={{ color: "var(--muted)" }}>
                  {member.email}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <select
                  className={`${plainInput} w-auto`}
                  value={member.role}
                  disabled={isMe}
                  onChange={(e) => setRowMessage(session.changeRole(member.id, e.target.value as StaffRole) ?? "")}
                  aria-label={`Role of ${member.name}`}
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${member.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {member.active ? "Active" : "Deactivated"}
                </span>
                <button
                  type="button"
                  disabled={isMe}
                  onClick={() => setRowMessage(session.setActive(member.id, !member.active) ?? "")}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {member.active ? "Deactivate" : "Reactivate"}
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      {/* Permissions */}
      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        What each role can do
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-[var(--surface)] text-left">
              <th className="px-4 py-3 font-bold" style={{ color: "var(--foreground)" }}>Role</th>
              {CAPABILITIES.map((c) => (
                <th key={c} className="px-3 py-3 text-center text-xs font-bold" style={{ color: "var(--muted)" }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row) => (
              <tr key={row.role} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--foreground)" }}>
                  {row.role}
                </td>
                {row.can.map((allowed, index) => (
                  <td key={CAPABILITIES[index]} className="px-3 py-3 text-center">
                    {allowed ? (
                      <Check size={18} strokeWidth={3} className="mx-auto text-[#ef850f]" />
                    ) : (
                      <span style={{ color: "var(--muted)" }}>-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        Drivers can only see the deliveries assigned to them.
      </p>

      {/* Audit log */}
      <h3 className="mb-4 mt-10 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        Audit log
      </h3>
      {session.audit.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {session.audit.slice(0, 12).map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm">
              <span style={{ color: "var(--foreground)" }}>
                <strong>{entry.actor}</strong>: {entry.text}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {formatDate(entry.at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}