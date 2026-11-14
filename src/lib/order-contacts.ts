import { LEADERSHIP, LOGISTICS_PHONE, SALES_CONTACTS } from "@/data/company";
import type { Subsidiary } from "@/lib/orders";

export type HelpContact = {
  label: string;
  name: string;
  role: string;
  phone: string;
};

const logisticsManager = LEADERSHIP.find((p) => p.phone === LOGISTICS_PHONE);

const LOGISTICS_CONTACT: HelpContact = {
  label: "Logistics & Spare Parts",
  name: logisticsManager?.name ?? "",
  role: logisticsManager?.role ?? "Logistics",
  phone: LOGISTICS_PHONE,
};

/**
 * The people a customer should call about an order:
 * the Head of Sales for each cement brand in it, the Logistics line for
 * spare parts, and always the General Manager last.
 */
export function contactsFor(subsidiary: Subsidiary, productIds: string[]): HelpContact[] {
  const contacts: HelpContact[] = [];

  if (subsidiary === "Cement Depot") {
    if (productIds.some((id) => id.startsWith("dangote"))) contacts.push(SALES_CONTACTS.dangote);
    if (productIds.some((id) => id.startsWith("hbm"))) contacts.push(SALES_CONTACTS.hbm);
  }
  if (subsidiary === "Truck Spare Parts") contacts.push(LOGISTICS_CONTACT);

  contacts.push(SALES_CONTACTS.generalManager);
  return contacts.filter((c) => c.phone);
}

export function telLink(phone: string) {
  return `tel:+234${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}
