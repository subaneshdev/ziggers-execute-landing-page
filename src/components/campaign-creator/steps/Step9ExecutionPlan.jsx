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

  const totalDays = campaignDurationDays || campaignDays || 3;
  const targetCity = locations[0]?.city || 'Chennai';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 9 • Campaign Execution Plan
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          Unified Master Execution Plan
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Everything comes together into a transparent operational matrix showing owners, current status, deadlines, and dependencies.
        </p>
      </div>

      {/* Top Campaign Summary Card */}
      <div className="bg-espresso text-linen p-5 sm:p-6 rounded-3xl space-y-4 shadow-md border border-gold/30">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-linen/15 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
              Execution Master Blueprint
            </span>
            <h3 className="text-base sm:text-lg font-black text-white font-serif">
              {name || `${brand} ${objective} Campaign`}
            </h3>
            <span className="text-xs text-linen/75 mt-0.5 block">
              Activation: <strong className="text-white">{activationPlan?.activationName || btlFormat || 'Product Sampling'}</strong>
            </span>
          </div>

          <div className="p-2.5 bg-linen/10 rounded-xl text-left sm:text-right shrink-0">
            <span className="text-[9px] font-bold text-gold uppercase block">Timeline & Sizing</span>
            <strong className="text-xs font-black text-white">
              {totalDays} Days • {promoterCount} Promoters • {locations.length || 1} Hubs
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[9px] text-gold uppercase font-bold">Target Audience:</span>
            <strong className="text-white block text-[11px] truncate">{audienceName} ({ageRange[0]}–{ageRange[1]} yrs)</strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gold uppercase font-bold">City & Hubs:</span>
            <strong className="text-white block text-[11px] truncate">{targetCity} ({locations.length || 1} Locations)</strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gold uppercase font-bold">Field Staffing:</span>
            <strong className="text-white block text-[11px] truncate">{promoterCount} Promoters, {supervisorCount} Team Leader</strong>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-gold uppercase font-bold">Telemetry:</span>
            <strong className="text-green-300 block text-[11px] truncate">GPS Geofenced Verification</strong>
          </div>
        </div>
      </div>

      {/* Structured Execution Component Matrix */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <strong className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} className="text-gold" />
            <span>Operational Component Matrix ({activationRequirements.length})</span>
          </strong>
          <span className="text-[10px] font-mono text-muted">Owner • Status • Deadline • Dependency</span>
        </div>

        <div className="space-y-3">
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
                className="p-4 bg-linen/15 rounded-2xl border border-espresso/10 space-y-2.5 text-xs"
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
