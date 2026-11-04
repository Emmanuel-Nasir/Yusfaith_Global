/*
  YUSFAITH BAKERY — DEMO CATALOGUE
  Prices are editable demo estimates, not confirmed Yusfaith prices.
*/

export type BakeryCategory = "Bread" | "Pastries" | "Doughnuts" | "Cakes";

export type BakeryProduct = {
  id: string;
  name: string;
  category: BakeryCategory;
  description: string;
  image: string;
  unit: string;
  price: number;
};

const root = "/images/bakery/";

export const BAKERY_CATEGORIES: BakeryCategory[] = [
  "Bread",
  "Pastries",
  "Doughnuts",
  "Cakes",
];

export const BAKERY_PRODUCTS: BakeryProduct[] = [
  {
    id: "sliced-bread",
    name: "Sliced Bread",
    category: "Bread",
    description: "Soft, freshly baked sliced loaf for the family table.",
    image: root + "product-sliced-bread.jpg",
    unit: "loaf",
    price: 1500,
  },
  {
    id: "bread-rolls",
    name: "Bread Rolls",
    category: "Bread",
    description: "Golden rolls, perfect for breakfast or events.",
    image: root + "product-bread-rolls.jpg",
    unit: "pack of 6",
    price: 1200,
  },
  {
    id: "soft-buns",
    name: "Soft Buns",
    category: "Bread",
    description: "Light, fluffy buns baked fresh every morning.",
    image: root + "product-soft-buns.jpg",
    unit: "pack of 6",
    price: 1000,
  },
  {
    id: "bread-assortment",
    name: "Bread Assortment",
    category: "Bread",
    description: "A mixed selection of our breads for homes and shops.",
    image: root + "product-bread-assortment.jpg",
    unit: "basket",
    price: 5000,
  },
  {
    id: "meat-pie",
    name: "Meat Pie",
    category: "Pastries",
    description: "Flaky pastry filled with seasoned minced meat.",
    image: root + "product-meat-pie-reference.jpg",
    unit: "piece",
    price: 800,
  },
  {
    id: "assorted-pastries",
    name: "Assorted Pastries",
    category: "Pastries",
    description: "A box of our favourite pastries for sharing.",
    image: root + "product-assorted-pastries.jpg",
    unit: "box of 8",
    price: 4500,
  },
  {
    id: "glazed-doughnuts",
    name: "Glazed Doughnuts",
    category: "Doughnuts",
    description: "Classic soft doughnuts with a sweet glaze.",
    image: root + "product-glazed-doughnuts.jpg",
    unit: "box of 6",
    price: 3000,
  },
  {
    id: "chocolate-doughnuts",
    name: "Chocolate Doughnuts",
    category: "Doughnuts",
    description: "Doughnuts dipped in rich chocolate.",
    image: root + "product-chocolate-doughnuts.jpg",
    unit: "box of 6",
    price: 3600,
  },
  {
    id: "doughnut-assortment",
    name: "Doughnut Assortment",
    category: "Doughnuts",
    description: "A mixed dozen for parties and offices.",
    image: root + "product-doughnut-assortment.jpg",
    unit: "box of 12",
    price: 6500,
  },
  {
    id: "cupcakes",
    name: "Cake & Cupcakes",
    category: "Cakes",
    description: "Celebration cake with matching cupcakes. Custom orders welcome.",
    image: root + "product-cake-cupcakes.jpg",
    unit: "set",
    price: 25000,
  },
];

/* Delivery zones and demo delivery fees (charged separately) */
export const BAKERY_ZONES = [
  { name: "Abeokuta", fee: 1500 },
  { name: "Epe", fee: 2000 },
  { name: "Ibadan", fee: 2000 },
];