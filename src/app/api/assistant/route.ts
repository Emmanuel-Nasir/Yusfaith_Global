import { NextResponse } from "next/server";
import { ASSISTANT_SYSTEM_PROMPT, splitHandoff } from "@/lib/assistant";

/*
  HELP ASSISTANT (AI)
  Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables to switch
  the AI on. Without it, the chat uses its built-in answers.
  Optional: ANTHROPIC_MODEL to choose the model.
*/

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 12;
const MAX_CHARS = 800;

// Simple limit per visitor (per server instance): 20 messages per 10 minutes.
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

export async function POST(request: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ fallback: true }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many messages. Please wait a few minutes or call us." }, { status: 429 });
  }

  let messages: ChatMessage[] = [];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad");
    messages = body.messages
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m === "object" &&
          ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
          typeof (m as ChatMessage).content === "string"
      )
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
      .slice(-MAX_MESSAGES);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  // the conversation must start with the customer and end with their question
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
        max_tokens: 400,
        system: ASSISTANT_SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!response.ok) return NextResponse.json({ fallback: true }, { status: 502 });
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? [])
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
    return NextResponse.json(splitHandoff(text));
  } catch {
    return NextResponse.json({ fallback: true }, { status: 502 });
  }
}
