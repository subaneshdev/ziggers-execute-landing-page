"use client";
import React from 'react';
import { 
  Layers, CheckCircle2, Clock, ShieldCheck, UserCheck, 
  Building2, Sparkles, AlertCircle, ArrowRight, Target, MapPin, Users 
} from 'lucide-react';
import { FULFILLMENT_MODES } from '@/lib/ecosystem/btlTaxonomy';

export default function Step9ExecutionPlan({ draft, onJumpToStep }) {
  const {
    name = '',
    brand = 'Brand',
    objective = 'Product Sampling',
    btlFormat = '',
    activationPlan = null,
    audienceName = 'Target Audience',
    ageRange = [20, 35],
    locations = [],
    campaignDurationDays = 3,
    campaignDays = 3,
    promoterCount = 4,
    supervisorCount = 1,
    workforceDeploymentMode = 'ziggers',
    activationRequirements = []
  } = draft;

  const totalDays = draft.campaignDays || campaignDurationDays || campaignDays || 3;
  const targetCity = locations[0]?.city || 'Chennai';
  const startDate = draft.startDate || '2026-10-15';
  const endDate = draft.endDate || '2026-10-17';
  const dailyTime = `${draft.dailyStartTime || '16:00'}–${draft.dailyEndTime || '21:00'}`;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 9 • Campaign Execution Plan
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Unified Master Execution Plan
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Everything comes together into a transparent operational matrix showing owners, current status, deadlines, and dependencies.
        </p>
      </div>

      {/* Top Campaign Summary Card */}
      <div className="bg-espresso text-linen p-6 sm:p-7 rounded-3xl space-y-5 shadow-xl border border-gold/30">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-linen/15 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
              Execution Master Blueprint
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white font-serif mt-0.5">
              {name || `${brand} ${objective} Campaign`}
            </h3>
            <span className="text-xs text-linen/75 mt-1 block">
              Activation Strategy: <strong className="text-white">{activationPlan?.activationName || btlFormat || 'Product Sampling'}</strong>
            </span>
          </div>

          <div className="p-3 bg-linen/10 rounded-2xl text-left sm:text-right shrink-0 border border-linen/10">
            <span className="text-[9px] font-mono font-bold text-gold uppercase block">Timeline & Sizing</span>
            <strong className="text-xs sm:text-sm font-black text-white block mt-0.5">
              {totalDays} Days • {promoterCount} Promoters • {locations.length || 1} Hubs
            </strong>
            <span className="text-[10px] text-linen/70 block mt-0.5 font-mono">
              {startDate} to {endDate} ({dailyTime})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[9px] text-gold uppercase font-bold tracking-wider block">Target Audience:</span>
            <strong className="text-white block text-xs truncate">{audienceName} ({ageRange[0]}–{ageRange[1]} yrs)</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-gold uppercase font-bold tracking-wider block">City & Hubs:</span>
            <strong className="text-white block text-xs truncate">{targetCity} ({locations.length || 1} Locations)</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-gold uppercase font-bold tracking-wider block">Field Staffing:</span>
            <strong className="text-white block text-xs truncate">{promoterCount} Promoters, {supervisorCount} Team Leader</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-gold uppercase font-bold tracking-wider block">Telemetry:</span>
            <strong className="text-green-300 block text-xs truncate">GPS Geofenced Verification</strong>
          </div>
        </div>
      </div>

      {/* Structured Execution Component Matrix */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
              01
            </span>
            <strong className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} className="text-gold" />
              <span>Operational Component Matrix ({activationRequirements.length})</span>
            </strong>
          </div>
          <span className="text-[10px] font-mono text-muted">Owner • Status • Deadline • Dependency</span>
        </div>

        <div className="space-y-3.5">
          {activationRequirements.map((req, idx) => {
            const mode = req.fulfillmentMode || req.suggestedFulfillment || FULFILLMENT_MODES.CLIENT_HANDLES;

            let ownerBadge = 'Brand / Client Team';
            let ownerStyle = 'bg-linen/30 text-espresso border border-espresso/10';
            let statusText = 'Pending Material Delivery';
            let statusStyle = 'text-amber-700 bg-amber-50 border border-amber-200';
            let deadlineText = 'T-24 Hours before Shift';
            let dependencyText = 'Client In-House Production';

            if (mode === FULFILLMENT_MODES.ZIGGERS_EXECUTE) {
              ownerBadge = 'Ziggers Execute';
              ownerStyle = 'bg-espresso text-gold';
              statusText = 'Ready for Deployment';
              statusStyle = 'text-green-700 bg-green-50 border border-green-200';
              deadlineText = 'Continuous On-Ground';
              dependencyText = 'GPS Geofence & Check-in Sync';
            } else if (mode === FULFILLMENT_MODES.ZIGGERS_PARTNER) {
              ownerBadge = `Partner: ${req.attachedPartner?.partnerName || 'Ziggers Verified Network'}`;
              ownerStyle = 'bg-green-50 text-green-900 border border-green-300';
              statusText = 'Partner Briefed / Sourced';
              statusStyle = 'text-blue-700 bg-blue-50 border border-blue-200';
              deadlineText = 'T-48 Hours Pre-Setup';
              dependencyText = 'Artwork & Asset Approvals';
            } else if (mode === FULFILLMENT_MODES.EXISTING_VENDOR) {
              ownerBadge = `Vendor: ${req.attachedVendor?.vendorName || 'Existing Agency'}`;
              ownerStyle = 'bg-blue-50 text-blue-900 border border-blue-300';
              statusText = 'Contact Attached';
              statusStyle = 'text-purple-700 bg-purple-50 border border-purple-200';
              deadlineText = 'T-24 Hours Venue Drop';
              dependencyText = 'Venue Gate Pass NOC';
            } else if (mode === FULFILLMENT_MODES.NOT_REQUIRED) {
              ownerBadge = 'Not Required';
              ownerStyle = 'bg-muted/10 text-muted line-through';
              statusText = 'Excluded';
              statusStyle = 'text-muted bg-linen/20';
              deadlineText = '—';
              dependencyText = 'None';
            }

            return (
              <div
                key={req.id || idx}
                className="p-5 bg-linen/15 rounded-2xl border border-espresso/10 space-y-3 text-xs hover:border-espresso/25 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-muted uppercase block">
                      {req.reqCategory}
                    </span>
                    <strong className="text-xs font-bold text-espresso block font-serif">
                      {req.title}
                    </strong>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold shrink-0 self-start sm:self-auto ${ownerStyle}`}>
                    {ownerBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-espresso/10 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Status:</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${statusStyle}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Deadline:</span>
                    <span className="font-bold text-espresso">{deadlineText}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-muted">Dependency:</span>
                    <span className="font-bold text-espresso truncate">{dependencyText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
