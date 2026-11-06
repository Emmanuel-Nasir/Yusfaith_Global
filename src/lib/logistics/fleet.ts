/*
  YUSFAITH LOGISTICS — SAMPLE FLEET AND DRIVERS (DEMO)
  Replace with Yusfaith's real trucks, plate numbers and drivers.
*/

export type Truck = {
  id: string;
  plate: string;
  type: string;
  capacity: string;
  branch: string;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  truckId: string; // default truck
};

export const TRUCKS: Truck[] = [
  { id: "T1", plate: "ABK-101-XA", type: "Flatbed truck", capacity: "30 tonnes", branch: "Abeokuta" },
  { id: "T2", plate: "ABK-102-XA", type: "Flatbed truck", capacity: "30 tonnes", branch: "Abeokuta" },
  { id: "T3", plate: "EPE-201-XB", type: "Tipper truck", capacity: "20 tonnes", branch: "Epe" },
  { id: "T4", plate: "IBD-301-XC", type: "Delivery van", capacity: "3 tonnes", branch: "Ibadan" },
];

export const DRIVERS: Driver[] = [
  { id: "D1", name: "Sample Driver A", phone: "0800 000 0001", truckId: "T1" },
  { id: "D2", name: "Sample Driver B", phone: "0800 000 0002", truckId: "T2" },
  { id: "D3", name: "Sample Driver C", phone: "0800 000 0003", truckId: "T3" },
  { id: "D4", name: "Sample Driver D", phone: "0800 000 0004", truckId: "T4" },
];