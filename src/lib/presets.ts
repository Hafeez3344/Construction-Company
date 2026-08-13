import { ExpenseItem } from './types';

export const DEFAULT_EXPENSE_PRESETS: { description: string; unit: string; defaultRate: number }[] = [
  { description: "Crush", unit: "m³/Trip", defaultRate: 8500 },
  { description: "Cement", unit: "Bags", defaultRate: 1450 },
  { description: "Sand", unit: "Trip", defaultRate: 6500 },
  { description: "Steel/Rebar", unit: "kg", defaultRate: 275 },
  { description: "Labour Charges", unit: "Days", defaultRate: 1500 },
  { description: "Mason/Skilled Labour", unit: "Days", defaultRate: 2800 },
  { description: "Fuel (Diesel/Petrol)", unit: "Litres", defaultRate: 290 },
  { description: "Transportation/Carriage", unit: "Trip", defaultRate: 12000 },
  { description: "Machinery/Equipment Rent", unit: "Hours", defaultRate: 4500 },
  { description: "Water (Tanker)", unit: "Trips", defaultRate: 3500 },
  { description: "Loading/Unloading", unit: "Labour", defaultRate: 2000 },
  { description: "Other Expenses", unit: "Lump Sum", defaultRate: 15000 },
];

export function generateDefaultExpenses(): ExpenseItem[] {
  return DEFAULT_EXPENSE_PRESETS.map((preset, index) => {
    const qty = index === 0 ? 10 : index === 1 ? 100 : index === 4 ? 15 : 0;
    const amount = qty * preset.defaultRate;
    return {
      id: `exp-${index + 1}`,
      sNo: index + 1,
      description: preset.description,
      unit: preset.unit,
      qty,
      rate: preset.defaultRate,
      amount,
      remarks: qty > 0 ? "Standard allocation" : ""
    };
  });
}
