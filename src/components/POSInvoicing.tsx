import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Building,
  User,
  Percent,
  CheckCircle2,
  Printer,
  Sparkles,
  Phone,
  Camera,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { VoiceEngine } from '../lib/voice';
import { Language, CartItem, Invoice, PaymentMethod } from '../types';
import { generateBarcodeSvg, generateQrCodeSvg } from '../lib/barcode';

interface POSInvoicingProps {
  cart: CartItem[];
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onAddToCart: (item: CartItem) => void;
  lang: Language;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export const POSInvoicing: React.FC<POSInvoicingProps> = ({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  lang,
  onInvoiceCreated
}) => {
  const t = translations[lang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(1);
  const [customerName, setCustomerName] = useState('Walk-in Cash Customer');
  const [customerPhone, setCustomerPhone] = useState('+968');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [installFee, setInstallFee] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [bankSwiftNo, setBankSwiftNo] = useState('SWIFT-BML-01');
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [selectedPrintSize, setSelectedPrintSize] = useState<'A4' | 'A5' | '80mm' | '58mm'>('80mm');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Totals Calculation
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0) + installFee;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatRate = db.config.vatEnabled ? db.config.vatRate : 0;
  const vatAmount = taxableAmount * vatRate;
  const grandTotal = taxableAmount + vatAmount;

  // Handle Hardware Barcode / IMEI Scan
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const term = barcodeInput.trim().toLowerCase();
    // Search products by barcode, IMEI, SKU
    const foundProduct = db.products.find(p => 
      p.barcode?.toLowerCase() === term ||
      p.imei?.toLowerCase() === term ||
      p.imei2?.toLowerCase() === term ||
      p.sku?.toLowerCase() === term
    );

    if (foundProduct) {
      SoundEngine.scan();
      onAddToCart({
        id: foundProduct.id,
        name: foundProduct.name,
        sku: foundProduct.sku,
        price: foundProduct.price,
        cost: foundProduct.cost,
        qty: 1,
        isComponent: false,
        barcode: foundProduct.barcode,
        imei: foundProduct.imei,
        imei2: foundProduct.imei2,
        serial: foundProduct.serial,
        warranty: foundProduct.warranty
      });
      setBarcodeInput('');
      return;
    }

    // Search components
    const foundComp = db.components.find(c => 
      c.barcode?.toLowerCase() === term ||
      c.sku?.toLowerCase() === term
    );

    if (foundComp) {
      SoundEngine.scan();
      onAddToCart({
        id: foundComp.id,
        name: foundComp.name,
        sku: foundComp.sku,
        price: foundComp.price,
        cost: foundComp.cost,
        qty: 1,
        isComponent: true,
        barcode: foundComp.barcode
      });
      setBarcodeInput('');
      return;
    }

    SoundEngine.warning();
    alert(`Item not found for barcode / IMEI: ${barcodeInput}`);
    setBarcodeInput('');
  };

