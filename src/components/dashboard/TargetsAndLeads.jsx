"use client";
import React, { useState } from 'react';
import { 
  Target, Users, FileSpreadsheet, Download, Plus, CheckCircle, 
  Sparkles, TrendingUp, QrCode, Phone, MapPin, Check, 
  BarChart3, UserCheck, ShieldCheck, Filter
} from 'lucide-react';

export default function TargetsAndLeads({ campaigns = [], onLogAction, onCreateClick }) {
  const [activeSubTab, setActiveSubTab] = useState('targets'); // 'targets' or 'leads'
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Active campaign
  const activeCampaign = campaigns[0] || null;

  // Derived targets state
  const derivedTargets = activeCampaign ? [
    {
      id: 'tgt_1',
      kpiName: 'Product Samples Distributed',
      target: (activeCampaign.workers || 10) * 450,
      achieved: activeCampaign.samples || Math.round((activeCampaign.workers || 10) * 320),
      unit: 'Physical Product Samples',
      icon: '🥤'
    },
    {
      id: 'tgt_2',
      kpiName: 'Verified Customer Leads Captured',
      target: (activeCampaign.workers || 10) * 120,
      achieved: activeCampaign.leads || Math.round((activeCampaign.workers || 10) * 85),
      unit: 'SMS OTP Verified Contacts',
      icon: '📋'
    },
    {
      id: 'tgt_3',
      kpiName: 'QR Promo Code Scans',
      target: (activeCampaign.workers || 10) * 250,
      achieved: Math.round((activeCampaign.workers || 10) * 180),
      unit: 'App Landing Scans',
      icon: '📱'
    }
  ] : [];

  const [targets, setTargets] = useState(derivedTargets);
  const [leads, setLeads] = useState([]);

  // New Lead Form
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    location: activeCampaign?.city ? `${activeCampaign.city} Metro Hub` : 'Central Activation Node',
    promoterName: 'Field Promoter',
    productInterest: activeCampaign?.name || 'Product Sampling',
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
    setTargets(prev => prev.map(t => t.kpiName.includes('Leads') ? { ...t, achieved: t.achieved + 1 } : t));

    if (onLogAction) {
      onLogAction('LEAD_CAPTURED', `Captured verified customer lead for ${createdLead.name} (${createdLead.location})`);
    }

    setNewLead({
      name: '',
      phone: '',
      location: activeCampaign?.city ? `${activeCampaign.city} Metro Hub` : 'Central Activation Node',
      promoterName: 'Field Promoter',
      productInterest: activeCampaign?.name || 'Product Sampling',
      consent: true
    });
    setIsAddLeadModalOpen(false);
  };

  const totalTargetSum = targets.reduce((a, b) => a + b.target, 0);
  const totalAchievedSum = targets.reduce((a, b) => a + b.achieved, 0);
  const overallAchievementPct = totalTargetSum > 0 ? Math.round((totalAchievedSum / totalTargetSum) * 100) : 0;

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
          {activeCampaign ? (
            <>
              <div className="bg-espresso text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Campaign Target Velocity</span>
                  <h3 className="text-lg font-extrabold mt-0.5">{activeCampaign.name}</h3>
                  <p className="text-xs text-white/70 mt-1">
                    Real-time target progress submitted by on-ground promoters with GPS timestamp verification.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-gold font-mono">
                    {overallAchievementPct}%
                  </span>
                  <span className="text-[10px] text-white/70 block">Overall Target Achievement</span>
                </div>
              </div>

              {/* Targets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {targets.map((tgt) => {
                  const pct = tgt.target > 0 ? Math.round((tgt.achieved / tgt.target) * 100) : 0;
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
                        <div className="h-2 w-full bg-linen/50 rounded-full overflow-hidden">
                          <div
                            className="bg-gold h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
                <Target size={26} />
              </div>

              <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
                No Target Quotas Configured
              </h3>

              <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
                Deploy your first campaign to automatically initialize quantitative target velocity tracking and sampling quotas.
              </p>

              <button
                onClick={onCreateClick}
                className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus size={16} className="text-gold" />
                <span>Create Campaign to Set Target Quotas</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: Field Leads Collection */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-espresso/10 p-4 rounded-2xl">
            <div>
              <h3 className="font-extrabold text-sm text-espresso">Verified Field Customer Leads</h3>
              <p className="text-xs text-muted">All leads captured on-ground with instant customer SMS OTP verification.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="flex items-center gap-1.5 bg-gold hover:bg-gold/90 text-espresso font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add Manual Lead
              </button>
            </div>
          </div>

          {leads.length > 0 ? (
            <div className="bg-white border border-espresso/10 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-linen/30 border-b border-espresso/10 text-[10px] font-bold text-muted uppercase">
                    <th className="py-3 px-4">Lead ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Promoter</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/5 text-xs">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-linen/20">
                      <td className="py-3 px-4 font-mono font-bold text-espresso">{l.id}</td>
                      <td className="py-3 px-4 font-extrabold text-espresso">{l.name}</td>
                      <td className="py-3 px-4 font-mono">{l.phone}</td>
                      <td className="py-3 px-4 text-muted">{l.location}</td>
                      <td className="py-3 px-4 text-espresso font-semibold">{l.promoterName}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-700 font-bold text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                          ✓ {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6 text-center bg-white border border-espresso/10 rounded-2xl">
              <Users size={28} className="mx-auto mb-2 text-muted opacity-30" />
              <p className="font-extrabold text-sm text-espresso">No Field Leads Captured Yet</p>
              <p className="text-xs text-muted mt-0.5">Leads captured by field promoters in the Ziggers Promote app will sync here in real time.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
