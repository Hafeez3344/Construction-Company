'use client';

import React, { useState, useEffect } from 'react';
import { getStoredWorkOrders } from '@/lib/storage';
import { WorkOrder, WorkType } from '@/lib/types';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function ReportsPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    setWorkOrders(getStoredWorkOrders());
  }, []);

  // Summary Metrics
  const totalOrders = workOrders.length;
  const totalSpent = workOrders.reduce((sum, w) => sum + (w.totalAmountPKR || 0), 0);
  const totalAdvance = workOrders.reduce((sum, w) => sum + (w.payment?.advanceReceived || 0), 0);
  const totalDue = workOrders.reduce((sum, w) => sum + (w.payment?.paymentDue || 0), 0);
  const avgCost = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Breakdown by Work Type
  const workTypes: WorkType[] = ['Road', 'PPC', 'Drain', 'Structure', 'Other'];
  const typeMetrics = workTypes.map(type => {
    const orders = workOrders.filter(w => w.typeOfWork === type);
    const count = orders.length;
    const amount = orders.reduce((sum, w) => sum + (w.totalAmountPKR || 0), 0);
    const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    return { type, count, amount, pct };
  });

  // Breakdown by Status
  const statusMetrics = [
    { label: 'Approved', count: workOrders.filter(w => w.status === 'Approved').length, color: 'bg-emerald-500' },
    { label: 'Completed', count: workOrders.filter(w => w.status === 'Completed').length, color: 'bg-indigo-500' },
    { label: 'In Progress', count: workOrders.filter(w => w.status === 'In Progress').length, color: 'bg-blue-500' },
    { label: 'Pending', count: workOrders.filter(w => w.status === 'Pending').length, color: 'bg-amber-500' },
    { label: 'On Hold', count: workOrders.filter(w => w.status === 'On Hold').length, color: 'bg-slate-400' },
  ];

  // CSV Summary Export
  const handleExportCSV = () => {
    let csv = 'Work Order No,Department,Location,Type of Work,Area (sq.m),Total Cost (PKR),Advance (PKR),Due (PKR),Status\n';
    workOrders.forEach(w => {
      csv += `"${w.id}","${w.departmentName}","${w.location}","${w.typeOfWork}",${w.measurements?.areaCoveredSqM || 0},${w.totalAmountPKR},${w.payment?.advanceReceived || 0},${w.payment?.paymentDue || 0},"${w.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jandool_Construction_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-brand-900">Reports & Executive Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Financial breakdown, work-type distribution, and project completion summaries for Jandool Construction.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold px-5 py-2.5 rounded-xl shadow transition-all text-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          Export Summary Report (CSV)
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Grand Expenditure</p>
          <p className="text-2xl font-bold text-brand-900 mt-1">PKR {(totalSpent / 1000000).toFixed(2)} M</p>
          <p className="text-xs text-slate-500 mt-0.5">PKR {totalSpent.toLocaleString()} Total</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Average WO Value</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">PKR {(avgCost / 1000000).toFixed(2)} M</p>
          <p className="text-xs text-slate-500 mt-0.5">Across {totalOrders} Work Orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Advance Recovered</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">PKR {(totalAdvance / 1000000).toFixed(2)} M</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            {totalSpent > 0 ? ((totalAdvance / totalSpent) * 100).toFixed(1) : 0}% Collected
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase">Outstanding Dues</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">PKR {(totalDue / 1000000).toFixed(2)} M</p>
          <p className="text-xs text-rose-600 mt-0.5">Pending Payment</p>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Expenditure by Type of Work */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-semibold text-brand-900 uppercase">Expenditure by Work Category</h2>
            <PieChart className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            {typeMetrics.map(item => (
              <div key={item.type} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{item.type} Construction ({item.count} orders)</span>
                  <span className="font-mono text-brand-900">PKR {item.amount.toLocaleString()} ({item.pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-brand-900 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, item.pct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-semibold text-brand-900 uppercase">Work Order Status Distribution</h2>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            {statusMetrics.map(item => {
              const pct = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
              return (
                <div key={item.label} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{item.label}</span>
                    <span>{item.count} orders ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Detail Executive Ledger Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-brand-900 uppercase border-b pb-3">
          Summary Ledger Statement
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800 text-white font-bold uppercase">
              <tr>
                <th className="p-3">WO No</th>
                <th className="p-3">Department</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Area (m²)</th>
                <th className="p-3 text-right">Total Cost (PKR)</th>
                <th className="p-3 text-right">Advance Received</th>
                <th className="p-3 text-right">Payment Due</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {workOrders.map(w => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-900">{w.id}</td>
                  <td className="p-3 font-semibold text-slate-800">{w.departmentName}</td>
                  <td className="p-3 font-semibold text-slate-700">{w.typeOfWork}</td>
                  <td className="p-3 text-right font-mono">{w.measurements?.areaCoveredSqM?.toLocaleString() || 0}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {w.totalAmountPKR?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                    {(w.payment?.advanceReceived || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-rose-700 font-bold">
                    {(w.payment?.paymentDue || 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-700">{w.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-900 text-white font-semibold">
                <td colSpan={4} className="p-3 text-right uppercase text-amber-400">Totals:</td>
                <td className="p-3 text-right font-mono">PKR {totalSpent.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-emerald-300">PKR {totalAdvance.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-rose-300">PKR {totalDue.toLocaleString()}</td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}

