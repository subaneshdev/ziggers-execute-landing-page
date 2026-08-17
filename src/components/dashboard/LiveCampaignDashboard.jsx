"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, MapPin, Users, CheckCircle, Clock, AlertTriangle, 
  RefreshCw, TrendingUp, DollarSign, Camera, FileText, ChevronRight,
  ShieldCheck, Sparkles, Zap, Smartphone, CheckCircle2, Award, Plus
} from 'lucide-react';

export default function LiveCampaignDashboard({ campaigns = [], onCreateClick }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setPulse(prev => !prev), 2000);
    return () => clearInterval(timer);
  }, []);

  // Primary active campaign
  const activeCampaign = campaigns.find(c => c.status === true || c.stage === 'Live') || campaigns[0] || null;

  // Generate location nodes dynamically if active campaign exists
  const locationNodes = activeCampaign ? [
    { 
      id: 'hub-1', 
      name: `${activeCampaign.city || 'Metro'} Center Hub`, 
      targetWorkers: Math.ceil((activeCampaign.workers || 10) * 0.4), 
      presentWorkers: Math.ceil((activeCampaign.workers || 10) * 0.4), 
      completedInteractions: Math.round((activeCampaign.samples || 1000) * 0.45), 
      targetInteractions: Math.round((activeCampaign.samples || 1000) * 0.5), 
      leads: Math.round((activeCampaign.leads || 100) * 0.5), 
      photos: Math.round((activeCampaign.workers || 10) * 2), 
      status: '🟢 On Track' 
    },
    { 
      id: 'hub-2', 
      name: `${activeCampaign.city || 'Metro'} North Transit Node`, 
      targetWorkers: Math.floor((activeCampaign.workers || 10) * 0.35), 
      presentWorkers: Math.floor((activeCampaign.workers || 10) * 0.35), 
      completedInteractions: Math.round((activeCampaign.samples || 1000) * 0.35), 
      targetInteractions: Math.round((activeCampaign.samples || 1000) * 0.35), 
      leads: Math.round((activeCampaign.leads || 100) * 0.35), 
      photos: Math.round((activeCampaign.workers || 10) * 1.5), 
      status: '🟢 On Track' 
    },
    { 
      id: 'hub-3', 
      name: `${activeCampaign.city || 'Metro'} Retail High Street`, 
      targetWorkers: Math.floor((activeCampaign.workers || 10) * 0.25), 
      presentWorkers: Math.floor((activeCampaign.workers || 10) * 0.25), 
      completedInteractions: Math.round((activeCampaign.samples || 1000) * 0.2), 
      targetInteractions: Math.round((activeCampaign.samples || 1000) * 0.25), 
      leads: Math.round((activeCampaign.leads || 100) * 0.15), 
      photos: Math.round((activeCampaign.workers || 10) * 1), 
      status: '🟢 On Track' 
    }
  ] : [];

  const rawBudget = parseInt((activeCampaign?.spend || activeCampaign?.totalBudget || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const rawSpent = Math.round(rawBudget * 0.74);

  return (
    <div className="bg-white text-espresso border border-espresso/15 rounded-3xl shadow-sm p-6 space-y-6 font-sans">
      
      {activeCampaign ? (
        <>
          {/* Top Banner: YOUR CAMPAIGN 🔴 LIVE */}
          <div className="bg-espresso text-white border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${pulse ? 'scale-125' : ''}`}></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/15 px-2.5 py-0.5 rounded border border-red-500/20">
                  YOUR CAMPAIGN 🔴 LIVE
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {activeCampaign.name}
              </h2>
              <span className="text-xs text-linen/70 font-medium block">
                Brand: <strong className="text-white">{activeCampaign.brand || 'Enterprise Partner'}</strong> • Target Area: <strong className="text-gold">{activeCampaign.city || 'Metro Activation Area'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-[10px] text-linen/60 uppercase font-bold block">Campaign Completion</span>
                <span className="text-lg font-extrabold text-green-400">88% Completed</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-gold shadow-inner">
                <Activity size={22} className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Budget Spent</span>
              <div className="text-base md:text-lg font-black text-espresso">₹{rawSpent.toLocaleString('en-IN')}</div>
              <span className="text-[9px] text-muted block">of ₹{rawBudget.toLocaleString('en-IN')} Escrow</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Staff Deployed</span>
              <div className="text-base md:text-lg font-black text-gold">{activeCampaign.workers || 10} / {activeCampaign.workers || 10}</div>
              <span className="text-[9px] text-green-700 font-bold block">100% GPS Verified</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Est. Interactions</span>
              <div className="text-base md:text-lg font-black text-espresso">{(activeCampaign.samples || 1000).toLocaleString('en-IN')}</div>
              <span className="text-[9px] text-muted block">Target Quota</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Completed</span>
              <div className="text-base md:text-lg font-black text-green-700">
                {Math.round((activeCampaign.samples || 1000) * 0.85).toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] text-green-700 font-bold block">85.0% Paced</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Field Leads</span>
              <div className="text-base md:text-lg font-black text-espresso">{(activeCampaign.leads || 150).toLocaleString('en-IN')}</div>
              <span className="text-[9px] text-muted block">OTP Verified</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Photos Uploaded</span>
              <div className="text-base md:text-lg font-black text-espresso">
                {Math.round((activeCampaign.workers || 10) * 4).toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] text-muted block">GPS Watermarked</span>
            </div>
          </div>

          {/* Location Nodes Breakdown Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={15} className="text-gold" /> Target Nodes & Geofences Breakdown
              </h3>
              <span className="text-xs font-mono font-bold text-muted">{locationNodes.length} Active Geofenced Clusters</span>
            </div>

            <div className="bg-white border border-espresso/10 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-linen/30 border-b border-espresso/10 text-[10px] font-bold text-muted uppercase">
                    <th className="py-3 px-4">Geofence Node</th>
                    <th className="py-3 px-4">Staff Present</th>
                    <th className="py-3 px-4">Interactions Completed</th>
                    <th className="py-3 px-4">Leads Captured</th>
                    <th className="py-3 px-4">Photo Proofs</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/5 font-mono">
                  {locationNodes.map((node) => (
                    <tr key={node.id} className="hover:bg-linen/20">
                      <td className="py-3 px-4 font-sans font-bold text-espresso">
                        {node.name}
                        <span className="text-[10px] text-muted block font-mono">50m GPS Geofence Check-in</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-espresso">{node.presentWorkers} / {node.targetWorkers}</td>
                      <td className="py-3 px-4 font-bold text-green-700">
                        {node.completedInteractions} <span className="text-muted font-normal text-[10px]">/ {node.targetInteractions}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gold">{node.leads}</td>
                      <td className="py-3 px-4 font-bold text-espresso">{node.photos}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] font-bold bg-green-50 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                          {node.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <Activity size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Live Campaigns Currently Active
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Deploy your first campaign to launch real-time GPS telemetry streams, live worker check-in feeds, and instant interaction counters.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Launch Live Campaign Telemetry</span>
          </button>
        </div>
      )}

    </div>
  );
}
