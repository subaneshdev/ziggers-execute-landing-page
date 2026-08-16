"use client";
import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, MapPin, 
  Upload, Filter, Eye, Camera, Video, Sparkles, User, 
  Search, Check, ChevronRight, AlertCircle, FileCheck
} from 'lucide-react';

export default function ProofCenter({ campaigns = [], onLogAction }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [previewItem, setPreviewItem] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Proof Upload Simulation State
  const [uploadForm, setUploadForm] = useState({
    workerName: 'Rohit Sharma',
    category: 'Product Distribution Proof',
    location: 'Loyola College, Chennai',
    campaign: 'Coca-Cola College Activation',
    gps: '13.0631° N, 80.2341° E',
    caption: 'Distributed 45 ice-cold Coca-Cola Zero cans to engineering students.'
  });

  const categories = [
    'All',
    'Check-in Selfie',
    'Location Photo',
    'Branding Setup Photo',
    'Crowd Photo',
    'Activity Photos',
    'Product Distribution Proof',
    'Booth Photo',
    'Check-out Photo',
    'Short Videos'
  ];

  // Evidence dataset with automatic metadata tags: Worker + Time + GPS + Campaign + Location
  const [proofs, setProofs] = useState([
    {
      id: 'prf_1',
      category: 'Check-in Selfie',
      workerName: 'Rohit Sharma',
      avatar: '👨🏽',
      time: '09:42:15 AM',
      date: '2026-08-20',
      gps: '13.0631° N, 80.2341° E',
      location: 'Loyola College Gate 1',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: 'image',
      icon: '🤳',
      caption: 'Checked in wearing red Coca-Cola polo and ID badge at main entrance.'
    },
    {
      id: 'prf_2',
      category: 'Branding Setup Photo',
      workerName: 'Kumar Swaminathan (Supervisor)',
      avatar: '👨🏽',
      time: '09:55:00 AM',
      date: '2026-08-20',
      gps: '13.0631° N, 80.2341° E',
      location: 'Loyola College Quadrangle',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: 'image',
      icon: '🎪',
      caption: 'Branded 8x6 backdrop standee, ice tubs, and sampling canopy fully erected.'
    },
    {
      id: 'prf_3',
      category: 'Product Distribution Proof',
      workerName: 'Meera Nair',
      avatar: '👩🏽',
      time: '11:15:30 AM',
      date: '2026-08-20',
      gps: '13.0631° N, 80.2341° E',
      location: 'Loyola College Cafeteria',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: 'image',
      icon: '🥤',
      caption: 'Direct sampling handoff to college sports team with QR lead capture.'
    },
    {
      id: 'prf_4',
      category: 'Crowd Photo',
      workerName: 'Karthik Raja',
      avatar: '👨🏽',
      time: '01:30:22 PM',
      date: '2026-08-20',
      gps: '12.9229° N, 80.1275° E',
      location: 'MCC College, Tambaram',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: 'image',
      icon: '👥',
      caption: 'High-density student queue at sampling counter during lunch recess.'
    },
    {
      id: 'prf_5',
      category: 'Short Videos',
      workerName: 'Divya Krishnan',
      avatar: '👩🏽',
      time: '02:45:10 PM',
      date: '2026-08-20',
      gps: '13.0102° N, 80.2354° E',
      location: 'Anna University, Guindy',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Pending Review',
      type: 'video',
      icon: '🎥',
      caption: '15-sec video showing lively student interaction and slogan quiz engagement.'
    },
    {
      id: 'prf_6',
      category: 'Check-out Photo',
      workerName: 'Pooja Sundaram',
      avatar: '👩🏽',
      time: '06:05:44 PM',
      date: '2026-08-20',
      gps: '12.9229° N, 80.1275° E',
      location: 'MCC College, Tambaram',
      campaign: 'Coca-Cola College Activation',
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: 'image',
      icon: '🏁',
      caption: 'Shift completion selfie with packed booth inventory and clean premises.'
    }
  ]);

  const filteredProofs = proofs.filter(p => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    return true;
  });

  const handleApprove = (id) => {
    setProofs(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    if (onLogAction) {
      const item = proofs.find(p => p.id === id);
      onLogAction('PROOF_APPROVED', `Audit officer approved ${item?.category} from ${item?.workerName} (${item?.location})`);
    }
  };

  const handleReject = (id) => {
    setProofs(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    if (onLogAction) {
      const item = proofs.find(p => p.id === id);
      onLogAction('PROOF_REJECTED', `Flagged quality review for ${item?.category} from ${item?.workerName}`);
    }
  };

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    const newProof = {
      id: 'prf_' + Date.now().toString(36),
      category: uploadForm.category,
      workerName: uploadForm.workerName,
      avatar: '👨🏽',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      gps: uploadForm.gps,
      location: uploadForm.location,
      campaign: uploadForm.campaign,
      brand: 'Coca-Cola India',
      status: 'Approved',
      type: uploadForm.category.includes('Video') ? 'video' : 'image',
      icon: uploadForm.category.includes('Video') ? '🎥' : '📸',
      caption: uploadForm.caption
    };

    setProofs(prev => [newProof, ...prev]);
    setIsUploadModalOpen(false);

    if (onLogAction) {
      onLogAction('PROOF_UPLOADED', `Worker ${newProof.workerName} uploaded ${newProof.category} with verified GPS at ${newProof.location}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Cryptographic Photo & Video Proof Center
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Every submission is cryptographically watermarked with Worker + Timestamp + GPS Coordinates + Campaign + Location.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Camera size={14} className="text-gold" />
            <span>Upload Test Field Proof</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-espresso text-white shadow-xs' 
                : 'bg-white border border-espresso/10 text-espresso hover:border-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Proof Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProofs.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-gold transition-all"
          >
            {/* Visual Media Card Preview with Watermark Stamp */}
            <div className="relative bg-[#0c0a09] text-white p-5 min-h-[190px] flex flex-col justify-between overflow-hidden">
              
              {/* Top Watermark Row */}
              <div className="flex justify-between items-start z-10">
                <span className="bg-white/20 backdrop-blur-md text-[9px] font-mono font-bold px-2 py-0.5 rounded text-white border border-white/20">
                  {item.icon} {item.category}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                  item.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  item.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Center Decorative Visual Placeholder */}
              <div className="my-auto text-center py-4">
                <div className="text-4xl opacity-80 mb-1">{item.icon}</div>
                <span className="text-[10px] text-white/60 font-mono">
                  [Verified {item.type === 'video' ? '1080p Video Stream' : 'High-Res Field Capture'}]
                </span>
              </div>

              {/* Bottom Cryptographic Stamp Watermark: Worker + Time + GPS + Campaign + Location */}
              <div className="bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-[9px] font-mono space-y-0.5 z-10">
                <div className="flex justify-between text-gold font-bold">
                  <span>👤 {item.workerName}</span>
                  <span>⏰ {item.time}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>📍 {item.location}</span>
                  <span>🌐 {item.gps}</span>
                </div>
                <div className="text-white/60 truncate">
                  🏷️ {item.campaign}
                </div>
              </div>
            </div>

            {/* Card Details & Audit Controls */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-espresso font-medium leading-relaxed line-clamp-2">
                "{item.caption}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-espresso/10 text-xs">
                <span className="text-[10px] text-muted font-mono">{item.date}</span>

                <div className="flex gap-1.5">
                  {item.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={11} /> Approve
                    </button>
                  )}
                  {item.status !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(item.id)}
                      className="bg-linen/40 hover:bg-red-50 hover:text-red-700 text-espresso font-bold px-2.5 py-1 rounded-lg text-[10px] border border-espresso/10 transition-colors cursor-pointer"
                    >
                      Flag
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Field Proof Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col justify-between">
            
            <div className="p-5 bg-espresso text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="text-gold" size={18} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  Submit Field Proof Simulation
                </h3>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="text-white hover:text-gold text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="p-6 space-y-4 text-xs text-espresso">
              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Proof Category *</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Promoter Name *</label>
                <input
                  type="text"
                  value={uploadForm.workerName}
                  onChange={(e) => setUploadForm({ ...uploadForm, workerName: e.target.value })}
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1">Location Node</label>
                  <input
                    type="text"
                    value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1">GPS Coordinates</label>
                  <input
                    type="text"
                    value={uploadForm.gps}
                    onChange={(e) => setUploadForm({ ...uploadForm, gps: e.target.value })}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Proof Caption / Notes</label>
                <textarea
                  rows={2}
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs"
                  placeholder="Describe the activity or milestone..."
                />
              </div>

              <div className="p-4 bg-linen/20 border border-dashed border-espresso/20 rounded-2xl flex flex-col items-center justify-center text-center">
                <Upload size={20} className="text-gold mb-1" />
                <span className="font-bold text-xs">Simulate Camera Snapshot / Video Upload</span>
                <span className="text-[10px] text-muted">Auto-attaches current timestamp and GPS coordinates</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:text-espresso"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check size={14} />
                  <span>Submit Verified Proof</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
