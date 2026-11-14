import { useEffect, useState } from "react";

/*
  DELIVERY FEES
  One list for every store and the staff area. Staff with price access can
  change a fee in Admin → Prices; the stores pick it up at checkout.
  Demo: changes are saved in this browser only. In the main app they live in
  the database so every customer sees the same fee.
*/

export type DeliveryBusiness = "Cement Depot" | "Building Materials" | "Truck Spare Parts" | "Bakery";
export type DeliveryZone = { name: string; fee: number };

export const DELIVERY_BUSINESSES: DeliveryBusiness[] = [
  "Cement Depot",
  "Building Materials",
  "Truck Spare Parts",
  "Bakery",
];

export const DEFAULT_DELIVERY_FEES: Record<DeliveryBusiness, DeliveryZone[]> = {
  "Cement Depot": [
    { name: "Ogun State", fee: 25000 },
    { name: "Lagos State", fee: 30000 },
    { name: "Oyo State", fee: 35000 },
    { name: "Osun State", fee: 40000 },
  ],
  "Building Materials": [
    { name: "Ogun State", fee: 25000 },
    { name: "Lagos State", fee: 30000 },
    { name: "Oyo State", fee: 35000 },
    { name: "Osun State", fee: 40000 },
  ],
  "Truck Spare Parts": [
    { name: "Ogun State", fee: 5000 },
    { name: "Lagos State", fee: 8000 },
    { name: "Oyo State", fee: 8000 },
    { name: "Osun State", fee: 10000 },
  ],
  Bakery: [
    { name: "Ogun State", fee: 1500 },
    { name: "Lagos State", fee: 2000 },
    { name: "Oyo State", fee: 2000 },
    { name: "Osun State", fee: 2500 },
  ],
};

const KEY = "yusfaith-demo-delivery-fees";
const EVENT = "yusfaith-delivery-fees-changed";

type Overrides = Partial<Record<DeliveryBusiness, Record<string, number>>>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

export function loadDeliveryFees(): Record<DeliveryBusiness, DeliveryZone[]> {
  const overrides = readOverrides();
  const result = {} as Record<DeliveryBusiness, DeliveryZone[]>;
  for (const business of DELIVERY_BUSINESSES) {
    result[business] = DEFAULT_DELIVERY_FEES[business].map((zone) => ({
      name: zone.name,
      fee: overrides[business]?.[zone.name] ?? zone.fee,
    }));
  }
  return result;
}

export function saveDeliveryFee(business: DeliveryBusiness, zone: string, fee: number) {
  const overrides = readOverrides();
  overrides[business] = { ...(overrides[business] ?? {}), [zone]: Math.max(0, Math.round(fee)) };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // demo only, ignore
  }
}

export function resetDeliveryFees() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // demo only, ignore
  }
}

/** All delivery fees, kept up to date when staff change them. */
export function useDeliveryFees() {
  const [fees, setFees] = useState(DEFAULT_DELIVERY_FEES);
  useEffect(() => {
    const refresh = () => setFees(loadDeliveryFees());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return fees;
}

/** Delivery zones for one store. Falls back to `fallback` for other businesses. */
export function useDeliveryZones(business: string, fallback: DeliveryZone[] = []) {
  const fees = useDeliveryFees();
  return (fees as Record<string, DeliveryZone[]>)[business] ?? fallback;
}
