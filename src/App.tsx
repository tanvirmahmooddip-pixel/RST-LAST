import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { POSInvoicing } from './components/POSInvoicing';
import { InvoicesQuotations } from './components/InvoicesQuotations';
import { InventoryManager } from './components/InventoryManager';
import { PhoneModelsCatalog } from './components/PhoneModelsCatalog';
import { RepairServiceCentre } from './components/RepairServiceCentre';
import { CctvInstallation } from './components/CctvInstallation';
import { TelecomUtility } from './components/TelecomUtility';
import { AccountingFinance } from './components/AccountingFinance';
import { CustomersManager } from './components/CustomersManager';
import { HrmAttendance } from './components/HrmAttendance';
import { GoogleDriveDocumentsSpace } from './components/GoogleDriveDocumentsSpace';
import { SqlStudio } from './components/SqlStudio';
import { AdminCenter } from './components/AdminCenter';
import { VisitorLandingPage } from './components/VisitorLandingPage';
import { AiAssistant } from './components/AiAssistant';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LoginScreen } from './components/LoginScreen';

import { db } from './lib/database';
import { SoundEngine } from './lib/sound';
import { Language, User, CartItem, Invoice } from './types';
import { ShieldAlert, StopCircle } from 'lucide-react';

export default function App() {
  // Current Authenticated User (Defaults to Master Admin)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rst_user');
    return saved ? JSON.parse(saved) : (db.users?.[0] || null);
  });

  // Language state (English default, Bangla, Arabic)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('rst_lang') as Language) || 'en';
  });

  // Current view page
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Shared cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rst_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sound Engine state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('rst_sound') !== 'false';
  });

  // Emergency Siren State
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(() => {
    return db.activeEmergency?.active || false;
  });

  // Mobile navigation and drawers
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isVisitorMode, setIsVisitorMode] = useState(false);
  const [tick, setTick] = useState(0);

  // Sync HTML direction and language
  useEffect(() => {
    localStorage.setItem('rst_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync Cart
  useEffect(() => {
    localStorage.setItem('rst_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Sound
  useEffect(() => {
    SoundEngine.enabled = soundEnabled;
    localStorage.setItem('rst_sound', String(soundEnabled));
  }, [soundEnabled]);

  const handleLanguageChange = (newLang: Language) => {
    SoundEngine.click();
    setLang(newLang);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsVisitorMode(false);
    localStorage.setItem('rst_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rst_user');
    SoundEngine.click();
  };

  // Emergency Handlers
  const handleTriggerEmergency = () => {
    db.triggerEmergencyAlert(
      'SECURITY & CASH DRAWER DISCREPANCY',
      'High-priority emergency alert siren triggered on system dashboard. Admin intervention required.'
    );
    setIsEmergencyActive(true);
    setTick(t => t + 1);
  };

  const handleStopEmergency = () => {
    if (currentUser?.role !== 'master_admin' && currentUser?.role !== 'admin') {
      alert('Only Admin role is authorized to silence this emergency alert.');
      return;
    }
    db.stopEmergencyAlert(currentUser.fullname);
    setIsEmergencyActive(false);
    setTick(t => t + 1);
  };

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id && i.isComponent === item.isComponent);
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id && i.isComponent === item.isComponent
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qty: newQty };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleInvoiceCreated = (invoice: Invoice) => {
    setTick((t) => t + 1);
  };

  // Dynamic Theme & Typography Styling
  const themeClasses = useMemo(() => {
    const theme = db.config.themePreset || 'emerald';
    const font = db.config.fontScale || 'normal';

    let bg = 'bg-slate-950 text-slate-100';
    if (theme === 'obsidian') bg = 'bg-black text-neutral-100';
    else if (theme === 'sapphire') bg = 'bg-slate-950 text-sky-100';
    else if (theme === 'amethyst') bg = 'bg-slate-950 text-purple-100';
    else if (theme === 'solar') bg = 'bg-stone-950 text-amber-100';
    else if (theme === 'cyberpunk') bg = 'bg-slate-950 text-rose-100';

    let fontClass = 'text-sm';
    if (font === 'compact') fontClass = 'text-[13px]';
    else if (font === 'spacious') fontClass = 'text-base';

    return `${bg} ${fontClass}`;
  }, [db.config.themePreset, db.config.fontScale, tick]);

  // If user is not authenticated: render Visitor Showcase or Login Screen
  if (!currentUser) {
    if (isVisitorMode) {
      return (
        <VisitorLandingPage
          lang={lang}
          onLanguageChange={handleLanguageChange}
          onGoToLogin={() => setIsVisitorMode(false)}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={handleLogin}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onViewShowcase={() => setIsVisitorMode(true)}
      />
    );
  }

  // If currently viewing the public website while logged in
  if (currentPage === 'visitorSite') {
    return (
      <VisitorLandingPage
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onGoToLogin={handleLogout}
        onOpenApp={() => setCurrentPage('dashboard')}
        isLoggedIn={true}
      />
    );
  }

  const unreadNotifsCount = db.notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen ${themeClasses} flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        unreadNotifsCount={unreadNotifsCount}
        onToggleNotifications={() => setIsNotifOpen(true)}
        cart={cart}
        onOpenCart={() => setCurrentPage('pos')}
        onNavigate={setCurrentPage}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onTriggerEmergencyTest={handleTriggerEmergency}
        onStopEmergency={handleStopEmergency}
        isEmergencyActive={isEmergencyActive}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          lang={lang}
          currentUser={currentUser}
          onLogout={handleLogout}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full transition-all">
          {currentPage === 'dashboard' && (
            <DashboardView
              lang={lang}
              onNavigate={setCurrentPage}
              currentUser={currentUser}
              onTriggerEmergency={handleTriggerEmergency}
              onStopEmergency={handleStopEmergency}
              isEmergencyActive={isEmergencyActive}
              onDataRefresh={() => setTick(t => t + 1)}
            />
          )}

          {currentPage === 'pos' && (
            <POSInvoicing
              cart={cart}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onAddToCart={handleAddToCart}
              lang={lang}
              onInvoiceCreated={handleInvoiceCreated}
            />
          )}

          {currentPage === 'invoicesQuotations' && (
            <InvoicesQuotations
              lang={lang}
            />
          )}

          {currentPage === 'inventory' && (
            <InventoryManager
              lang={lang}
              currentUser={currentUser}
              onRefresh={() => setTick(t => t + 1)}
            />
          )}

          {currentPage === 'phones' && (
            <PhoneModelsCatalog
              lang={lang}
              currentUser={currentUser}
              onAddToCart={handleAddToCart}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'repairCentre' && (
            <RepairServiceCentre
              lang={lang}
            />
          )}

          {currentPage === 'cctvSecurity' && (
            <CctvInstallation
              lang={lang}
            />
          )}

          {currentPage === 'telecom' && (
            <TelecomUtility
              lang={lang}
            />
          )}

          {currentPage === 'accounting' && (
            <AccountingFinance
              lang={lang}
              currentUser={currentUser}
            />
          )}

          {currentPage === 'customers' && (
            <CustomersManager
              lang={lang}
            />
          )}

          {currentPage === 'hrmAttendance' && (
            <HrmAttendance
              lang={lang}
              currentUser={currentUser}
            />
          )}

          {currentPage === 'googleDrive' && (
            <GoogleDriveDocumentsSpace
              lang={lang}
            />
          )}

          {currentPage === 'sqlStudio' && (
            <SqlStudio
              lang={lang}
              onDataMutated={() => setTick(t => t + 1)}
            />
          )}

          {currentPage === 'adminCenter' && (
            <AdminCenter
              lang={lang}
              currentUser={currentUser}
              onRefresh={() => setTick(t => t + 1)}
            />
          )}
        </main>
      </div>

      {/* Emergency Siren Modal (When siren is actively ringing) */}
      {isEmergencyActive && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-xl font-black text-rose-400 tracking-tight uppercase">
                🚨 EMERGENCY SIREN ACTIVE
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                {db.activeEmergency?.message || 'High-priority cash drawer / security discrepancy alert active.'}
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-400">
              Triggered: {db.activeEmergency?.timestamp || new Date().toLocaleTimeString()}
            </div>

            {currentUser?.role === 'master_admin' || currentUser?.role === 'admin' ? (
              <button
                onClick={handleStopEmergency}
                className="w-full py-3 bg-white hover:bg-slate-100 text-rose-700 font-black rounded-xl text-sm transition shadow-xl flex items-center justify-center gap-2"
              >
                <StopCircle className="w-5 h-5 text-rose-700" />
                <span>SILENCE SIREN (ADMIN AUTHORIZATION)</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-950/60 border border-rose-900 text-rose-300 text-xs rounded-xl font-mono">
                🔒 You are logged in as {currentUser?.username}. Only System Administrator is authorized to silence this alert.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating AI Assistant Copilot */}
      <AiAssistant />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onClear={() => {
          db.notifications = [];
          setTick(t => t + 1);
        }}
      />
    </div>
  );
}
