"use client";
import React, { useState } from 'react';
import { 
  Users, Eye, CheckCircle2, Lock, Shield, FileText, Plus, 
  Building, Trash2, MapPin, Camera, Target, DollarSign, 
  ArrowRight, ShieldCheck, Sparkles, ExternalLink
} from 'lucide-react';

export default function AgencyClientManager({ campaigns = [], isClientPortal, setIsClientPortal, onLogAction }) {
  const [selectedBrand, setSelectedBrand] = useState('Coca-Cola India');

  // Client Brands Portfolio
  const brands = [
    {
      id: 'brand_1',
      name: 'Coca-Cola India',
      campaignName: 'Coca-Cola College Activation',
      activeLocations: 4,
      totalPromoters: 20,
      attendanceRate: '96.4%',
      samplesDistributed: '4,210',
      leadsCaptured: '1,240',
      verifiedPhotos: 128,
      verifiedVideos: 14,
      totalSpend: '₹1,82,900',
      status: 'Live & On-Field'
    },
    {
      id: 'brand_2',
      name: 'PepsiCo Beverages',
      campaignName: 'Pepsi Supermarket Mega Sampling',
      activeLocations: 6,
      totalPromoters: 30,
      attendanceRate: '98.0%',
      samplesDistributed: '6,850',
      leadsCaptured: '1,920',
      verifiedPhotos: 210,
      verifiedVideos: 25,
      totalSpend: '₹2,65,000',
      status: 'Completed'
    },
    {
      id: 'brand_3',
      name: 'Red Bull India',
      campaignName: 'Red Bull Youth Marathon Sampling',
      activeLocations: 3,
      totalPromoters: 25,
      attendanceRate: '100%',
      samplesDistributed: '5,500',
      leadsCaptured: '890',
      verifiedPhotos: 94,
      verifiedVideos: 12,
      totalSpend: '₹2,10,000',
      status: 'Live & On-Field'
    }
  ];

  const currentBrand = brands.find(b => b.name === selectedBrand) || brands[0];

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
            Agency clients (e.g. Pepsi, Coca-Cola) get a dedicated portal to view campaign status, live attendance, photo/video proofs, leads, and targets — with worker personal phone numbers & Aadhaar PII completely protected and masked.
          </p>
        </div>

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
      </div>

      {/* Brand Accounts Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => setSelectedBrand(brand.name)}
            className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
              selectedBrand === brand.name ? 'border-gold bg-linen/10 ring-2 ring-gold/40' : 'border-espresso/10 hover:border-espresso/30'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-espresso">{brand.name}</span>
                <span className="text-[9px] font-mono font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {brand.status}
                </span>
              </div>
              <p className="text-[10px] text-muted mt-1">{brand.campaignName}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-espresso/10 flex justify-between text-xs font-mono">
              <span className="text-muted">Deployment: <strong>{brand.totalPromoters} Staff</strong></span>
              <span className="text-gold font-bold">{brand.attendanceRate} Attendance</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feature 16: White-Label Brand Client View Container */}
      <div className="bg-white border border-espresso/10 rounded-3xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
        
        {/* Brand Portal Header Banner */}
        <div className="bg-[#0c0a09] text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gold text-espresso font-mono font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                Enterprise Client View
              </span>
              <span className="text-xs text-white/60 font-mono">Powered by Ziggers Execute OS</span>
            </div>
            <h3 className="text-2xl font-extrabold mt-1">{currentBrand.name}</h3>
            <span className="text-xs text-white/80 block mt-0.5">
              Campaign: {currentBrand.campaignName} • Live Field Telemetry
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block">Live Attendance</span>
              <span className="text-lg font-extrabold text-green-400">{currentBrand.attendanceRate}</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block">Verified Proofs</span>
              <span className="text-lg font-extrabold text-gold">{currentBrand.verifiedPhotos + currentBrand.verifiedVideos} Files</span>
            </div>
          </div>
        </div>

        {/* PII Privacy Shield Callout */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-green-900 font-bold">
            <ShieldCheck size={18} className="text-green-600 shrink-0" />
            <span>DPDP & GDPR Compliance Active: Individual worker Aadhaar numbers, private mobile numbers, and residential coordinates are securely masked.</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-green-200/60 text-green-900 px-2.5 py-1 rounded-full whitespace-nowrap">
            PII Protected ✅
          </span>
        </div>

        {/* Brand Executive KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-muted uppercase font-bold block">Active Locations</span>
            <span className="text-xl font-extrabold text-espresso mt-1 block">{currentBrand.activeLocations} Hubs</span>
            <span className="text-[10px] text-muted font-sans mt-0.5 block">Loyola, MCC, SRM, Anna Univ</span>
          </div>

          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-muted uppercase font-bold block">Samples Distributed</span>
            <span className="text-xl font-extrabold text-gold mt-1 block">{currentBrand.samplesDistributed}</span>
            <span className="text-[10px] text-muted font-sans mt-0.5 block">100% Geofence Logged</span>
          </div>

          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-muted uppercase font-bold block">Captured Leads</span>
            <span className="text-xl font-extrabold text-green-700 mt-1 block">{currentBrand.leadsCaptured}</span>
            <span className="text-[10px] text-muted font-sans mt-0.5 block">Verified with SMS OTP</span>
          </div>

          <div className="bg-linen/20 p-4 rounded-2xl border border-espresso/10">
            <span className="text-[10px] text-muted uppercase font-bold block">Audited Spend</span>
            <span className="text-xl font-extrabold text-espresso mt-1 block">{currentBrand.totalSpend}</span>
            <span className="text-[10px] text-muted font-sans mt-0.5 block">Locked via Escrow</span>
          </div>
        </div>

        {/* Client Multi-Location Summary Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
            Regional Activation Locations Overview
          </h4>

          <div className="overflow-x-auto border border-espresso/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-espresso/10 text-[10px] font-bold text-muted uppercase tracking-wider bg-linen/20">
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Staff Deployed</th>
                  <th className="py-3 px-4">Live Attendance</th>
                  <th className="py-3 px-4">Sampling Progress</th>
                  <th className="py-3 px-4">Audited Proof Media</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/10 font-medium">
                <tr className="hover:bg-linen/10">
                  <td className="py-3.5 px-4 font-bold text-espresso flex items-center gap-1.5">
                    <MapPin size={13} className="text-gold" /> Loyola College Quadrangle, Chennai
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-espresso">6 Promoters</td>
                  <td className="py-3.5 px-4 text-green-700 font-bold font-mono">100% (6/6 Present)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gold">1,420 Cans</td>
                  <td className="py-3.5 px-4 font-mono text-muted">38 Photos • 4 Videos</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      🟢 On Track
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-linen/10">
                  <td className="py-3.5 px-4 font-bold text-espresso flex items-center gap-1.5">
                    <MapPin size={13} className="text-gold" /> MCC College Campus, Tambaram
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-espresso">5 Promoters</td>
                  <td className="py-3.5 px-4 text-green-700 font-bold font-mono">100% (5/5 Present)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gold">1,150 Cans</td>
                  <td className="py-3.5 px-4 font-mono text-muted">32 Photos • 3 Videos</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      🟢 On Track
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-linen/10">
                  <td className="py-3.5 px-4 font-bold text-espresso flex items-center gap-1.5">
                    <MapPin size={13} className="text-gold" /> SRM University Campus Hub
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-espresso">5 Promoters</td>
                  <td className="py-3.5 px-4 text-green-700 font-bold font-mono">100% (5/5 Present)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gold">980 Cans</td>
                  <td className="py-3.5 px-4 font-mono text-muted">29 Photos • 4 Videos</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      🟢 On Track
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-linen/10">
                  <td className="py-3.5 px-4 font-bold text-espresso flex items-center gap-1.5">
                    <MapPin size={13} className="text-gold" /> Anna University Main Gate, Guindy
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-espresso">4 Promoters</td>
                  <td className="py-3.5 px-4 text-green-700 font-bold font-mono">100% (4/4 Present)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-gold">660 Cans</td>
                  <td className="py-3.5 px-4 font-mono text-muted">29 Photos • 3 Videos</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      🟢 On Track
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
