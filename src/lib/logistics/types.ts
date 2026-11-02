
export type BookingStatus =
  | "request-received"
  | "under-review"
  | "scheduled"
  | "in-transit"
  | "delivered";

export type LogisticsBooking = {
  id: string;
  createdAt: string;
  status: BookingStatus;
  demo: true;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  cargo: {
    type: string;
    description: string;
    quantity: number;
    unit: string;
  };
  pickup: string;
  destination: string;
  preferredDate: string;
  notes: string;
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  "request-received": "Request Received",
  "under-review": "Under Review",
  scheduled: "Scheduled",
  "in-transit": "In Transit",
  delivered: "Delivered",
};

export const STATUS_STEPS: BookingStatus[] = [
  "request-received",
  "under-review",
  "scheduled",
  "in-transit",
  "delivered",
];

export const CARGO_TYPES = [
  "Cement",
  "Building Materials",
  "Agricultural Goods",
  "General Merchandise",
  "Other",
];

export const CARGO_UNITS = [
  "bags",
  "tonnes",
  "pieces",
  "pallets",
  "loads",
];
