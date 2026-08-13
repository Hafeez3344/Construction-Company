'use client';

import React, { useState } from 'react';
import { getStoredWorkOrders, saveStoredWorkOrders, resetToSeedData } from '@/lib/storage';
import { Database, Download, Upload, RotateCcw, CheckCircle, FileJson, FileSpreadsheet } from 'lucide-react';

export default function BackupPage() {
  const [message, setMessage] = useState<string | null>(null);

  const handleExportJSON = () => {
    const data = getStoredWorkOrders();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jandool_Construction_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setMessage('JSON Backup downloaded successfully!');
  };

  const handleExportCSV = () => {
    const workOrders = getStoredWorkOrders();
    let csv = 'Work Order No,Department,Location,Type of Work,Total Cost (PKR),Status,Created At\n';
    workOrders.forEach(w => {
      csv += `"${w.id}","${w.departmentName}","${w.location}","${w.typeOfWork}",${w.totalAmountPKR},"${w.status}","${w.createdAt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jandool_WorkOrders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setMessage('CSV export downloaded successfully!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveStoredWorkOrders(parsed);
          setMessage(`Successfully restored ${parsed.length} work orders!`);
        } else {
          alert('Invalid backup file format. Expected JSON array.');
        }
      } catch (err) {
        alert('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all work orders to the default seed dataset?')) {
      resetToSeedData();
      setMessage('Dataset restored to default seed demo records!');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-black text-brand-900">Data Backup & System Maintenance</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Keep offline backups of all measurement sheets and work order records in JSON or CSV formats.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Backup Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export JSON */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-50 p-3 rounded-xl text-brand-900">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Full Data Backup (JSON)</h3>
              <p className="text-xs text-slate-500">Download complete dataset including site photos, measurements & approvals.</p>
            </div>
          </div>
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export JSON Backup
          </button>
        </div>

        {/* Export CSV */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Work Orders Spreadsheet (CSV)</h3>
              <p className="text-xs text-slate-500">Export work orders into Excel / CSV format for accounting.</p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-brand-950 font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV Spreadsheet
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Restore JSON Backup</h3>
              <p className="text-xs text-slate-500">Import a previously saved JSON backup file into local storage.</p>
            </div>
          </div>
          <label className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-300 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-brand-900" /> Choose Backup File (.json)
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset to Seed Data */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Reset Demo Dataset</h3>
              <p className="text-xs text-slate-500">Revert all work orders back to the pre-seeded Jandool Construction demo dataset.</p>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2.5 rounded-xl border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Demo Records
          </button>
        </div>

      </div>

    </div>
  );
}
