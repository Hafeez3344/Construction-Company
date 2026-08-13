import React from 'react';
import { WorkOrderStatus, PaymentStatus } from '@/lib/types';
import { Clock, PlayCircle, CheckCircle2, ShieldCheck, PauseCircle, CreditCard } from 'lucide-react';

interface StatusBadgeProps {
  status: WorkOrderStatus | PaymentStatus;
  type?: 'status' | 'payment';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  if (type === 'payment') {
    const paymentConfigs: Record<PaymentStatus, { bg: string; text: string; border: string; label: string }> = {
      Paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Paid in Full' },
      Partial: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Partial Payment' },
      Unpaid: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Unpaid' },
    };
    const config = paymentConfigs[status as PaymentStatus] || paymentConfigs.Unpaid;
    return (
      <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
        <CreditCard className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  }

  const statusConfigs: Record<WorkOrderStatus, { bg: string; text: string; border: string; icon: any }> = {
    Pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
    'In Progress': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: PlayCircle },
    Completed: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', icon: CheckCircle2 },
    Approved: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: ShieldCheck },
    'On Hold': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', icon: PauseCircle },
  };

  const config = statusConfigs[status as WorkOrderStatus] || statusConfigs.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

