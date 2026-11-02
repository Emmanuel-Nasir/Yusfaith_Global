
import type { LogisticsBooking } from "./types";

const KEY = "yusfaith-logistics-bookings-v1";

export function getBookings(): LogisticsBooking[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data)
      ? (data as LogisticsBooking[])
      : [];
  } catch {
    return [];
  }
}

export function getBooking(
  id: string
): LogisticsBooking | undefined {
  const reference = id.trim().toUpperCase();

  return getBookings().find(
    (item) => item.id.toUpperCase() === reference
  );
}

export const findBooking = getBooking;

export function saveBooking(booking: LogisticsBooking): void {
  if (typeof window === "undefined") {
    throw new Error("Browser storage is unavailable.");
  }

  const previous = getBookings().filter(
    (item) => item.id !== booking.id
  );

  localStorage.setItem(
    KEY,
    JSON.stringify([booking, ...previous])
  );
}

export function createBookingId(): string {
  const random = crypto.randomUUID()
    .replace(/-/g, "")
    .slice(0, 10)
    .toUpperCase();

  return `YGE-LG-${random}`;
}
