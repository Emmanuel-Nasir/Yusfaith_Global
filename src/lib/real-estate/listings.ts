/*
  YUSFAITH REAL ESTATE — SAMPLE LISTINGS FOR THE DEMO
  These are illustrative properties to show how the listings will work.
  Replace with Yusfaith's real properties, prices and photos.
*/

export type PropertyType =
  | "Detached House"
  | "Bungalow"
  | "Apartment"
  | "Terrace"
  | "Land";

export type ListingStatus = "For Sale" | "For Rent" | "Off-plan";

export type Listing = {
  id: string;
  title: string;
  type: PropertyType;
  status: ListingStatus;
  city: "Ogun State" | "Lagos State" | "Oyo State";
  price: number;
  priceNote?: string; // e.g. "per year", "per plot"
  bedrooms?: number;
  bathrooms?: number;
  size: string;
  summary: string;
  features: string[];
  images: string[];
};

const root = "/images/real-estate/";

export const PROPERTY_TYPES: PropertyType[] = [
  "Detached House",
  "Bungalow",
  "Apartment",
  "Terrace",
  "Land",
];

export const CITIES = ["Ogun State", "Lagos State", "Oyo State"] as const;

export const LISTINGS: Listing[] = [
  {
    id: "abk-duplex-4bed",
    title: "4-Bedroom Detached Duplex",
    type: "Detached House",
    status: "For Sale",
    city: "Ogun State",
    price: 85_000_000,
    bedrooms: 4,
    bathrooms: 5,
    size: "600 sqm plot",
    summary:
      "A finished family duplex with a fenced compound, parking and a gatehouse.",
    features: ["All rooms en-suite", "Fenced and gated", "Parking for 4 cars", "Boys' quarters"],
    images: [root + "real-estate-modern-duplex.jpg", root + "real-estate-completed-project.jpg"],
  },
  {
    id: "abk-bungalow-3bed",
    title: "3-Bedroom Bungalow",
    type: "Bungalow",
    status: "For Sale",
    city: "Ogun State",
    price: 45_000_000,
    bedrooms: 3,
    bathrooms: 3,
    size: "450 sqm plot",
    summary: "A modern bungalow with a garage, ideal for a growing family.",
    features: ["Garage", "Spacious living room", "Modern kitchen", "Good road access"],
    images: [root + "real-estate-family-bungalow.jpg", root + "real-estate-residential-estate.jpg"],
  },
  {
    id: "ibd-apartment-2bed",
    title: "2-Bedroom Apartment",
    type: "Apartment",
    status: "For Rent",
    city: "Oyo State",
    price: 2_500_000,
    priceNote: "per year",
    bedrooms: 2,
    bathrooms: 2,
    size: "110 sqm",
    summary: "A serviced apartment in a secure block close to the city centre.",
    features: ["24-hour security", "Water supply", "Parking space", "Balcony"],
    images: [root + "real-estate-apartments.jpg", root + "real-estate-gallery.jpg"],
  },
  {
    id: "epe-terrace-3bed",
    title: "3-Bedroom Terrace Homes",
    type: "Terrace",
    status: "Off-plan",
    city: "Lagos State",
    price: 38_000_000,
    bedrooms: 3,
    bathrooms: 4,
    size: "250 sqm",
    summary:
      "Terrace homes in a planned estate, with flexible payment during construction.",
    features: ["Instalment payment plan", "Estate road network", "Green areas", "Gated estate"],
    images: [root + "real-estate-residential-estate.jpg", root + "real-estate-estate.jpg"],
  },
  {
    id: "epe-estate-plots",
    title: "Residential Estate Plots",
    type: "Land",
    status: "For Sale",
    city: "Lagos State",
    price: 12_000_000,
    priceNote: "per plot",
    size: "600 sqm per plot",
    summary: "Dry, accessible plots in a developing estate with an entrance gate.",
    features: ["Survey plan", "Estate entrance gate", "Good road access", "Ready to build"],
    images: [root + "real-estate-estate-entrance.jpg", root + "real-estate-estate-infrastructure.jpg"],
  },
  {
    id: "abk-offplan-duplex",
    title: "Off-plan Duplex Development",
    type: "Detached House",
    status: "Off-plan",
    city: "Ogun State",
    price: 30_000_000,
    priceNote: "starting price",
    bedrooms: 4,
    bathrooms: 4,
    size: "500 sqm plot",
    summary: "Buy early in an ongoing development and pay as construction progresses.",
    features: ["Pay as it is built", "Choose your finishes", "Site visits welcome", "Construction updates"],
    images: [root + "real-estate-development.jpg", root + "real-estate-property-development.jpg"],
  },
];