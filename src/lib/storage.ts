import { WorkOrder } from './types';
import { generateDefaultExpenses } from './presets';
import { numberToPKRWords } from './number-to-words';

const STORAGE_KEY = 'jandool_work_orders_v1';
const ROLE_STORAGE_KEY = 'jandool_active_role_v1';

export const SEED_WORK_ORDERS: WorkOrder[] = [
  {
    id: "JCC-WO-2026-001",
    departmentName: "Highways & Communication Division",
    location: "GT Road Section KM 14 to KM 18, Peshawar",
    tenderDate: "2026-01-15",
    startDate: "2026-02-01",
    completedDate: "2026-08-30",
    expectedCompletionDate: "2026-08-30",
    totalCostInMillion: 4.5,
    finalCost: 4250000,
    isFinalCostOverridden: false,
    notes: "Bituminous concrete carpet overlay work with asphalt compactor.",

    typeOfWork: "Road",
    sectionVillage: "Tarab Village - Section 2",
    chainageFrom: "14+000",
    chainageTo: "18+200",

    measurements: {
      lengthMeters: 4200,
      widthMeters: 7.2,
      thickness: "75 mm Asphalt Base",
      areaCoveredSqM: 30240,
      workDoneTodayPct: 15,
      totalWorkCompletedPct: 75,
      remarks: {
        length: "Measured by Chainage Tape",
        width: "Dual lane carriageway",
        thickness: "As per tender spec 75mm",
        area: "Auto-calculated",
        workDoneToday: "Paving 600m segment",
        totalCompleted: "75% sub-base and carpet completed"
      }
    },

    expenses: [
      { id: "e1", sNo: 1, description: "Crush Aggregate (20mm)", unit: "m³/Trip", qty: 45, rate: 8500, amount: 382500, remarks: "Crushed stone for carpet" },
      { id: "e2", sNo: 2, description: "Bitumen / Cement Base", unit: "Bags", qty: 600, rate: 1450, amount: 870000, remarks: "Grade 60/70 Bitumen" },
      { id: "e3", sNo: 3, description: "Sand (Margalla)", unit: "Trip", qty: 25, rate: 6500, amount: 162500, remarks: "Coarse sand" },
      { id: "e4", sNo: 4, description: "Steel/Rebar", unit: "kg", qty: 1200, rate: 275, amount: 330000, remarks: "Expansion joints" },
      { id: "e5", sNo: 5, description: "Unskilled Labour", unit: "Days", qty: 120, rate: 1500, amount: 180000, remarks: "Site squad" },
      { id: "e6", sNo: 6, description: "Mason / Operator", unit: "Days", qty: 40, rate: 2800, amount: 112000, remarks: "Paver machine operators" },
      { id: "e7", sNo: 7, description: "Fuel (Diesel)", unit: "Litres", qty: 2500, rate: 290, amount: 725000, remarks: "Compactor & roller" },
      { id: "e8", sNo: 8, description: "Transportation/Carriage", unit: "Trip", qty: 20, rate: 12000, amount: 240000, remarks: "Dumper freight" },
      { id: "e9", sNo: 9, description: "Machinery Rent (Paver)", unit: "Hours", qty: 80, rate: 4500, amount: 360000, remarks: "Caterpillar Asphalt Paver" },
      { id: "e10", sNo: 10, description: "Water Tanker", unit: "Trips", qty: 30, rate: 3500, amount: 105000, remarks: "Compaction spraying" },
      { id: "e11", sNo: 11, description: "Loading/Unloading", unit: "Labour", qty: 40, rate: 2000, amount: 80000, remarks: "Manual site prep" },
      { id: "e12", sNo: 12, description: "Signage & Safety Cones", unit: "Lump Sum", qty: 1, rate: 70000, amount: 70000, remarks: "Traffic management" }
    ],
    totalAmountPKR: 3617000,
    amountInWords: numberToPKRWords(3617000),

    approvals: {
      preparedBy: { name: "Engr. Tariq Khan (Site Supervisor)", date: "2026-08-01", signed: true },
      checkedBy: { name: "Engr. Salman Mahmood (AE)", date: "2026-08-02", signed: true },
      approvedBy: { name: "Malik Jandool Khan (Managing Director)", date: "2026-08-03", signed: true },
      receivedBy: { name: "Sub-Divisional Officer (SDO)", date: "2026-08-04", signed: true },
      remarks: "Quality test certificates verified by Materials Testing Lab."
    },

    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&q=80",
        caption: "Sub-base levelling and asphalt paving in progress at KM 15",
        date: "2026-08-02",
        stage: "During"
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
        caption: "Compactor rolling carpet edge finish",
        date: "2026-08-03",
        stage: "During"
      }
    ],

    status: "In Progress",

    payment: {
      advanceReceived: 1500000,
      paymentDue: 2117000,
      paymentStatus: "Partial"
    },

    vendor: {
      supplierName: "Frontier Bitumen & Aggregate Suppliers",
      contactNumber: "+92 300 5551234",
      materialSupplied: "Bitumen Grade 60/70, 20mm Aggregate"
    },

    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-08-10T14:30:00Z"
  },
  {
    id: "JCC-WO-2026-002",
    departmentName: "Public Works Department (PWD)",
    location: "Main Bazaar Road, Village Swabi",
    tenderDate: "2025-11-10",
    startDate: "2025-12-01",
    completedDate: "2026-03-20",
    totalCostInMillion: 2.8,
    finalCost: 2650000,
    isFinalCostOverridden: false,
    notes: "Plain Rigid Concrete Pavement (PPC) 1:2:4 mix with dowel bars.",

    typeOfWork: "PPC",
    sectionVillage: "Swabi Central - Ward 3",
    chainageFrom: "0+000",
    chainageTo: "1+800",

    measurements: {
      lengthMeters: 1800,
      widthMeters: 6.0,
      thickness: "200 mm Concrete",
      areaCoveredSqM: 10800,
      workDoneTodayPct: 0,
      totalWorkCompletedPct: 100,
      remarks: {
        length: "Full bazaar stretch completed",
        width: "6m width concrete slab",
        thickness: "200mm M-20 Concrete",
        area: "10,800 Sq Meters",
        workDoneToday: "Work completed",
        totalCompleted: "100% final inspection handed over"
      }
    },

    expenses: [
      { id: "e1", sNo: 1, description: "Crush Aggregate", unit: "m³/Trip", qty: 60, rate: 8500, amount: 510000, remarks: "" },
      { id: "e2", sNo: 2, description: "OPC Cement", unit: "Bags", qty: 950, rate: 1450, amount: 1377500, remarks: "" },
      { id: "e3", sNo: 3, description: "Sand", unit: "Trip", qty: 35, rate: 6500, amount: 227500, remarks: "" },
      { id: "e4", sNo: 4, description: "Steel Dowel Bars", unit: "kg", qty: 850, rate: 275, amount: 233750, remarks: "" },
      { id: "e5", sNo: 5, description: "Mason & Labour", unit: "Days", qty: 80, rate: 2000, amount: 160000, remarks: "" },
      { id: "e6", sNo: 6, description: "Water Tanker Curing", unit: "Trips", qty: 40, rate: 3500, amount: 140000, remarks: "" }
    ],
    totalAmountPKR: 2648750,
    amountInWords: numberToPKRWords(2648750),

    approvals: {
      preparedBy: { name: "Engr. Bilal Ahmed", date: "2026-03-21", signed: true },
      checkedBy: { name: "Engr. Rashid Ali", date: "2026-03-22", signed: true },
      approvedBy: { name: "Malik Jandool Khan", date: "2026-03-23", signed: true },
      receivedBy: { name: "Executive Engineer (XEN PWD)", date: "2026-03-25", signed: true },
      remarks: "Final completion certificate issued by XEN PWD."
    },

    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
        caption: "Completed PPC concrete road surface ready for traffic",
        date: "2026-03-20",
        stage: "After"
      }
    ],

    status: "Approved",

    payment: {
      advanceReceived: 2648750,
      paymentDue: 0,
      paymentStatus: "Paid"
    },

    vendor: {
      supplierName: "Cherat Cement & Local Quarries",
      contactNumber: "+92 312 9988776",
      materialSupplied: "OPC Cement Bags, Crushed Aggregate"
    },

    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2026-03-25T11:00:00Z"
  },
  {
    id: "JCC-WO-2026-003",
    departmentName: "Municipal Development Corporation",
    location: "Mouza Kalu Khan, Main Nullah Drain",
    tenderDate: "2026-05-01",
    startDate: "2026-06-10",
    completedDate: "2026-10-15",
    expectedCompletionDate: "2026-10-15",
    totalCostInMillion: 1.9,
    finalCost: 1850000,
    isFinalCostOverridden: false,
    notes: "Construction of Reinforced Cement Concrete (RCC) box drain 3x4 ft.",

    typeOfWork: "Drain",
    sectionVillage: "Kalu Khan Market Ward",
    chainageFrom: "0+200",
    chainageTo: "1+100",

    measurements: {
      lengthMeters: 900,
      widthMeters: 1.2,
      thickness: "150 mm RCC Wall",
      areaCoveredSqM: 1080,
      workDoneTodayPct: 5,
      totalWorkCompletedPct: 40,
      remarks: {
        length: "900 meters wall shuttering",
        width: "1.2m inner clear width",
        thickness: "150mm reinforced concrete walls",
        area: "1,080 Sq M footprint",
        workDoneToday: "Concrete pour segment 3",
        totalCompleted: "400m excavation & bed concrete complete"
      }
    },

    expenses: [
      { id: "e1", sNo: 1, description: "Crush Aggregate", unit: "m³/Trip", qty: 20, rate: 8500, amount: 170000, remarks: "" },
      { id: "e2", sNo: 2, description: "Cement Bags", unit: "Bags", qty: 400, rate: 1450, amount: 580000, remarks: "" },
      { id: "e3", sNo: 3, description: "Deformed Steel Bars", unit: "kg", qty: 2200, rate: 275, amount: 605000, remarks: "" },
      { id: "e4", sNo: 4, description: "Excavator Charges", unit: "Hours", qty: 45, rate: 4500, amount: 202500, remarks: "" },
      { id: "e5", sNo: 5, description: "Labour & Shuttering", unit: "Days", qty: 60, rate: 2200, amount: 132000, remarks: "" }
    ],
    totalAmountPKR: 1689500,
    amountInWords: numberToPKRWords(1689500),

    approvals: {
      preparedBy: { name: "Engr. Farhan Ullah", date: "2026-07-28", signed: true },
      checkedBy: { name: "Engr. Shahab Khan", date: "2026-07-29", signed: false },
      approvedBy: { name: "Malik Jandool Khan", date: "", signed: false },
      receivedBy: { name: "", date: "", signed: false },
      remarks: "Shuttering alignment checked by Site Engineer."
    },

    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        caption: "Steel rebar cage shuttering for RCC box drain",
        date: "2026-07-25",
        stage: "During"
      }
    ],

    status: "Pending",

    payment: {
      advanceReceived: 500000,
      paymentDue: 1189500,
      paymentStatus: "Partial"
    },

    vendor: {
      supplierName: "Mardan Steel Mills & Cement Supply",
      contactNumber: "+92 333 4455667",
      materialSupplied: "60-Grade Deformed Rebar & OPC Cement"
    },

    createdAt: "2026-06-01T08:30:00Z",
    updatedAt: "2026-07-28T16:00:00Z"
  },
  {
    id: "JCC-WO-2026-004",
    departmentName: "Rural Development & Irrigation",
    location: "Topi Stream Bridge Crossing, District Swabi",
    tenderDate: "2025-08-20",
    startDate: "2025-09-15",
    completedDate: "2026-02-10",
    totalCostInMillion: 6.2,
    finalCost: 5950000,
    isFinalCostOverridden: false,
    notes: "Double cell RCC culvert structure with wing walls & protection work.",

    typeOfWork: "Structure",
    sectionVillage: "Topi Stream Crossing - Sector B",
    chainageFrom: "2+500",
    chainageTo: "2+550",

    measurements: {
      lengthMeters: 50,
      widthMeters: 9.0,
      thickness: "350 mm Slab & Abutment",
      areaCoveredSqM: 450,
      workDoneTodayPct: 0,
      totalWorkCompletedPct: 100,
      remarks: {
        length: "50m total bridge apron & deck",
        width: "9m dual carriageway width",
        thickness: "Heavy RCC slab and retaining wing walls",
        area: "450 Sq Meters structure footprint",
        workDoneToday: "Completed",
        totalCompleted: "100% finished and tested for load capacity"
      }
    },

    expenses: [
      { id: "e1", sNo: 1, description: "Ready Mix Concrete M-25", unit: "m³/Trip", qty: 180, rate: 12000, amount: 2160000, remarks: "" },
      { id: "e2", sNo: 2, description: "Deformed Steel (Grade 60)", unit: "kg", qty: 7500, rate: 275, amount: 2062500, remarks: "" },
      { id: "e3", sNo: 3, description: "Heavy Crane & Shuttering", unit: "Hours", qty: 60, rate: 8000, amount: 480000, remarks: "" },
      { id: "e4", sNo: 4, description: "Mason & Skilled Steel Fixers", unit: "Days", qty: 150, rate: 3000, amount: 450000, remarks: "" },
      { id: "e5", sNo: 5, description: "Stone Pitching / Protection", unit: "Trip", qty: 40, rate: 9000, amount: 360000, remarks: "" },
      { id: "e6", sNo: 6, description: "Engineers & Testing Charges", unit: "Lump Sum", qty: 1, rate: 250000, amount: 250000, remarks: "" }
    ],
    totalAmountPKR: 5762500,
    amountInWords: numberToPKRWords(5762500),

    approvals: {
      preparedBy: { name: "Engr. Imran Saeed (Project Engineer)", date: "2026-02-11", signed: true },
      checkedBy: { name: "Engr. Noman Zahid (Senior Inspector)", date: "2026-02-12", signed: true },
      approvedBy: { name: "Malik Jandool Khan (Managing Director)", date: "2026-02-13", signed: true },
      receivedBy: { name: "Director Irrigation Dept", date: "2026-02-15", signed: true },
      remarks: "Hydraulic load testing successfully completed."
    },

    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&q=80",
        caption: "Completed double-box culvert stream crossing with wing walls",
        date: "2026-02-10",
        stage: "After"
      }
    ],

    status: "Completed",

    payment: {
      advanceReceived: 3000000,
      paymentDue: 2762500,
      paymentStatus: "Partial"
    },

    vendor: {
      supplierName: "Peshawar Concrete & Heavy Structures Ltd",
      contactNumber: "+92 301 8877665",
      materialSupplied: "Ready-mix M-25 Concrete & Steel Rebar"
    },

    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2026-02-15T15:00:00Z"
  }
];

