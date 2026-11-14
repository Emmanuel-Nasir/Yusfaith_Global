/*
  YUSFAITH GLOBAL ENTERPRISES — SHARED COMPANY FACTS
  One place for confirmed company information, so every page says the same thing.
  Source: client documents and WhatsApp messages from Mr Wale.
*/

export const COMPANY = {
  name: "Yusfaith Global Enterprises",
  // Name used with Dangote Cement customers (the Lafarge business uses Yusfaith)
  tradingAs: "Olasunkanmi Global Enterprise",
  // Both names together, for cement and legal lines
  fullName: "Yusfaith Global Enterprises / Olasunkanmi Global Enterprise",
  tagline: "Distributors of HBM and Dangote Cement — Wholesale & Retail",
  email: "olasunkanmidepot1985@gmail.com",
  officeLine: "07055540994",
  phones: ["08066171815", "08037777533"],
};

// Source: the company profile brochure (Nov 2026).
// The older staff-policy wording is kept below in case the client prefers it.
export const VISION =
  "To become a leading and trusted distributor of cement and building materials in Nigeria, known for reliability, operational excellence, and customer satisfaction.";

export const MISSION =
  "To consistently deliver high-quality cement and building materials through efficient logistics, professional service delivery, and strong customer relationships, while upholding integrity and sustainable business practices.";

export const CORE_VALUES = [
  { title: "Integrity", description: "Upholding honesty and ethical conduct in all dealings." },
  { title: "Professionalism", description: "Delivering services with competence and diligence." },
  { title: "Customer Focus", description: "Prioritising client satisfaction and long-term relationships." },
  { title: "Accountability", description: "Taking responsibility for actions and outcomes." },
  { title: "Teamwork", description: "Promoting collaboration and mutual respect." },
];

/* Older wording from the staff policy document (not shown on the site):
   Vision: "To become the leading distributor that uses innovation and creative
   solutions to attain competitive advantage in local and regional landscape..."
   Values: Trust in God, Professionalism, Prudency, Integrity, Teamwork. */

export const SERVICES = [
  "Cement distribution and bulk supply",
  "Supply of building and construction materials",
  "Logistics and haulage support for construction materials",
  "On-time delivery to project sites and warehouses",
  "Customer advisory and order fulfilment",
];

export const LOCATIONS = [
  {
    city: "Abeokuta",
    state: "Ogun State",
    label: "Head Office · Abeokuta",
    address:
      "KM 6, Lagos–Abeokuta Expressway, Ile-Ise Awo, beside Sholanke Filling Station, Abeokuta, Ogun State",
  },
  {
    city: "Epe",
    state: "Lagos State",
    label: "Office & Depot · Epe",
    address:
      "No. 33/34 Lagos Road, beside Benjude Supermarket, Epe, Lagos State",
  },
  {
    city: "Ibadan",
    state: "Oyo State",
    label: "Office · Ibadan",
    address: "Adeoyo, off Ring Road, Ibadan, Oyo State",
  },
  {
    city: "Osun",
    state: "Osun State",
    label: "Osun Depot",
    // TODO: replace with the Osun depot's own address (head office address for now)
    address:
      "KM 6, Lagos–Abeokuta Expressway, Ile-Ise Awo, beside Sholanke Filling Station, Abeokuta, Ogun State",
  },
];

// Our partners (named in the company profile brochure)
// Logos taken from the company profile brochure
export const PARTNERS = [
  { name: "Dangote Cement", logo: "/images/partners/dangote-cement.png" },
  { name: "HBM (formerly Lafarge)", logo: "/images/partners/lafarge-hbm.png" },
  { name: "Sterling Bank", logo: "/images/partners/sterling-bank.png" },
  { name: "First Bank", logo: "/images/partners/first-bank.png" },
  { name: "FCMB", logo: "/images/partners/fcmb.png" },
  { name: "Wema Bank", logo: "/images/partners/wema-bank.png" },
];

export const FLEET_TEXT =
  "Our fleet is strategically maintained to ensure efficient and timely delivery of cement and building materials. All vehicles are managed under strict operational and maintenance standards to guarantee safety, reliability and minimal downtime.";

export type Person = {
  name: string;
  role: string;
  image?: string; // leave out until a photo is supplied
  credentials?: string;
  summary: string;
  bio?: string[]; // full profile, shown in "View profile"
  highlights?: string[];
  phone?: string;
  email?: string; // TODO: emails to be supplied by the client
};

