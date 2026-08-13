'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredWorkOrders } from '@/lib/storage';
import { WorkOrder } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Building2, FileText, ChevronRight, Eye } from 'lucide-react';

export default function DepartmentsPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    setWorkOrders(getStoredWorkOrders());
  }, []);

  // Group work orders by Department
  const departmentGroups: Record<string, WorkOrder[]> = {};
  workOrders.forEach(w => {
    const dept = w.departmentName || 'General Contracts';
    if (!departmentGroups[dept]) {
      departmentGroups[dept] = [];
    }
    departmentGroups[dept].push(w);
  });

  const departmentList = Object.keys(departmentGroups);

  return (
    <div className="space-y-4 sm:space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
          <h1 className="text-lg sm:text-2xl font-bold text-brand-900">Department Portfolio</h1>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
          Work orders grouped by client government department and municipal agency.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="space-y-4 sm:space-y-6">
        {departmentList.map(deptName => {
          const orders = departmentGroups[deptName];
          const deptTotalCost = orders.reduce((sum, o) => sum + (o.totalAmountPKR || 0), 0);
          const completedCount = orders.filter(o => o.status === 'Completed' || o.status === 'Approved').length;

          return (
            <div key={deptName} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-3 sm:space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-100 pb-3 sm:pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-brand-900">{deptName}</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {orders.length} Active Orders | {completedCount} Completed
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold block uppercase">Total Department Cost</span>
                  <span className="text-base sm:text-lg font-bold text-amber-600 font-mono">
                    PKR {deptTotalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Work Orders Sub-Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                    <tr>
                      <th className="p-2 sm:p-2.5">Work Order No</th>
                      <th className="p-2 sm:p-2.5">Location</th>
                      <th className="p-2 sm:p-2.5">Type</th>
                      <th className="p-2 sm:p-2.5 text-right">Amount (PKR)</th>
                      <th className="p-2 sm:p-2.5 text-center">Status</th>
                      <th className="p-2 sm:p-2.5 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(wo => (
                      <tr key={wo.id} className="hover:bg-slate-50">
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-brand-900 whitespace-nowrap">{wo.id}</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-slate-800 whitespace-nowrap">{wo.location}</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-slate-600">{wo.typeOfWork}</td>
                        <td className="p-2 sm:p-2.5 text-right font-mono font-bold text-slate-900">
                          {wo.totalAmountPKR.toLocaleString()}
                        </td>
                        <td className="p-2 sm:p-2.5 text-center">
                          <StatusBadge status={wo.status} size="sm" />
                        </td>
                        <td className="p-2 sm:p-2.5 text-right">
                          <Link
                            href={`/work-orders/${encodeURIComponent(wo.id)}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-900 hover:text-amber-600"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

