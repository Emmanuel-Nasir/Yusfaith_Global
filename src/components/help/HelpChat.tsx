"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Phone, Send, Sparkles, UserRound, X } from "lucide-react";
import { logActivity } from "@/lib/activity-log";
import { builtInAnswer, HANDOFF, type HandoffKey } from "@/lib/assistant";
import { telLink } from "@/lib/order-contacts";

/*
  HELP CHAT
  An AI assistant answers common questions and hands the customer over to
  the right Head of Sales or sales rep (call or WhatsApp) when a person is
  needed. With no AI key set, it uses built-in answers.
*/

type Line = { role: "user" | "assistant"; content: string; handoff?: HandoffKey };

const STORE_KEY = "yusfaith-help-chat";
const QUICK = ["How do I get a price?", "How do I pay?", "Track my order", "Talk to a person"];
const GREETING: Line = {
  role: "assistant",
  content: "Hello! I'm the Yusfaith assistant. Ask me about prices, payment, delivery or your order. I can also put you through to our sales team.",
};

function whatsapp(phone: string, question: string) {
  const intl = phone.replace(/\D/g, "").replace(/^0/, "234");
  const text = `Hello, I was chatting with the Yusfaith website assistant${question ? ` about: "${question.slice(0, 200)}"` : ""}. Can you help me?`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

function HandoffCard({ handoff, question }: { handoff: HandoffKey; question: string }) {
  const group = HANDOFF[handoff];
  return (
    <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gold-text)" }}>
        {group.label}
      </p>
      <ul className="mt-2 space-y-2">
        {group.contacts.map((c) => (
          <li key={c.phone} className="flex flex-wrap items-center justify-between gap-2">
            <span className="min-w-0 text-sm">
              <span className="block font-semibold" style={{ color: "var(--foreground)" }}>{c.name}</span>
              <span className="block text-xs" style={{ color: "var(--muted)" }}>{c.role} · {c.phone}</span>
            </span>
            <span className="flex gap-1.5">
              <a
                href={telLink(c.phone)}
                onClick={() => logActivity({ actor: "Website visitor", actorType: "Customer", category: "Account", action: `Help chat: called ${c.role}`, detail: c.name })}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-bold"
                style={{ color: "var(--foreground)" }}
              >
                <Phone size={13} /> Call
              </a>
              <a
                href={whatsapp(c.phone, question)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logActivity({ actor: "Website visitor", actorType: "Customer", category: "Account", action: `Help chat: WhatsApp to ${c.role}`, detail: c.name })}
                className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HelpChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([GREETING]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<boolean | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORE_KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify(lines.slice(-30)));
    } catch {
      // ignore
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, open]);

  if (pathname?.startsWith("/admin")) return null; // staff area has its own tools

  const lastQuestion = [...lines].reverse().find((l) => l.role === "user")?.content ?? "";

  async function ask(question: string) {
    const clean = question.trim().slice(0, 800);
    if (!clean || busy) return;
    const next: Line[] = [...lines, { role: "user", content: clean }];
    setLines(next);
    setText("");
    setBusy(true);

    let answer: { reply: string; handoff?: HandoffKey } | null = null;
    if (ai !== false) {
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: next.filter((l) => l !== GREETING).map(({ role, content }) => ({ role, content })),
          }),
        });
        if (res.ok) {
          answer = await res.json();
          setAi(true);
        } else if (res.status === 429) {
          answer = { reply: (await res.json()).error, handoff: "general" };
        } else {
          setAi(false);
        }
      } catch {
        setAi(false);
      }
    }
    if (!answer || !answer.reply) answer = builtInAnswer(clean);

    setLines((current) => [...current, { role: "assistant", content: answer!.reply, handoff: answer!.handoff }]);
    if (answer.handoff) {
      logActivity({
        actor: "Website visitor",
        actorType: "Customer",
        category: "Account",
        action: `Help chat handed over to ${HANDOFF[answer.handoff].label}`,
        detail: clean.slice(0, 80),
      });
    }
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close help chat" : "Open help chat"}
        className="fixed bottom-24 right-4 z-[150] inline-flex items-center gap-2 rounded-full bg-[#0f1a3d] px-5 py-3.5 text-sm font-bold text-white shadow-2xl ring-2 ring-[#ef850f]/60 transition hover:scale-[1.03] lg:bottom-6 lg:right-6"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {open ? "Close" : "Need help?"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            aria-label="Help chat"
            className="fixed bottom-40 right-4 z-[150] flex max-h-[min(620px,calc(100vh-11rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl lg:bottom-24 lg:right-6"
          >
            <header className="flex items-center gap-3 bg-[#0f1a3d] px-5 py-4 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d]">
                <Bot size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">Yusfaith Assistant</span>
                <span className="flex items-center gap-1 text-xs text-white/70">
                  <Sparkles size={12} /> {ai === false ? "Quick answers" : "AI assistant"} · our team is one tap away
                </span>
              </span>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map((line, index) => (
                <div key={index} className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] ${line.role === "user" ? "" : "w-full"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                        line.role === "user" ? "rounded-br-sm bg-[#0f1a3d] text-white" : "rounded-bl-sm bg-[var(--surface)]"
                      }`}
                      style={line.role === "user" ? undefined : { color: "var(--foreground)" }}
                    >
                      {line.content}
                    </div>
                    {line.handoff && <HandoffCard handoff={line.handoff} question={lastQuestion} />}
                  </div>
                </div>
              ))}
              {busy && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  The assistant is typing…
                </p>
              )}
            </div>

            <div className="border-t border-[var(--border)] px-4 py-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold transition hover:border-[var(--gold)] disabled:opacity-50"
                    style={{ color: "var(--foreground)" }}
                  >
                    {q === "Talk to a person" && <UserRound size={12} />}
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(text);
                }}
                className="flex gap-2"
              >
                <input
                  className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[15px] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  placeholder="Type your question…"
                  value={text}
                  maxLength={800}
                  onChange={(e) => setText(e.target.value)}
                  aria-label="Your question"
                />
                <button
                  type="submit"
                  disabled={!text.trim() || busy}
                  aria-label="Send"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ef850f] text-[#0f1a3d] disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </form>
              <p className="mt-2 text-[11px] leading-4" style={{ color: "var(--muted)" }}>
                Automatic answers can be wrong. Prices and payments are only confirmed by our staff. Never share card details or PINs here.
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
