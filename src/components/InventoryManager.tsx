import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Barcode,
  Smartphone,
  Cpu,
  Trash2,
  Edit,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, User, Product, ElectronicComponent } from '../types';
import { generateEAN13, generateIMEI, generateSerial, generateBarcodeSvg } from '../lib/barcode';

interface InventoryManagerProps {
  lang: Language;
  currentUser?: User | null;
  onRefresh?: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  lang,
  currentUser,
  onRefresh
}) => {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState<'products' | 'components'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [cost, setCost] = useState(100.000);
  const [price, setPrice] = useState(130.000);
  const [stock, setStock] = useState(5);
  const [hasImei, setHasImei] = useState(true);
  const [condition, setCondition] = useState<'New' | 'Used' | 'Refurbished'>('New');

  const canSeeCost = currentUser?.permissions?.canViewCostPrice && !currentUser?.hiddenOptions?.hideCostPrice;

  const filteredProducts = db.products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.imei && p.imei.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredComponents = db.components.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    SoundEngine.click();
    const nextId = db.products.length ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
    const barcode = generateEAN13('890');
    const imei = hasImei ? generateIMEI('35') : undefined;
    const imei2 = hasImei ? generateIMEI('86') : undefined;

    const newProd: Product = {
      id: nextId,
      sku: `PRD-${brand.slice(0, 3).toUpperCase()}-${String(nextId).padStart(4, '0')}`,
      name: name.trim(),
      brand,
      category: 'Smartphones & Devices',
      cost: Number(cost),
      price: Number(price),
      stock: Number(stock),
      lowstock: 2,
      barcode,
      imei,
      imei2,
      serial: generateSerial('PRD'),
      condition,
      warranty: '1 Year Warranty',
      unit: 'pcs',
      active: true,
      hasImei,
      isComponent: false,
      is_deleted: false
    };

    db.products.unshift(newProd);
    db.logAudit(`Added new inventory product: ${newProd.name} (SKU: ${newProd.sku})`, 'product', newProd.id);
    db.persist();

    setIsAddModalOpen(false);
    setName('');
    if (onRefresh) onRefresh();
    alert(`Product ${newProd.name} created! Barcode: ${barcode} ${imei ? `IMEI: ${imei}` : ''}`);
  };

  const handleExportCsv = () => {
    SoundEngine.click();
    let csv = "SKU,Name,Brand,Cost,Price,Stock,Barcode,IMEI\n";
    db.products.forEach(p => {
      csv += `"${p.sku}","${p.name.replace(/"/g, '""')}","${p.brand}",${p.cost.toFixed(3)},${p.price.toFixed(3)},${p.stock},"${p.barcode}","${p.imei || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Inventory_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase">
            Inventory &amp; IMEI Warehouse Management
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time stock ledger, serial tracking, Luhn IMEI verification &amp; EAN-13 barcodes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              SoundEngine.click();
              setActiveTab('products');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'products' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Finished Products &amp; Phones ({db.products.length})
          </button>
          <button
            onClick={() => {
              SoundEngine.click();
              setActiveTab('components');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'components' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lab Components &amp; ICs ({db.components.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by SKU, IMEI, barcode, name..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm overflow-hidden">
        {activeTab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">Brand</th>
                  <th className="pb-3">Barcode (EAN-13)</th>
                  <th className="pb-3">IMEI 1 &amp; 2</th>
                  {canSeeCost && <th className="pb-3 text-right">Cost (OMR)</th>}
                  <th className="pb-3 text-right">Retail (OMR)</th>
                  <th className="pb-3 text-center">Stock</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-slate-400">{prod.sku}</td>
                    <td className="py-3 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{prod.name}</span>
                        {prod.condition && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                            {prod.condition}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 font-bold">{prod.brand}</td>
                    <td className="py-3 text-emerald-400 font-bold">{prod.barcode}</td>
                    <td className="py-3 text-[11px] text-slate-400">
                      {prod.imei ? (
                        <div>
                          <div>{prod.imei}</div>
                          {prod.imei2 && <div className="text-[10px] text-slate-500">{prod.imei2}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-600">N/A</span>
                      )}
                    </td>
                    {canSeeCost && (
                      <td className="py-3 text-right text-slate-400 font-mono">
                        {prod.cost.toFixed(3)}
                      </td>
                    )}
                    <td className="py-3 text-right font-bold text-white font-mono">
                      {prod.price.toFixed(3)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        prod.stock <= (prod.lowstock || 2) ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const newStock = prompt(`Update stock for ${prod.name}:`, String(prod.stock));
                            if (newStock !== null) {
                              prod.stock = Math.max(0, parseInt(newStock, 10) || 0);
                              db.persist();
                              if (onRefresh) onRefresh();
                            }
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition"
                        >
                          Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Component Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Package / Voltage</th>
                  {canSeeCost && <th className="pb-3 text-right">Cost (OMR)</th>}
                  <th className="pb-3 text-right">Price (OMR)</th>
                  <th className="pb-3 text-center">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredComponents.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-teal-400">{comp.sku}</td>
                    <td className="py-3 font-sans font-medium text-slate-200">{comp.name}</td>
                    <td className="py-3 text-slate-300">{comp.category}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{comp.packageType} • {comp.voltage}</td>
                    {canSeeCost && (
                      <td className="py-3 text-right text-slate-400 font-mono">
                        {comp.cost.toFixed(3)}
                      </td>
                    )}
                    <td className="py-3 text-right font-bold text-white font-mono">
                      {comp.price.toFixed(3)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        comp.stock <= comp.minStock ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {comp.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Add New Inventory Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24 Ultra 512GB"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple, Samsung, Anker"
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used / Pre-owned</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Cost (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Retail (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasImeiCheck"
                  checked={hasImei}
                  onChange={(e) => setHasImei(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="hasImeiCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Auto-generate 15-digit Luhn IMEI 1 &amp; IMEI 2 (Phone tracking)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Create &amp; Assign Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
