import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  DollarSign,
  Package,
  Zap,
  AlertTriangle,
  Pin,
  PinOff,
  EyeOff,
  RotateCcw,
  PlusCircle,
  FileText,
  Smartphone,
  Wrench,
  Camera,
  Cloud,
  ArrowUpRight,
  ShieldAlert,
  StopCircle,
  Building,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, User } from '../types';

interface DashboardViewProps {
  lang: Language;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onTriggerEmergency: () => void;
  onStopEmergency: () => void;
  isEmergencyActive: boolean;
  onDataRefresh: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  onNavigate,
  currentUser,
  onTriggerEmergency,
  onStopEmergency,
  isEmergencyActive,
  onDataRefresh
}) => {
  const t = translations[lang] || translations.en;
  const cashData = db.calculateCashInHand();

  // Financial Stats
  const todaySales = db.invoices.reduce((sum, inv) => sum + inv.grand_total, 0);
  const todayProfit = currentUser?.permissions?.canViewProfit 
    ? db.invoices.reduce((sum, inv) => sum + inv.profit, 0)
    : 0;

  const stockValuation = db.products.reduce((sum, p) => sum + (p.price * p.stock), 0) +
    db.components.reduce((sum, c) => sum + (c.price * c.stock), 0);

  const telecomTotalBalance = db.telecomOperators.reduce((sum, op) => sum + op.balance, 0);
  const lowStockCount = db.products.filter(p => p.stock <= (p.lowstock || 2)).length +
    db.components.filter(c => c.stock <= c.minStock).length;

  const isPinned = (widget: string) => db.config.widgetPinned?.[widget] || false;
  const isVisible = (widget: string) => db.config.widgetVisibility?.[widget] !== false;

  const handleTogglePin = (widget: string) => {
    SoundEngine.click();
    db.togglePinWidget(widget);
    onDataRefresh();
  };

  const handleToggleHide = (widget: string) => {
    SoundEngine.click();
    db.toggleWidget(widget);
    onDataRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Emergency Siren Banner if Active */}
      {isEmergencyActive && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900/90 to-red-800/90 border-2 border-rose-500 shadow-xl flex items-center justify-between text-white animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-300 animate-bounce" />
            <div>
              <h3 className="text-base font-black tracking-wide uppercase">
                🚨 EMERGENCY SIREN ACTIVE: HIGH-PRIORITY INTERVENTION REQUIRED
              </h3>
              <p className="text-xs text-rose-100 font-mono">
                {db.activeEmergency?.message || 'Emergency alert triggered on counter. Please verify cash drawer and perimeter.'}
              </p>
            </div>
          </div>
          {currentUser?.role === 'master_admin' || currentUser?.role === 'admin' ? (
            <button
              onClick={onStopEmergency}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 font-black text-xs hover:bg-slate-100 transition shadow-lg flex items-center gap-1.5"
            >
              <StopCircle className="w-4 h-4 text-rose-700" />
              <span>SILENCE SIREN (ADMIN)</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-rose-200 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
              Admin clearance required
            </span>
          )}
        </div>
      )}

      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {db.config.business_name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CR {db.config.cr_no}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Welcome back, <strong className="text-slate-200">{currentUser?.fullname}</strong> ({currentUser?.role?.replace('_', ' ')}) • {currentUser?.branchName || 'Main Branch'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('pos')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New POS Bill</span>
          </button>

          <button
            onClick={() => onNavigate('invoicesQuotations')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Quotation</span>
          </button>

          <button
            onClick={() => onNavigate('googleDrive')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <Cloud className="w-4 h-4 text-teal-400" />
            <span>Drive Space</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Today's Sales */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.todaySales}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {todaySales.toFixed(3)} <span className="text-xs font-normal text-emerald-400">{db.config.currency}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            5% VAT: {(todaySales * 0.05 / 1.05).toFixed(3)} {db.config.currency}
          </div>
        </div>

        {/* Net Cash in Hand */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.netCashInHand}</span>
            <Wallet className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {cashData.cashInHandNow.toFixed(3)} <span className="text-xs font-normal text-teal-400">{db.config.currency}</span>
          </div>
          <div className="text-[10px] text-teal-400/80 mt-1 font-mono">
            Live Counter Drawer Balance
          </div>
        </div>

        {/* Profit Margin (if permitted) */}
        {currentUser?.permissions?.canViewProfit && !currentUser?.hiddenOptions?.hideProfitMargin && (
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>{t.todayProfit}</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-xl font-black text-white font-mono">
              {todayProfit.toFixed(3)} <span className="text-xs font-normal text-amber-400">{db.config.currency}</span>
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1 font-mono">
              Margin: {todaySales > 0 ? ((todayProfit / todaySales) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        )}

        {/* Stock Valuation */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.stockValuation}</span>
            <Package className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {stockValuation.toFixed(3)} <span className="text-xs font-normal text-sky-400">{db.config.currency}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            {db.products.length} Phones + {db.components.length} Parts
          </div>
        </div>

        {/* Telecom Wallet */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.telecomWallet}</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {telecomTotalBalance.toFixed(3)} <span className="text-xs font-normal text-purple-400">{db.config.currency}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Omantel, Ooredoo, Vodafone
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>{t.lowStockItems}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-xl font-black text-rose-400 font-mono">
            {lowStockCount} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[10px] text-rose-400/80 mt-1 font-mono">
            {lowStockCount > 0 ? 'Reorder needed soon' : 'Optimal Inventory'}
          </div>
        </div>
      </div>

      {/* Cash In Hand Calculator Widget */}
      {isVisible('cashCalculator') && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight uppercase">
                  Cash in Hand Formula Calculator
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  [Total Sales + Service] - [Purchases + Expenses] - [SWIFT POS + Bank Transfer] - Returns = Cash in Hand
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleTogglePin('cashCalculator')}
                className={`p-1.5 rounded-lg border text-xs ${isPinned('cashCalculator') ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                title={isPinned('cashCalculator') ? t.unpinWidget : t.pinWidget}
              >
                {isPinned('cashCalculator') ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleToggleHide('cashCalculator')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs"
                title={t.hideWidget}
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Sales &amp; Service Inflow</span>
              <p className="text-sm font-bold text-emerald-400 font-mono mt-1">
                +{(cashData.totalSalesAndService + cashData.servicesAdvanced).toFixed(3)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Purchases Today</span>
              <p className="text-sm font-bold text-rose-400 font-mono mt-1">
                -{cashData.purchasedTotalToday.toFixed(3)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Expenses Outflow</span>
              <p className="text-sm font-bold text-rose-400 font-mono mt-1">
                -{cashData.expensesTotalToday.toFixed(3)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Bank SWIFT Machine</span>
              <p className="text-sm font-bold text-sky-400 font-mono mt-1">
                -{cashData.bankSwiftTotal.toFixed(3)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium">Bank Transfers (Afaq)</span>
              <p className="text-sm font-bold text-sky-400 font-mono mt-1">
                -{cashData.bankTransferTotal.toFixed(3)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-950 to-emerald-950 border border-teal-600/50">
              <span className="text-[10px] text-teal-300 font-bold uppercase">CASH IN HAND NOW</span>
              <p className="text-base font-black text-teal-300 font-mono mt-1">
                {cashData.cashInHandNow.toFixed(3)} <span className="text-[10px] font-normal">{db.config.currency}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Branch Sales & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Sales & Telecom Alerts */}
        <div className="space-y-6">
          {/* Branch Performance */}
          {isVisible('branchSales') && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Branch Performance (Oman)</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">4 Active Branches</span>
              </div>

              <div className="space-y-3">
                {db.branches.map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{b.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.address}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-emerald-400">{b.salesToday.toFixed(3)} {db.config.currency}</span>
                      <p className="text-[9px] text-slate-500">Sales Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Telecom Providers Balances */}
          {isVisible('telecomAlerts') && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Oman Telecom Wallets</h3>
                </div>
                <button
                  onClick={() => onNavigate('telecom')}
                  className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Recharge Counter</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {db.telecomOperators.map(op => (
                  <div key={op.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{op.name}</span>
                      {op.balance < op.lowAlertThreshold && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <p className={`text-xs font-mono font-bold mt-1 ${op.balance < op.lowAlertThreshold ? 'text-rose-400' : 'text-slate-100'}`}>
                      {op.balance.toFixed(3)} {db.config.currency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Tax Invoices List */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Tax Invoices &amp; Bills</h3>
              <p className="text-[10px] text-slate-400 font-mono">Compliant with Sultanate of Oman 5.000% VAT Regulations</p>
            </div>
            <button
              onClick={() => onNavigate('invoicesQuotations')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-2">Invoice No</th>
                  <th className="pb-2">SL DOC NO</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2 text-right">Grand Total</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {db.invoices.slice(0, 6).map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 font-bold text-emerald-400">{inv.invoice_no}</td>
                    <td className="py-2.5 text-slate-400 text-[10px]">{inv.sl_doc_no || 'SL-DOC-00001'}</td>
                    <td className="py-2.5 text-slate-200 font-sans font-medium">{inv.customer}</td>
                    <td className="py-2.5 text-slate-400 text-[11px]">{inv.date}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {inv.payment}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      {inv.grand_total.toFixed(3)} {db.config.currency}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onNavigate('invoicesQuotations')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[10px] font-bold transition"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