// Bios: adapted from the company profile brochure (Nov 2026).
// Roles and phone numbers: meeting notes (Nov 2026).
export const LEADERSHIP: Person[] = [
  {
    // Name and title as in the company profile brochure
    name: "Yusuf Fatai Olasunkanmi",
    role: "Chairman / CEO",
    image: "/images/leadership/Alhaji Fatai Yusuf Olatunji.jpeg",
    credentials: "B.Sc., M.Sc. Business Studies",
    summary:
      "Provides overall strategic direction and leads the company's growth across cement distribution, building materials, logistics, real estate and bakery.",
    bio: [
      "A seasoned business executive, he brings strong academic credentials and extensive practical experience to the leadership of the company. He holds a Bachelor of Science and a Master of Science degree in Business Studies, a foundation in strategic management, business development and organisational leadership.",
      "He has completed professional training locally and internationally in sales and marketing strategy, leadership and executive management, customer relationship management, and business growth and sustainability.",
      "With over 20 years of hands-on sales and commercial experience, he has built deep expertise in market development, customer acquisition, revenue growth and strategic partnerships. His understanding of the Nigerian business environment has been central to establishing the company as a reliable, customer-focused distributor of cement and building materials.",
      "As Chairman and CEO, he drives the corporate vision, oversees expansion, and ensures the company operates in line with sound corporate governance, ethical standards and long-term sustainability.",
    ],
    highlights: ["20+ years in sales and commerce", "B.Sc. and M.Sc. Business Studies"],
  },
  {
    name: "Mr Abdulrahman Adebayo Obawunmi",
    role: "General Manager",
    image: "/images/leadership/Abdulrahman Adebayo Obawunmi.jpeg",
    credentials: "MCIB, FCIHRM",
    summary:
      "An experienced finance and operations professional with a background in banking, risk management, operations and marketing.",
    bio: [
      "He graduated in Banking and Finance from Olabisi Onabanjo University, Ago-Iwoye, and began his career with Integrated Microfinance Bank in 2009 as a Marketer.",
      "In 2011 he joined Trust Microfinance Bank as an Assistant Internal Auditor and rose to Head of Operations. In 2016 he joined Al-Hayat Microfinance Bank as a Monitoring Officer, and was promoted to Risk Manager, Head of Recovery Unit and later Head of Marketing Unit.",
      "He is a Chartered Banker (MCIB), a Fellow of the Chartered Institute of Human Resource Management (FCIHRM), and a full member of the Institute of Customer Relationship Management and the Chartered Institute of Loan and Risk Management.",
      "He joined the company as General Manager in 2022.",
    ],
    highlights: [
      "Most Valuable Staff Award (2017)",
      "Most Outstanding Staff Award (2019)",
      "General Manager since 2022",
    ],
    phone: "08161331881",
  },
  {
    name: "Mr Nurudeen Olatunji Lawal",
    role: "Logistics Manager",
    image: "/images/leadership/Nurudeen Olatunji Lawal.jpeg",
    credentials: "B.Sc. Computer Science",
    summary:
      "Oversees logistics coordination, fleet management and delivery operations for every Yusfaith business.",
    bio: [
      "He began his career with Guaranty Trust Bank (GTBank) in 2005, working across domestic operations, funds transfer, Western Union, ATM maintenance and repair, and online banking services.",
      "He holds a National Diploma in Computer Science from the Federal Polytechnic, Ede, a B.Sc. in Computer Science from Olabisi Onabanjo University, Ago-Iwoye, and a Diploma in Computer Engineering. His professional training includes Exceptional Customer Service Delivery and Fraud Prevention.",
      "After GTBank he served as Logistics Manager at Demaloc Auto Mech and Investment, Saje, Abeokuta, before joining the company as Logistics Manager in 2021.",
    ],
    highlights: [
      "Best Teller of the Year (2006, branch level)",
      "Most Customer-Focused Staff Award",
      "Best Transaction Service Officer (2008)",
    ],
    phone: "08136979918",
  },
  {
    name: "Akindele Akeem Oluwaseun",
    role: "Head of Sales, Dangote Cement",
    image: "/images/leadership/Akindele Akeem Oluwaseun.jpeg",
    credentials: "B.Sc. Economics",
    summary:
      "Leads sales strategy and distribution for the Dangote Cement portfolio, with over nine years of sales experience.",
    bio: [
      "An experienced sales professional with strong expertise in cement distribution, market development and customer relationship management. His B.Sc. in Economics gives him a solid foundation in market analysis, demand forecasting and pricing strategy.",
      "He has over nine years of practical sales experience managing distributor networks, driving volume growth, expanding market coverage and maintaining relationships with key customers and corporate clients, working closely with the logistics and operations teams to ensure timely delivery.",
      "As Head of Sales for the Dangote Cement portfolio, he oversees sales strategy and Dangote product distribution, supervises the sales team, and drives the company's volume and revenue targets in Ogun State and beyond.",
    ],
    highlights: ["9+ years in cement sales", "B.Sc. Economics"],
    phone: "09061881215",
  },
  {
    name: "Okuewu Adewale",
    role: "Head of Sales, Lafarge Cement",
    // TODO: photo to be supplied
    credentials: "HND Marketing",
    summary:
      "Leads sales strategy and distribution for the Lafarge Cement portfolio, with over eleven years of sales experience.",
    bio: [
      "A seasoned sales professional with extensive experience in cement distribution, market penetration and customer relationship management. His Higher National Diploma in Marketing grounds him in sales strategy, consumer behaviour, branding and market development.",
      "He has over eleven years of hands-on sales experience, with a proven record of managing Lafarge Cement product portfolios, expanding distributor networks, growing sales volume and building strong relationships with contractors, developers and retail customers.",
      "As Head of Sales for the Lafarge Cement portfolio, he formulates and executes sales strategy, manages distribution channels and supervises sales operations, working closely with logistics and operations to ensure efficient fulfilment and timely delivery.",
    ],
    highlights: ["11+ years in cement sales", "HND Marketing"],
    phone: "08062143471",
  },
  {
    name: "Oduwole Yusuf Olayemi",
    role: "Human Resources",
    image: "/images/leadership/Oduwole Yusuf Olayemi.jpeg",
    summary: "Leads human resources across the company's businesses and locations.",
    // Meeting notes: show HR's email, not a phone number
  },
  {
    name: "Mrs Bello Morenikeji",
    role: "Assistant Human Resources",
    image: "/images/leadership/Bello Morenikeji.jpeg",
    summary: "Supports the HR team in looking after staff across the company.",
  },
  {
    name: "Miss Timilehin Tobiloba Obadimu",
    role: "Secretary",
    image: "/images/leadership/Timilehin Tobiloba Obadimu.jpeg",
    summary: "Manages the office and is the first point of contact on the office line.",
    phone: "07055540994",
  },
];

