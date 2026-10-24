import React, { useState } from 'react';
import {
  UserCheck,
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language, User, AttendanceRecord, Employee } from '../types';

interface HrmAttendanceProps {
  lang: Language;
  currentUser?: User | null;
}

export const HrmAttendance: React.FC<HrmAttendanceProps> = ({ lang, currentUser }) => {
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<number>(1);
  const [notes, setNotes] = useState('');

  const canApprove = currentUser?.permissions?.canApprovePayroll;

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.click();
    const emp = db.employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    const rec = db.checkInEmployee(emp.id, { notes });
    setIsCheckInModalOpen(false);
    setNotes('');
    if (rec) {
      alert(`Employee ${emp.name} checked in at ${rec.checkInTime}!`);
    }
  };

  const handleCheckOut = (recordId: number) => {
    SoundEngine.click();
    const rec = db.checkOutEmployee(recordId);
    if (rec) {
      alert(`Employee ${rec.employeeName} checked out! Total: ${rec.totalHours} hrs | Pay: ${rec.calculatedPay.toFixed(3)} OMR`);
    }
  };

  const handleApprovePayroll = (recordId: number) => {
    SoundEngine.success();
    db.approveAttendanceRecord(recordId, currentUser?.fullname || 'Administrator');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              HRM, Staff Shifts &amp; Attendance Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated Break Deductions • Overtime Calculations • Hourly Payroll Pay Generation
          </p>
        </div>

        <button
          onClick={() => setIsCheckInModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition"
        >
          <Clock className="w-4 h-4" />
          <span>Clock In Staff Member</span>
        </button>
      </div>

      {/* Shifts Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {db.shifts.map(shift => (
          <div key={shift.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">{shift.name}</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: shift.color }} />
            </div>
            <p className="text-xs font-mono text-slate-300 font-bold">{shift.startTime} - {shift.endTime}</p>
            <p className="text-[10px] text-slate-500 font-mono">
              Std: {shift.standardHours}h • Break: {shift.defaultBreakMinutes}m • OT: {shift.overtimeRateMultiplier}x
            </p>
          </div>
        ))}
      </div>

      {/* Attendance Records Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Daily Attendance &amp; Payroll Approval Ledger
          </h2>
          <span className="text-xs font-mono text-slate-400">{db.attendanceRecords.length} Records Today</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3">Code</th>
                <th className="pb-3">Staff Member</th>
                <th className="pb-3">Shift</th>
                <th className="pb-3">Check-In</th>
                <th className="pb-3">Check-Out</th>
                <th className="pb-3 text-center">Worked Hours</th>
                <th className="pb-3 text-center">Overtime</th>
                <th className="pb-3 text-right">Rate / Hr</th>
                <th className="pb-3 text-right">Calculated Pay</th>
                <th className="pb-3 text-center">Payroll Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {db.attendanceRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-teal-400">{rec.employeeCode}</td>
                  <td className="py-3 font-sans font-medium text-slate-200">
                    <div>
                      <span className="font-semibold text-white">{rec.employeeName}</span>
                      <p className="text-[10px] text-slate-500 font-mono">{rec.branch}</p>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{rec.shiftCategory}</td>
                  <td className="py-3 text-emerald-400 font-bold">{rec.checkInTime}</td>
                  <td className="py-3 text-slate-300">
                    {rec.checkOutTime || <span className="text-amber-400 animate-pulse">On Duty</span>}
                  </td>
                  <td className="py-3 text-center font-bold text-white">
                    {rec.totalHours > 0 ? `${rec.totalHours} hrs` : '-'}
                  </td>
                  <td className="py-3 text-center text-amber-400 font-bold">
                    {rec.overtimeHours > 0 ? `+${rec.overtimeHours} hrs` : '-'}
                  </td>
                  <td className="py-3 text-right text-slate-400">{rec.hourlyRate.toFixed(3)}</td>
                  <td className="py-3 text-right font-bold text-white font-mono">
                    {rec.calculatedPay.toFixed(3)} OMR
                  </td>
                  <td className="py-3 text-center">
                    {rec.isApproved ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!rec.checkOutTime && (
                        <button
                          onClick={() => handleCheckOut(rec.id)}
                          className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold transition"
                        >
                          Check Out
                        </button>
                      )}
                      {canApprove && !rec.isApproved && rec.checkOutTime && (
                        <button
                          onClick={() => handleApprovePayroll(rec.id)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check In Modal */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Clock In Staff Member</h3>
              <button onClick={() => setIsCheckInModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Select Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {db.employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.code} - {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Counter duty started"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                >
                  Confirm Clock In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
