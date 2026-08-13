'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredWorkOrders, deleteWorkOrder, getActiveRole } from '@/lib/storage';
import { WorkOrder, WorkType, WorkOrderStatus, UserRole } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit3, 
  Printer, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Building2, 
  Grid, 
  List,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [role, setRole] = useState<UserRole>('Admin');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState<WorkType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<WorkOrderStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = () => {
    setWorkOrders(getStoredWorkOrders());
    setRole(getActiveRole());
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('jandool_storage_change', handleStorageChange);
    window.addEventListener('jandool_role_change', handleStorageChange);
    return () => {
      window.removeEventListener('jandool_storage_change', handleStorageChange);
      window.removeEventListener('jandool_role_change', handleStorageChange);
    };
  }, []);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteWorkOrder(deleteId);
      setDeleteId(null);
      loadData();
    }
  };

  // Filter Logic
  const departmentsList = Array.from(new Set(workOrders.map(w => w.departmentName))).filter(Boolean);

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.sectionVillage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || wo.departmentName === selectedDept;
    const matchesType = selectedType === 'All' || wo.typeOfWork === selectedType;
    const matchesStatus = selectedStatus === 'All' || wo.status === selectedStatus;

    return matchesSearch && matchesDept && matchesType && matchesStatus;
  });

  // Calculate Metrics
  const totalOrders = workOrders.length;
  const totalExpenditure = workOrders.reduce((sum, w) => sum + (w.totalAmountPKR || 0), 0);
  const totalPendingPayment = workOrders.reduce((sum, w) => sum + (w.payment?.paymentDue || 0), 0);
  const ongoingCount = workOrders.filter(w => w.status === 'In Progress' || w.status === 'Pending').length;
  const completedCount = workOrders.filter(w => w.status === 'Completed' || w.status === 'Approved').length;
  const pendingApprovalsCount = workOrders.filter(w => w.status === 'Pending').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Alert (If pending items exist) */}
      {pendingApprovalsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-brand-950 px-5 py-3 rounded-2xl shadow-md flex items-center justify-between gap-4 font-bold text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-brand-950" />
            <span>
              Notice: You have <span className="underline font-bold">{pendingApprovalsCount} work order(s)</span> pending approval or inspection sign-off.
            </span>
          </div>
          <button
            onClick={() => setSelectedStatus('Pending')}
            className="bg-brand-950 text-white hover:bg-brand-900 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow"
          >
            Filter Pending
          </button>
        </div>
      )}

      {/* Hero Welcome Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold text-brand-900">Work Orders Dashboard</h1>
            <span className="bg-brand-100 text-brand-900 font-semibold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full">
              {totalOrders} Total
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            Digitally track measurement sheets, site photos, material costs, and approvals for Jandool Construction.
          </p>
        </div>

        {role !== 'Client' && (
          <Link
            href="/work-orders/new"
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-brand-950 font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow transition-transform transform active:scale-95 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            Add New Work Order
          </Link>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-lg sm:text-2xl font-bold text-brand-900 mt-0.5 sm:mt-1">{totalOrders}</p>
            <p className="text-[10px] sm:text-xs text-emerald-600 font-semibold mt-0.5">
              {completedCount} Done / {ongoingCount} Active
            </p>
          </div>
          <div className="bg-brand-50 p-2 sm:p-3 rounded-lg sm:rounded-xl text-brand-700">
            <FileText className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Card 2: Total Expenditure */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Spent</p>
            <p className="text-base sm:text-xl font-bold text-brand-900 mt-0.5 sm:mt-1">
              PKR {(totalExpenditure / 1000000).toFixed(2)} M
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
              PKR {totalExpenditure.toLocaleString()}
            </p>
          </div>
          <div className="bg-amber-50 p-2 sm:p-3 rounded-lg sm:rounded-xl text-amber-600">
            <DollarSign className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dues</p>
            <p className="text-base sm:text-xl font-bold text-rose-700 mt-0.5 sm:mt-1">
              PKR {(totalPendingPayment / 1000000).toFixed(2)} M
            </p>
            <p className="text-[10px] sm:text-xs text-rose-600 font-medium mt-0.5 truncate">
              {workOrders.filter(w => (w.payment?.paymentDue || 0) > 0).length} orders
            </p>
          </div>
          <div className="bg-rose-50 p-2 sm:p-3 rounded-lg sm:rounded-xl text-rose-600">
            <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Card 4: Active Projects */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Ongoing On-Site</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-700 mt-0.5 sm:mt-1">{ongoingCount}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Active Site Ops
            </p>
          </div>
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl text-blue-700">
            <Clock className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
        </div>

      </div>

      {/* Toolbar: Search, Filters & View Toggle */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
            <input
              type="text"
              placeholder="Search WO No, Location, Dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-300 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Depts ({departmentsList.length})</option>
              {departmentsList.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Work Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-300 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Types</option>
              <option value="Road">Road</option>
              <option value="PPC">PPC (Concrete)</option>
              <option value="Drain">Drain</option>
              <option value="Structure">Structure</option>
              <option value="Other">Other</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 border border-slate-300 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 focus:outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Approved">Approved</option>
              <option value="On Hold">On Hold</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 ml-auto md:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow text-brand-900' : 'text-slate-500'
                }`}
                title="Grid Card View"
              >
                <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-white shadow text-brand-900' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* WORK ORDERS DISPLAY AREA */}
      {filteredWorkOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Work Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No work order matches your active search query or filter selection. Try clearing filters or create a new order.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedType('All');
              setSelectedStatus('All');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {filteredWorkOrders.map((wo) => (
            <div
              key={wo.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-3.5 sm:p-5 space-y-2 sm:space-y-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold font-mono text-brand-900">{wo.id}</span>
                  <StatusBadge status={wo.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">{wo.location}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">{wo.departmentName}</p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded">
                    {wo.typeOfWork} Work
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 truncate">
                    Ch: {wo.chainageFrom} - {wo.chainageTo}
                  </span>
                </div>
              </div>

              {/* Card Body Metrics */}
              <div className="p-3.5 sm:p-5 bg-slate-50/50 space-y-2.5 sm:space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Total Cost:</span>
                    <span className="font-semibold text-brand-900 font-mono text-xs sm:text-sm">
                      PKR {wo.totalAmountPKR.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Area Covered:</span>
                    <span className="font-bold text-slate-800 font-mono text-xs sm:text-sm">
                      {wo.measurements?.areaCoveredSqM.toLocaleString()} m²
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-700">
                    <span>Completion</span>
                    <span>{wo.measurements?.totalWorkCompletedPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div
                      className="bg-brand-600 h-1.5 sm:h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, wo.measurements?.totalWorkCompletedPct || 0))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
                <Link
                  href={`/work-orders/${encodeURIComponent(wo.id)}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" /> View / Print
                </Link>

                {role !== 'Client' && (
                  <Link
                    href={`/work-orders/${encodeURIComponent(wo.id)}/edit`}
                    className="p-2 text-slate-600 hover:text-brand-900 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Edit Work Order"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                )}

                {role === 'Admin' && (
                  <button
                    onClick={() => setDeleteId(wo.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Work Order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      ) : (

        /* COMPACT TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-brand-900 text-white font-bold uppercase">
                <tr>
                  <th className="p-3">WO No</th>
                  <th className="p-3">Location & Dept</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Total Cost (PKR)</th>
                  <th className="p-3 text-center">Progress</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredWorkOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-900 whitespace-nowrap">{wo.id}</td>
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{wo.location}</p>
                      <p className="text-xs text-slate-500 truncate">{wo.departmentName}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{wo.typeOfWork}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {wo.totalAmountPKR.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-slate-800">{wo.measurements?.totalWorkCompletedPct}%</span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={wo.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/work-orders/${encodeURIComponent(wo.id)}`}
                          className="p-1.5 bg-brand-900 text-amber-400 hover:bg-brand-800 rounded-lg shadow-sm"
                          title="View & Print"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {role !== 'Client' && (
                          <Link
                            href={`/work-orders/${encodeURIComponent(wo.id)}/edit`}
                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        {role === 'Admin' && (
                          <button
                            onClick={() => setDeleteId(wo.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        workOrderId={deleteId || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
}