export const BUSINESSES = [
  {
    name: "Cement Depot",
    href: "/cement",
    description: "Wholesale and retail distribution of Dangote, HBM, BUA, Mangal and Purechem cement.",
  },
  {
    name: "Building Materials",
    href: "/building-materials",
    description: "Blocks, rods, roofing, tiles, paints and other construction supplies.",
  },
  {
    name: "Logistics",
    href: "/logistics",
    description: "On-time delivery by our own trucks, plus truck spare parts for sale.",
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
// Sales contacts shown on the stores (from LEADERSHIP, so numbers stay in one place)
function personByRole(role: string) {
  const person = LEADERSHIP.find((p) => p.role === role);
  return { name: person?.name ?? "", role, phone: person?.phone ?? "" };
}
export const SALES_CONTACTS = {
  dangote: { label: "Dangote Cement", ...personByRole("Head of Sales, Dangote Cement"), role: "Head of Sales" },
  hbm: { label: "HBM (Lafarge) Cement", ...personByRole("Head of Sales, Lafarge Cement"), role: "Head of Sales" },
  generalManager: { label: "General Manager", ...personByRole("General Manager") },
};

// Company bank account(s) customers pay into by transfer.
// TODO: fill in from Yusfaith (get it in writing from the MD/GM). While this list is
// empty the site shows "call us for account details" instead of a number.
// Example: { bank: "First Bank", accountName: "Yusfaith Global Enterprises", accountNumber: "0123456789" }
export type BankAccount = { bank: string; accountName: string; accountNumber: string };
export const BANK_ACCOUNTS: BankAccount[] = [];

// Logistics line (meeting notes, Nov 2026): deliveries and truck spare parts
export const LOGISTICS_PHONE = "08136979918";

export const WHATSAPP_NUMBER = "2348066171815"; // international format, no "+" or leading 0

export function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

export function mapsEmbed(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&z=15&output=embed`;
}

export function telLink(localNumber: string) {
  // "08066171815" -> "tel:+2348066171815"
  return `tel:+234${localNumber.replace(/^0/, "")}`;
}