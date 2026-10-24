import React, { useState } from 'react';
import {
  Sliders,
  Users,
  Palette,
  Volume2,
  Mic,
  Shield,
  Building2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { VoiceEngine } from '../lib/voice';
import { translations } from '../lib/translations';
import { Language, User, UserRole, ThemePreset, AnimationLevel } from '../types';

interface AdminCenterProps {
  lang: Language;
  currentUser: User | null;
  onRefresh: () => void;
}

export const AdminCenter: React.FC<AdminCenterProps> = ({ lang, currentUser, onRefresh }) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'users' | 'theme' | 'company' | 'soundVoice'>('users');

  // Company details state
  const [businessName, setBusinessName] = useState(db.config.business_name);
  const [legalName, setLegalName] = useState(db.config.legal_name);
  const [crNo, setCrNo] = useState(db.config.cr_no);
  const [taxNo, setTaxNo] = useState(db.config.tax_no || 'OM-VAT-1374092-2024');
  const [address, setAddress] = useState(db.config.address);
  const [phone, setPhone] = useState(db.config.phone);
  const [email, setEmail] = useState(db.config.email);
  const [invPrefix, setInvPrefix] = useState(db.config.invoice_prefix);
  const [slDocPrefix, setSlDocPrefix] = useState(db.config.sl_doc_prefix);

  // Theme & Animation state
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(db.config.themePreset);
  const [selectedAnim, setSelectedAnim] = useState<AnimationLevel>(db.config.animationLevel);
  const [fontScale, setFontScale] = useState(db.config.fontScale);

  // Sound & Voice state
  const [soundEnabled, setSoundEnabled] = useState(db.config.soundAlerts.enabled);
  const [soundVolume, setSoundVolume] = useState(db.config.soundAlerts.volume);
  const [sirenAlert, setSirenAlert] = useState(db.config.soundAlerts.siren);
  const [voiceSpeechOutput, setVoiceSpeechOutput] = useState(db.config.voiceControl.speechOutput);

  // User management modal
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('user123');
  const [newFullname, setNewFullname] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('cashier');
  const [newProfilePic, setNewProfilePic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [hideCost, setHideCost] = useState(true);
  const [hideProfit, setHideProfit] = useState(true);

  // Handle Save Company
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.success();
    db.config.business_name = businessName;
    db.config.legal_name = legalName;
    db.config.cr_no = crNo;
    db.config.tax_no = taxNo;
    db.config.address = address;
    db.config.phone = phone;
    db.config.email = email;
    db.config.invoice_prefix = invPrefix;
    db.config.sl_doc_prefix = slDocPrefix;
    db.persist();
    onRefresh();
    alert('Company configurations and document serial prefixes saved successfully!');
  };

  // Handle Save Themes & Visual Controls
  const handleSaveTheme = () => {
    SoundEngine.click();
    db.config.themePreset = selectedTheme;
    db.config.animationLevel = selectedAnim;
    db.config.fontScale = fontScale;
    db.persist();
    onRefresh();
  };

  // Handle Save Audio & Voice Controls
  const handleSaveSoundVoice = () => {
    SoundEngine.click();
    db.config.soundAlerts.enabled = soundEnabled;
    db.config.soundAlerts.volume = soundVolume;
    db.config.soundAlerts.siren = sirenAlert;
    db.config.voiceControl.speechOutput = voiceSpeechOutput;
    SoundEngine.enabled = soundEnabled;
    SoundEngine.volume = soundVolume;
    db.persist();
    onRefresh();
    alert('Audio & Voice synthesizer settings saved!');
  };

  // Handle Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullname.trim()) return;

    SoundEngine.click();
    db.createUser({
      username: newUsername.trim(),
      password: newPassword,
      fullname: newFullname.trim(),
      role: newRole,
      profilePic: newProfilePic,
      hiddenOptions: {
        hideCostPrice: hideCost,
        hideProfitMargin: hideProfit,
        hideSupplierBalances: hideCost,
        hideFinancialSummary: hideProfit,
        hideDamagesCost: hideCost,
        hidePayroll: hideProfit
      }
    });

    setIsNewUserModalOpen(false);
    setNewUsername('');
    setNewFullname('');
    onRefresh();
  };

  const themes: { id: ThemePreset; name: string; color: string; desc: string }[] = [
    { id: 'emerald', name: 'Emerald Tech (Default)', color: 'bg-emerald-600', desc: 'Modern fintech dark slate with glowing emerald accents' },
    { id: 'obsidian', name: 'Obsidian Black', color: 'bg-neutral-900', desc: 'Ultra-minimalist true black OLED contrast' },
    { id: 'sapphire', name: 'Sapphire Enterprise', color: 'bg-sky-600', desc: 'Crisp corporate blue and sky styling' },
    { id: 'amethyst', name: 'Amethyst Royal', color: 'bg-purple-600', desc: 'Deep violet executive theme' },
    { id: 'solar', name: 'Solar Amber', color: 'bg-amber-600', desc: 'High-contrast warm stone and gold highlights' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: 'bg-rose-600', desc: 'Vibrant neon crimson terminal aesthetics' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Administrator Control Centre
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            User Profiles &amp; Photos • Launcher Theme Engine • Audio Synthesizer • Company CR 1374092 Details
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl border border-slate-800 w-fit gap-1">
        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('users');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users &amp; Profiles ({db.users.length})</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('theme');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'theme' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Theme &amp; Launcher Controls</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('soundVoice');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'soundVoice' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Voice &amp; Audio Synthesizer</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.click();
            setActiveTab('company');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'company' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company &amp; Tax Settings</span>
        </button>
      </div>

      {/* Tab: Users & Profile Pictures */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                User Accounts, Role Permissions &amp; Profile Avatars
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Admin-controlled cost price, profit visibility, and photo uploads
              </p>
            </div>

            <button
              onClick={() => setIsNewUserModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.users.map(u => (
              <div key={u.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    <img 
                      src={u.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'} 
                      alt={u.fullname} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white">{u.fullname}</h3>
                    <p className="text-xs text-emerald-400 font-mono">@{u.username}</p>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">{u.role.replace('_', ' ')} • {u.branchName || 'Main Branch'}</p>

                    <div className="flex flex-wrap gap-1 mt-2 text-[9px] font-mono">
                      {u.hiddenOptions?.hideCostPrice ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Cost Protected
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          Can View Cost
                        </span>
                      )}
                      {u.hiddenOptions?.hideProfitMargin ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Margin Protected
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          Can View Margin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {u.id !== 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete account for ${u.fullname}?`)) {
                          db.deleteUser(u.id);
                          onRefresh();
                        }
                      }}
                      className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Theme Launcher & Animation Controls */}
      {activeTab === 'theme' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              System Theme Presets
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Select visual aesthetics for your enterprise counter display
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {themes.map(tItem => (
                <div
                  key={tItem.id}
                  onClick={() => {
                    setSelectedTheme(tItem.id);
                    db.config.themePreset = tItem.id;
                    db.persist();
                    onRefresh();
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedTheme === tItem.id 
                      ? 'bg-slate-950 border-emerald-500 shadow-md shadow-emerald-950/50' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{tItem.name}</span>
                    <span className={`w-3.5 h-3.5 rounded-full ${tItem.color}`} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-sans">{tItem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Animation &amp; Motion Controls
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['smooth', 'high_fps', 'reduced', 'pulse'] as AnimationLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedAnim(lvl);
                    db.config.animationLevel = lvl;
                    db.persist();
                    onRefresh();
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold capitalize transition ${
                    selectedAnim === lvl 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Voice & Audio Synthesizer */}
      {activeTab === 'soundVoice' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Web Audio API Synthesizer
            </h2>

            <div className="space-y-3 max-w-md">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 font-bold">Master Audio Feedback</span>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-bold">
                  <span>Synthesizer Volume:</span>
                  <span className="font-mono text-emerald-400">{(soundVolume * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300 font-bold">Emergency Siren Audio Pattern</span>
                <input
                  type="checkbox"
                  checked={sirenAlert}
                  onChange={(e) => setSirenAlert(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Voice AI &amp; Spoken Readout
            </h2>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 max-w-md">
              <div>
                <span className="text-xs text-slate-300 font-bold block">Spoken Bill Totals &amp; Announcements</span>
                <span className="text-[10px] text-slate-500">Reads out grand totals after checkout</span>
              </div>
              <input
                type="checkbox"
                checked={voiceSpeechOutput}
                onChange={(e) => setVoiceSpeechOutput(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-emerald-600"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSoundVoice}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            Save Sound &amp; Voice Settings
          </button>
        </div>
      )}

      {/* Tab: Company & Tax Settings */}
      {activeTab === 'company' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Sultanate of Oman Company Details &amp; Prefixes
            </h2>
          </div>

          <form onSubmit={handleSaveCompany} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trading Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Legal Commercial Name</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Commercial Registration (CR)</label>
              <input
                type="text"
                value={crNo}
                onChange={(e) => setCrNo(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Oman Tax Authority VAT No</label>
              <input
                type="text"
                value={taxNo}
                onChange={(e) => setTaxNo(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Phone / Support Line</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Invoice Prefix</label>
              <input
                type="text"
                value={invPrefix}
                onChange={(e) => setInvPrefix(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Document Serial Prefix (SL DOC NO)</label>
              <input
                type="text"
                value={slDocPrefix}
                onChange={(e) => setSlDocPrefix(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-teal-400 font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-sans"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New User Account Modal */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Create Enterprise User Account</h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Username (Login ID)</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. cashier2"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullname}
                  onChange={(e) => setNewFullname(e.target.value)}
                  placeholder="e.g. Abdullah Al-Kindi"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="cashier">Cashier (POS Only)</option>
                  <option value="sales_staff">Sales Staff</option>
                  <option value="manager">Branch Manager</option>
                  <option value="accountant">Accountant</option>
                  <option value="service_technician">Service Technician</option>
                  <option value="storekeeper">Storekeeper</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Profile Picture URL</label>
                <input
                  type="text"
                  value={newProfilePic}
                  onChange={(e) => setNewProfilePic(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideCostCheck"
                    checked={hideCost}
                    onChange={(e) => setHideCost(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-600"
                  />
                  <label htmlFor="hideCostCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Hide Cost Price for this User
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideProfitCheck"
                    checked={hideProfit}
                    onChange={(e) => setHideProfit(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-600"
                  />
                  <label htmlFor="hideProfitCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Hide Profit &amp; Loss Margins for this User
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
