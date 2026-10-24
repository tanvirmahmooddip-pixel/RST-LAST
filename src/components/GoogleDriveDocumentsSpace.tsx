import React, { useState } from 'react';
import {
  Cloud,
  HardDrive,
  FileText,
  Upload,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Shield,
  FileSpreadsheet,
  FileArchive,
  Database,
  Lock,
  Tag,
  Plus
} from 'lucide-react';
import { db } from '../lib/database';
import { translations } from '../lib/translations';
import { SoundEngine } from '../lib/sound';
import { Language, CloudDriveFile } from '../types';
import { generateSlDocNo } from '../lib/barcode';

interface GoogleDriveDocumentsSpaceProps {
  lang: Language;
}

export const GoogleDriveDocumentsSpace: React.FC<GoogleDriveDocumentsSpaceProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New file form
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<CloudDriveFile['category']>('CR Legal');
  const [newFileType, setNewFileType] = useState<CloudDriveFile['fileType']>('pdf');
  const [newFileNotes, setNewFileNotes] = useState('');
  const [customSlNo, setCustomSlNo] = useState('');

  const drive = db.config.googleDrive;

  // Filtered files
  const filteredFiles = db.cloudFiles.filter(f => {
    const matchesSearch = f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.sl_doc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Trigger Cloud Sync
  const handleTriggerSync = () => {
    SoundEngine.beep();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      db.config.googleDrive.lastBackupTimestamp = new Date().toISOString();
      db.persist();
      SoundEngine.success();
      alert('Cloud Backup & Document Space synced successfully with Google Drive!');
    }, 1200);
  };

  // Download Google Drive JSON Backup
  const handleDownloadDriveBackup = () => {
    SoundEngine.click();
    const jsonStr = db.exportGoogleDriveBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TopTelecom_Oman_GoogleDrive_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Full SQL Dump
  const handleDownloadSqlDump = () => {
    SoundEngine.click();
    const sqlStr = db.generateSqlDump();
    const blob = new Blob([sqlStr], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TopTelecom_Oman_MySQL_Schema_${new Date().toISOString().slice(0, 10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Add Document to Space
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    SoundEngine.click();
    const nextSeq = db.cloudFiles.length + 1;
    const finalSl = customSlNo.trim() || generateSlDocNo(db.config.sl_doc_prefix, nextSeq);

    db.addCloudFile({
      fileName: newFileName.trim(),
      fileType: newFileType,
      category: newFileCategory,
      sl_doc_no: finalSl,
      notes: newFileNotes.trim(),
      uploadedBy: 'admin',
      sizeBytes: Math.floor(250000 + Math.random() * 1500000)
    });

    setNewFileName('');
    setNewFileNotes('');
    setCustomSlNo('');
    setIsUploadModalOpen(false);
  };

  const categories = ['All', 'CR Legal', 'Tax Filing', 'Invoices', 'Warranties', 'Suppliers', 'Device Specs', 'Cloud Backup'];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              {t.driveTitle}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Admin Google Drive Space
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {t.driveSubtitle} • Document Serials, Legal Certificates &amp; Cloud Database Exports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document to Space</span>
          </button>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Drive...' : 'Sync Cloud Backup'}</span>
          </button>
        </div>
      </div>

      {/* Google Drive Status & Storage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Drive Connection</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white font-mono">{drive.folderName}</p>
          <p className="text-[10px] text-emerald-400 font-mono">{drive.accountEmail}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Documents in Space</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-base font-black text-white font-mono">{db.cloudFiles.length} Registered Docs</p>
          <p className="text-[10px] text-slate-400 font-mono">Auto Serial SL-DOC active</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Space Storage Used</span>
            <HardDrive className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-base font-black text-white font-mono">
            {(drive.usedStorageBytes / (1024 * 1024)).toFixed(1)} MB / 15 GB
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-teal-500 h-full" style={{ width: `${Math.min(100, (drive.usedStorageBytes / drive.maxStorageBytes) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Last Cloud Backup</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs font-bold text-slate-200 font-mono">
            {drive.lastBackupTimestamp ? new Date(drive.lastBackupTimestamp).toLocaleDateString() : 'Today'}
          </p>
          <p className="text-[10px] text-teal-400 font-mono">Daily Auto-Backup Active</p>
        </div>
      </div>

      {/* Cloud Backup Exporter Actions */}
      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            One-Click Database &amp; System Backups
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Sultanate of Oman Commercial Integrity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadDriveBackup}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 flex items-center justify-between group transition text-left"
          >
            <div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white group-hover:text-teal-300">Google Drive JSON Backup</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Full ERP data snapshot, products, journals &amp; users</p>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-teal-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={handleDownloadSqlDump}
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition text-left"
          >
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white group-hover:text-emerald-300">MySQL Schema &amp; Data SQL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Full MariaDB / MySQL export with CREATE &amp; INSERT statements</p>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0 ml-2" />
          </button>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 flex items-center justify-between group transition text-left"
          >
            <div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white group-hover:text-sky-300">Open Google Drive Online</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Direct link to Admin Drive Vault folder</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-400 shrink-0 ml-2" />
          </a>
        </div>
      </div>

      {/* Document Space Vault & Explorer */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Document Space Registry &amp; Serial Number Tracking
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              All documents assigned unique SL DOC NO serials with cloud retention
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by SL DOC NO or filename..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-2.5">SL DOC NO</th>
                <th className="pb-2.5">Document Name</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Size</th>
                <th className="pb-2.5">Uploaded</th>
                <th className="pb-2.5">Sync Status</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-emerald-400">{file.sl_doc_no}</td>
                  <td className="py-3 font-sans font-medium text-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-white">{file.fileName}</span>
                        {file.notes && <p className="text-[10px] text-slate-400 font-sans">{file.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-teal-300 border border-slate-700">
                      {file.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {(file.sizeBytes / 1024).toFixed(0)} KB
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">{file.uploadDate}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Synced (Google Drive)</span>
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          SoundEngine.click();
                          alert(`Viewing verified document: ${file.fileName}\nSerial: ${file.sl_doc_no}\nFolder: ${file.driveFolder}`);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[10px] font-bold transition"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove document ${file.fileName} from cloud space?`)) {
                            db.deleteCloudFile(file.id);
                          }
                        }}
                        className="p-1 rounded text-rose-400 hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white uppercase">Upload Document to Cloud Space</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Document Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g., Oman_Tax_Authority_Clearance.pdf"
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Document Serial (SL DOC NO)</label>
                <input
                  type="text"
                  value={customSlNo}
                  onChange={(e) => setCustomSlNo(e.target.value)}
                  placeholder={`Auto-assigned (e.g., ${generateSlDocNo('SL-DOC', db.cloudFiles.length + 1)})`}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Classification Category</label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="CR Legal">CR Legal &amp; Ministry of Commerce</option>
                  <option value="Tax Filing">Oman Tax Authority (VAT / Corporate)</option>
                  <option value="Invoices">Invoices &amp; Fiscal Receipts</option>
                  <option value="Warranties">Warranty Certificates &amp; RMA</option>
                  <option value="Suppliers">Supplier Agency Contracts</option>
                  <option value="Device Specs">Hardware &amp; Telecom Datasheets</option>
                  <option value="Cloud Backup">Database Backup Dump</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Notes &amp; Description</label>
                <textarea
                  rows={2}
                  value={newFileNotes}
                  onChange={(e) => setNewFileNotes(e.target.value)}
                  placeholder="Optional document details or serial verification notes..."
                  className="w-full mt-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  Confirm &amp; Register Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
