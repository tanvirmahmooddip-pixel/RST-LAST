import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  AlertCircle,
  Phone,
  User,
  X
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, RepairJob, RepairStatus } from '../types';
import { generateBarcodeSvg } from '../lib/barcode';

interface RepairServiceCentreProps {
  lang: Language;
}

export const RepairServiceCentre: React.FC<RepairServiceCentreProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [activeJobForPrint, setActiveJobForPrint] = useState<RepairJob | null>(null);

  // New repair state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+968');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 15 Pro');
  const [imei, setImei] = useState('');
  const [fault, setFault] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(25.000);
  const [advancePaid, setAdvancePaid] = useState(10.000);

  const statuses: ('All' | RepairStatus)[] = [
    'All',
    'Pending',
    'Diagnosed',
    'Waiting Parts',
    'In Progress',
    'Quality Check',
    'Delivered'
  ];

  const filteredRepairs = db.repairs.filter(r => {
    const matchesSearch = r.job_card_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.device_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.imei_or_serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !fault.trim()) return;

    SoundEngine.click();
    const newJob = db.createRepairJob({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      device_brand: brand,
      device_model: model,
      imei_or_serial: imei.trim(),
      fault_reported: fault.trim(),
      estimated_cost: Number(estimatedCost),
      advance_paid: Number(advancePaid)
    });

    setIsNewJobModalOpen(false);
    setCustomerName('');
    setFault('');
    alert(`Repair Job Card ${newJob.job_card_no} created with serial ${newJob.sl_doc_no}!`);
  };

  const handleStatusChange = (jobId: number, newStatus: RepairStatus) => {
    SoundEngine.click();
    db.updateRepairStatus(jobId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Precision Repair &amp; Service Lab
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Job Cards, Fault Checklists, Spare Parts Integration &amp; 90-Day Warranty Registry
          </p>
        </div>

        <button
          onClick={() => setIsNewJobModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Repair Job Card</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedStatus === st ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search job card, IMEI, customer..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Job Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepairs.map(job => (
          <div
            key={job.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-mono font-bold text-amber-400 text-xs">{job.job_card_no}</span>
                <span className="text-[10px] text-slate-400 font-mono">{job.sl_doc_no}</span>
              </div>

              <div className="mt-2">
                <h3 className="font-bold text-sm text-white">{job.device_brand} {job.device_model}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">IMEI / Serial: {job.imei_or_serial}</p>
                <p className="text-xs text-slate-300 font-sans mt-2 bg-slate-950 p-2 rounded-xl border border-slate-800/60">
                  <strong>Fault:</strong> {job.fault_reported}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase">Customer</span>
                  <p className="font-bold text-slate-200 truncate">{job.customer_name}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
                  <span className="text-[9px] text-slate-500 uppercase">Balance Due</span>
                  <p className="font-bold text-rose-400 font-mono">{job.balance_due.toFixed(3)} OMR</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Workflow Status:</span>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value as RepairStatus)}
                  className="bg-slate-950 border border-slate-700 px-2 py-1 rounded text-xs text-amber-300 font-bold focus:outline-none"
                >
                  {statuses.filter(s => s !== 'All').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setActiveJobForPrint(job)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Job Card &amp; Claim Slip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Job Card Modal */}
      {activeJobForPrint && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">REPAIR JOB CARD: {activeJobForPrint.job_card_no}</h3>
              <button onClick={() => setActiveJobForPrint(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-white text-slate-900 p-5 rounded-2xl font-mono text-xs space-y-3">
              <div className="text-center border-b border-slate-200 pb-2">
                <h2 className="font-black text-sm uppercase">{db.config.business_name}</h2>
                <p className="text-[10px] text-slate-600">CERTIFIED ELECTRONICS &amp; REPAIR LAB</p>
                <p className="text-[9px] text-slate-500">Mabellah Sanaya, Oman • Tel: +968 9430 1393</p>
                <div className="mt-1 font-bold text-xs bg-amber-100 text-amber-900 py-0.5 rounded">
                  SERVICE TICKET &amp; CUSTOMER CLAIM CARD
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>Job Card No:</strong> {activeJobForPrint.job_card_no}</p>
                <p><strong>SL DOC NO:</strong> {activeJobForPrint.sl_doc_no}</p>
                <p><strong>Customer:</strong> {activeJobForPrint.customer_name} ({activeJobForPrint.customer_phone})</p>
                <p><strong>Device:</strong> {activeJobForPrint.device_brand} {activeJobForPrint.device_model}</p>
                <p><strong>IMEI / Serial:</strong> {activeJobForPrint.imei_or_serial}</p>
                <p><strong>Fault Reported:</strong> {activeJobForPrint.fault_reported}</p>
                <p><strong>Estimated Total:</strong> {activeJobForPrint.estimated_cost.toFixed(3)} OMR</p>
                <p><strong>Advance Received:</strong> {activeJobForPrint.advance_paid.toFixed(3)} OMR</p>
                <p><strong>Balance Due:</strong> {activeJobForPrint.balance_due.toFixed(3)} OMR</p>
                <p><strong>Warranty:</strong> {activeJobForPrint.warranty_period}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-center flex flex-col items-center">
                <div 
                  className="w-44 h-12"
                  dangerouslySetInnerHTML={{ __html: generateBarcodeSvg(activeJobForPrint.job_card_no, 180, 45) }}
                />
                <p className="text-[9px] text-slate-500 mt-1">Present this slip upon collection within 30 days.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Print Claim Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Issue Repair Job Card</h3>
              <button onClick={() => setIsNewJobModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Salim Al-Harthy"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Device Model</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">IMEI / Serial</label>
                  <input
                    type="text"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="15-digit IMEI"
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Fault Reported</label>
                <textarea
                  required
                  rows={2}
                  value={fault}
                  onChange={(e) => setFault(e.target.value)}
                  placeholder="e.g. Broken OLED display, no touch, power on test ok"
                  className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Est. Total (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Advance Paid (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                >
                  Create Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
