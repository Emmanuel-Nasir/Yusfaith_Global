/*
  YUSFAITH LOGISTICS — TRUCK SPARE PARTS
  Starter list for the website. Confirm with the logistics team which parts
  they stock, and for which truck makes. Prices are set by staff, so the site
  asks customers to enquire instead of showing prices.
*/

export type PartCategory =
  | "Engine & Filters"
  | "Brakes"
  | "Clutch & Transmission"
  | "Suspension & Steering"
  | "Electrical & Lighting"
  | "Tyres & Wheels"
  | "Oils & Lubricants"
  | "Body & Accessories";

export type SparePart = {
  id: string;
  name: string;
  category: PartCategory;
  description: string;
};

export const PART_CATEGORIES: PartCategory[] = [
  "Engine & Filters",
  "Brakes",
  "Clutch & Transmission",
  "Suspension & Steering",
  "Electrical & Lighting",
  "Tyres & Wheels",
  "Oils & Lubricants",
  "Body & Accessories",
];

export const SPARE_PARTS: SparePart[] = [
  // Engine & Filters
  { id: "oil-filter", name: "Oil filters", category: "Engine & Filters", description: "Keep engine oil clean between services." },
  { id: "fuel-filter", name: "Fuel filters and water separators", category: "Engine & Filters", description: "Protect the injection system from dirt and water in diesel." },
  { id: "air-filter", name: "Air filters", category: "Engine & Filters", description: "Clean air for better engine performance and fuel use." },
  { id: "fan-belt", name: "Fan belts", category: "Engine & Filters", description: "Drive belts for the fan, alternator and water pump." },
  { id: "water-pump", name: "Water pumps", category: "Engine & Filters", description: "Keep coolant moving to prevent overheating." },
  { id: "radiator", name: "Radiators and hoses", category: "Engine & Filters", description: "Cooling system parts for long, hot journeys." },
  { id: "gasket-set", name: "Engine gasket sets", category: "Engine & Filters", description: "Seals for engine repairs and overhauls." },

  // Brakes
  { id: "brake-linings", name: "Brake shoes and linings", category: "Brakes", description: "Reliable stopping power for loaded trucks." },
  { id: "brake-drums", name: "Brake drums", category: "Brakes", description: "Heavy-duty drums for front and rear axles." },
  { id: "brake-chambers", name: "Brake chambers", category: "Brakes", description: "Air brake chambers and spring brakes." },
  { id: "brake-valves", name: "Air brake valves", category: "Brakes", description: "Relay, foot and hand brake valves for air systems." },

  // Clutch & Transmission
  { id: "clutch-plate", name: "Clutch plates", category: "Clutch & Transmission", description: "Clutch discs for smooth gear changes." },
  { id: "pressure-plate", name: "Pressure plates", category: "Clutch & Transmission", description: "Clutch covers matched to your clutch plate." },
  { id: "release-bearing", name: "Clutch release bearings", category: "Clutch & Transmission", description: "Bearings for a quiet, reliable clutch." },
  { id: "propeller-shaft", name: "Propeller shaft parts", category: "Clutch & Transmission", description: "Universal joints and centre bearings." },

  // Suspension & Steering
  { id: "leaf-springs", name: "Leaf springs", category: "Suspension & Steering", description: "Springs that carry heavy loads safely." },
  { id: "shock-absorbers", name: "Shock absorbers", category: "Suspension & Steering", description: "A steadier ride for the cab and the load." },
  { id: "u-bolts", name: "U-bolts and centre bolts", category: "Suspension & Steering", description: "Hold springs and axles firmly in place." },
  { id: "tie-rod-ends", name: "Tie rod ends", category: "Suspension & Steering", description: "Precise steering and even tyre wear." },
  { id: "kingpin-kits", name: "King pin kits", category: "Suspension & Steering", description: "Restore tight, safe front-axle steering." },

  // Electrical & Lighting
  { id: "batteries", name: "Truck batteries", category: "Electrical & Lighting", description: "Heavy-duty batteries for reliable starts." },
  { id: "headlamps", name: "Headlamps", category: "Electrical & Lighting", description: "Clear lighting for safe night driving." },
  { id: "tail-lamps", name: "Tail and indicator lamps", category: "Electrical & Lighting", description: "Rear lights and indicators to stay visible." },
  { id: "alternators", name: "Alternators", category: "Electrical & Lighting", description: "Keep batteries charged on the road." },
  { id: "starter-motors", name: "Starter motors", category: "Electrical & Lighting", description: "Dependable starting for diesel engines." },

  // Tyres & Wheels
  { id: "tyres", name: "Truck tyres", category: "Tyres & Wheels", description: "Tyres for trucks and trailers. Tell us your tyre size." },
  { id: "wheel-bearings", name: "Wheel bearings and seals", category: "Tyres & Wheels", description: "Smooth, safe wheel rotation under load." },
  { id: "wheel-studs", name: "Wheel studs and nuts", category: "Tyres & Wheels", description: "Secure fixing for every wheel." },

  // Oils & Lubricants
  { id: "engine-oil", name: "Engine oil", category: "Oils & Lubricants", description: "Diesel engine oil for heavy-duty trucks." },
  { id: "gear-oil", name: "Gear and axle oil", category: "Oils & Lubricants", description: "Protects the gearbox and differential." },
  { id: "grease", name: "Grease", category: "Oils & Lubricants", description: "For bearings, king pins and moving joints." },
  { id: "coolant", name: "Coolant", category: "Oils & Lubricants", description: "Prevents overheating and corrosion." },

  // Body & Accessories
  { id: "mirrors", name: "Side mirrors", category: "Body & Accessories", description: "Replacement mirrors for a clear view." },
  { id: "wipers", name: "Wiper blades", category: "Body & Accessories", description: "Clear windscreens in the rainy season." },
  { id: "mud-flaps", name: "Mud flaps", category: "Body & Accessories", description: "Protect the truck and the vehicles behind it." },
  { id: "tarpaulins", name: "Tarpaulins and ropes", category: "Body & Accessories", description: "Cover and secure loads in transit." },
];
