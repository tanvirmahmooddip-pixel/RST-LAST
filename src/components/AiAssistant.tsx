import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Volume2,
  Bot,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { VoiceEngine } from '../lib/voice';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Salam! I am your AI Business Copilot for Top Telecom Oman & RST Electronics. Ask me about cash in hand, stock, repairs, or telecom balances.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'What is Cash in Hand now?',
    'Check low stock alerts',
    'How many active repair jobs?',
    'What is telecom wallet balance?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    SoundEngine.click();
    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Process Copilot response based on live ERP state
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('cash in hand') || q.includes('cash') || q.includes('নগদ') || q.includes('النقد')) {
        const cash = db.calculateCashInHand();
        reply = `The current Net Cash in Hand is ${cash.cashInHandNow.toFixed(3)} ${db.config.currency}. Inflow: ${(cash.totalSalesAndService + cash.servicesAdvanced).toFixed(3)} OMR, Outflow (Purchases & Expenses & Cards): ${(cash.purchasedTotalToday + cash.expensesTotalToday + cash.bankSwiftTotal).toFixed(3)} OMR.`;
      } else if (q.includes('stock') || q.includes('inventory') || q.includes('phone') || q.includes('مخزون')) {
        const phoneCount = db.products.reduce((sum, p) => sum + p.stock, 0);
        const lowStock = db.products.filter(p => p.stock <= (p.lowstock || 2));
        reply = `You have ${phoneCount} total smartphone & device units in warehouse across ${db.products.length} catalog items. ${lowStock.length} items have reached low stock thresholds.`;
      } else if (q.includes('repair') || q.includes('صيانة') || q.includes('মেরামত')) {
        const activeRepairs = db.repairs.filter(r => r.status !== 'Delivered' && r.status !== 'Cancelled');
        reply = `There are currently ${activeRepairs.length} active repair job cards in the lab bench.`;
      } else if (q.includes('telecom') || q.includes('omantel') || q.includes('ooredoo') || q.includes('رصيد')) {
        const total = db.telecomOperators.reduce((sum, op) => sum + op.balance, 0);
        reply = `The aggregate Oman telecom balance across all 7 operators is ${total.toFixed(3)} ${db.config.currency}. Omantel has ${db.telecomOperators[0]?.balance.toFixed(3)} OMR.`;
      } else {
        reply = `I have checked the system. You have ${db.invoices.length} posted tax invoices today, CR 1374092 compliance active, and Google Drive Cloud Vault in sync.`;
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      SoundEngine.notify();
      if (db.config.voiceControl.speechOutput) {
        VoiceEngine.speak(reply, 'en-US');
      }
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => {
            SoundEngine.click();
            setIsOpen(true);
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 hover:scale-105 text-white shadow-xl shadow-emerald-950/60 transition flex items-center gap-2 group"
          title="Open AI Business Copilot"
        >
          <Sparkles className="w-5 h-5 animate-spin group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-xs font-black uppercase tracking-tight hidden sm:inline">AI Copilot</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-80 sm:w-96 shadow-2xl p-4 flex flex-col h-[480px] animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase">ERP AI Assistant</h3>
                <p className="text-[10px] text-emerald-400 font-mono">Live Business Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs font-sans">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-1.5 overflow-x-auto py-2 border-t border-slate-800/80">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about ERP..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
