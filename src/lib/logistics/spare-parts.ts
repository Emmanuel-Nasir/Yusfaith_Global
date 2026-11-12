/*
  YUSFAITH LOGISTICS — TRUCK SPARE PARTS
  Starter list for the website. Confirm with the logistics team which parts
  they stock, and for which truck makes. Prices are set by staff, so the site
  shows rough estimates that staff confirm on each order.
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
  unit: string;
  price: number; // rough estimate in Naira, confirmed by staff
};

/* One picture per category until Yusfaith sends photos of its stock */
export const CATEGORY_IMAGES: Record<PartCategory, string> = {
  "Engine & Filters": "/images/logistics/parts/engine-filters.jpg",
  Brakes: "/images/logistics/parts/brakes.jpg",
  "Clutch & Transmission": "/images/logistics/parts/clutch-transmission.jpg",
  "Suspension & Steering": "/images/logistics/parts/suspension-steering.jpg",
  "Electrical & Lighting": "/images/logistics/parts/electrical-lighting.jpg",
  "Tyres & Wheels": "/images/logistics/parts/tyres-wheels.jpg",
  "Oils & Lubricants": "/images/logistics/parts/oils-lubricants.jpg",
  "Body & Accessories": "/images/logistics/parts/body-accessories.jpg",
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
  { id: "oil-filter", name: "Oil filter", category: "Engine & Filters", description: "Keep engine oil clean between services.", unit: "piece", price: 12000 },
  { id: "fuel-filter", name: "Fuel filter and water separator", category: "Engine & Filters", description: "Protect the injection system from dirt and water in diesel.", unit: "piece", price: 18000 },
  { id: "air-filter", name: "Air filter", category: "Engine & Filters", description: "Clean air for better engine performance and fuel use.", unit: "piece", price: 28000 },
  { id: "fan-belt", name: "Fan belt", category: "Engine & Filters", description: "Drive belts for the fan, alternator and water pump.", unit: "piece", price: 15000 },
  { id: "water-pump", name: "Water pump", category: "Engine & Filters", description: "Keep coolant moving to prevent overheating.", unit: "piece", price: 120000 },
  { id: "radiator", name: "Radiator with hoses", category: "Engine & Filters", description: "Cooling system parts for long, hot journeys.", unit: "piece", price: 450000 },
  { id: "gasket-set", name: "Engine gasket set", category: "Engine & Filters", description: "Seals for engine repairs and overhauls.", unit: "set", price: 85000 },

  // Brakes
  { id: "brake-linings", name: "Brake shoes and linings (axle set)", category: "Brakes", description: "Reliable stopping power for loaded trucks.", unit: "set", price: 45000 },
  { id: "brake-drums", name: "Brake drum", category: "Brakes", description: "Heavy-duty drums for front and rear axles.", unit: "piece", price: 95000 },
  { id: "brake-chambers", name: "Brake chamber", category: "Brakes", description: "Air brake chambers and spring brakes.", unit: "piece", price: 55000 },
  { id: "brake-valves", name: "Air brake valve", category: "Brakes", description: "Relay, foot and hand brake valves for air systems.", unit: "piece", price: 60000 },

  // Clutch & Transmission
  { id: "clutch-plate", name: "Clutch plate", category: "Clutch & Transmission", description: "Clutch discs for smooth gear changes.", unit: "piece", price: 150000 },
  { id: "pressure-plate", name: "Pressure plate", category: "Clutch & Transmission", description: "Clutch covers matched to your clutch plate.", unit: "piece", price: 220000 },
  { id: "release-bearing", name: "Clutch release bearing", category: "Clutch & Transmission", description: "Bearings for a quiet, reliable clutch.", unit: "piece", price: 45000 },
  { id: "propeller-shaft", name: "Propeller shaft universal joint", category: "Clutch & Transmission", description: "Universal joints and centre bearings.", unit: "piece", price: 35000 },

  // Suspension & Steering
  { id: "leaf-springs", name: "Leaf spring", category: "Suspension & Steering", description: "Springs that carry heavy loads safely.", unit: "piece", price: 65000 },
  { id: "shock-absorbers", name: "Shock absorber", category: "Suspension & Steering", description: "A steadier ride for the cab and the load.", unit: "piece", price: 55000 },
  { id: "u-bolts", name: "U-bolts (set of 4)", category: "Suspension & Steering", description: "Hold springs and axles firmly in place.", unit: "set", price: 25000 },
  { id: "tie-rod-ends", name: "Tie rod end", category: "Suspension & Steering", description: "Precise steering and even tyre wear.", unit: "piece", price: 30000 },
  { id: "kingpin-kits", name: "King pin kit", category: "Suspension & Steering", description: "Restore tight, safe front-axle steering.", unit: "kit", price: 70000 },

  // Electrical & Lighting
  { id: "batteries", name: "Truck battery", category: "Electrical & Lighting", description: "Heavy-duty batteries for reliable starts.", unit: "piece", price: 180000 },
  { id: "headlamps", name: "Headlamp", category: "Electrical & Lighting", description: "Clear lighting for safe night driving.", unit: "piece", price: 85000 },
  { id: "tail-lamps", name: "Tail and indicator lamp", category: "Electrical & Lighting", description: "Rear lights and indicators to stay visible.", unit: "piece", price: 25000 },
  { id: "alternators", name: "Alternator", category: "Electrical & Lighting", description: "Keep batteries charged on the road.", unit: "piece", price: 250000 },
  { id: "starter-motors", name: "Starter motor", category: "Electrical & Lighting", description: "Dependable starting for diesel engines.", unit: "piece", price: 280000 },

  // Tyres & Wheels
  { id: "tyres", name: "Truck tyre", category: "Tyres & Wheels", description: "Tyres for trucks and trailers. Tell us your tyre size.", unit: "tyre", price: 420000 },
  { id: "wheel-bearings", name: "Wheel bearing and seal set", category: "Tyres & Wheels", description: "Smooth, safe wheel rotation under load.", unit: "set", price: 40000 },
  { id: "wheel-studs", name: "Wheel studs and nuts (set of 10)", category: "Tyres & Wheels", description: "Secure fixing for every wheel.", unit: "set", price: 30000 },

  // Oils & Lubricants
  { id: "engine-oil", name: "Diesel engine oil", category: "Oils & Lubricants", description: "Diesel engine oil for heavy-duty trucks.", unit: "25-litre keg", price: 120000 },
  { id: "gear-oil", name: "Gear and axle oil", category: "Oils & Lubricants", description: "Protects the gearbox and differential.", unit: "20-litre keg", price: 95000 },
  { id: "grease", name: "Grease", category: "Oils & Lubricants", description: "For bearings, king pins and moving joints.", unit: "15 kg bucket", price: 45000 },
  { id: "coolant", name: "Coolant", category: "Oils & Lubricants", description: "Prevents overheating and corrosion.", unit: "20-litre keg", price: 40000 },

  // Body & Accessories
  { id: "mirrors", name: "Side mirror", category: "Body & Accessories", description: "Replacement mirrors for a clear view.", unit: "piece", price: 35000 },
  { id: "wipers", name: "Wiper blades", category: "Body & Accessories", description: "Clear windscreens in the rainy season.", unit: "pair", price: 12000 },
  { id: "mud-flaps", name: "Mud flaps", category: "Body & Accessories", description: "Protect the truck and the vehicles behind it.", unit: "pair", price: 18000 },
  { id: "tarpaulins", name: "Tarpaulin with ropes", category: "Body & Accessories", description: "Cover and secure loads in transit.", unit: "piece", price: 85000 },
];
