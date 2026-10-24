import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Search,
  HardDrive,
  Shield,
  Clock,
  Printer,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language, CctvProject } from '../types';

interface CctvInstallationProps {
  lang: Language;
}

export const CctvInstallation: React.FC<CctvInstallationProps> = ({ lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New project state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+968');
  const [address, setAddress] = useState('Muscat, Oman');
  const [cameras, setCameras] = useState(8);
  const [nvrModel, setNvrModel] = useState('Hikvision 4K 8-Ch NVR');
  const [hdd, setHdd] = useState('4TB Surveillance Grade HDD');
  const [totalVal, setTotalVal] = useState(380.000);
  const [advance, setAdvancePaid] = useState(150.000);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    SoundEngine.click();
    const nextId = db.cctvProjects.length ? Math.max(...db.cctvProjects.map(p => p.id)) + 1 : 1;
    const newProj: CctvProject = {
      id: nextId,
      project_no: `CCTV-2026-${String(nextId).padStart(3, '0')}`,
      sl_doc_no: `SL-CCTV-2026-${String(nextId).padStart(4, '0')}`,
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      site_address: address.trim(),
      camera_count: Number(cameras),
      dvr_nvr_model: nvrModel,
      hdd_capacity: hdd,
      total_value: Number(totalVal),
      advance_paid: Number(advance),
      balance_due: Number(totalVal) - Number(advance),
      lead_technician: 'Nasser Al-Kindi',
      installation_date: new Date().toISOString().slice(0, 10),
      status: 'In Progress'
    };

    db.cctvProjects.unshift(newProj);
    db.persist();
    setIsModalOpen(false);
    setClientName('');
    alert(`CCTV Project ${newProj.project_no} created!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              CCTV, Smart Door &amp; Security Engineering
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Hikvision, Dahua &amp; Uniview 4K Installations • Work Orders, Site Surveys &amp; Technicians
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New CCTV Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {db.cctvProjects.map(proj => (
          <div key={proj.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-sky-400 text-xs">{proj.project_no}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {proj.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">{proj.client_name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{proj.site_address}</p>
              <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <strong>Equipment:</strong> {proj.camera_count} Cameras • {proj.dvr_nvr_model} • {proj.hdd_capacity}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-500">Advance Paid</span>
                <p className="font-bold text-emerald-400 font-mono">{proj.advance_paid.toFixed(3)} OMR</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
                <span className="text-[9px] text-slate-500">Balance Due</span>
                <p className="font-bold text-rose-400 font-mono">{proj.balance_due.toFixed(3)} OMR</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">New CCTV &amp; Security Work Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Client / Villa Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Site Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Total Cameras</label>
                  <input
                    type="number"
                    value={cameras}
                    onChange={(e) => setCameras(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Storage HDD</label>
                  <input
                    type="text"
                    value={hdd}
                    onChange={(e) => setHdd(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Total Value (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={totalVal}
                    onChange={(e) => setTotalVal(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Advance Paid (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={advance}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition"
                >
                  Confirm Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
