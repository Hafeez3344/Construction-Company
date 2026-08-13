'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrder, ExpenseItem, SitePhoto, WorkType, WorkOrderStatus, PaymentStatus } from '@/lib/types';
import { generateDefaultExpenses } from '@/lib/presets';
import { generateWorkOrderNumber, saveWorkOrder } from '@/lib/storage';
import { numberToPKRWords } from '@/lib/number-to-words';
import { 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  CheckCircle, 
  Calculator, 
  Image as ImageIcon, 
  ArrowLeft,
  DollarSign,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface WorkOrderFormProps {
  initialData?: WorkOrder;
  isEdit?: boolean;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [successToast, setSuccessToast] = useState(false);

  // Form State Initializer
  const [id, setId] = useState(initialData?.id || generateWorkOrderNumber());
  const [departmentName, setDepartmentName] = useState(initialData?.departmentName || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [tenderDate, setTenderDate] = useState(initialData?.tenderDate || new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [completedDate, setCompletedDate] = useState(initialData?.completedDate || '');
  const [totalCostInMillion, setTotalCostInMillion] = useState(initialData?.totalCostInMillion || 1.0);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState<WorkOrderStatus>(initialData?.status || 'In Progress');

  // Work Done Details
  const [typeOfWork, setTypeOfWork] = useState<WorkType>(initialData?.typeOfWork || 'Road');
  const [sectionVillage, setSectionVillage] = useState(initialData?.sectionVillage || '');
  const [chainageFrom, setChainageFrom] = useState(initialData?.chainageFrom || '');
  const [chainageTo, setChainageTo] = useState(initialData?.chainageTo || '');

  // Measurements
  const [lengthMeters, setLengthMeters] = useState<number>(initialData?.measurements?.lengthMeters || 0);
  const [widthMeters, setWidthMeters] = useState<number>(initialData?.measurements?.widthMeters || 0);
  const [thickness, setThickness] = useState<string>(initialData?.measurements?.thickness || '');
  const [areaCoveredSqM, setAreaCoveredSqM] = useState<number>(initialData?.measurements?.areaCoveredSqM || 0);
  const [isManualArea, setIsManualArea] = useState<boolean>(false);
  const [workDoneTodayPct, setWorkDoneTodayPct] = useState<number>(initialData?.measurements?.workDoneTodayPct || 0);
  const [totalWorkCompletedPct, setTotalWorkCompletedPct] = useState<number>(initialData?.measurements?.totalWorkCompletedPct || 0);

  const [measurementRemarks, setMeasurementRemarks] = useState({
    length: initialData?.measurements?.remarks?.length || '',
    width: initialData?.measurements?.remarks?.width || '',
    thickness: initialData?.measurements?.remarks?.thickness || '',
    area: initialData?.measurements?.remarks?.area || '',
    workDoneToday: initialData?.measurements?.remarks?.workDoneToday || '',
    totalCompleted: initialData?.measurements?.remarks?.totalCompleted || '',
  });

  // Materials & Expenses
  const [expenses, setExpenses] = useState<ExpenseItem[]>(
    initialData?.expenses || generateDefaultExpenses()
  );

  // Override final cost option
  const [isFinalCostOverridden, setIsFinalCostOverridden] = useState<boolean>(
    initialData?.isFinalCostOverridden || false
  );
  const [finalCostOverride, setFinalCostOverride] = useState<number>(
    initialData?.finalCost || 0
  );

  // Vendor Details
  const [supplierName, setSupplierName] = useState(initialData?.vendor?.supplierName || '');
  const [contactNumber, setContactNumber] = useState(initialData?.vendor?.contactNumber || '');
  const [materialSupplied, setMaterialSupplied] = useState(initialData?.vendor?.materialSupplied || '');

  // Payment Tracking
  const [advanceReceived, setAdvanceReceived] = useState<number>(initialData?.payment?.advanceReceived || 0);

  // Photos
  const [photos, setPhotos] = useState<SitePhoto[]>(initialData?.photos || []);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoStage, setNewPhotoStage] = useState<'Before' | 'During' | 'After' | 'Inspection'>('During');

  // Approvals
  const [approvals, setApprovals] = useState({
    preparedBy: initialData?.approvals?.preparedBy || { name: 'Engr. Tariq Khan', date: new Date().toISOString().split('T')[0], signed: true },
    checkedBy: initialData?.approvals?.checkedBy || { name: 'Engr. Salman Mahmood', date: '', signed: false },
    approvedBy: initialData?.approvals?.approvedBy || { name: 'Malik Jandool Khan', date: '', signed: false },
    receivedBy: initialData?.approvals?.receivedBy || { name: 'Sub-Divisional Officer (SDO)', date: '', signed: false },
    remarks: initialData?.approvals?.remarks || '',
  });

  // Auto-Calculate Area Covered (Length x Width)
  useEffect(() => {
    if (!isManualArea && lengthMeters >= 0 && widthMeters >= 0) {
      const calcArea = Math.round((lengthMeters * widthMeters) * 100) / 100;
      setAreaCoveredSqM(calcArea);
    }
  }, [lengthMeters, widthMeters, isManualArea]);

  // Calculate live Total Amount PKR
  const totalAmountPKR = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const amountInWords = numberToPKRWords(totalAmountPKR);
  const finalCostCalculated = isFinalCostOverridden ? finalCostOverride : totalAmountPKR;
  const paymentDuePKR = Math.max(0, totalAmountPKR - advanceReceived);

  // Dynamic Expense Handlers
  const handleExpenseChange = (index: number, field: keyof ExpenseItem, value: any) => {
    const updated = [...expenses];
    const item = { ...updated[index], [field]: value };
    if (field === 'qty' || field === 'rate') {
      const q = field === 'qty' ? parseFloat(value) || 0 : item.qty;
      const r = field === 'rate' ? parseFloat(value) || 0 : item.rate;
      item.amount = Math.round(q * r);
    }
    updated[index] = item;
    setExpenses(updated);
  };

  const handleAddExpenseRow = () => {
    const newRow: ExpenseItem = {
      id: `exp-custom-${Date.now()}`,
      sNo: expenses.length + 1,
      description: '',
      unit: 'Units',
      qty: 0,
      rate: 0,
      amount: 0,
      remarks: ''
    };
    setExpenses([...expenses, newRow]);
  };

  const handleDeleteExpenseRow = (index: number) => {
    const updated = expenses.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      sNo: i + 1
    }));
    setExpenses(updated);
  };

  // Photo Upload Handler (Mock Base64 file reader)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      const newPhoto: SitePhoto = {
        id: `photo-${Date.now()}`,
        url: base64Url,
        caption: newPhotoCaption || file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toISOString().split('T')[0],
        stage: newPhotoStage
      };
      setPhotos([...photos, newPhoto]);
      setNewPhotoCaption('');
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  // Approval Sign Button Trigger
  const handleToggleSign = (key: 'preparedBy' | 'checkedBy' | 'approvedBy' | 'receivedBy') => {
    const current = approvals[key];
    const updatedSigned = !current.signed;
    const updatedDate = updatedSigned ? new Date().toISOString().split('T')[0] : '';
    setApprovals({
      ...approvals,
      [key]: {
        ...current,
        signed: updatedSigned,
        date: updatedDate
      }
    });
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let payStatus: PaymentStatus = 'Unpaid';
    if (advanceReceived >= totalAmountPKR && totalAmountPKR > 0) payStatus = 'Paid';
    else if (advanceReceived > 0) payStatus = 'Partial';

    const workOrderToSave: WorkOrder = {
      id,
      departmentName,
      location,
      tenderDate,
      startDate,
      completedDate,
      expectedCompletionDate: completedDate,
      totalCostInMillion: parseFloat(totalCostInMillion as any) || 0,
      finalCost: finalCostCalculated,
      isFinalCostOverridden,
      notes,

      typeOfWork,
      sectionVillage,
      chainageFrom,
      chainageTo,

      measurements: {
        lengthMeters: parseFloat(lengthMeters as any) || 0,
        widthMeters: parseFloat(widthMeters as any) || 0,
        thickness,
        areaCoveredSqM: parseFloat(areaCoveredSqM as any) || 0,
        workDoneTodayPct: parseFloat(workDoneTodayPct as any) || 0,
        totalWorkCompletedPct: parseFloat(totalWorkCompletedPct as any) || 0,
        remarks: measurementRemarks
      },

      expenses,
      totalAmountPKR,
      amountInWords,

      approvals,
      photos,
      status,

      payment: {
        advanceReceived: parseFloat(advanceReceived as any) || 0,
        paymentDue: paymentDuePKR,
        paymentStatus: payStatus
      },

      vendor: {
        supplierName,
        contactNumber,
        materialSupplied
      },

      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveWorkOrder(workOrderToSave);
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
      router.push(`/work-orders/${encodeURIComponent(id)}`);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-300" />
          <div>
            <p className="font-bold text-sm">Work Order Saved Successfully!</p>
            <p className="text-xs text-emerald-200">Redirecting to printable view...</p>
          </div>
        </div>
      )}

      {/* Top Title & Header Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-brand-900">
            {isEdit ? `Edit Work Order: ${id}` : 'Create New Work Order'}
          </h1>
          <p className="text-xs text-slate-500">
            Fill in the digital measurement sheet form below. All totals and conversions calculate live automatically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-brand-900 to-brand-700 hover:from-brand-950 hover:to-brand-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-transform active:scale-95"
          >
            <Save className="w-4 h-4 text-amber-400" />
            {isEdit ? 'Save Changes' : 'Create & Save Work Order'}
          </button>
        </div>
      </div>

      {/* 1. GENERAL INFO SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Building className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-brand-900 uppercase">1. General Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Order No (Auto/Editable)</label>
            <input
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono font-bold bg-slate-50 text-brand-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Highways & Communication Division"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Site Location *</label>
            <input
              type="text"
              required
              placeholder="e.g. GT Road Sector 4, Swabi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tender Date</label>
            <input
              type="date"
              value={tenderDate}
              onChange={(e) => setTenderDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Starting Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Completed / Target Date</label>
            <input
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Cost in Million (PKR)</label>
            <input
              type="number"
              step="0.01"
              value={totalCostInMillion}
              onChange={(e) => setTotalCostInMillion(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as WorkOrderStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold text-brand-900"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Approved">Approved</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Final Cost PKR (Auto: {totalAmountPKR.toLocaleString()})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                disabled={!isFinalCostOverridden}
                value={isFinalCostOverridden ? finalCostOverride : totalAmountPKR}
                onChange={(e) => setFinalCostOverride(parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg font-mono font-bold text-slate-900 ${
                  isFinalCostOverridden ? 'bg-white border-amber-500' : 'bg-slate-100 border-slate-300'
                }`}
              />
              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isFinalCostOverridden}
                  onChange={(e) => setIsFinalCostOverridden(e.target.checked)}
                  className="rounded text-brand-600"
                />
                Override
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">General Notes / Remarks</label>
          <textarea
            rows={2}
            placeholder="Additional details regarding contract, asphalt grade, or specifications..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* 2. WORK DONE DETAILS SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Layers className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-brand-900 uppercase">2. Work Done Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Type of Work *</label>
            <select
              value={typeOfWork}
              onChange={(e) => setTypeOfWork(e.target.value as WorkType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold text-slate-900"
            >
              <option value="Road">Road</option>
              <option value="PPC">PPC (Concrete Road)</option>
              <option value="Drain">Drain / Nullah</option>
              <option value="Structure">Structure / Bridge / Culvert</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section / Village</label>
            <input
              type="text"
              placeholder="e.g. Swabi Sector 2"
              value={sectionVillage}
              onChange={(e) => setSectionVillage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chainage From</label>
            <input
              type="text"
              placeholder="e.g. 14+000"
              value={chainageFrom}
              onChange={(e) => setChainageFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Chainage To</label>
            <input
              type="text"
              placeholder="e.g. 18+200"
              value={chainageTo}
              onChange={(e) => setChainageTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 3. MEASUREMENT TABLE (Fixed Rows with Auto-Math) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-brand-900 uppercase">3. Measurement Sheet Details</h2>
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
            Auto-calculates Area (Length × Width)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-brand-900 text-white font-bold uppercase">
              <tr>
                <th className="p-3 border-r border-brand-800">Parameter Description</th>
                <th className="p-3 border-r border-brand-800">Unit</th>
                <th className="p-3 border-r border-brand-800 w-36">Measurement Input</th>
                <th className="p-3">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              
              {/* Road Length */}
              <tr>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50">Road Length</td>
                <td className="p-3 text-slate-600 font-mono">Meter (m)</td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Length in meters"
                    value={lengthMeters || ''}
                    onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={measurementRemarks.length}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, length: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

              {/* Road Width */}
              <tr>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50">Road Width</td>
                <td className="p-3 text-slate-600 font-mono">Meter (m)</td>
                <td className="p-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Width in meters"
                    value={widthMeters || ''}
                    onChange={(e) => setWidthMeters(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={measurementRemarks.width}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, width: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

              {/* Road Thickness */}
              <tr>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50">Road Thickness</td>
                <td className="p-3 text-slate-600 font-mono">Inch / mm</td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="e.g. 75 mm or 6 Inches"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={measurementRemarks.thickness}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, thickness: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

              {/* Area Covered (Auto-Calc) */}
              <tr className="bg-amber-50/80">
                <td className="p-3 font-bold text-brand-900">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Area Covered</span>
                  </div>
                </td>
                <td className="p-3 font-semibold text-amber-900 font-mono">Sq Meter (m²)</td>
                <td className="p-2">
                  <div className="space-y-1">
                    <input
                      type="number"
                      disabled={!isManualArea}
                      value={areaCoveredSqM}
                      onChange={(e) => setAreaCoveredSqM(parseFloat(e.target.value) || 0)}
                      className={`w-full px-2 py-1.5 border rounded font-mono font-extrabold text-brand-900 ${
                        isManualArea ? 'bg-white border-amber-500' : 'bg-amber-100/50 border-amber-300'
                      }`}
                    />
                    <label className="flex items-center gap-1 text-[10px] text-amber-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isManualArea}
                        onChange={(e) => setIsManualArea(e.target.checked)}
                        className="rounded text-brand-600"
                      />
                      Manual Override
                    </label>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Auto-calculated (Length x Width)"
                    value={measurementRemarks.area}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, area: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

              {/* Work Done Today */}
              <tr>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50">Work Done Today</td>
                <td className="p-3 text-slate-600 font-mono">%</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={workDoneTodayPct || ''}
                    onChange={(e) => setWorkDoneTodayPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={measurementRemarks.workDoneToday}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, workDoneToday: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

              {/* Total Work Completed */}
              <tr className="bg-slate-100">
                <td className="p-3 font-bold text-slate-900">Total Work Completed</td>
                <td className="p-3 text-slate-600 font-mono">%</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={totalWorkCompletedPct || ''}
                    onChange={(e) => setTotalWorkCompletedPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 border border-brand-500 rounded font-mono font-extrabold text-brand-900 bg-white"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Remarks"
                    value={measurementRemarks.totalCompleted}
                    onChange={(e) => setMeasurementRemarks({ ...measurementRemarks, totalCompleted: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-700"
                  />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Visual Progress Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs font-extrabold text-slate-800">
            <span>Visual Completion Progress Bar</span>
            <span className="text-brand-900">{totalWorkCompletedPct}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-brand-600 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, totalWorkCompletedPct))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. MATERIALS & EXPENSES TABLE (Dynamic Rows with Live Sum & Words) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-brand-900 uppercase">4. Materials & Expenses Statement</h2>
          </div>
          <button
            type="button"
            onClick={handleAddExpenseRow}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-brand-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Custom Expense Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-800 text-white font-bold uppercase">
              <tr>
                <th className="p-2.5 border-r border-slate-700 w-10 text-center">S.No</th>
                <th className="p-2.5 border-r border-slate-700">Item Description</th>
                <th className="p-2.5 border-r border-slate-700 w-28">Unit</th>
                <th className="p-2.5 border-r border-slate-700 w-24 text-right">Qty</th>
                <th className="p-2.5 border-r border-slate-700 w-28 text-right">Rate (PKR)</th>
                <th className="p-2.5 border-r border-slate-700 w-32 text-right">Amount (PKR)</th>
                <th className="p-2.5 border-r border-slate-700">Remarks</th>
                <th className="p-2.5 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expenses.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 text-center font-mono text-slate-500">{item.sNo}</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleExpenseChange(idx, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleExpenseChange(idx, 'unit', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-1.5">
                    <input
                      type="number"
                      value={item.qty || ''}
                      onChange={(e) => handleExpenseChange(idx, 'qty', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded font-mono font-bold text-right text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </td>
                  <td className="p-1.5">
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => handleExpenseChange(idx, 'rate', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded font-mono font-bold text-right text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </td>
                  <td className="p-2 text-right font-extrabold font-mono text-brand-900 bg-slate-50">
                    {(item.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      placeholder="Remarks"
                      value={item.remarks || ''}
                      onChange={(e) => handleExpenseChange(idx, 'remarks', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600 focus:outline-none"
                    />
                  </td>
                  <td className="p-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteExpenseRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-900 text-white font-extrabold">
                <td colSpan={5} className="p-3 text-right uppercase tracking-wider text-amber-400">
                  Total Amount (PKR):
                </td>
                <td className="p-3 text-right font-mono text-base text-white">
                  PKR {totalAmountPKR.toLocaleString()}
                </td>
                <td colSpan={2} className="p-3 text-xs text-brand-200 font-normal">
                  Auto-Summed Live
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Live Amount in Words */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-xl space-y-1">
          <span className="text-xs font-black uppercase text-amber-900 tracking-wider block">
            Amount in Words (Auto-Converted):
          </span>
          <p className="text-base font-extrabold text-slate-900 italic">
            &ldquo;{amountInWords}&rdquo;
          </p>
        </div>
      </div>

      {/* VENDOR & PAYMENT TRACKING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vendor Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-sm font-extrabold text-brand-900 uppercase border-b pb-2">
            Supplier / Vendor Details
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier Name</label>
              <input
                type="text"
                placeholder="e.g. Cherat Cement & Local Quarries"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +92 300 1234567"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Material Supplied</label>
              <input
                type="text"
                placeholder="e.g. Bitumen Grade 60/70, 20mm aggregate"
                value={materialSupplied}
                onChange={(e) => setMaterialSupplied(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Payment Tracking */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-sm font-extrabold text-brand-900 uppercase border-b pb-2">
            Payment & Advance Tracking
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Advance Payment Received (PKR)</label>
              <input
                type="number"
                placeholder="0"
                value={advanceReceived || ''}
                onChange={(e) => setAdvanceReceived(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold text-slate-600">
                <span>Total Work Order Amount:</span>
                <span className="font-mono">PKR {totalAmountPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-rose-700 text-sm pt-1 border-t">
                <span>Calculated Remaining Due:</span>
                <span className="font-mono">PKR {paymentDuePKR.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SITE PROGRESS PHOTOS UPLOAD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <ImageIcon className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-brand-900 uppercase">Site Progress Photos Upload</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Photo Caption</label>
            <input
              type="text"
              placeholder="e.g. 50% paving completed"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Stage</label>
            <select
              value={newPhotoStage}
              onChange={(e) => setNewPhotoStage(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white"
            >
              <option value="Before">Before Work</option>
              <option value="During">During Work</option>
              <option value="After">After Completion</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Upload Photo File</label>
            <label className="flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-amber-400" /> Choose Image File
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Existing Photos Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-sm">
                <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-2 text-[11px]">
                  <span className="font-extrabold text-brand-900 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                    {photo.stage}
                  </span>
                  <p className="font-semibold text-slate-800 truncate mt-1">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. APPROVAL & DIGITAL SIGNATURE SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-brand-900 uppercase">5. Digital Approvals & Signatures</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Prepared By */}
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase block">1. Prepared By</span>
            <input
              type="text"
              placeholder="Name & Designation"
              value={approvals.preparedBy.name}
              onChange={(e) => setApprovals({
                ...approvals,
                preparedBy: { ...approvals.preparedBy, name: e.target.value }
              })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleToggleSign('preparedBy')}
              className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                approvals.preparedBy.signed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {approvals.preparedBy.signed ? `Signed (${approvals.preparedBy.date})` : 'Sign & Stamp'}
            </button>
          </div>

          {/* Checked By */}
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase block">2. Checked By</span>
            <input
              type="text"
              placeholder="Name & Designation"
              value={approvals.checkedBy.name}
              onChange={(e) => setApprovals({
                ...approvals,
                checkedBy: { ...approvals.checkedBy, name: e.target.value }
              })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleToggleSign('checkedBy')}
              className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                approvals.checkedBy.signed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {approvals.checkedBy.signed ? `Signed (${approvals.checkedBy.date})` : 'Sign & Stamp'}
            </button>
          </div>

          {/* Approved By */}
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase block">3. Approved By</span>
            <input
              type="text"
              placeholder="Name & Designation"
              value={approvals.approvedBy.name}
              onChange={(e) => setApprovals({
                ...approvals,
                approvedBy: { ...approvals.approvedBy, name: e.target.value }
              })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleToggleSign('approvedBy')}
              className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                approvals.approvedBy.signed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {approvals.approvedBy.signed ? `Signed (${approvals.approvedBy.date})` : 'Sign & Stamp'}
            </button>
          </div>

          {/* Received By */}
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase block">4. Received By</span>
            <input
              type="text"
              placeholder="Name & Designation"
              value={approvals.receivedBy.name}
              onChange={(e) => setApprovals({
                ...approvals,
                receivedBy: { ...approvals.receivedBy, name: e.target.value }
              })}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleToggleSign('receivedBy')}
              className={`w-full py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                approvals.receivedBy.signed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {approvals.receivedBy.signed ? `Signed (${approvals.receivedBy.date})` : 'Sign & Stamp'}
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Submit Action */}
      <div className="flex items-center justify-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-brand-900 to-brand-700 hover:from-brand-950 hover:to-brand-800 text-white font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
        >
          <Save className="w-5 h-5 text-amber-400" />
          {isEdit ? 'Save Changes' : 'Create & Save Work Order'}
        </button>
      </div>

    </form>
  );
};
