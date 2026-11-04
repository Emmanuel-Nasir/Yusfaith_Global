/*
  YUSFAITH GLOBAL ENTERPRISES — SHARED COMPANY FACTS
  One place for confirmed company information, so every page says the same thing.
  Source: client documents and WhatsApp messages from Mr Wale.
*/

export const COMPANY = {
  name: "Yusfaith Global Enterprises",
  tagline: "Distributors of HBM and Dangote Cement — Wholesale & Retail",
  email: "olasunkanmidepot1985@gmail.com",
  officeLine: "07055540994",
  phones: ["08066171815", "08037777533"],
};

// TODO: confirm with the client — "satisfied ument needs" looks mistyped
// in the original staff policy document.
export const VISION =
  "To become the leading distributor that uses innovation and creative solutions to attain competitive advantage in local and regional landscape with trusted product to satisfied ument needs while capitalizing on global opportunities.";

export const MISSION =
  "We are committed to distributing building product at affordable prices for all our customers while providing unique value added services.";

export const CORE_VALUES = [
  {
    title: "Trust in God",
    description:
      "Our faith guides how we work, how we treat people and how we grow.",
  },
  {
    title: "Professionalism",
    description:
      "We serve every customer with competence, courtesy and reliability.",
  },
  {
    title: "Prudency",
    description:
      "We manage resources carefully and make sound business decisions.",
  },
  {
    title: "Integrity",
    description:
      "We are honest in our dealings and keep the commitments we make.",
  },
  {
    title: "Teamwork",
    description:
      "We achieve more together, across every department and location.",
  },
];

export const LOCATIONS = [
  {
    city: "Abeokuta",
    state: "Ogun State",
    label: "Corporate Head Office",
    address:
      "KM 6, Lagos–Abeokuta Expressway, Ile-Ise Awo, beside Sholanke Filling Station, Abeokuta, Ogun State",
  },
  {
    city: "Epe",
    state: "Lagos State",
    label: "Epe Office & Depot",
    address:
      "No. 33/34 Lagos Road, beside Benjude Supermarket, Epe, Lagos State",
  },
  {
    city: "Ibadan",
    state: "Oyo State",
    label: "Ibadan Office",
    address: "Adeoyo, off Ring Road, Ibadan, Oyo State",
  },
];

export const LEADERSHIP = [
  {
    name: "Alhaji Fatai Yusuf Olatunji",
    role: "CEO / Managing Director",
    image: "/images/leadership/Alhaji Fatai Yusuf Olatunji.jpeg",
  },
  {
    name: "Mr Abdulrahman Adebayo Obawunmi",
    role: "General Manager",
    image: "/images/leadership/Abdulrahman Adebayo Obawunmi.jpeg",
  },
  {
    name: "Mr Nurudeen Olatunji Lawal",
    role: "Logistics Manager",
    image: "/images/leadership/Nurudeen Olatunji Lawal.jpeg",
  },
  {
    name: "Akindele Akeem Oluwaseun",
    role: "HOS, Dangote",
    image: "/images/leadership/Akindele Akeem Oluwaseun.jpeg",
  },
  {
    name: "Mrs Bello Morenikeji",
    role: "Accountant",
    image: "/images/leadership/Bello Morenikeji.jpeg",
  },
  {
    name: "Oduwole Yusuf Olayemi",
    role: "Auditor",
    image: "/images/leadership/Oduwole Yusuf Olayemi.jpeg",
  },
  {
    name: "Miss Timilehin Tobiloba Obadimu",
    role: "Secretary",
    image: "/images/leadership/Timilehin Tobiloba Obadimu.jpeg",
  },
];

export const BUSINESSES = [
  {
    name: "Cement Depot",
    href: "/cement",
    description: "Wholesale and retail distribution of Dangote and HBM cement.",
  },
  {
    name: "Building Materials",
    href: "/building-materials",
    description: "Blocks, rods, roofing, tiles and other construction supplies.",
  },
  {
    name: "Logistics",
    href: "/logistics",
    description: "Our own trucks and drivers deliver customer orders to site.",
  },
  {
    name: "Real Estate",
    href: "/real-estate",
    description: "Property and development for growing communities.",
  },
  {
    name: "Bakery",
    href: "/bakery",
    description: "Fresh bread, pastries and baked goods made with care.",
  },
];

// Distinct award photos (award5–8 are duplicates of award1–4; award11 ≈ award9)
export const AWARD_IMAGES = [1, 2, 3, 4, 9, 10, 12, 13, 14, 15, 17, 18].map(
  (n) => `/images/corporate/awards/award${n}.jpeg`
);

// TODO: confirm which number Yusfaith uses for WhatsApp (using the first phone for now)
export const WHATSAPP_NUMBER = "2348066171815"; // international format, no "+" or leading 0

export function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

export function mapsEmbed(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;
}

export function telLink(localNumber: string) {
  // "08066171815" -> "tel:+2348066171815"
  return `tel:+234${localNumber.replace(/^0/, "")}`;
}