export function getStoredWorkOrders(): WorkOrder[] {
  if (typeof window === 'undefined') return SEED_WORK_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_WORK_ORDERS));
      return SEED_WORK_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading work orders from localStorage:", e);
    return SEED_WORK_ORDERS;
  }
}

export function saveStoredWorkOrders(workOrders: WorkOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workOrders));
    window.dispatchEvent(new Event('jandool_storage_change'));
  } catch (e) {
    console.error("Error saving work orders to localStorage:", e);
  }
}

export function getWorkOrderById(id: string): WorkOrder | null {
  const all = getStoredWorkOrders();
  return all.find(w => w.id === id) || null;
}

export function saveWorkOrder(workOrder: WorkOrder): void {
  const all = getStoredWorkOrders();
  const existingIdx = all.findIndex(w => w.id === workOrder.id);
  
  // Calculate total PKR and PKR words
  const calculatedTotal = workOrder.expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  workOrder.totalAmountPKR = calculatedTotal;
  workOrder.amountInWords = numberToPKRWords(calculatedTotal);

  if (!workOrder.isFinalCostOverridden) {
    workOrder.finalCost = calculatedTotal;
  }

  // Calculate payment due
  const adv = workOrder.payment?.advanceReceived || 0;
  const due = Math.max(0, calculatedTotal - adv);
  let status = workOrder.payment?.paymentStatus || 'Unpaid';
  if (adv >= calculatedTotal && calculatedTotal > 0) status = 'Paid';
  else if (adv > 0) status = 'Partial';
  else status = 'Unpaid';

  workOrder.payment = {
    advanceReceived: adv,
    paymentDue: due,
    paymentStatus: status
  };

  workOrder.updatedAt = new Date().toISOString();

  if (existingIdx >= 0) {
    all[existingIdx] = workOrder;
  } else {
    workOrder.createdAt = new Date().toISOString();
    all.unshift(workOrder);
  }

  saveStoredWorkOrders(all);
}

export function deleteWorkOrder(id: string): void {
  const all = getStoredWorkOrders();
  const filtered = all.filter(w => w.id !== id);
  saveStoredWorkOrders(filtered);
}

export function resetToSeedData(): void {
  saveStoredWorkOrders(SEED_WORK_ORDERS);
}

export function generateWorkOrderNumber(): string {
  const all = getStoredWorkOrders();
  const currentYear = new Date().getFullYear();
  const prefix = `JCC-WO-${currentYear}-`;
  
  let maxSeq = 0;
  all.forEach(w => {
    if (w.id.startsWith(prefix)) {
      const numPart = parseInt(w.id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  });

  const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
  return `${prefix}${nextSeq}`;
}

export function getActiveRole(): 'Admin' | 'Site Staff' | 'Client' {
  if (typeof window === 'undefined') return 'Admin';
  return (localStorage.getItem(ROLE_STORAGE_KEY) as any) || 'Admin';
}

export function setActiveRole(role: 'Admin' | 'Site Staff' | 'Client'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new Event('jandool_role_change'));
}
