import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ShoppingCart,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Globe,
  ExternalLink,
  ShieldAlert,
  StopCircle,
  Building2,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { VoiceEngine } from '../lib/voice';
import { translations } from '../lib/translations';
import { Language, User, CartItem } from '../types';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unreadNotifsCount: number;
  onToggleNotifications: () => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onNavigate: (page: string) => void;
  onToggleMobileSidebar: () => void;
  onTriggerEmergencyTest: () => void;
  onStopEmergency: () => void;
  isEmergencyActive: boolean;
  isVisitorMode?: boolean;
  onToggleVisitorMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  currentUser,
  onLogout,
  soundEnabled,
  onToggleSound,
  unreadNotifsCount,
  onToggleNotifications,
  cart,
  onOpenCart,
  onNavigate,
  onToggleMobileSidebar,
  onTriggerEmergencyTest,
  onStopEmergency,
  isEmergencyActive,
  isVisitorMode,
  onToggleVisitorMode
}) => {
  const t = translations[lang] || translations.en;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleVoiceCommand = () => {
    SoundEngine.click();
    if (isVoiceListening) {
      VoiceEngine.stopListening();
      setIsVoiceListening(false);
      return;
    }

    const voiceLang = lang === 'ar' ? 'ar-SA' : lang === 'bn' ? 'bn-BD' : 'en-US';
    setIsVoiceListening(true);
    
    VoiceEngine.startListening(
      (result) => {
        if (result.isFinal) {
          setIsVoiceListening(false);
          const cmd = result.transcript.toLowerCase();
          
          if (cmd.includes('pos') || cmd.includes('billing') || cmd.includes('বিক্রয়') || cmd.includes('بيع')) {
            onNavigate('pos');
            VoiceEngine.speak('Opening Point of Sale counter', voiceLang);
          } else if (cmd.includes('inventory') || cmd.includes('stock') || cmd.includes('স্টক') || cmd.includes('مخزون')) {
            onNavigate('inventory');
            VoiceEngine.speak('Opening inventory and stock', voiceLang);
          } else if (cmd.includes('invoice') || cmd.includes('quotation') || cmd.includes('চালান') || cmd.includes('فاتورة')) {
            onNavigate('invoicesQuotations');
            VoiceEngine.speak('Opening invoices and quotations', voiceLang);
          } else if (cmd.includes('drive') || cmd.includes('document') || cmd.includes('ড্রাইভ') || cmd.includes('درايف')) {
            onNavigate('googleDrive');
            VoiceEngine.speak('Opening Google Drive Document Space', voiceLang);
          } else if (cmd.includes('emergency') || cmd.includes('siren') || cmd.includes('সাইরেন') || cmd.includes('طوارئ')) {
            onTriggerEmergencyTest();
          } else {
            onNavigate('dashboard');
            VoiceEngine.speak('Navigating to system dashboard', voiceLang);
          }
        }
      },
      (err) => {
        setIsVoiceListening(false);
        console.warn('Voice error:', err);
      },
      () => setIsVoiceListening(false),
      voiceLang
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-lg">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-tight text-white uppercase group-hover:text-emerald-400 transition-colors">
                {db.config.business_name}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CR: {db.config.cr_no}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              {db.config.address} • 5.000% VAT OMAN
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Public Website Preview Switch */}
        <button
          onClick={() => onNavigate('visitorSite')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-500/40 border border-slate-700 text-slate-300 text-xs font-semibold transition"
          title="Open Public Website Showcase"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t.visitorSite}</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </button>

        {/* Emergency Alert Siren Trigger / Stop */}
        {isEmergencyActive ? (
          <button
            onClick={onStopEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs animate-pulse shadow-lg shadow-rose-900/50 hover:bg-rose-700 transition"
            title="Silence active emergency siren"
          >
            <StopCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.stopSiren}</span>
          </button>
        ) : (
          <button
            onClick={onTriggerEmergencyTest}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition"
            title="Trigger Emergency Alert Test"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        )}

        {/* Voice AI Assistant Mic */}
        <button
          onClick={handleVoiceCommand}
          className={`p-2 rounded-xl border transition ${
            isVoiceListening 
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md shadow-rose-900/40' 
              : 'bg-slate-800 text-slate-400 hover:text-emerald-400 border-slate-700/60'
          }`}
          title="Voice Command & Navigation (Speak 'POS', 'Inventory', 'Drive', etc.)"
        >
          {isVoiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound Effects Synthesizer Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-700/60 transition"
          title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Synthesizer'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Language Selector: English (Default), Bangla, Arabic */}
        <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 p-0.5 text-xs font-bold">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'bn' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            বাংলা
          </button>
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-2 py-1 rounded-lg transition ${lang === 'ar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            عربي
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition"
          title="Audit Logs & Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Cart Drawer Button */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-950/40 hover:opacity-95 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">POS</span>
          {totalCartCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-emerald-900 text-[10px] font-black">
              {totalCartCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-white">
              {currentUser?.profilePic ? (
                <img 
                  src={currentUser.profilePic} 
                  alt={currentUser.fullname} 
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.fullname?.[0] || 'U'
              )}
            </div>
            <div className="text-left hidden lg:block pr-1">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {currentUser?.fullname || 'Admin'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono capitalize">
                {currentUser?.role?.replace('_', ' ') || 'Master Admin'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 bg-slate-950 rounded-xl mb-2 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-100">{currentUser?.fullname}</p>
                <p className="text-[11px] text-emerald-400 font-mono">@{currentUser?.username}</p>
                <p className="text-[10px] text-slate-400 mt-1">{currentUser?.branchName || 'Main Branch'}</p>
              </div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onNavigate('adminCenter');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <UserIcon className="w-4 h-4 text-emerald-400" />
                <span>{t.adminCenter}</span>
              </button>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onNavigate('googleDrive');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>{t.googleDrive}</span>
              </button>

              <div className="border-t border-slate-800 my-1"></div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
