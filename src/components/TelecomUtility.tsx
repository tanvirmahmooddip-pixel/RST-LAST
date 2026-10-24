import React, { useState } from 'react';
import {
  Zap,
  Phone,
  DollarSign,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Building2
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language } from '../types';

interface TelecomUtilityProps {
  lang: Language;
}

export const TelecomUtility: React.FC<TelecomUtilityProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [selectedOpId, setSelectedOpId] = useState<number>(1);
  const [rechargePhone, setRechargePhone] = useState('+968');
  const [rechargeAmount, setRechargeAmount] = useState<number>(5.000);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(50.000);

  const selectedOp = db.telecomOperators.find(o => o.id === selectedOpId);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOp || rechargeAmount <= 0) return;

    if (selectedOp.balance < rechargeAmount) {
      SoundEngine.error();
      alert(`Insufficient balance in ${selectedOp.name} wallet! Current: ${selectedOp.balance.toFixed(3)} OMR`);
      return;
    }

    const tx = db.rechargeTelecom(selectedOp.id, rechargeAmount, rechargePhone);
    if (tx) {
      SoundEngine.beep();
      alert(`Recharge of ${rechargeAmount.toFixed(3)} OMR on ${selectedOp.name} completed successfully!\nEarned Commission: +${tx.profit.toFixed(3)} OMR\nNew Balance: ${tx.newBalance.toFixed(3)} OMR`);
    }
  };

  const handleAddWalletBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOp || topupAmount <= 0) return;

    SoundEngine.click();
    db.addTelecomBalance(selectedOp.id, topupAmount);
    setIsTopupModalOpen(false);
    alert(`Added ${topupAmount.toFixed(3)} OMR to ${selectedOp.name} wallet balance.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Top Telecom Oman &amp; Bill Payment Counter
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Omantel, Ooredoo, Vodafone, FRiENDi, Awasr Fiber, Nama Electricity &amp; Water
          </p>
        </div>

        <button
          onClick={() => setIsTopupModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Operator Balance</span>
        </button>
      </div>

      {/* Operator Balance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {db.telecomOperators.map(op => {
          const isSelected = selectedOpId === op.id;
          const isLow = op.balance < op.lowAlertThreshold;

          return (
            <div
              key={op.id}
              onClick={() => {
                SoundEngine.click();
                setSelectedOpId(op.id);
              }}
              className={`p-4 rounded-3xl border cursor-pointer transition ${
                isSelected
                  ? 'bg-slate-900 border-purple-500 shadow-md shadow-purple-950/40'
                  : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{op.name}</span>
                {isLow ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Low Balance
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
                    Active
                  </span>
                )}
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-mono">Current Balance:</span>
                <p className={`text-base font-black font-mono ${isLow ? 'text-rose-400' : 'text-purple-400'}`}>
                  {op.balance.toFixed(3)} <span className="text-xs font-normal text-slate-400">OMR</span>
                </p>
              </div>

              <div className="mt-2 text-[10px] text-slate-500 font-mono">
                Comm: {op.commissionType === 'percent' ? `${op.commissionValue}%` : `${op.commissionValue.toFixed(3)} OMR/bill`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharge Action Desk & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Instant Recharge Form */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Issue Telecom Recharge or Utility Bill
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Selected Provider: <strong className="text-purple-400">{selectedOp?.name}</strong>
            </p>
          </div>

          <form onSubmit={handleRecharge} className="space-y-3 font-mono">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">GSM Phone / Account No</label>
              <input
                type="text"
                required
                value={rechargePhone}
                onChange={(e) => setRechargePhone(e.target.value)}
                placeholder="+968 9xxx xxxx or Account ID"
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Recharge Amount (OMR)</label>
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[1.000, 3.000, 5.000, 10.000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRechargeAmount(val)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      rechargeAmount === val ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {val.toFixed(3)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.001"
                min="0.100"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                className="w-full mt-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Estimated Profit Commission:</span>
              <span className="font-bold text-emerald-400">
                +{selectedOp ? (selectedOp.commissionType === 'fixed' ? selectedOp.commissionValue : (rechargeAmount * selectedOp.commissionValue / 100)).toFixed(3) : '0.000'} OMR
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-950/60 transition"
            >
              Confirm Instant Recharge &amp; Deduct
            </button>
          </form>
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Recharge &amp; Commission Ledger
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">{db.telecomTx.length} Transactions</span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-2">Operator</th>
                  <th className="pb-2">Account / Phone</th>
                  <th className="pb-2">Time</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-right">Commission Profit</th>
                  <th className="pb-2 text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {db.telecomTx.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No telecom transactions recorded today yet.
                    </td>
                  </tr>
                ) : (
                  db.telecomTx.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 font-bold text-purple-400">{tx.operatorName}</td>
                      <td className="py-2.5 text-slate-300">{tx.phoneNumber || 'Counter Direct'}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{tx.time}</td>
                      <td className="py-2.5 text-right font-bold text-white">{tx.amount.toFixed(3)}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">+{tx.profit.toFixed(3)}</td>
                      <td className="py-2.5 text-right text-slate-400 text-[11px]">{tx.newBalance.toFixed(3)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {isTopupModalOpen && selectedOp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Add Balance to {selectedOp.name}</h3>
              <button onClick={() => setIsTopupModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddWalletBalance} className="space-y-3 font-mono">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Topup Amount (OMR)</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Top Up Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
