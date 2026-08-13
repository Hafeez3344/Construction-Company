'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkOrderById, getActiveRole, deleteWorkOrder } from '@/lib/storage';
import { WorkOrder, UserRole } from '@/lib/types';
import { WorkOrderPrintView } from '@/components/WorkOrderPrintView';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ArrowLeft, Edit3, Trash2, Printer, AlertTriangle } from 'lucide-react';

export default function ViewWorkOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [role, setRole] = useState<UserRole>('Admin');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const wo = getWorkOrderById(id);
    setWorkOrder(wo);
    setRole(getActiveRole());
  }, [id]);

  if (!workOrder) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Work Order Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested work order ID <span className="font-mono font-bold text-brand-900">{id}</span> does not exist or was removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow hover:bg-brand-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteWorkOrder(workOrder.id);
    router.push('/');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          {role !== 'Client' && (
            <Link
              href={`/work-orders/${encodeURIComponent(workOrder.id)}/edit`}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-slate-300"
            >
              <Edit3 className="w-4 h-4 text-brand-900" /> Edit Work Order
            </Link>
          )}

          {role === 'Admin' && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-rose-200"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Main Print View Component */}
      <WorkOrderPrintView workOrder={workOrder} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        workOrderId={workOrder.id}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

    </div>
  );
}
