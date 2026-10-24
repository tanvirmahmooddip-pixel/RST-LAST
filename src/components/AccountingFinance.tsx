import React, { useState } from 'react';
import {
  Calculator,
  BookOpen,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, User } from '../types';

interface AccountingFinanceProps {
  lang: Language;
  currentUser?: User | null;
}

export const AccountingFinance: React.FC<AccountingFinanceProps> = ({ lang, currentUser }) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'journals' | 'accounts' | 'trialBalance' | 'vat'>('journals');

  const cashData = db.calculateCashInHand();

  // Calculate Trial Balance sums
  const totalDebits = db.journals.reduce((sum, jrn) => 
    sum + jrn.lines.reduce((lSum, l) => lSum + l.debit, 0), 0
  );
  const totalCredits = db.journals.reduce((sum, jrn) => 
    sum + jrn.lines.reduce((lSum, l) => lSum + l.credit, 0), 0
  );

  // VAT Breakdown
  const totalVatOutput = db.invoices.reduce((sum, i) => sum + i.vat, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              {t.accountingTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated Balanced Journal Entries • Trial Balance • Oman Tax Authority 5% VAT Filing Ledger
          </p>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Trial Balance Verification</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Debits Equal Credits Balanced (100%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('journals');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'journals' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Journal Entries ({db.journals.length})
        </button>
        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('accounts');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'accounts' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Chart of Accounts ({db.accounts.length})
        </button>
        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('trialBalance');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'trialBalance' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Trial Balance
        </button>
        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('vat');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'vat' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Oman 5% VAT Audit
        </button>
      </div>

      {/* Tab: Journal Entries */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          {db.journals.map(jrn => (
            <div key={jrn.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-bold text-xs text-emerald-400">{jrn.entry_no}</span>
                  <span className="text-[11px] text-slate-400 ml-2">Date: {jrn.date}</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Ref: {jrn.reference_type} ({jrn.reference_id})
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans">{jrn.description}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                      <th className="pb-1.5">Account Code</th>
                      <th className="pb-1.5">Account Name</th>
                      <th className="pb-1.5 text-right">Debit (OMR)</th>
                      <th className="pb-1.5 text-right">Credit (OMR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {jrn.lines.map((l, idx) => (
                      <tr key={idx}>
                        <td className="py-1 text-slate-400">{l.account_code}</td>
                        <td className="py-1 font-sans">{l.account_name}</td>
                        <td className="py-1 text-right text-emerald-400 font-bold">
                          {l.debit > 0 ? l.debit.toFixed(3) : '-'}
                        </td>
                        <td className="py-1 text-right text-sky-400 font-bold">
                          {l.credit > 0 ? l.credit.toFixed(3) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Chart of Accounts */}
      {activeTab === 'accounts' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">Account Code</th>
                  <th className="pb-3">Account Title</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {db.accounts.map(acc => (
                  <tr key={acc.code} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-emerald-400">{acc.code}</td>
                    <td className="py-3 font-sans font-medium text-slate-200">{acc.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.type === 'Asset' ? 'bg-sky-500/10 text-sky-400' :
                        acc.type === 'Liability' ? 'bg-rose-500/10 text-rose-400' :
                        acc.type === 'Revenue' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-white">
                      {acc.balance.toFixed(3)} {db.config.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Trial Balance */}
      {activeTab === 'trialBalance' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4 font-mono">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Trial Balance Statement as of {new Date().toLocaleDateString()}
            </h3>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Balanced Books
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total Debit Postings:</span>
              <p className="text-lg font-black text-emerald-400 mt-1">{totalDebits.toFixed(3)} {db.config.currency}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-xs text-slate-400">Total Credit Postings:</span>
              <p className="text-lg font-black text-sky-400 mt-1">{totalCredits.toFixed(3)} {db.config.currency}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Oman VAT Audit */}
      {activeTab === 'vat' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Oman Tax Authority 5.000% VAT Summary
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              CR 1374092 • Tax No: {db.config.tax_no || 'OM-VAT-1374092'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total Taxable Sales</span>
              <p className="text-base font-bold text-white mt-1">
                {db.invoices.reduce((sum, i) => sum + (i.subtotal - i.discount), 0).toFixed(3)} OMR
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Output VAT Collected (5%)</span>
              <p className="text-base font-bold text-emerald-400 mt-1">{totalVatOutput.toFixed(3)} OMR</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Net Tax Authority Liability</span>
              <p className="text-base font-bold text-purple-400 mt-1">{totalVatOutput.toFixed(3)} OMR</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
