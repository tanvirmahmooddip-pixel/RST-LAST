import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Boxes,
  Smartphone,
  Wrench,
  Camera,
  Zap,
  Calculator,
  Users,
  UserCheck,
  Cloud,
  Database,
  Sliders,
  Globe,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, User } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  lang: Language;
  currentUser: User | null;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  lang,
  currentUser,
  onLogout,
  mobileOpen,
  onCloseMobile
}) => {
  const t = translations[lang] || translations.en;

  const navCategories: { category: string; items: NavItem[] }[] = [
    {
      category: lang === 'ar' ? 'العمليات الأساسية' : lang === 'bn' ? 'প্রধান অপারেশন' : 'Core Operations',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
        { id: 'pos', label: t.pos, icon: ShoppingCart, highlight: true },
        { id: 'invoicesQuotations', label: t.invoicesQuotations, icon: FileText },
        { id: 'inventory', label: t.inventory, icon: Boxes },
        { id: 'phones', label: t.phonesCatalog, icon: Smartphone }
      ]
    },
    {
      category: lang === 'ar' ? 'الخدمات المتخصصة' : lang === 'bn' ? 'বিশেষ পরিষেবা' : 'Specialized Verticals',
      items: [
        { id: 'repairCentre', label: t.repairCentre, icon: Wrench },
        { id: 'cctvSecurity', label: t.cctvSecurity, icon: Camera },
        { id: 'telecom', label: t.telecomUtility, icon: Zap }
      ]
    },
    {
      category: lang === 'ar' ? 'المالية والسحابة والعملاء' : lang === 'bn' ? 'হিসাব, ক্লাউড ও গ্রাহক' : 'Finance & Cloud Vault',
      items: [
        { id: 'accounting', label: t.accounting, icon: Calculator },
        { id: 'customers', label: t.customers, icon: Users },
        { id: 'hrmAttendance', label: t.hrmAttendance, icon: UserCheck },
        { id: 'googleDrive', label: t.googleDrive, icon: Cloud, badge: 'Vault' }
      ]
    },
    {
      category: lang === 'ar' ? 'الإدارة والمنصة' : lang === 'bn' ? 'প্রশাসন ও ডাটাবেস' : 'Administration & System',
      items: [
        { id: 'sqlStudio', label: t.sqlStudio, icon: Database },
        { id: 'adminCenter', label: t.adminCenter, icon: Sliders },
        { id: 'visitorSite', label: t.visitorSite, icon: Globe }
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    SoundEngine.click();
    onNavigate(id);
    onCloseMobile();
  };

  const isItemHidden = (id: string) => {
    if (currentUser?.role === 'master_admin') return false;
    return currentUser?.hiddenPages?.includes(id) || false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Mobile Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
              TT
            </div>
            <span className="font-bold text-xs text-white uppercase">TOP TELECOM OMAN</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Bar */}
        <div className="p-3 mx-3 my-2 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-emerald-800 border border-emerald-500/30 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {currentUser?.profilePic ? (
              <img src={currentUser.profilePic} alt={currentUser.fullname} className="w-full h-full object-cover" />
            ) : (
              currentUser?.fullname?.[0] || 'A'
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.fullname}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-emerald-400 font-mono capitalize truncate">
                {currentUser?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs font-medium">
          {navCategories.map((group, idx) => {
            const visibleItems = group.items.filter(item => !isItemHidden(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {group.category}
                </div>
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition
                        ${isActive 
                          ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/50' 
                          : item.highlight
                            ? 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300'
                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <button
            onClick={() => {
              SoundEngine.click();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
          <div className="mt-2 text-[10px] text-slate-500 text-center font-mono">
            v3.0.0 • Oman Tax 5.000%
          </div>
        </div>
      </aside>
    </>
  );
};
