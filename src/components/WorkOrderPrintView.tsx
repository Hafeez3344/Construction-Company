'use client';

import React from 'react';
import { WorkOrder } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { HardHat, Printer, Calendar, MapPin, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WorkOrderPrintViewProps {
  workOrder: WorkOrder;
  onPrint?: () => void;
}

export const WorkOrderPrintView: React.FC<WorkOrderPrintViewProps> = ({ workOrder, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const { measurements, expenses, approvals, photos, payment } = workOrder;

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-xl shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Printable Measurement Sheet & Work Order</h2>
          <p className="text-xs text-slate-500">Official paper voucher layout with Jandool Construction letterhead header</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-all transform active:scale-95"
        >
          <Printer className="w-5 h-5 text-amber-400" />
          Print / Export as PDF
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="print-container bg-white p-8 rounded-xl shadow-xl border border-slate-300 text-slate-900 max-w-4xl mx-auto space-y-6">
        
        {/* Official Header */}
        <div className="border-b-2 border-brand-900 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-brand-900 text-amber-400 p-3 rounded-lg flex items-center justify-center">
                <HardHat className="w-10 h-10 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-brand-900 uppercase tracking-wide">
                  JANDOOL CONSTRUCTION COMPANY
                </h1>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                  Building Trust, Delivering Quality
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Govt. Contractor Licence No: <span className="font-bold text-slate-900">76790</span> | Class: A-1 (Highways & Civil)
                </p>
              </div>
            </div>
            <div className="text-right border-l-2 border-amber-400 pl-4 py-1">
              <span className="text-xs font-bold uppercase text-slate-500 block">Work Order Voucher</span>
              <span className="text-lg font-extrabold text-brand-900 font-mono">{workOrder.id}</span>
              <div className="mt-1">
                <StatusBadge status={workOrder.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: General Info */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
            1. General Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs border border-slate-300 p-3 rounded-md bg-slate-50/50">
            <div>
              <span className="text-slate-500 font-semibold block">Department Name:</span>
              <span className="font-bold text-slate-900">{workOrder.departmentName || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Site Location:</span>
              <span className="font-bold text-slate-900">{workOrder.location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Tender Date:</span>
              <span className="font-bold text-slate-900">{workOrder.tenderDate || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Work Start Date:</span>
              <span className="font-bold text-slate-900">{workOrder.startDate || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Completed Date:</span>
              <span className="font-bold text-slate-900">{workOrder.completedDate || 'Ongoing'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Total Cost (Million PKR):</span>
              <span className="font-bold text-slate-900">PKR {workOrder.totalCostInMillion} M</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Final Cost (PKR):</span>
              <span className="font-bold text-brand-900">PKR {workOrder.finalCost.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Notes/Remarks:</span>
              <span className="font-medium text-slate-800">{workOrder.notes || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Work Done Details */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
            2. Work Done Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs border border-slate-300 p-3 rounded-md bg-slate-50/50">
            <div>
              <span className="text-slate-500 font-semibold block">Type of Work:</span>
              <span className="font-bold text-brand-900 uppercase bg-amber-100 px-2 py-0.5 rounded text-amber-900 inline-block mt-0.5">
                {workOrder.typeOfWork}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Section / Village:</span>
              <span className="font-bold text-slate-900">{workOrder.sectionVillage || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Chainage From:</span>
              <span className="font-bold text-slate-900">{workOrder.chainageFrom || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Chainage To:</span>
              <span className="font-bold text-slate-900">{workOrder.chainageTo || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Measurement Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
            3. Measurement Sheet Details
          </h3>
          <table className="print-table w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-200 text-slate-800 font-bold uppercase">
              <tr>
                <th className="p-2 border border-slate-300">Parameter Description</th>
                <th className="p-2 border border-slate-300">Unit</th>
                <th className="p-2 border border-slate-300 text-right">Recorded Value</th>
                <th className="p-2 border border-slate-300">Field Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 font-medium border border-slate-300">Road Length</td>
                <td className="p-2 border border-slate-300">Meter (m)</td>
                <td className="p-2 font-bold text-right border border-slate-300">{measurements.lengthMeters} m</td>
                <td className="p-2 text-slate-600 border border-slate-300">{measurements.remarks.length || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium border border-slate-300">Road Width</td>
                <td className="p-2 border border-slate-300">Meter (m)</td>
                <td className="p-2 font-bold text-right border border-slate-300">{measurements.widthMeters} m</td>
                <td className="p-2 text-slate-600 border border-slate-300">{measurements.remarks.width || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium border border-slate-300">Road Thickness</td>
                <td className="p-2 border border-slate-300">Inch / mm</td>
                <td className="p-2 font-bold text-right border border-slate-300">{measurements.thickness || '-'}</td>
                <td className="p-2 text-slate-600 border border-slate-300">{measurements.remarks.thickness || '-'}</td>
              </tr>
              <tr className="bg-amber-50/60">
                <td className="p-2 font-bold text-brand-900 border border-slate-300">Area Covered (Length × Width)</td>
                <td className="p-2 font-semibold border border-slate-300">Sq Meter (m²)</td>
                <td className="p-2 font-extrabold text-brand-900 text-right border border-slate-300">
                  {measurements.areaCoveredSqM.toLocaleString()} m²
                </td>
                <td className="p-2 text-slate-700 font-medium border border-slate-300">{measurements.remarks.area || 'Auto-Calculated'}</td>
              </tr>
              <tr>
                <td className="p-2 font-medium border border-slate-300">Work Done Today</td>
                <td className="p-2 border border-slate-300">%</td>
                <td className="p-2 font-bold text-right border border-slate-300">{measurements.workDoneTodayPct}%</td>
                <td className="p-2 text-slate-600 border border-slate-300">{measurements.remarks.workDoneToday || '-'}</td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td className="p-2 border border-slate-300">Total Work Completed</td>
                <td className="p-2 border border-slate-300">%</td>
                <td className="p-2 text-right border border-slate-300">
                  <div className="flex items-center justify-end gap-2">
                    <span>{measurements.totalWorkCompletedPct}%</span>
                  </div>
                </td>
                <td className="p-2 text-slate-700 border border-slate-300">{measurements.remarks.totalCompleted || '-'}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Visual Progress Bar (Hidden or reduced in print) */}
          <div className="no-print pt-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Overall Completion Progress</span>
              <span>{measurements.totalWorkCompletedPct}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-emerald-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, measurements.totalWorkCompletedPct))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Materials & Expenses Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
            4. Materials & Expenses Statement
          </h3>
          <table className="print-table w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-200 text-slate-800 font-bold uppercase">
              <tr>
                <th className="p-2 border border-slate-300 w-10 text-center">S.No</th>
                <th className="p-2 border border-slate-300">Description of Item</th>
                <th className="p-2 border border-slate-300">Unit</th>
                <th className="p-2 border border-slate-300 text-right">Qty</th>
                <th className="p-2 border border-slate-300 text-right">Rate (PKR)</th>
                <th className="p-2 border border-slate-300 text-right">Amount (PKR)</th>
                <th className="p-2 border border-slate-300">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expenses.map((item, idx) => (
                <tr key={item.id} className={item.qty > 0 ? '' : 'text-slate-400'}>
                  <td className="p-2 text-center border border-slate-300 font-mono">{idx + 1}</td>
                  <td className="p-2 font-medium border border-slate-300 text-slate-900">{item.description}</td>
                  <td className="p-2 border border-slate-300 text-slate-600">{item.unit}</td>
                  <td className="p-2 text-right border border-slate-300 font-mono">{item.qty || 0}</td>
                  <td className="p-2 text-right border border-slate-300 font-mono">{item.rate ? item.rate.toLocaleString() : 0}</td>
                  <td className="p-2 text-right font-bold border border-slate-300 font-mono text-slate-900">
                    {(item.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-2 border border-slate-300 text-slate-500">{item.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-900 text-white font-extrabold">
                <td colSpan={5} className="p-2.5 text-right uppercase tracking-wider text-amber-400 border border-slate-900">
                  Grand Total Amount (PKR):
                </td>
                <td className="p-2.5 text-right font-mono text-sm text-white border border-slate-900">
                  PKR {workOrder.totalAmountPKR.toLocaleString()}
                </td>
                <td className="p-2.5 border border-slate-900"></td>
              </tr>
            </tfoot>
          </table>

          {/* Amount in Words Box */}
          <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-md text-xs mt-2">
            <span className="font-extrabold text-amber-900 uppercase block mb-0.5">Amount in Words:</span>
            <p className="font-bold text-slate-900 italic text-sm">
              &ldquo;{workOrder.amountInWords || 'Zero PKR Only'}&rdquo;
            </p>
          </div>
        </div>

        {/* Vendor Info & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-300 p-3 rounded-md bg-slate-50">
            <h4 className="font-bold text-brand-900 mb-1 border-b pb-1 uppercase">Vendor / Supplier Details</h4>
            <div className="space-y-1 text-slate-700">
              <p><span className="font-semibold">Supplier Name:</span> {workOrder.vendor?.supplierName || 'N/A'}</p>
              <p><span className="font-semibold">Contact Phone:</span> {workOrder.vendor?.contactNumber || 'N/A'}</p>
              <p><span className="font-semibold">Material Supplied:</span> {workOrder.vendor?.materialSupplied || 'N/A'}</p>
            </div>
          </div>
          <div className="border border-slate-300 p-3 rounded-md bg-slate-50">
            <h4 className="font-bold text-brand-900 mb-1 border-b pb-1 uppercase">Payment & Financial Status</h4>
            <div className="space-y-1 text-slate-700">
              <p><span className="font-semibold">Advance Received:</span> PKR {(payment?.advanceReceived || 0).toLocaleString()}</p>
              <p className="text-rose-700 font-bold">
                <span>Payment Remaining Due:</span> PKR {(payment?.paymentDue || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="font-semibold">Status:</span>
                <StatusBadge status={payment?.paymentStatus || 'Unpaid'} type="payment" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Site Progress Photos (If available) */}
        {photos && photos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
              Site Progress Attachments ({photos.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-1">
              {photos.map((photo) => (
                <div key={photo.id} className="border border-slate-300 rounded p-2 text-xs bg-slate-50 space-y-1">
                  <div className="aspect-video bg-slate-200 overflow-hidden rounded border">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span className="font-bold text-brand-900 bg-amber-100 px-1.5 py-0.5 rounded">{photo.stage} Stage</span>
                    <span>Date: {photo.date}</span>
                  </div>
                  <p className="font-medium text-slate-800 text-xs">{photo.caption}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Approval Signatures */}
        <div className="pt-6 space-y-3">
          <h3 className="text-xs font-extrabold text-brand-900 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded border-l-4 border-brand-900">
            5. Signatures & Approvals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-4 text-center">
            
            {/* Prepared By */}
            <div className="border border-slate-300 p-3 rounded bg-white flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block mb-2">Prepared By</span>
                <p className="font-bold text-slate-900 text-xs">{approvals.preparedBy.name || 'Site Engineer'}</p>
                <p className="text-[10px] text-slate-500">{approvals.preparedBy.date || 'Date: ______'}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 mt-3">
                {approvals.preparedBy.signed ? (
                  <span className="text-emerald-700 font-extrabold text-[11px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED & STAMPED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Signature Line</span>
                )}
              </div>
            </div>

            {/* Checked By */}
            <div className="border border-slate-300 p-3 rounded bg-white flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block mb-2">Checked By</span>
                <p className="font-bold text-slate-900 text-xs">{approvals.checkedBy.name || 'Assistant Engineer'}</p>
                <p className="text-[10px] text-slate-500">{approvals.checkedBy.date || 'Date: ______'}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 mt-3">
                {approvals.checkedBy.signed ? (
                  <span className="text-emerald-700 font-extrabold text-[11px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SIGNED & STAMPED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Signature Line</span>
                )}
              </div>
            </div>

            {/* Approved By */}
            <div className="border border-slate-300 p-3 rounded bg-white flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block mb-2">Approved By</span>
                <p className="font-bold text-slate-900 text-xs">{approvals.approvedBy.name || 'Managing Director'}</p>
                <p className="text-[10px] text-slate-500">{approvals.approvedBy.date || 'Date: ______'}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 mt-3">
                {approvals.approvedBy.signed ? (
                  <span className="text-emerald-700 font-extrabold text-[11px] inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> APPROVED & STAMPED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Signature Line</span>
                )}
              </div>
            </div>

            {/* Received By */}
            <div className="border border-slate-300 p-3 rounded bg-white flex flex-col justify-between min-h-[110px]">
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block mb-2">Received By (Dept)</span>
                <p className="font-bold text-slate-900 text-xs">{approvals.receivedBy.name || 'Client / SDO Officer'}</p>
                <p className="text-[10px] text-slate-500">{approvals.receivedBy.date || 'Date: ______'}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 mt-3">
                {approvals.receivedBy.signed ? (
                  <span className="text-emerald-700 font-extrabold text-[11px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RECEIVED & SIGNED
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px]">Signature Line</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Jandool Construction Company - Measurement & Work Order Digital System v1.0</span>
          <span>System Generated Voucher | Licence No: 76790</span>
        </div>

      </div>
    </div>
  );
};
