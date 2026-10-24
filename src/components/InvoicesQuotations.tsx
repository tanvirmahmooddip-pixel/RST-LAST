import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Share2,
  Mail,
  CheckCircle2,
  Download,
  Search,
  ArrowRight,
  Eye,
  PlusCircle,
  Copy,
  X
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, Invoice, Quotation } from '../types';
import { generateBarcodeSvg, generateQrCodeSvg } from '../lib/barcode';

interface InvoicesQuotationsProps {
  lang: Language;
}

export const InvoicesQuotations: React.FC<InvoicesQuotationsProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotations'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [printSize, setPrintSize] = useState<'A4' | 'A5' | '80mm' | '58mm'>('A4');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // New Quotation Modal State
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [quoteCustomer, setQuoteCustomer] = useState('');
  const [quotePhone, setQuotePhone] = useState('+968');
  const [quoteItems, setQuoteItems] = useState([
    { name: 'Apple iPhone 16 Pro Max 256GB', price: 520.000, qty: 1, warranty: '1 Year Apple Official' }
  ]);

  const filteredInvoices = db.invoices.filter(inv =>
    inv.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.sl_doc_no && inv.sl_doc_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredQuotations = db.quotations.filter(q =>
    q.quote_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.sl_doc_no && q.sl_doc_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenPrint = (inv: Invoice) => {
    SoundEngine.click();
    setSelectedInvoice(inv);
    setSelectedQuotation(null);
    setIsPreviewOpen(true);
  };

  const handleOpenQuotePrint = (q: Quotation) => {
    SoundEngine.click();
    setSelectedQuotation(q);
    setSelectedInvoice(null);
    setIsPreviewOpen(true);
  };

  const handleConvertQuote = (quoteId: number) => {
    SoundEngine.cash();
    const inv = db.convertQuotationToInvoice(quoteId);
    if (inv) {
      alert(`Quotation successfully converted to Official Tax Invoice: ${inv.invoice_no}`);
      setSelectedInvoice(inv);
      setIsPreviewOpen(true);
    }
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    SoundEngine.click();
    const text = encodeURIComponent(
      `Hello ${inv.customer}, here is your Tax Invoice ${inv.invoice_no} from ${db.config.business_name} (CR: ${db.config.cr_no}).\nTotal Amount: ${inv.grand_total.toFixed(3)} ${db.config.currency} (VAT Included).\nSerial DOC: ${inv.sl_doc_no || 'N/A'}\nThank you for your business!`
    );
    window.open(`https://wa.me/${inv.customer_phone?.replace(/\D/g, '') || ''}?text=${text}`, '_blank');
  };

  const handleCreateNewQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomer.trim()) return;

    SoundEngine.click();
    db.createQuotation({
      customer_name: quoteCustomer.trim(),
      customer_phone: quotePhone.trim(),
      items: quoteItems.map((it, idx) => ({
        id: idx + 1,
        name: it.name,
        price: Number(it.price) || 10,
        cost: (Number(it.price) || 10) * 0.82,
        qty: Number(it.qty) || 1,
        warranty: it.warranty
      }))
    });

    setIsNewQuoteOpen(false);
    setQuoteCustomer('');
    alert('New official quotation created successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            Invoices &amp; Official Quotations Hub
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Multi-Printed Sizes (A4, A5, 80mm, 58mm) • Oman Tax Authority Compliant QR Codes &amp; Barcodes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create B2B Quotation</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              SoundEngine.click();
              setActiveTab('invoices');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'invoices' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tax Invoices ({db.invoices.length})
          </button>
          <button
            onClick={() => {
              SoundEngine.click();
              setActiveTab('quotations');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'quotations' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quotations ({db.quotations.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Invoice No, SL DOC NO, or Customer..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Invoices Tab Table */}
      {activeTab === 'invoices' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">SL DOC NO</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Subtotal</th>
                  <th className="pb-3 text-right">Oman VAT (5%)</th>
                  <th className="pb-3 text-right">Grand Total</th>
                  <th className="pb-3 text-right">Print &amp; Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-emerald-400">{inv.invoice_no}</td>
                    <td className="py-3 text-slate-400 text-[10px]">{inv.sl_doc_no || 'SL-DOC-00001'}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{inv.date}</td>
                    <td className="py-3 font-sans font-medium text-slate-200">{inv.customer}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {inv.payment}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-300 font-mono">{inv.subtotal.toFixed(3)}</td>
                    <td className="py-3 text-right text-slate-400 font-mono">{inv.vat.toFixed(3)}</td>
                    <td className="py-3 text-right font-bold text-white font-mono">
                      {inv.grand_total.toFixed(3)} {db.config.currency}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPrint(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print</span>
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(inv)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-emerald-950 text-emerald-400 border border-slate-700 transition"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quotations Tab Table */}
      {activeTab === 'quotations' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">Quotation No</th>
                  <th className="pb-3">SL DOC NO</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Valid Until</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Grand Total</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQuotations.map(quote => (
                  <tr key={quote.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-teal-400">{quote.quote_no}</td>
                    <td className="py-3 text-slate-400 text-[10px]">{quote.sl_doc_no || 'SL-QT-0001'}</td>
                    <td className="py-3 font-sans font-medium text-slate-200">{quote.customer_name}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{quote.date}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{quote.valid_until}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        quote.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        quote.status === 'Approved' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-white font-mono">
                      {quote.grand_total.toFixed(3)} {db.config.currency}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenQuotePrint(quote)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {quote.status !== 'Converted' && (
                          <button
                            onClick={() => handleConvertQuote(quote.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Convert to Tax Invoice</span>
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
      )}

      {/* Printable Modal (Supports A4, A5, 80mm, 58mm) */}
      {isPreviewOpen && (selectedInvoice || selectedQuotation) && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">
                  {selectedInvoice ? `TAX INVOICE: ${selectedInvoice.invoice_no}` : `OFFICIAL QUOTATION: ${selectedQuotation?.quote_no}`}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Size Selection Bar */}
            <div className="flex flex-wrap items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800 gap-2">
              <span className="text-xs font-bold text-slate-300 ml-2">Print Layout Template:</span>
              <div className="flex gap-1.5">
                {(['A4', 'A5', '80mm', '58mm'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setPrintSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      printSize === size ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size === 'A4' ? 'A4 Full Tax' : size === 'A5' ? 'A5 Half' : size === '80mm' ? '80mm POS' : '58mm Mini'}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Rendering Body */}
            <div className={`mx-auto bg-white text-slate-900 p-6 rounded-2xl shadow-inner font-mono ${
              printSize === '80mm' ? 'max-w-[340px] text-xs' :
              printSize === '58mm' ? 'max-w-[260px] text-[10px]' :
              'max-w-2xl text-xs'
            }`}>
              {/* Header */}
              <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                <h2 className="font-black text-base uppercase tracking-tight text-slate-900">{db.config.business_name}</h2>
                <p className="text-[11px] text-slate-600">{db.config.legal_name}</p>
                <p className="text-[10px]">CR: {db.config.cr_no} • Tax VAT: {db.config.tax_no}</p>
                <p className="text-[9px] text-slate-500">{db.config.address} • Tel: {db.config.phone}</p>
                <div className="inline-block mt-1 px-3 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  {selectedInvoice ? `OFFICIAL TAX INVOICE (${printSize})` : `OFFICIAL B2B QUOTATION (${printSize})`}
                </div>
              </div>

              {/* Document Details */}
              <div className="py-2.5 text-[11px] border-b border-slate-200 flex justify-between">
                <div>
                  <p><strong>Doc Number:</strong> {selectedInvoice?.invoice_no || selectedQuotation?.quote_no}</p>
                  <p><strong>SL DOC NO:</strong> {selectedInvoice?.sl_doc_no || selectedQuotation?.sl_doc_no}</p>
                  <p><strong>Customer:</strong> {selectedInvoice?.customer || selectedQuotation?.customer_name}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {selectedInvoice?.date || selectedQuotation?.date}</p>
                  <p><strong>Branch:</strong> Main Branch - Mabellah</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-3 border-b border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="pb-1">Item Description</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                      <th className="pb-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedInvoice?.items || selectedQuotation?.items || []).map((it, i) => (
                      <tr key={i}>
                        <td className="py-1">
                          {it.name}
                          {it.imei && <div className="text-[9px] text-slate-500 font-mono">IMEI: {it.imei}</div>}
                        </td>
                        <td className="py-1 text-center">{it.qty}</td>
                        <td className="py-1 text-right">{it.price.toFixed(3)}</td>
                        <td className="py-1 text-right">{(it.price * it.qty).toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="py-2 space-y-1 text-right text-[11px]">
                <p>Subtotal: <strong>{(selectedInvoice?.subtotal || selectedQuotation?.subtotal || 0).toFixed(3)} OMR</strong></p>
                {((selectedInvoice?.discount || selectedQuotation?.discount || 0) > 0) && (
                  <p className="text-rose-600">Discount: -{(selectedInvoice?.discount || selectedQuotation?.discount || 0).toFixed(3)} OMR</p>
                )}
                <p>Oman 5.000% VAT: <strong>{(selectedInvoice?.vat || selectedQuotation?.vat || 0).toFixed(3)} OMR</strong></p>
                <p className="text-sm font-black pt-1 border-t border-slate-300 text-slate-900">
                  Grand Total: {(selectedInvoice?.grand_total || selectedQuotation?.grand_total || 0).toFixed(3)} OMR
                </p>
              </div>

              {/* Barcode & QR code */}
              <div className="pt-3 border-t border-slate-200 flex flex-col items-center justify-center space-y-2">
                <div 
                  className="w-24 h-24"
                  dangerouslySetInnerHTML={{ 
                    __html: generateQrCodeSvg(
                      selectedInvoice?.qrCodeData || selectedInvoice?.invoice_no || selectedQuotation?.quote_no || 'RST',
                      100
                    ) 
                  }}
                />
                <div 
                  className="w-48 h-12"
                  dangerouslySetInnerHTML={{ 
                    __html: generateBarcodeSvg(selectedInvoice?.invoice_no || selectedQuotation?.quote_no || 'RST', 200, 45) 
                  }}
                />
                <p className="text-[9px] text-slate-500 text-center font-sans">
                  Sultanate of Oman Tax Authority Certified Electronic Document
                </p>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document ({printSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New B2B Quotation Modal */}
      {isNewQuoteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Generate B2B Wholesale Quotation</h3>
              <button onClick={() => setIsNewQuoteOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNewQuotation} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Customer / Company Name</label>
                <input
                  type="text"
                  required
                  value={quoteCustomer}
                  onChange={(e) => setQuoteCustomer(e.target.value)}
                  placeholder="e.g. Al-Madina Telecom LLC"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={quotePhone}
                  onChange={(e) => setQuotePhone(e.target.value)}
                  placeholder="+968"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Quotation Item</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={quoteItems[0].name}
                    onChange={(e) => setQuoteItems([{ ...quoteItems[0], name: e.target.value }])}
                    className="col-span-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.001"
                    value={quoteItems[0].price}
                    onChange={(e) => setQuoteItems([{ ...quoteItems[0], price: Number(e.target.value) }])}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewQuoteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
