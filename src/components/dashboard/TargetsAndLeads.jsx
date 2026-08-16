"use client";
import React, { useState } from 'react';
import { 
  Target, Users, FileSpreadsheet, Download, Plus, CheckCircle, 
  Sparkles, TrendingUp, QrCode, Phone, MapPin, Check, 
  BarChart3, UserCheck, ShieldCheck, Filter
} from 'lucide-react';

export default function TargetsAndLeads({ campaigns = [], onLogAction }) {
  const [activeSubTab, setActiveSubTab] = useState('targets'); // 'targets' or 'leads'
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Targets State as required in Feature 12
  const [targets, setTargets] = useState([
    {
      id: 'tgt_1',
      kpiName: 'Customer Interactions',
      target: 10000,
      achieved: 7842,
      unit: 'Interactions',
      icon: '🗣️',
      color: 'bg-blue-500'
    },
    {
      id: 'tgt_2',
      kpiName: 'Cold Samples Distributed',
      target: 5000,
      achieved: 4210,
      unit: 'Cans / Units',
      icon: '🥤',
      color: 'bg-gold'
    },
    {
      id: 'tgt_3',
      kpiName: 'Contest QR Code Scans',
      target: 3000,
      achieved: 2680,
      unit: 'Scans',
      icon: '📱',
      color: 'bg-purple-500'
    },
    {
      id: 'tgt_4',
      kpiName: 'Verified Leads Captured',
      target: 1500,
      achieved: 1240,
      unit: 'Leads',
      icon: '📋',
      color: 'bg-green-500'
    },
    {
      id: 'tgt_5',
      kpiName: 'App Downloads / Onboarding',
      target: 1000,
      achieved: 810,
      unit: 'Installs',
      icon: '⚡',
      color: 'bg-amber-500'
    }
  ]);

  // Lead Collection State as required in Feature 13
  const [leads, setLeads] = useState([
    {
      id: 'lead_1',
      name: 'Aditya Swaminathan',
      phone: '+91 98401 99881',
      location: 'Loyola College Quadrangle',
      promoterName: 'Rohit Sharma',
      productInterest: 'Coca-Cola Zero Sugar (Regular Consumer)',
      consent: true,
      time: '10:45 AM',
      date: '2026-08-20',
      status: 'Verified SMS OTP'
    },
    {
      id: 'lead_2',
      name: 'Priyanka Sundar',
      phone: '+91 98402 88772',
      location: 'Loyola College Cafeteria',
      promoterName: 'Meera Nair',
      productInterest: 'Coca-Cola Zero Sugar (Subscription Trial)',
      consent: true,
      time: '11:12 AM',
      date: '2026-08-20',
      status: 'Verified SMS OTP'
    },
    {
      id: 'lead_3',
      name: 'Gautam Ramachandran',
      phone: '+91 98403 77663',
      location: 'MCC College, Tambaram',
      promoterName: 'Karthik Raja',
      productInterest: 'Youth College Campus Ambassador Program',
      consent: true,
      time: '11:30 AM',
      date: '2026-08-20',
      status: 'Verified SMS OTP'
    },
    {
      id: 'lead_4',
      name: 'Sneha Varadarajan',
      phone: '+91 98404 66554',
      location: 'Anna University, Guindy',
      promoterName: 'Divya Krishnan',
      productInterest: 'Diet Coke / Zero Sugar Bulk Supply',
      consent: true,
      time: '12:05 PM',
      date: '2026-08-20',
      status: 'Verified SMS OTP'
    }
  ]);

  // New Lead Form
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    location: 'Loyola College, Chennai',
    promoterName: 'Rohit Sharma',
    productInterest: 'Coca-Cola Zero Sugar (Trial Pack)',
    consent: true
  });

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    const createdLead = {
      id: 'lead_' + Date.now().toString(36),
      name: newLead.name,
      phone: newLead.phone,
      location: newLead.location,
      promoterName: newLead.promoterName,
      productInterest: newLead.productInterest,
      consent: newLead.consent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      status: 'Verified SMS OTP'
    };

    setLeads(prev => [createdLead, ...prev]);
    // Also bump targets
    setTargets(prev => prev.map(t => t.kpiName.includes('Leads') ? { ...t, achieved: t.achieved + 1 } : t));

    if (onLogAction) {
      onLogAction('LEAD_CAPTURED', `Captured verified customer lead for ${createdLead.name} (${createdLead.location}) via ${createdLead.promoterName}`);
    }

    setNewLead({
      name: '',
      phone: '',
      location: 'Loyola College, Chennai',
      promoterName: 'Rohit Sharma',
      productInterest: 'Coca-Cola Zero Sugar (Trial Pack)',
      consent: true
    });
    setIsAddLeadModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['Lead ID', 'Customer Name', 'Phone', 'Location', 'Promoter', 'Product Interest', 'Consent', 'Time', 'Status'];
    const rows = leads.map(l => [
      l.id, l.name, l.phone, l.location, l.promoterName, l.productInterest, l.consent ? 'YES' : 'NO', l.time, l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ziggers_Campaign_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onLogAction) {
      onLogAction('LEADS_EXPORTED', `Exported ${leads.length} verified campaign leads to CSV format.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Target className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Task Targets & Field Lead Collection
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Track quantitative campaign targets (interactions, samplings, QR scans) and manage field lead forms for FMCG, Auto, and Retail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('targets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'targets' ? 'bg-espresso text-white shadow-xs' : 'bg-linen/40 text-espresso hover:bg-linen/70'
            }`}
          >
            1. Target Quota Tracking
          </button>
          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'leads' ? 'bg-gold text-espresso font-extrabold shadow-xs' : 'bg-linen/40 text-espresso hover:bg-linen/70'
            }`}
          >
            2. Field Leads ({leads.length} Captured)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Target Quota Tracking */}
      {activeSubTab === 'targets' && (
        <div className="space-y-6">
          <div className="bg-espresso text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Campaign Target Velocity</span>
              <h3 className="text-lg font-extrabold mt-0.5">Coca-Cola College Activation</h3>
              <p className="text-xs text-white/70 mt-1">
                Real-time target progress submitted by on-ground promoters with GPS timestamp verification.
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-gold font-mono">
                {Math.round((targets.reduce((a, b) => a + b.achieved, 0) / targets.reduce((a, b) => a + b.target, 0)) * 100)}%
              </span>
              <span className="text-[10px] text-white/70 block">Overall Target Achievement</span>
            </div>
          </div>

          {/* Targets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {targets.map((tgt) => {
              const pct = Math.round((tgt.achieved / tgt.target) * 100);
              return (
                <div key={tgt.id} className="bg-white border border-espresso/10 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gold transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{tgt.icon}</span>
                      <span className="text-xs font-extrabold font-mono text-espresso bg-linen/30 px-2 py-0.5 rounded-lg">
                        {pct}% Achieved
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-espresso mt-3">{tgt.kpiName}</h4>
                    <span className="text-[10px] text-muted font-medium">{tgt.unit}</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold mb-1">
                      <span className="text-espresso">{tgt.achieved.toLocaleString('en-IN')}</span>
                      <span className="text-muted">Target: {tgt.target.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="w-full bg-linen/40 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gold h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Field Lead Capture & Database */}
      {activeSubTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">
                Captured Customer Leads Database
              </h3>
              <p className="text-xs text-muted">
                Collected by promoters on field with full customer consent and instant OTP verification.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="bg-espresso hover:bg-muted text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus size={13} className="text-gold" />
                <span>Simulate Field Lead Entry</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white border border-espresso/10 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/20">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Collection Location</th>
                    <th className="py-3 px-4">Captured By (Promoter)</th>
                    <th className="py-3 px-4">Product Interest</th>
                    <th className="py-3 px-4">Consent & Verification</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/10 font-medium">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-linen/10">
                      <td className="py-3.5 px-4 font-bold text-espresso">
                        {lead.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-espresso">
                        {lead.phone}
                      </td>
                      <td className="py-3.5 px-4 flex items-center gap-1 text-muted">
                        <MapPin size={11} className="text-gold" /> {lead.location}
                      </td>
                      <td className="py-3.5 px-4 text-espresso font-semibold">
                        {lead.promoterName}
                      </td>
                      <td className="py-3.5 px-4 text-espresso font-medium max-w-xs">
                        {lead.productInterest}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1 w-fit">
                          <CheckCircle size={10} /> {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-muted text-[10px]">
                        {lead.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Field Lead Entry Modal (Feature 13 form simulation) */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-espresso/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-espresso/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col justify-between">
            
            <div className="p-5 bg-espresso text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-gold" size={18} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">
                  Field Lead Capture Form
                </h3>
              </div>
              <button 
                onClick={() => setIsAddLeadModalOpen(false)} 
                className="text-white hover:text-gold text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-xs text-espresso">
              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Customer Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="+91 98400 11223"
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1">Location Node</label>
                  <select
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-2.5 py-2 text-xs"
                  >
                    <option value="Loyola College, Chennai">Loyola College</option>
                    <option value="MCC College, Tambaram">MCC College</option>
                    <option value="SRM University">SRM University</option>
                    <option value="Anna University">Anna University</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase block mb-1">Promoter Name</label>
                  <input
                    type="text"
                    value={newLead.promoterName}
                    onChange={(e) => setNewLead({ ...newLead, promoterName: e.target.value })}
                    className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase block mb-1">Product Interest</label>
                <input
                  type="text"
                  value={newLead.productInterest}
                  onChange={(e) => setNewLead({ ...newLead, productInterest: e.target.value })}
                  className="w-full bg-linen/30 border border-espresso/15 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 bg-linen/20 p-2.5 rounded-xl">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={newLead.consent}
                  onChange={(e) => setNewLead({ ...newLead, consent: e.target.checked })}
                  className="accent-gold cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="text-[10px] text-muted font-medium cursor-pointer">
                  Customer has consented to receive product updates and sample promotions via SMS/WhatsApp.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check size={14} />
                  <span>Submit Verified Lead</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
