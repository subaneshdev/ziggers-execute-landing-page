"use client";
import React from 'react';
import { X, ShieldCheck, Database, Info, Layers, CheckCircle2, Clock } from 'lucide-react';

export default function DataProvenanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-espresso/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-espresso/15 rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-5 animate-in fade-in duration-150 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-gold" />
            <h3 className="text-sm font-black text-espresso tracking-tight">
              Forecast Provenance & Data Sources
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 rounded-lg text-muted hover:text-espresso hover:bg-linen/50 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sources Breakdown Table */}
        <div className="space-y-3 text-xs">
          <p className="text-muted leading-relaxed">
            All Ziggers campaign forecasts are computed by our unified intelligence engine using continuous demographic projections, geometric H3 cell overlaps, and discrete capacity constraints.
          </p>

          <div className="bg-linen/25 border border-espresso/10 rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex justify-between items-start pb-2 border-b border-espresso/10">
              <div>
                <strong className="text-espresso block font-sans">1. Spatial Population Base</strong>
                <span className="text-[10px] text-muted font-sans">Census 2011 + WorldPop high-res grids</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                OFFICIAL_CENSUS
              </span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-espresso/10">
              <div>
                <strong className="text-espresso block font-sans">2. 24h Commercial Footfall Curve</strong>
                <span className="text-[10px] text-muted font-sans">Time-of-day peak distribution engine</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                MODELLED_ESTIMATE
              </span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-espresso/10">
              <div>
                <strong className="text-espresso block font-sans">3. POI Vector Affinities</strong>
                <span className="text-[10px] text-muted font-sans">Retail, dining, transit & gym clusters</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                POI_SIGNALS
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <strong className="text-espresso block font-sans">4. Physical Pitch Capacity</strong>
                <span className="text-[10px] text-muted font-sans">Promoter speed and bottleneck optimizer</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                CAPACITY_LIMIT
              </span>
            </div>
          </div>

          <div className="p-3 bg-gold/10 border border-gold/30 rounded-xl text-[11px] text-espresso leading-relaxed">
            <strong className="block mb-0.5 font-bold">Uncertainty & Calibration Notice:</strong>
            Forecasts represent probabilistic 90% confidence bounds based on current venue density. Real-time telemetry is recorded on-ground to continually calibrate future predictions.
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
}
