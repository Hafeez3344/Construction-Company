export type WorkType = 'Road' | 'PPC' | 'Drain' | 'Structure' | 'Other';

export type WorkOrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Approved' | 'On Hold';

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';

export type UserRole = 'Admin' | 'Site Staff' | 'Client';

export interface MeasurementData {
  lengthMeters: number;
  widthMeters: number;
  thickness: string; // e.g. "150 mm" or "6 Inches"
  areaCoveredSqM: number;
  workDoneTodayPct: number;
  totalWorkCompletedPct: number;
  remarks: {
    length?: string;
    width?: string;
    thickness?: string;
    area?: string;
    workDoneToday?: string;
    totalCompleted?: string;
  };
}

export interface ExpenseItem {
  id: string;
  sNo: number;
  description: string;
  unit: string;
  qty: number;
  rate: number;
  amount: number; // Auto-calculated (qty * rate)
  remarks?: string;
}

export interface SitePhoto {
  id: string;
  url: string; // Base64 or object URL
  caption: string;
  date: string;
  stage: 'Before' | 'During' | 'After' | 'Inspection';
}

export interface ApprovalRecord {
  preparedBy: { name: string; date: string; signed: boolean };
  checkedBy: { name: string; date: string; signed: boolean };
  approvedBy: { name: string; date: string; signed: boolean };
  receivedBy: { name: string; date: string; signed: boolean };
  remarks?: string;
}

export interface VendorDetails {
  supplierName: string;
  contactNumber: string;
  materialSupplied: string;
}

export interface PaymentDetails {
  advanceReceived: number;
  paymentDue: number; // Auto-calculated (Total Expense Amount - advanceReceived)
  paymentStatus: PaymentStatus;
}

export interface WorkOrder {
  id: string; // Unique WO Number e.g., "JCC-WO-2026-001"
  departmentName: string;
  location: string;
  tenderDate: string; // YYYY-MM-DD
  startDate: string;
  completedDate: string;
  expectedCompletionDate?: string;
  totalCostInMillion: number;
  finalCost: number; // Defaults to auto-summed expenses total, but editable override
  isFinalCostOverridden?: boolean;
  notes?: string;

  // Section 2: Work Done Details
  typeOfWork: WorkType;
  sectionVillage: string;
  chainageFrom: string;
  chainageTo: string;

  // Section 3: Measurements
  measurements: MeasurementData;

  // Section 4: Materials & Expenses
  expenses: ExpenseItem[];
  totalAmountPKR: number; // Sum of expenses
  amountInWords: string; // Auto-converted

  // Section 5: Approval
  approvals: ApprovalRecord;

  // Additional Features
  photos: SitePhoto[];
  status: WorkOrderStatus;
  payment: PaymentDetails;
  vendor?: VendorDetails;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
