"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Info, LogIn, Search, ShieldAlert, Trash2 } from "lucide-react";
import {
  ACTIVITY_EVENT,
  clearActivity,
  loadActivity,
  type ActivityCategory,
  type ActivityEntry,
} from "@/lib/activity-log";

/*
  ACTIVITY LOG (Super Admin only)
  Every staff sign-in/out, failed sign-in, staff action and customer action.
*/

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25";

type View = "All" | "Logins" | "Staff" | "Customers";
const VIEWS: View[] = ["All", "Logins", "Staff", "Customers"];
const LOGIN_CATEGORIES: ActivityCategory[] = ["Sign-in", "Sign-out"];
const PAGE_SIZE = 50;

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function isFailed(entry: ActivityEntry) {
  return entry.action.toLowerCase().startsWith("failed");
}

function toCsv(entries: ActivityEntry[]) {
  const header = ["Time", "Who", "Type", "Role", "Category", "Action", "Detail", "Page", "Device"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = entries.map((e) =>
    [e.at, e.actor, e.actorType, e.role ?? "", e.category, e.action, e.detail ?? "", e.page ?? "", e.device ?? ""]
      .map((v) => escape(String(v)))
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

export default function ActivityPanel() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [view, setView] = useState<View>("All");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  useEffect(() => {
    const refresh = () => setEntries(loadActivity());
    refresh();
    window.addEventListener(ACTIVITY_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (view === "Logins" && !LOGIN_CATEGORIES.includes(e.category)) return false;
      if (view === "Staff" && e.actorType !== "Staff") return false;
      if (view === "Customers" && e.actorType !== "Customer") return false;
      if (!q) return true;
      return [e.actor, e.role, e.action, e.detail, e.page, e.category]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [entries, view, query]);

  const today = new Date().toDateString();
  const todays = entries.filter((e) => new Date(e.at).toDateString() === today);
  const stats = [
    { label: "Sign-ins today", value: todays.filter((e) => e.category === "Sign-in" && !isFailed(e)).length },
    { label: "Failed sign-ins today", value: todays.filter(isFailed).length },
    { label: "Staff actions today", value: todays.filter((e) => e.actorType === "Staff" && !LOGIN_CATEGORIES.includes(e.category)).length },
    { label: "Customer actions today", value: todays.filter((e) => e.actorType === "Customer" && !LOGIN_CATEGORIES.includes(e.category)).length },
  ];

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yusfaith-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (window.confirm("Clear the whole activity log on this device? This cannot be undone.")) {
      clearActivity();
    }
  }

  return (
    <div>
      <p className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6" style={{ color: "var(--muted)" }}>
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
        Only the Super Admin can see this page. It records every staff sign-in
        and sign-out (including failed attempts), every staff change, and what
        customers do on the website. Demo: the log is kept on this device only.
        In the main app it is recorded on the server with the IP address and
        cannot be edited or deleted by staff.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-heading text-3xl font-semibold" style={{ color: "var(--gold-text)" }}>{s.value}</p>
            <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setView(v);
                setShown(PAGE_SIZE);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                view === v
                  ? "bg-[#ef850f] text-[#0f1a3d]"
                  : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]"
              }`}
            >
              {v === "All" ? "All activity" : v}
            </button>
          ))}
        </div>
        <label className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            className={`${inputClass} pl-10`}
            placeholder="Search name, order number, action…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE_SIZE);
            }}
            aria-label="Search the activity log"
          />
        </label>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)] disabled:opacity-40"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          {entries.length === 0 ? "Nothing recorded yet." : "No activity matches this filter."}
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Who</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Page</th>
                <th className="px-4 py-3 font-semibold">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.slice(0, shown).map((e) => {
                const failed = isFailed(e);
                return (
                  <tr key={e.id} className={failed ? "bg-red-50/60" : "bg-[var(--background)]"}>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-xs" style={{ color: "var(--muted)" }}>
                      {formatTime(e.at)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="block font-semibold" style={{ color: "var(--foreground)" }}>{e.actor}</span>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          e.actorType === "Staff" ? "bg-[#0f1a3d] text-white" : "bg-[#ef850f]/15 text-[#a35a00]"
                        }`}
                      >
                        {e.actorType === "Staff" ? e.role ?? "Staff" : "Customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className={`flex items-center gap-1.5 font-semibold ${failed ? "text-red-700" : ""}`} style={failed ? undefined : { color: "var(--foreground)" }}>
                        {failed ? <ShieldAlert size={15} /> : e.category === "Sign-in" ? <LogIn size={15} /> : null}
                        {e.action}
                      </span>
                      <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
                        {e.category}
                        {e.detail ? ` · ${e.detail}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-xs" style={{ color: "var(--muted)" }}>{e.page}</td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-xs" style={{ color: "var(--muted)" }}>{e.device}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Showing {Math.min(shown, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-3">
          {shown < filtered.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE_SIZE)}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
            >
              Show more
            </button>
          )}
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition hover:text-red-700"
              style={{ color: "var(--muted)" }}
            >
              <Trash2 size={14} />
              Clear log (demo)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
