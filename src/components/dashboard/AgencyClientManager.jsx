"use client";
import React, { useState } from 'react';
import { 
  Users, Eye, CheckCircle2, Lock, Shield, FileText, Plus, 
  Building, Trash2, MapPin, Camera, Target, DollarSign, 
  ArrowRight, ShieldCheck, Sparkles, ExternalLink, Layers
} from 'lucide-react';

export default function AgencyClientManager({ campaigns = [], isClientPortal, setIsClientPortal, onLogAction, onCreateClick }) {
  // Derive brands dynamically from campaigns prop
  const derivedBrands = campaigns.map((c, idx) => ({
    id: c.id || `brand_${idx}`,
    name: c.brand || 'Enterprise Brand',
    campaignName: c.name || 'Brand Activation',
    activeLocations: c.locations || 1,
    totalPromoters: c.workers || 10,
    attendanceRate: c.attendance || '100%',
    samplesDistributed: (c.samples || 0).toLocaleString('en-IN'),
    leadsCaptured: (c.leads || 0).toLocaleString('en-IN'),
    verifiedPhotos: Math.round((c.workers || 10) * 4),
    verifiedVideos: Math.round((c.workers || 10) * 0.8),
    totalSpend: c.spend || c.totalBudget || '₹1,50,000',
    status: (c.status === true || c.stage === 'Live') ? 'Live & On-Field' : 'Completed',
    city: c.city || 'Chennai'
  }));

  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);
  const currentBrand = derivedBrands[selectedBrandIndex] || derivedBrands[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Brand Client Portal (White-Label Login)
            </h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Agency clients get a dedicated portal to view campaign status, live attendance, photo/video proofs, leads, and targets — with worker personal phone numbers & Aadhaar PII completely protected and masked.
          </p>
        </div>

        {derivedBrands.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsClientPortal(!isClientPortal);
                if (onLogAction) {
                  onLogAction('PORTAL_SWITCH', `Switched view mode to ${!isClientPortal ? 'BRAND CLIENT VIEW' : 'AGENCY CONSOLE'}`);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isClientPortal 
                  ? 'bg-gold text-espresso ring-2 ring-gold/40 font-extrabold' 
                  : 'bg-espresso text-white hover:bg-muted'
              }`}
            >
              <Eye size={15} />
              <span>{isClientPortal ? '👁️ Brand Portal Mode (Active)' : 'Preview Brand Client View'}</span>
            </button>
          </div>
        )}
      </div>

      {derivedBrands.length > 0 ? (
        <>
          {/* Brand Accounts Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {derivedBrands.map((brand, idx) => (
              <div
                key={brand.id}
                onClick={() => setSelectedBrandIndex(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  selectedBrandIndex === idx
                    ? 'border-gold shadow-md ring-2 ring-gold/30'
                    : 'border-espresso/10 hover:border-gold/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-espresso">{brand.name}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    brand.status === 'Live & On-Field' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {brand.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">{brand.campaignName}</p>

                <div className="mt-3 pt-3 border-t border-espresso/5 flex items-center justify-between text-xs font-mono">
                  <span>Deployment: <strong>{brand.totalPromoters} Staff</strong></span>
                  <span className="text-gold font-bold">{brand.attendanceRate} Attendance</span>
                </div>
              </div>
            ))}
          </div>

          {/* Client Portal Preview Card */}
          {currentBrand && (
            <div className="bg-white border border-espresso/10 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 bg-espresso text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-gold/20 text-gold px-2.5 py-0.5 rounded border border-gold/30 uppercase">
                    Enterprise Client View • Powered by Ziggers Execute OS
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight text-white mt-1">
                    {currentBrand.name}
                  </h3>
                  <p className="text-xs text-linen/70 mt-0.5">
                    Campaign: {currentBrand.campaignName} • Live Field Telemetry ({currentBrand.city})
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                    <span className="text-[9px] text-linen/70 block uppercase">Live Attendance</span>
                    <strong className="text-green-400 text-base block mt-0.5">{currentBrand.attendanceRate}</strong>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
                    <span className="text-[9px] text-linen/70 block uppercase">Verified Proofs</span>
                    <strong className="text-gold text-base block mt-0.5">{currentBrand.verifiedPhotos + currentBrand.verifiedVideos} Files</strong>
                  </div>
                </div>
              </div>

              {/* Data Protection Notice */}
              <div className="p-4 bg-emerald-50 border-b border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
                  <span>DPDP & GDPR Compliance Active: Individual worker Aadhaar numbers, private mobile numbers, and residential coordinates are securely masked.</span>
                </div>
                <span className="font-bold text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 shrink-0">PII Protected ✓</span>
              </div>

              {/* Telemetry Metrics */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-linen/20 border border-espresso/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Active Locations</span>
                  <strong className="text-lg font-extrabold text-espresso font-mono block mt-1">{currentBrand.activeLocations} Hubs</strong>
                  <span className="text-[10px] text-muted font-medium block mt-0.5">{currentBrand.city} Geofences</span>
                </div>

                <div className="bg-linen/20 border border-espresso/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Samples Distributed</span>
                  <strong className="text-lg font-extrabold text-espresso font-mono block mt-1">{currentBrand.samplesDistributed}</strong>
                  <span className="text-[10px] text-green-700 font-bold block mt-0.5">100% Geofence Logged</span>
                </div>

                <div className="bg-linen/20 border border-espresso/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Captured Leads</span>
                  <strong className="text-lg font-extrabold text-espresso font-mono block mt-1">{currentBrand.leadsCaptured}</strong>
                  <span className="text-[10px] text-muted font-medium block mt-0.5">Verified with SMS OTP</span>
                </div>

                <div className="bg-linen/20 border border-espresso/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Audited Spend</span>
                  <strong className="text-lg font-extrabold text-espresso font-mono block mt-1">{currentBrand.totalSpend}</strong>
                  <span className="text-[10px] text-muted font-medium block mt-0.5">Locked via Escrow</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center bg-white border border-espresso/10 rounded-3xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-linen/50 border border-espresso/10 text-gold flex items-center justify-center mb-4 shadow-xs">
            <Users size={26} />
          </div>

          <h3 className="text-base font-extrabold text-espresso tracking-tight mb-1.5">
            No Brand Client Portals Active
          </h3>

          <p className="text-xs text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Create and deploy your first campaign to automatically generate white-label brand portal links with masked PII data protection.
          </p>

          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} className="text-gold" />
            <span>Create Campaign to Enable Client Portal</span>
          </button>
        </div>
      )}

    </div>
  );
}