  // Filter products for quick search
  const filteredProducts = db.products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8);

  const handleSelectCustomer = (custId: number) => {
    setSelectedCustomerId(custId);
    const c = db.customers.find(cust => cust.id === custId);
    if (c) {
      setCustomerName(c.name);
      setCustomerPhone(c.phone);
    }
  };

  // Handle Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      SoundEngine.error();
      alert(t.cartEmpty);
      return;
    }

    SoundEngine.cash();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch {
      // Confetti fallback
    }

    const costTotal = cart.reduce((sum, it) => sum + (it.cost * it.qty), 0);
    const profit = Math.max(0, taxableAmount - costTotal);

    const invoice = db.createInvoice({
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: customerName,
      customer_phone: customerPhone,
      customer_id: selectedCustomerId,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      vat: vatAmount,
      vat_rate: vatRate,
      grand_total: grandTotal,
      paid: paymentMethod === 'Due' ? 0 : grandTotal,
      balance: paymentMethod === 'Due' ? grandTotal : 0,
      payment: paymentMethod,
      amountReceivedCash: paymentMethod === 'Cash' ? grandTotal : 0,
      amountReceivedBankSwift: paymentMethod === 'Card' ? grandTotal : 0,
      amountReceivedBankTransfer: paymentMethod === 'Bank' ? grandTotal : 0,
      amountCreditLedger: paymentMethod === 'Due' ? grandTotal : 0,
      bankSwiftMachineNo: paymentMethod === 'Card' ? bankSwiftNo : undefined,
      hasServiceInstallation: installFee > 0,
      serviceAdvancedPaid: advancePaid,
      serviceDueOnCompletion: Math.max(0, installFee - advancePaid),
      profit,
      branch: 'Main Branch - Mabellah Sanaya',
      operator: 'admin',
      status: paymentMethod === 'Due' ? 'Due' : 'Paid'
    });

    onInvoiceCreated(invoice);
    setCreatedInvoice(invoice);
    setIsPrintModalOpen(true);
    onClearCart();
    setDiscountAmount(0);
    setInstallFee(0);
    setAdvancePaid(0);

    // Voice announcement
    if (db.config.voiceControl.speechOutput) {
      VoiceEngine.speak(
        `Invoice ${invoice.invoice_no} completed. Total: ${invoice.grand_total.toFixed(3)} ${db.config.currency}`,
        lang === 'ar' ? 'ar-SA' : lang === 'bn' ? 'bn-BD' : 'en-US'
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 Columns: Product Scanner & Quick Catalog Explorer */}
      <div className="lg:col-span-7 space-y-4">
        {/* Hardware Barcode Scanner Auto-Submit Input */}
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-sm space-y-3">
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Scan className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan Barcode, IMEI or Serial (Press Enter)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5"
            >
              <span>Scan Item</span>
            </button>
          </form>

          {/* Search box for typing */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search smartphones, accessories, CCTV or parts..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
            />
          </div>
        </div>

        {/* Quick Product Grid */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">Quick Add to Cart</h3>
            <span className="text-[10px] text-slate-400 font-mono">{filteredProducts.length} Products Found</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                onClick={() => {
                  SoundEngine.beep();
                  onAddToCart({
                    id: prod.id,
                    name: prod.name,
                    sku: prod.sku,
                    price: prod.price,
                    cost: prod.cost,
                    qty: 1,
                    isComponent: false,
                    barcode: prod.barcode,
                    imei: prod.imei,
                    imei2: prod.imei2,
                    serial: prod.serial,
                    warranty: prod.warranty
                  });
                }}
                className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/60 cursor-pointer transition hover:scale-[1.02] flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase">{prod.brand}</span>
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-2 mt-0.5 group-hover:text-emerald-300">
                    {prod.name}
                  </h4>
                  {prod.imei && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-mono bg-slate-800 text-slate-400">
                      IMEI Active
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span className="text-xs font-bold font-mono text-white">
                    {prod.price.toFixed(3)} <span className="text-[9px] text-slate-400 font-normal">{db.config.currency}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Stock: {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 5 Columns: Billing Cart, Customer Select, Split Payment & Checkout */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">POS Cart ({cart.length} items)</h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Customer Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer / VIP Client</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleSelectCustomer(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {db.customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isVip ? '⭐ (VIP Client)' : ''} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Item Rows */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {cart.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-2xl">
                Cart is empty. Scan an item or select a product to begin checkout.
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {item.price.toFixed(3)} {db.config.currency} {item.imei ? `• IMEI: ${item.imei}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQty(idx, item.qty - 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold font-mono text-white w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(idx, item.qty + 1)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-950/40 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Additional Charges / Installation Fees */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase">Discount (OMR)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="0.000"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase">Service / Install Fee</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={installFee || ''}
                onChange={(e) => setInstallFee(Number(e.target.value))}
                placeholder="0.000"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Cash', 'Card', 'Bank', 'Due'] as PaymentMethod[]).map(pm => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition border ${
                    paymentMethod === pm
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'Card' && (
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-300">
              <span>SWIFT POS Machine:</span>
              <input
                type="text"
                value={bankSwiftNo}
                onChange={(e) => setBankSwiftNo(e.target.value)}
                className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-white"
              />
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(3)} {db.config.currency}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Discount:</span>
                <span>-{discountAmount.toFixed(3)} {db.config.currency}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Oman VAT (5.000%):</span>
              <span>{vatAmount.toFixed(3)} {db.config.currency}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
              <span className="text-emerald-400">Grand Total:</span>
              <span>{grandTotal.toFixed(3)} {db.config.currency}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-950/60 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECKOUT &amp; ISSUE TAX INVOICE</span>
          </button>
        </div>
      </div>

      {/* Invoice Multi-Print Size Modal */}
      {isPrintModalOpen && createdInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">TAX INVOICE ISSUED: {createdInvoice.invoice_no}</h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Size Selection Bar */}
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 ml-2">Select Print Template:</span>
              <div className="flex gap-1.5">
                {(['80mm', 'A4', 'A5', '58mm'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedPrintSize(size)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedPrintSize === size 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Printable Preview Container */}
            <div className={`mx-auto bg-white text-slate-900 p-6 rounded-2xl shadow-inner font-mono text-xs ${selectedPrintSize === '80mm' ? 'max-w-[340px]' : selectedPrintSize === '58mm' ? 'max-w-[260px] text-[10px]' : 'max-w-xl'}`}>
              <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                <h2 className="font-black text-sm uppercase">{db.config.business_name}</h2>
                <p className="text-[10px] text-slate-600">{db.config.legal_name}</p>
                <p className="text-[10px]">CR: {db.config.cr_no} • VAT: {db.config.tax_no}</p>
                <p className="text-[9px] text-slate-500">{db.config.address} • Tel: {db.config.phone}</p>
                <p className="font-bold text-[11px] mt-1 uppercase tracking-wider text-emerald-800">
                  TAX INVOICE ({selectedPrintSize})
                </p>
              </div>

              <div className="py-2.5 text-[11px] border-b border-slate-200 flex justify-between">
                <div>
                  <p><strong>Invoice No:</strong> {createdInvoice.invoice_no}</p>
                  <p><strong>SL DOC NO:</strong> {createdInvoice.sl_doc_no}</p>
                  <p><strong>Customer:</strong> {createdInvoice.customer}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {createdInvoice.date}</p>
                  <p><strong>Pay:</strong> {createdInvoice.payment}</p>
                </div>
              </div>

              <div className="py-3 border-b border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="pb-1">Item</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Price</th>
                      <th className="pb-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {createdInvoice.items.map((it, i) => (
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

              <div className="py-2 space-y-1 text-right text-[11px]">
                <p>Subtotal: <strong>{createdInvoice.subtotal.toFixed(3)} OMR</strong></p>
                {createdInvoice.discount > 0 && <p className="text-rose-600">Discount: -{createdInvoice.discount.toFixed(3)} OMR</p>}
                <p>Oman 5% VAT: <strong>{createdInvoice.vat.toFixed(3)} OMR</strong></p>
                <p className="text-sm font-black pt-1 border-t border-slate-300 text-slate-900">
                  Grand Total: {createdInvoice.grand_total.toFixed(3)} OMR
                </p>
              </div>

              {/* QR Code and Barcode */}
              <div className="pt-3 border-t border-slate-200 flex flex-col items-center justify-center space-y-2">
                <div 
                  className="w-24 h-24"
                  dangerouslySetInnerHTML={{ __html: generateQrCodeSvg(createdInvoice.qrCodeData || createdInvoice.invoice_no, 100) }}
                />
                <div 
                  className="w-48 h-12"
                  dangerouslySetInnerHTML={{ __html: generateBarcodeSvg(createdInvoice.invoice_no, 200, 45) }}
                />
                <p className="text-[9px] text-slate-500 text-center">
                  Sultanate of Oman Tax Authority Certified Electronic Invoice
                </p>
              </div>
            </div>

            {/* Print action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Send to Printer ({selectedPrintSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
