import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Search,
  Plus,
  Cpu,
  Battery,
  Camera,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Tag,
  Filter
} from 'lucide-react';
import { db } from '../lib/database';
import { SoundEngine } from '../lib/sound';
import { translations } from '../lib/translations';
import { Language, User, PhoneBrand, PhoneDevice, CartItem } from '../types';

interface PhoneModelsCatalogProps {
  lang: Language;
  currentUser: User | null;
  onAddToCart: (item: CartItem) => void;
  onNavigate: (page: string) => void;
}

export const PhoneModelsCatalog: React.FC<PhoneModelsCatalogProps> = ({
  lang,
  currentUser,
  onAddToCart,
  onNavigate
}) => {
  const t = translations[lang] || translations.en;
  const [brands, setBrands] = useState<PhoneBrand[]>([]);
  const [devices, setDevices] = useState<PhoneDevice[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<PhoneDevice | null>(null);
  const [isCustomModelModalOpen, setIsCustomModelModalOpen] = useState(false);

  // Custom model fields
  const [customBrand, setCustomBrand] = useState('Apple');
  const [customName, setCustomName] = useState('');
  const [customStorage, setCustomStorage] = useState('256GB');
  const [customRam, setCustomRam] = useState('8GB RAM');
  const [customPrice, setCustomPrice] = useState(350.000);

  useEffect(() => {
    db.loadPhoneCatalog().then(catalog => {
      setBrands(catalog.brands);
      setDevices(catalog.devices);
    });
  }, []);

  const filteredDevices = devices.filter(d => {
    const matchesBrand = selectedBrand === 'All' || d.brand_name.toLowerCase() === selectedBrand.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.chipset && d.chipset.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesBrand && matchesSearch;
  });

  const handleImportToInventory = (device: PhoneDevice) => {
    SoundEngine.success();
    const prod = db.addPhoneToInventory(device);
    alert(`Successfully imported ${prod.name} into store inventory!\nAssigned EAN-13: ${prod.barcode}\nAssigned Luhn IMEI: ${prod.imei}`);
  };

  const handleCreateCustomPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    SoundEngine.click();
    const newDev: PhoneDevice = {
      id: Date.now(),
      brand_id: 1,
      brand_name: customBrand,
      name: customName.trim(),
      storage: customStorage,
      ram: customRam,
      priceEstimate: customPrice,
      released_at: new Date().toISOString().slice(0, 7),
      display: '6.7 inches AMOLED 120Hz',
      battery: '5000 mAh Li-Po',
      chipset: 'Octa-core 5G SoC'
    };

    setDevices([newDev, ...devices]);
    db.addPhoneToInventory(newDev, { price: customPrice });
    setIsCustomModelModalOpen(false);
    setCustomName('');
    alert(`Custom phone model added and imported to store stock!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Global Smartphone Specifications &amp; Catalog
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              10,633+ Models Database
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Global Brands • TechSpecs.io &amp; Phone-Specs-API Integration Hub • 1-Click Inventory &amp; IMEI Import
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'master_admin' || currentUser?.role === 'admin' ? (
            <button
              onClick={() => setIsCustomModelModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Model</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Brand Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => {
              SoundEngine.click();
              setSelectedBrand('All');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              selectedBrand === 'All' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            All Brands ({devices.length})
          </button>
          {brands.map(b => (
            <button
              key={b.id}
              onClick={() => {
                SoundEngine.click();
                setSelectedBrand(b.name);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedBrand === b.name ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search device name, chipset, storage..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDevices.map(dev => (
          <div
            key={dev.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-4 flex flex-col justify-between hover:border-indigo-500/50 transition group shadow-sm"
          >
            <div>
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950 mb-3 relative flex items-center justify-center p-2">
                <img
                  src={dev.picture || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80'}
                  alt={dev.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-900/90 text-indigo-400 border border-slate-700">
                  {dev.brand_name}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono bg-slate-900/90 text-slate-300 border border-slate-700">
                  {dev.released_at}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition line-clamp-1">
                {dev.brand_name} {dev.name}
              </h3>

              <div className="mt-2 space-y-1 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{dev.chipset || '5G Octa-Core Processor'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{dev.ram || '8GB RAM'} • {dev.storage || '256GB'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Battery className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{dev.battery || '5000 mAh Li-Ion'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-500 font-mono">Est. Price:</span>
                <p className="text-sm font-black text-white font-mono">
                  {(dev.priceEstimate || 180.000).toFixed(3)} {db.config.currency}
                </p>
              </div>

              <button
                onClick={() => handleImportToInventory(dev)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1"
                title="Import to stock with generated IMEI & EAN-13"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import Stock</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Model Modal */}
      {isCustomModelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Add Custom Mobile Phone Model</h3>
              <button onClick={() => setIsCustomModelModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCustomPhone} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
                <select
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Model Name</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Galaxy S25 Ultra 5G"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Storage</label>
                  <input
                    type="text"
                    value={customStorage}
                    onChange={(e) => setCustomStorage(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">RAM</label>
                  <input
                    type="text"
                    value={customRam}
                    onChange={(e) => setCustomRam(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Estimated Retail Price (OMR)</label>
                <input
                  type="number"
                  step="0.001"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModelModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Save Model &amp; Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
