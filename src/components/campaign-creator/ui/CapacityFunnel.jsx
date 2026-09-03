"use client";
import React from 'react';
import { ArrowDown, Users, Activity, Target } from 'lucide-react';

export default function CapacityFunnel({ footfall = 0, teamCapacity = 0, expectedInteractions = 0 }) {
  return (
    <div className="bg-linen/20 border border-espresso/10 rounded-2xl p-5 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Physical Interaction Capacity Funnel</span>
        <span className="text-[10px] text-muted font-mono">Bottleneck Constrained</span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono">
        {/* Tier 1: Total Footfall Opportunity */}
        <div className="w-full md:flex-1 bg-white border border-espresso/10 p-3 rounded-xl shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted uppercase">
            <Activity size={12} className="text-gold" />
            <span>Available Footfall</span>
          </div>
          <div className="text-base font-extrabold text-espresso">
            {footfall > 0 ? footfall.toLocaleString('en-IN') : 'N/A'}
          </div>
          <span className="text-[9px] text-muted block font-sans">Geofence Passersby</span>
        </div>

        <ArrowDown className="md:-rotate-90 text-gold shrink-0" size={16} />

        {/* Tier 2: Physical Team Capacity */}
        <div className="w-full md:flex-1 bg-white border border-espresso/10 p-3 rounded-xl shadow-2xs text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted uppercase">
            <Users size={12} className="text-gold" />
            <span>Team Max Capacity</span>
          </div>
          <div className="text-base font-extrabold text-espresso">
            {teamCapacity > 0 ? teamCapacity.toLocaleString('en-IN') : 'N/A'}
          </div>
          <span className="text-[9px] text-muted block font-sans">Promoter Pitch Limit</span>
        </div>

        <ArrowDown className="md:-rotate-90 text-gold shrink-0" size={16} />

        {/* Tier 3: Expected Realized Interactions */}
        <div className="w-full md:flex-1 bg-espresso text-white p-3 rounded-xl shadow-xs text-center space-y-1 border border-white/10">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-gold uppercase">
            <Target size={12} className="text-gold" />
            <span>Realized Forecast</span>
          </div>
          <div className="text-base font-black text-gold">
            {expectedInteractions > 0 ? expectedInteractions.toLocaleString('en-IN') : '0'}
          </div>
          <span className="text-[9px] text-linen/70 block font-sans">Expected Physical Interactions</span>
        </div>
      </div>
    </div>
  );
}
