import React from 'react';
import {
  X,
  Bell,
  Trash2,
  AlertTriangle,
  ShoppingCart,
  Cloud,
  Layers,
  Clock
} from 'lucide-react';
import { db } from '../lib/database';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onClear
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white uppercase tracking-tight">
                  System Alerts &amp; Logs
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {db.notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 font-mono">
                  No notifications recorded. System is operating normally.
                </div>
              ) : (
                db.notifications.map(n => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{n.title}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Clear */}
          {db.notifications.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onClear}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Notifications</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
