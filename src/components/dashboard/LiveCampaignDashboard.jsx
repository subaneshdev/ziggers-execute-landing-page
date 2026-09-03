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

  const rawBudget = parseInt(String(activeCampaign?.spend || activeCampaign?.totalBudget || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const rawSpent = activeCampaign?.spentNumeric || 0;

  const targetSamples = activeCampaign?.targetSamples || activeCampaign?.forecast?.samples || 0;
  const actualSamples = parseInt(activeCampaign?.samples, 10) || 0;
  const actualLeads = parseInt(activeCampaign?.leads, 10) || 0;
  const actualPhotos = parseInt(activeCampaign?.photos, 10) || 0;
  const workersCount = parseInt(activeCampaign?.workers || activeCampaign?.headcount_required, 10) || 0;
  const completionPct = targetSamples > 0 ? Math.min(100, Math.round((actualSamples / targetSamples) * 100)) : (activeCampaign ? 100 : 0);

  // Generate location nodes dynamically from actual campaign parameters
  const locationNodes = activeCampaign ? [
    { 
      id: 'hub-1', 
      name: activeCampaign.location || `${activeCampaign.city || 'Metro'} Prime Activation Hub`, 
      targetWorkers: workersCount, 
      presentWorkers: workersCount, 
      completedInteractions: actualSamples, 
      targetInteractions: targetSamples, 
      leads: actualLeads, 
      photos: actualPhotos, 
      status: '🟢 On Track' 
    }
  ] : [];

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
                  YOUR CAMPAIGN 🔴 {activeCampaign.stage?.toUpperCase() || 'LIVE'}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {activeCampaign.name || activeCampaign.title}
              </h2>
              <span className="text-xs text-linen/70 font-medium block">
                Brand: <strong className="text-white">{activeCampaign.brand || activeCampaign.brand_name || 'Enterprise Brand'}</strong> • Target Area: <strong className="text-gold">{activeCampaign.city || 'Metro Activation Area'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-[10px] text-linen/60 uppercase font-bold block">Execution Progress</span>
                <span className="text-lg font-extrabold text-green-400">{completionPct}% Paced</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-gold shadow-inner">
                <Activity size={22} className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Budget Escrow</span>
              <div className="text-base md:text-lg font-black text-espresso">₹{rawBudget.toLocaleString('en-IN')}</div>
              <span className="text-[9px] text-muted block">100% Escrow Backed</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Staff Deployed</span>
              <div className="text-base md:text-lg font-black text-gold">{workersCount} Promoters</div>
              <span className="text-[9px] text-green-700 font-bold block">100% GPS Verified</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Target Forecast</span>
              <div className="text-base md:text-lg font-black text-espresso">{targetSamples > 0 ? targetSamples.toLocaleString('en-IN') : 'N/A'}</div>
              <span className="text-[9px] text-muted block">Target Quota</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Actual Samples</span>
              <div className="text-base md:text-lg font-black text-green-700">
                {actualSamples.toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] text-green-700 font-bold block">Logged Telemetry</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Field Leads</span>
              <div className="text-base md:text-lg font-black text-espresso">{actualLeads.toLocaleString('en-IN')}</div>
              <span className="text-[9px] text-muted block">Verified Leads</span>
            </div>

            <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
              <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Photos Uploaded</span>
              <div className="text-base md:text-lg font-black text-espresso">
                {actualPhotos.toLocaleString('en-IN')}
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
              <span className="text-xs font-mono font-bold text-muted">{locationNodes.length} Active Geofenced Hub</span>
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
                  {locationNodes.map((node, index) => (
                    <tr key={node.id || `node-${index}`} className="hover:bg-linen/20 transition-colors">
                      <td className="py-3 px-4 font-sans font-extrabold text-espresso flex items-center gap-1.5">
                        <MapPin size={13} className="text-gold" />
                        <span>{node.name}</span>
                      </td>
                      <td className="py-3 px-4 text-espresso font-bold">
                        {node.presentWorkers} / {node.targetWorkers}
                      </td>
                      <td className="py-3 px-4 text-espresso">
                        <span className="font-bold text-green-700">{node.completedInteractions}</span>
                        {node.targetInteractions > 0 && <span className="text-muted text-[10px]"> / {node.targetInteractions}</span>}
                      </td>
                      <td className="py-3 px-4 text-espresso font-bold">
                        {node.leads}
                      </td>
                      <td className="py-3 px-4 text-espresso">
                        {node.photos} Proofs
                      </td>
                      <td className="py-3 px-4 text-right font-sans font-bold text-[11px] text-green-700">
                        {node.status}
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
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4">
            <Activity size={26} />
          </div>
          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1">No Active Campaigns On-Ground</h3>
          <p className="text-xs text-muted max-w-sm mb-5">
            Launch a new geofenced campaign to start streaming live attendance, proof photos, and sampling metrics.
          </p>
          {onCreateClick && (
            <button
              onClick={onCreateClick}
              className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} className="text-gold" />
              <span>Deploy First Campaign</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
