"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Smartphone } from "lucide-react";

/*
  INSTALL THE YUSFAITH APP
  Staff add the website to their phone's Home Screen so alerts reach them
  when the site is closed. On iPhone this is the only way alerts work.
*/

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallAppGuide() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [device, setDevice] = useState<"iphone" | "android" | "computer">("computer");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setDevice(/iPhone|iPad|iPod/.test(ua) ? "iphone" : /Android/.test(ua) ? "android" : "computer");
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  }

  if (installed) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-green-800">
        <CheckCircle2 size={18} />
        The Yusfaith app is installed on this device.
      </p>
    );
  }

  const steps: Record<typeof device, string[]> = {
    iphone: [
      "Open this site in Safari (not Chrome).",
      "Tap the Share button (the square with an arrow).",
      "Scroll down and tap Add to Home Screen, then Add.",
      "Open Yusfaith from the new icon on your Home Screen.",
      "Sign in, go to Price requests and tap Turn on alerts. Tap Allow.",
    ],
    android: [
      "Open this site in Chrome.",
      "Tap Install app below, or the ⋮ menu → Add to Home screen / Install app.",
      "Open Yusfaith from the new icon.",
      "Sign in, go to Price requests and tap Turn on alerts. Tap Allow.",
    ],
    computer: [
      "In Chrome or Edge, click the install icon at the right of the address bar, or use Install app below.",
      "Sign in, go to Price requests and click Turn on alerts. Click Allow.",
      "For alerts on the go, install the app on your phone too.",
    ],
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-start gap-3 text-sm leading-6" style={{ color: "var(--muted)" }}>
          <Smartphone size={20} className="mt-0.5 shrink-0" style={{ color: "var(--gold-text)" }} />
          <span>
            <span className="block font-bold" style={{ color: "var(--foreground)" }}>
              Install the Yusfaith app on your phone
            </span>
            So new requests reach you even when the website is closed.
            {device === "iphone" ? " On iPhone, alerts only work from the installed app." : ""}
          </span>
        </p>
        <span className="flex flex-wrap gap-2">
          {installEvent && (
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center gap-2 rounded-full bg-[#ef850f] px-5 py-2.5 text-sm font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26]"
            >
              <Download size={16} />
              Install app
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--gold)]"
          >
            {open ? "Hide steps" : "How to install"}
          </button>
        </span>
      </div>
      {open && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(["iphone", "android", "computer"] as const).map((d) => (
            <div key={d} className={`rounded-xl bg-[var(--background)] p-4 ${d === device ? "ring-2 ring-[#ef850f]" : ""}`}>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {d === "iphone" ? "iPhone" : d === "android" ? "Android" : "Computer"}
                {d === device ? " (this device)" : ""}
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6" style={{ color: "var(--muted)" }}>
                {steps[d].map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
