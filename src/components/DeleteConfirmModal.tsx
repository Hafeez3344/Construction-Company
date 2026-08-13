'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  workOrderId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  workOrderId,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        <div className="flex justify-between items-start">
          <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Delete Work Order?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently remove work order <span className="font-mono font-bold text-brand-900">{workOrderId}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Permanently
          </button>
        </div>

      </div>
    </div>
  );
};
