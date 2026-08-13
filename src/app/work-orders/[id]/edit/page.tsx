'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWorkOrderById } from '@/lib/storage';
import { WorkOrder } from '@/lib/types';
import { WorkOrderForm } from '@/components/WorkOrderForm';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function EditWorkOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wo = getWorkOrderById(id);
    setWorkOrder(wo);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500 font-bold">Loading work order details...</div>;
  }

  if (!workOrder) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-900">Work Order Not Found</h2>
        <p className="text-xs text-slate-500">Cannot edit work order {id} because it does not exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow hover:bg-brand-800"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <WorkOrderForm initialData={workOrder} isEdit={true} />
    </div>
  );
}
