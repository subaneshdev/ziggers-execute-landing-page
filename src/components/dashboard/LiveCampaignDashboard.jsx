"use client";
import React, { useState, useEffect } from 'react';
import { 
  Activity, MapPin, Users, CheckCircle, Clock, AlertTriangle, 
  RefreshCw, TrendingUp, DollarSign, Camera, FileText, ChevronRight,
  ShieldCheck, Sparkles, Zap, Smartphone, CheckCircle2, Award
} from 'lucide-react';

export default function LiveCampaignDashboard({ campaigns = [] }) {
  const [pulse, setPulse] = useState(true);
  const [selectedHub, setSelectedHub] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => setPulse(prev => !prev), 2000);
    return () => clearInterval(timer);
  }, []);

  // Primary active campaign state
  const activeCampaign = campaigns.find(c => c.status === true || c.stage === 'Live') || {
    name: 'Chennai Store Opening & Sampling',
    brand: 'Artisan Cafe & Bakery',
    objective: 'Store opening',
    city: 'Chennai (OMR Corridor)',
    budget: '₹25,000',
    spent: '₹18,400',
    deployedWorkers: 17,
    totalWorkers: 20,
    estimatedInteractions: 8420,
    completedInteractions: 6214,
    leadsCaptured: 342,
    photosUploaded: 428,
    completionPercentage: 92,
    status: 'LIVE'
  };

  // Real-time location nodes for the campaign
  const locationNodes = [
    { id: 'omr-hub-1', name: 'OMR Tidel Park Junction', targetWorkers: 8, presentWorkers: 8, completedInteractions: 2840, targetInteractions: 3500, leads: 164, photos: 192, status: '🟢 On Track' },
    { id: 'omr-hub-2', name: 'Sholinganallur Signal Plaza', targetWorkers: 7, presentWorkers: 6, completedInteractions: 2150, targetInteractions: 3000, leads: 118, photos: 146, status: '🟢 On Track' },
    { id: 'omr-hub-3', name: 'Perungudi Tech Zone', targetWorkers: 5, presentWorkers: 3, completedInteractions: 1224, targetInteractions: 1920, leads: 60, photos: 90, status: '🟡 Attention Needed' },
  ];

  return (
    <div className="bg-white text-espresso border border-espresso/15 rounded-3xl shadow-sm p-6 space-y-6 font-sans">
      
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
            Brand: <strong className="text-white">{activeCampaign.brand || 'Artisan Cafe'}</strong> • Target Area: <strong className="text-gold">{activeCampaign.city || 'OMR IT Corridor, Chennai'}</strong>
          </span>
        </div>

        {/* 1-Click Refresh & Live Stream Status */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-linen/60 uppercase font-bold block">Campaign Completion</span>
            <span className="text-lg font-extrabold text-green-400">92% Completed</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-gold shadow-inner">
            <Activity size={22} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* The 6 Core Offline Advertising Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {/* 1. Spend */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Budget Spent</span>
          <div className="text-base md:text-lg font-black text-espresso">₹18,400</div>
          <span className="text-[9px] text-muted block">of ₹25,000 Escrow</span>
        </div>

        {/* 2. Ziggers Deployed */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Staff Deployed</span>
          <div className="text-base md:text-lg font-black text-gold">17 / 20</div>
          <span className="text-[9px] text-green-700 font-bold block">100% GPS Verified</span>
        </div>

        {/* 3. Estimated Interactions */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Est. Interactions</span>
          <div className="text-base md:text-lg font-black text-espresso">8,420</div>
          <span className="text-[9px] text-muted block">Target Quota</span>
        </div>

        {/* 4. Completed Interactions */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Completed</span>
          <div className="text-base md:text-lg font-black text-green-700">6,214</div>
          <span className="text-[9px] text-green-700 font-bold block">73.8% Paced</span>
        </div>

        {/* 5. Leads Captured */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Field Leads</span>
          <div className="text-base md:text-lg font-black text-gold">342</div>
          <span className="text-[9px] text-muted block">OTP Verified</span>
        </div>

        {/* 6. Photos Uploaded */}
        <div className="bg-linen/30 border border-espresso/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9px] text-muted uppercase font-bold tracking-wider block">Photos Uploaded</span>
          <div className="text-base md:text-lg font-black text-espresso">428</div>
          <span className="text-[9px] text-green-700 font-bold block">GPS Watermarked</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-linen/25 border border-espresso/10 p-5 rounded-2xl space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted">Live Campaign Execution Pace:</span>
          <span className="text-espresso font-mono"><strong>6,214</strong> / 8,420 Completed (92% shift duration)</span>
        </div>
        <div className="w-full h-3 bg-espresso/10 rounded-full overflow-hidden border border-espresso/10 flex">
          <div className="bg-gold h-full transition-all duration-500" style={{ width: '73.8%' }}></div>
          <div className="bg-green-600 h-full transition-all duration-500" style={{ width: '18.2%' }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-muted font-mono">
          <span>Shift Window: 10:00 AM – 06:00 PM</span>
          <span className="text-green-700 font-bold">Remaining Shift: 48 Mins</span>
        </div>
      </div>

      {/* Live Geofenced Hubs Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gold" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-espresso">
              Target Nodes & Geofences Breakdown
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted">
            3 Active Geofenced Clusters
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-espresso/10 shadow-2xs">
          <table className="w-full text-left text-xs bg-white">
            <thead className="bg-linen/30 border-b border-espresso/10 text-[10px] uppercase font-bold text-muted">
              <tr>
                <th className="p-3.5">Geofence Node</th>
                <th className="p-3.5">Staff Present</th>
                <th className="p-3.5">Interactions Completed</th>
                <th className="p-3.5">Leads Captured</th>
                <th className="p-3.5">Photo Proofs</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/5 font-mono">
              {locationNodes.map((node) => (
                <tr key={node.id} className="hover:bg-linen/20 transition-colors">
                  <td className="p-3.5 font-sans">
                    <strong className="text-espresso block">{node.name}</strong>
                    <span className="text-[10px] text-muted font-mono">50m GPS Geofence Check-in</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-espresso font-bold">{node.presentWorkers} / {node.targetWorkers}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-green-700 font-bold">{node.completedInteractions}</span>
                    <span className="text-muted text-[10px]"> / {node.targetInteractions}</span>
                  </td>
                  <td className="p-3.5 text-gold font-bold">
                    {node.leads}
                  </td>
                  <td className="p-3.5 text-espresso">
                    {node.photos}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-linen border border-espresso/10 text-espresso">
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
