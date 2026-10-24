import React, { useState } from 'react';
import {
  Building2,
  Lock,
  User as UserIcon,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language, User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onViewShowcase: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  lang,
  onLanguageChange,
  onViewShowcase
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState<'sales_staff' | 'cashier'>('cashier');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegisterMode) {
      if (!username.trim() || !fullname.trim()) {
        setErrorMsg('Please enter all required fields.');
        return;
      }
      SoundEngine.success();
      const newUser = db.createUser({
        username: username.trim(),
        fullname: fullname.trim(),
        password,
        role
      });
      onLogin(newUser);
      return;
    }

    const u = db.authenticate(username, password);
    if (!u) {
      SoundEngine.error();
      setErrorMsg('Invalid credentials. For quick demo, select one of the buttons below.');
      return;
    }

    SoundEngine.success();
    onLogin(u);
  };

  const handleQuickDemo = (userRole: string) => {
    SoundEngine.click();
    const found = db.users.find(u => u.role === userRole) || db.users[0];
    setUsername(found.username);
    setPassword(found.password || 'admin123');
    onLogin(found);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans selection:bg-emerald-500 selection:text-black">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Language & Showcase Switch */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onViewShowcase}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Public Website</span>
        </button>

        <div className="flex bg-slate-900 rounded-xl border border-slate-800 p-0.5 text-xs font-bold">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'bn' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            বাংলা
          </button>
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'ar' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            عربي
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            {db.config.business_name}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            CR {db.config.cr_no} • Sultanate of Oman Enterprise ERP Portal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-900 text-rose-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="e.g. Tariq Al-Balushi"
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Username / Staff ID</label>
            <div className="relative mt-1">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Desired Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="cashier">Cashier (POS Terminal)</option>
                <option value="sales_staff">Sales Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
          >
            <span>{isRegisterMode ? 'Complete Sign Up' : 'Authenticate & Enter ERP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center font-mono">
            Demo 1-Click Role Switch:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleQuickDemo('master_admin')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 font-bold transition text-left"
            >
              👑 Master Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('cashier')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 font-bold transition text-left"
            >
              🛒 Cashier (POS)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('manager')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 font-bold transition text-left"
            >
              🏢 Branch Manager
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('accountant')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 font-bold transition text-left"
            >
              📊 Accountant
            </button>
          </div>
        </div>

        {/* Switch between Login and Register */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            {isRegisterMode ? 'Already have an enterprise account? Sign in' : 'Need a new staff account? Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
};
