import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Award,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language, Customer } from '../types';

interface CustomersManagerProps {
  lang: Language;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New customer form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+968');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Muscat, Oman');
  const [creditLimit, setCreditLimit] = useState(500.000);
  const [isVip, setIsVip] = useState(false);

  const filteredCustomers = db.customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    SoundEngine.click();
    const nextId = db.customers.length ? Math.max(...db.customers.map(c => c.id)) + 1 : 1;
    const newCust: Customer = {
      id: nextId,
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      email: email.trim() || 'info@customer.om',
      address: address.trim(),
      balance: 0,
      credit_limit: Number(creditLimit),
      creditDays: 0,
      isVip,
      loyaltyPoints: isVip ? 100 : 20,
      loyaltyTier: isVip ? 'Silver' : 'Bronze',
      is_deleted: false
    };

    db.customers.unshift(newCust);
    db.persist();
    setIsModalOpen(false);
    setName('');
    alert(`Customer ${newCust.name} added!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Customer CRM &amp; VIP Loyalty Club
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            VIP Badging, Credit Aging Thresholds, Points Accrual &amp; WhatsApp Integration
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search box */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name, phone, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:block">
          Total Customers: {db.customers.length}
        </span>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(cust => (
          <div key={cust.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{cust.name}</span>
                {cust.isVip && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-500">Tier: {cust.loyaltyTier || 'Bronze'}</span>
            </div>

            <div className="text-xs text-slate-400 font-mono space-y-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{cust.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{cust.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-500">Loyalty Points</span>
                <p className="font-bold text-amber-400">{cust.loyaltyPoints || 0} pts</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
                <span className="text-[9px] text-slate-500">Credit Balance</span>
                <p className={`font-bold ${cust.balance > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {cust.balance.toFixed(3)} OMR
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <a
                href={`https://wa.me/${cust.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 font-bold transition flex items-center gap-1.5 text-[11px]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              {cust.creditDays && cust.creditDays > 7 ? (
                <span className="text-[10px] font-bold text-rose-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{cust.creditDays}d Past Due</span>
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Register New Customer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Customer / Client Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Salim Al-Harthy"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Phone (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@domain.om"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVipCheck"
                  checked={isVip}
                  onChange={(e) => setIsVip(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="isVipCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Upgrade to VIP Gold / Corporate Client Status
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
                >
                  Save Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
