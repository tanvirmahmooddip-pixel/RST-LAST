import React, { useState } from 'react';
import {
  Database,
  Play,
  Download,
  Copy,
  Table,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language } from '../types';

interface SqlStudioProps {
  lang: Language;
  onDataMutated?: () => void;
}

export const SqlStudio: React.FC<SqlStudioProps> = ({ lang, onDataMutated }) => {
  const [query, setQuery] = useState('SELECT invoice_no, customer, grand_total, payment FROM invoices ORDER BY id DESC LIMIT 10;');
  const [result, setResult] = useState<{
    success: boolean;
    data: Record<string, unknown>[];
    columns: string[];
    message?: string;
    executionTimeMs: number;
  }>({
    success: true,
    data: [],
    columns: [],
    executionTimeMs: 0
  });

  const queryPresets = [
    { title: 'Top 10 Tax Invoices', sql: 'SELECT invoice_no, sl_doc_no, customer, subtotal, vat, grand_total, payment FROM invoices ORDER BY id DESC LIMIT 10;' },
    { title: 'Smartphones in Stock', sql: 'SELECT sku, name, brand, cost, price, stock, imei FROM products WHERE stock > 0;' },
    { title: 'Balanced Journal Entries', sql: 'SELECT entry_no, date, reference_type, reference_id, total_amount FROM journals ORDER BY id DESC;' },
    { title: 'Google Drive Space Files', sql: 'SELECT sl_doc_no, fileName, category, googleDriveSyncStatus FROM cloud_files;' },
    { title: 'Telecom Operators & Wallets', sql: 'SELECT name, code, balance, commissionValue FROM telecom_operators;' },
    { title: 'Chart of Accounts Balances', sql: 'SELECT code, name, type, balance FROM accounts;' }
  ];

  const handleExecute = () => {
    SoundEngine.click();
    const res = db.executeSql(query);
    setResult(res);
    if (res.success && onDataMutated) {
      onDataMutated();
    }
  };

  const handleDownloadDump = () => {
    SoundEngine.click();
    const dump = db.generateSqlDump();
    const blob = new Blob([dump], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TopTelecom_Oman_Full_Database_Dump_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Relational SQL Database Engine &amp; Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            In-Browser AlaSQL Relational Engine • Schema Explorer • Instant SQL DDL / DML Export
          </p>
        </div>

        <button
          onClick={handleDownloadDump}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Download MySQL SQL Dump</span>
        </button>
      </div>

      {/* Query Presets */}
      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          SQL Query Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {queryPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                SoundEngine.click();
                setQuery(p.sql);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 text-xs font-mono font-medium transition"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Execution Panel */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Interactive SQL Console</span>
          </div>

          <button
            onClick={handleExecute}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Query</span>
          </button>
        </div>

        <textarea
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 shadow-inner"
          placeholder="Enter SQL statement (e.g. SELECT * FROM products)..."
        />

        {/* Execution Status Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            {result.success ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{result.message || 'Ready'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{result.message}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Execution Time: {result.executionTimeMs} ms</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      {result.data.length > 0 && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-slate-400">
              Query Result: <strong>{result.data.length}</strong> rows returned
            </span>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-cyan-400 font-bold">
                  {result.columns.map(col => (
                    <th key={col} className="pb-2 pr-4">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {result.data.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                    {result.columns.map(col => (
                      <td key={col} className="py-2 pr-4 text-slate-300">
                        {typeof row[col] === 'object' && row[col] !== null 
                          ? JSON.stringify(row[col]) 
                          : String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
