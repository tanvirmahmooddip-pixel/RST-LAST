import React, { useState } from 'react';
import {
  Building2,
  Smartphone,
  Zap,
  Cpu,
  Shield,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Globe,
  Lock,
  MessageSquare,
  Sparkles,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { Language, BlogPost } from '../types';

interface VisitorLandingPageProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onGoToLogin: () => void;
  onOpenApp?: () => void;
  isLoggedIn?: boolean;
}

export const VisitorLandingPage: React.FC<VisitorLandingPageProps> = ({
  lang,
  onLanguageChange,
  onGoToLogin,
  onOpenApp,
  isLoggedIn
}) => {
  const landing = db.config.landingPage || {
    heroTitle: 'Top Telecom Oman & Enterprise Mobile Hub',
    heroSubtitle: 'Official Wholesale & Retail Distributor of Global Smartphones, 5G Devices & Microelectronics',
    heroTagline: 'Serving Oman Businesses, Telecom Operators & Consumers with Certified Technology & Nationwide Delivery',
    heroBadge: 'Sultanate of Oman • CR 1374092 • 10,633+ Models Supported',
    aboutText: 'Top Telecom Oman & RST Electronics is the Sultanate’s premier technology enterprise.',
    servicesHighlights: [],
    portfolioStats: [],
    companyHighlights: [],
    blogPosts: []
  };

  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [showPrices, setShowPrices] = useState(!landing.hidePricesInShowcase);
  const [quoteModelName, setQuoteModelName] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote form state
  const [quoteName, setQuoteName] = useState('');
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quotePhone, setQuotePhone] = useState('+968');
  const [quoteQty, setQuoteQty] = useState(5);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.success();
    const msg = encodeURIComponent(
      `Hello Top Telecom Oman,\nI would like to request an official wholesale quotation for:\nModel: ${quoteModelName || 'Smartphone Inquiry'}\nQuantity: ${quoteQty} units\nCompany: ${quoteCompany}\nContact: ${quoteName} (${quotePhone})\nThank you.`
    );
    window.open(`https://wa.me/96894301393?text=${msg}`, '_blank');
    setIsQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Visitor Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black shadow-md shadow-emerald-950/50">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-sm sm:text-base tracking-tight text-white uppercase block leading-none">
              {db.config.business_name}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              CR 1374092 • Sultanate of Oman
            </span>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-0.5 text-xs font-bold">
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

          {isLoggedIn ? (
            <button
              onClick={onOpenApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md transition"
            >
              <span>Return to Admin ERP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onGoToLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin / Staff Portal Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{landing.heroBadge || 'Sultanate of Oman • CR 1374092 • 10,633+ Models'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase max-w-4xl mx-auto leading-tight">
          {landing.heroTitle || 'Top Telecom Oman & Enterprise Mobile Hub'}
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
          {landing.heroSubtitle || 'Official Wholesale & Retail Distributor of Global Smartphones, 5G Devices & Microelectronics'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <a
            href="#showcase"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-950/60 transition flex items-center gap-2"
          >
            <span>Explore Mobile Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://wa.me/96894301393"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Tender Inquiry</span>
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          {(landing.portfolioStats || []).map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl font-black text-white font-mono">{stat.value}</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Specialized Verticals */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900/50 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
              6 Integrated Business Verticals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Technology Solutions Across The Sultanate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(landing.servicesHighlights || []).map((srv, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{srv.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Smartphone Showcase Section */}
      <section id="showcase" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
              B2B Enterprise Showcase
            </span>
            <h2 className="text-2xl font-black text-white uppercase">
              Certified Smartphone Hardware Specifications
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Wholesale inquiries welcome • Official 1-Year Regional Warranties
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-mono">Wholesale Price Mode:</span>
            <button
              onClick={() => setShowPrices(!showPrices)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                showPrices ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {showPrices ? 'Prices Visible' : 'Hidden for Tenders'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {db.products.slice(0, 8).map(prod => (
            <div key={prod.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition group">
              <div>
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950 mb-3 flex items-center justify-center p-2">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80'}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">{prod.brand}</span>
                <h3 className="font-bold text-sm text-white line-clamp-2 mt-0.5">{prod.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-2">{prod.warranty || '1 Year Official Warranty'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {showPrices ? (
                  <span className="text-base font-black text-white font-mono">
                    {prod.price.toFixed(3)} {db.config.currency}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    Tender Pricing
                  </span>
                )}

                <button
                  onClick={() => {
                    setQuoteModelName(prod.name);
                    setIsQuoteModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-bold transition"
                >
                  Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Blog & 5G Updates Section */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
              Informatics &amp; Tech Insights
            </span>
            <h2 className="text-2xl font-black text-white uppercase">
              Oman Telecommunications &amp; Hardware News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(landing.blogPosts || []).map(post => (
              <div
                key={post.id}
                onClick={() => setActiveBlog(post)}
                className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-44 overflow-hidden bg-slate-950">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Governorate Footnote */}
      <footer className="py-12 px-4 sm:px-8 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase">{db.config.business_name}</h3>
            <p className="text-slate-400 font-sans leading-relaxed">{db.config.legal_name}</p>
            <p>Commercial Registration: CR {db.config.cr_no} • Tax ID: {db.config.tax_no}</p>
            <p>{db.config.address}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-white uppercase">Direct Contact</h4>
            <p>Phone: {db.config.phone}</p>
            <p>Email: {db.config.email}</p>
            <p>WhatsApp: +968 9430 1393</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-white uppercase">Oman Operations</h4>
            <p>• Muscat (Mabellah Sanaya)</p>
            <p>• Seeb Souq &amp; Al Khoud</p>
            <p>• Salalah Industrial Dhofar</p>
            <p>• Sohar Freezone &amp; Port Hub</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} {db.config.business_name}. Powered by Omnichannel ERP Platform under Sultanate of Oman Tax Regulations.
        </div>
      </footer>

      {/* Blog Article Reader Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 font-mono uppercase">{activeBlog.category}</span>
                <h2 className="text-lg font-black text-white mt-1">{activeBlog.title}</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">By {activeBlog.author} • {activeBlog.date}</p>
              </div>
              <button onClick={() => setActiveBlog(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-950">
              <img src={activeBlog.image} alt={activeBlog.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3">
              <p>{activeBlog.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tender Quotation Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Request Tender Wholesale Quote</h3>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 uppercase">Selected Model</label>
                <input
                  type="text"
                  readOnly
                  value={quoteModelName}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="e.g. Tariq Al-Balushi"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Company / Establishment</label>
                <input
                  type="text"
                  required
                  value={quoteCompany}
                  onChange={(e) => setQuoteCompany(e.target.value)}
                  placeholder="e.g. Al-Madina Engineering LLC"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-400 uppercase">Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 uppercase">Target Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={quoteQty}
                    onChange={(e) => setQuoteQty(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition"
                >
                  Send via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
