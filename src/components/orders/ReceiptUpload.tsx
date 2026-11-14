"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, Info, Upload, X } from "lucide-react";
import { updateOrder, type Order, type Receipt } from "@/lib/orders";

/*
  RECEIPT UPLOAD (placeholder)
  Customers attach their transfer receipt after paying. In this demo the file
  stays in this browser only: images are shrunk to a small preview, PDFs keep
  just their name. In the main app the file goes to private storage and
  Finance is notified.
*/

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Shrink an image to a small JPEG preview so it fits in browser storage */
function makePreview(file: File): Promise<string | undefined> {
  if (!file.type.startsWith("image/")) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 640 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    img.src = url;
  });
}

export default function ReceiptUpload({
  order,
  onUpdated,
  required = false,
  allowReplace = true,
}: {
  order: Order;
  onUpdated: (order: Order) => void;
  required?: boolean; // shown as a required step right after ordering
  allowReplace?: boolean; // false: once uploaded, only show the receipt
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const paid = order.paymentStatus === "Payment confirmed";
  const receipt = order.receipt;

  async function choose(selected: File | undefined) {
    setError("");
    if (!selected) return;
    if (!TYPES.includes(selected.type)) {
      setError("Please upload a JPG, PNG or PDF file.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("The file is too large. The limit is 5 MB.");
      return;
    }
    setFile(selected);
    setPreview(await makePreview(selected));
  }

  function clear() {
    setFile(null);
    setPreview(undefined);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function submit() {
    if (!file) {
      setError("Choose your receipt first.");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const saved: Receipt = {
      name: file.name,
      type: file.type,
      size: file.size,
      preview,
      uploadedAt: now,
    };
    const updated = updateOrder(order.id, {
      receipt: saved,
      history: [...order.history, { status: "Receipt uploaded", at: now }],
    });
    setSaving(false);
    clear();
    if (updated) onUpdated(updated);
  }

  /* Payment already confirmed */
  if (paid) {
    return receipt ? (
      <p className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
        <CheckCircle2 size={18} />
        Payment confirmed. Receipt on file: {receipt.name}
      </p>
    ) : null;
  }

  /* Receipt on file and no replacing here: just show it */
  if (receipt && !allowReplace) {
    return (
      <div className="mt-6 flex items-start gap-4 rounded-xl bg-green-50 p-4 text-green-900">
        {receipt.preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={receipt.preview} alt="Uploaded receipt" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white">
            <FileText size={26} />
          </span>
        )}
        <span className="text-sm">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 size={16} />
            Receipt received, awaiting confirmation
          </span>
          <span className="mt-1 block opacity-80">
            {receipt.name} · {formatSize(receipt.size)} · {formatDate(receipt.uploadedAt)}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border bg-[var(--background)] p-5 sm:p-6 ${
        required ? "border-[#ef850f]/50" : "mt-8 border-[var(--border)]"
      }`}
    >
      <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold" style={{ color: "var(--foreground)" }}>
        <Upload size={20} style={{ color: "var(--gold-text)" }} />
        {required ? "Your transfer receipt" : "Send your payment receipt"}
        {required && (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-red-700">
            Required
          </span>
        )}
      </h3>
      <p className="mt-1 text-sm leading-6" style={{ color: "var(--muted)" }}>
        After your transfer, upload a screenshot, photo or PDF of the receipt.
        Your order is only processed once our accounts team confirms it.
      </p>

      {/* Already uploaded */}
      {receipt && (
        <div className="mt-4 flex items-start gap-4 rounded-xl bg-[var(--surface)] p-4">
          {receipt.preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={receipt.preview} alt="Uploaded receipt" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--background)]" style={{ color: "var(--gold-text)" }}>
              <FileText size={30} />
            </span>
          )}
          <span className="text-sm" style={{ color: "var(--foreground)" }}>
            <span className="flex items-center gap-1.5 font-bold text-green-700">
              <CheckCircle2 size={16} />
              Receipt received, awaiting confirmation
            </span>
            <span className="mt-1 block" style={{ color: "var(--muted)" }}>
              {receipt.name} · {formatSize(receipt.size)} · {formatDate(receipt.uploadedAt)}
            </span>
            <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
              Wrong file? Upload a new one below to replace it.
            </span>
          </span>
        </div>
      )}

      {/* Choose a file */}
      <label
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-6 text-center transition hover:border-[var(--gold)]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files?.[0]);
        }}
      >
        <Upload size={26} style={{ color: "var(--gold-text)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {file ? file.name : "Tap to choose your receipt, or drop it here"}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          JPG, PNG or PDF, up to 5 MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="sr-only"
          onChange={(e) => choose(e.target.files?.[0])}
        />
      </label>

      {file && (
        <div className="mt-3 flex items-center gap-3">
          {preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={preview} alt="Receipt preview" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--surface)]" style={{ color: "var(--gold-text)" }}>
              <FileText size={26} />
            </span>
          )}
          <span className="flex-1 text-sm" style={{ color: "var(--muted)" }}>
            {formatSize(file.size)}
          </span>
          <button type="button" onClick={clear} aria-label="Remove file" className="text-[var(--muted)] transition hover:text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ef850f] px-6 py-3.5 font-bold text-[#0f1a3d] transition hover:bg-[#ff9a26] disabled:opacity-60"
      >
        <Upload size={18} />
        {receipt ? "Replace receipt" : "Send receipt"}
      </button>

      <p className="mt-3 flex items-start gap-2 text-xs leading-5" style={{ color: "var(--muted)" }}>
        <Info size={14} className="mt-0.5 shrink-0" />
        Demo: your receipt is saved on this device only and is not sent to
        Yusfaith yet. The live website will send it securely to our accounts team.
      </p>
    </div>
  );
}
