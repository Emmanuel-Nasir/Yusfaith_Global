import { BRANCH_MANAGERS, LEADERSHIP, LOGISTICS_PHONE, SALES_CONTACTS } from "@/data/company";
import type { Recipient, Subsidiary } from "@/lib/orders";

export type HelpContact = {
  label: string;
  name: string;
  role: string;
  phone: string;
};

const STATES = Object.keys(BRANCH_MANAGERS);

const logisticsManager = LEADERSHIP.find((p) => p.phone === LOGISTICS_PHONE);
const ceo = LEADERSHIP.find((p) => p.role.includes("CEO"));

const LOGISTICS_CONTACT: HelpContact = {
  label: "Logistics & Spare Parts",
  name: logisticsManager?.name ?? "",
  role: logisticsManager?.role ?? "Logistics",
  phone: LOGISTICS_PHONE,
};

/** The state an order belongs to, from its delivery state or pickup branch. */
export function stateOf(location: string) {
  return STATES.find((state) => location.includes(state.replace(" State", ""))) ?? "";
}

/** The Head(s) of Sales responsible for what is in the order. */
function headsOfSales(subsidiary: Subsidiary, productIds: string[]): HelpContact[] {
  const heads: HelpContact[] = [];
  if (subsidiary === "Cement Depot") {
    if (productIds.some((id) => id.startsWith("dangote"))) heads.push(SALES_CONTACTS.dangote);
    if (productIds.some((id) => id.startsWith("hbm"))) heads.push(SALES_CONTACTS.hbm);
  }
  if (subsidiary === "Truck Spare Parts") heads.push(LOGISTICS_CONTACT);
  return heads;
}

/**
 * Everyone told about a new price request:
 * the branch manager for the state, the Head(s) of Sales, the GM and the CEO.
 */
export function recipientsFor(subsidiary: Subsidiary, productIds: string[], location: string): Recipient[] {
  const state = stateOf(location);
  const branch = state ? BRANCH_MANAGERS[state] : undefined;
  const list: Recipient[] = [];

  if (state) {
    list.push({
      name: branch?.name || `${state} branch manager`,
      role: `Branch Manager, ${state}`,
      phone: branch?.phone || undefined,
    });
  }
  for (const head of headsOfSales(subsidiary, productIds)) {
    list.push({ name: head.name, role: `${head.role} · ${head.label}`, phone: head.phone });
  }
  list.push({
    name: SALES_CONTACTS.generalManager.name,
    role: "General Manager",
    phone: SALES_CONTACTS.generalManager.phone,
  });
  if (ceo) list.push({ name: ceo.name, role: ceo.role, phone: ceo.phone });

  // one entry per person
  return list.filter((r, i) => list.findIndex((x) => x.name === r.name) === i);
}

/**
 * The people a customer can call about an order: the branch manager (when we
 * have their number), the Head of Sales for what they ordered, and the GM.
 */
export function contactsFor(subsidiary: Subsidiary, productIds: string[], location = ""): HelpContact[] {
  const contacts: HelpContact[] = [];
  const state = stateOf(location);
  const branch = state ? BRANCH_MANAGERS[state] : undefined;
  if (branch?.phone) {
    contacts.push({ label: `${state} branch`, name: branch.name, role: "Branch Manager", phone: branch.phone });
  }
  contacts.push(...headsOfSales(subsidiary, productIds));
  contacts.push(SALES_CONTACTS.generalManager);
  return contacts.filter((c) => c.phone);
}

export function telLink(phone: string) {
  return `tel:+234${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}
