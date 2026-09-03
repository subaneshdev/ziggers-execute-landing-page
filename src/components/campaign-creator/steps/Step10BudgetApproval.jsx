"use client";
import React, { useState } from 'react';
import { 
  Wallet, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, 
  Loader2, AlertCircle, Check, Percent, FileText, CheckSquare, Clock 
} from 'lucide-react';
import { calculateGstBreakdown } from '@/lib/intelligence/index';

export default function Step10BudgetApproval({ 
  draft, 
  onUpdate, 
  onJumpToStep,
  isPublishing, 
  isSuccess, 
  createdCampaign, 
  onNavigateHome 
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    name = '',
    brand = 'Brand',
    objective = 'Product Sampling',
    btlFormat = '',
    activationPlan = null,
    budgetInr = 75000,
    promoterCount = 4,
    supervisorCount = 1,
    campaignDurationDays = 3,
    campaignDays = 3,
    locations = [],
    activationRequirements = []
  } = draft;

  const totalDays = campaignDurationDays || campaignDays || 3;
  const budgetNum = parseInt(String(budgetInr).replace(/[^0-9]/g, ''), 10) || 75000;
  const gst = calculateGstBreakdown(budgetNum, true);

  // Approximate cost buckets
  const workforceCost = Math.round(gst.netCampaignFund * 0.45);
  const vendorServicesCost = Math.round(gst.netCampaignFund * 0.30);
  const equipmentCost = Math.round(gst.netCampaignFund * 0.10);
  const logisticsCost = Math.round(gst.netCampaignFund * 0.05);
  const contingencyBuffer = Math.round(gst.netCampaignFund * 0.10);

  if (isSuccess) {
    return (
      <div className="py-12 bg-white border border-espresso/15 rounded-3xl p-8 text-center space-y-6 max-w-xl mx-auto shadow-sm font-sans animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border-2 border-green-200 shadow-inner">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider border border-green-200">
            Campaign Blueprint Launched Successfully
          </span>
          <h2 className="text-2xl font-black text-espresso tracking-tight font-serif">
            {name || 'Campaign Ready for Deployment'}
          </h2>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your campaign parameters, activation plan, and partner requirements are locked. You can now monitor live readiness and telemetry in your console.
          </p>
        </div>

        {/* Campaign Credentials Summary */}
        <div className="p-4 bg-linen/30 border border-espresso/10 rounded-2xl text-xs text-left font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-muted font-sans">Campaign ID:</span>
            <strong className="text-espresso">{createdCampaign?.id || 'camp_active'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted font-sans">Status:</span>
            <span className="font-bold text-green-700">DRAFT / READY TO FUND</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted font-sans">Activation:</span>
            <span className="text-espresso">{activationPlan?.activationName || btlFormat || 'Product Sampling'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted font-sans">Locations:</span>
            <span className="text-espresso">{locations.length || 1} Geofenced Hubs</span>
          </div>
        </div>

        {/* Next Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto bg-espresso hover:bg-muted text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Go to Campaign Console</span>
            <ArrowRight size={14} className="text-gold" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 10 • Budget Consolidation & Campaign Approval
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          How much will it cost & is everything ready?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Review the consolidated budget breakdown with 100% escrow protection, GST separation, and readiness checklist.
        </p>
      </div>

      {/* Budget Breakdown Table */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
          <strong className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
            <Wallet size={14} className="text-gold" />
            <span>Consolidated Campaign Budget Breakdown</span>
          </strong>
          <span className="text-[10px] font-mono text-muted">100% Escrow Protected</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-espresso/5">
            <span className="text-espresso font-medium">1. On-Ground Workforce & Supervision ({promoterCount} Promoters, {supervisorCount} Team Leader, {totalDays} Days)</span>
            <strong className="font-mono text-espresso">₹{workforceCost.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-espresso/5">
            <span className="text-espresso font-medium">2. Vendor & Partner Services (Fabrication, Printing, Creative, Media)</span>
            <strong className="font-mono text-espresso">₹{vendorServicesCost.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-espresso/5">
            <span className="text-espresso font-medium">3. Equipment, Audio & Canopy Rentals</span>
            <strong className="font-mono text-espresso">₹{equipmentCost.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-espresso/5">
            <span className="text-espresso font-medium">4. Logistics & Last-Mile Transportation</span>
            <strong className="font-mono text-espresso">₹{logisticsCost.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-1.5 border-b border-espresso/5">
            <span className="text-espresso font-medium">5. Instant Refundable Contingency / Escrow Buffer (10%)</span>
            <strong className="font-mono text-green-700">₹{contingencyBuffer.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-2 border-b border-espresso/10 bg-linen/20 px-3 rounded-xl">
            <span className="font-bold text-espresso">Net Campaign Fund (100% Dedicated to Deployment)</span>
            <strong className="font-mono font-black text-espresso">₹{gst.netCampaignFund.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-1.5 px-3">
            <span className="text-muted">Statutory GST (18% Exact Isolation • CGST 9% + SGST 9%)</span>
            <strong className="font-mono text-amber-800">₹{gst.totalGst.toLocaleString('en-IN')}</strong>
          </div>

          <div className="flex justify-between py-3 px-3 bg-espresso text-white rounded-2xl">
            <span className="font-black text-xs uppercase tracking-wider text-gold">Total Campaign Budget (GST Inclusive)</span>
            <strong className="font-mono font-black text-base text-white">₹{gst.grossPaid.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Campaign Readiness Score & Dependency Checklist */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-espresso uppercase tracking-wider">
              Campaign Readiness Score
            </span>
            <span className="text-[10px] font-mono font-bold text-green-800 bg-green-50 border border-green-300 px-2 py-0.5 rounded-md">
              82% Ready
            </span>
          </div>
          <span className="text-[10px] text-muted font-mono">Pre-Launch Checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-green-50/60 border border-green-200 rounded-xl flex items-center gap-2 text-green-900 font-medium">
            <Check size={14} className="text-green-600 shrink-0" />
            <span>Campaign Blueprint approved</span>
          </div>
          <div className="p-3 bg-green-50/60 border border-green-200 rounded-xl flex items-center gap-2 text-green-900 font-medium">
            <Check size={14} className="text-green-600 shrink-0" />
            <span>Locations confirmed ({locations.length || 1} Hubs)</span>
          </div>
          <div className="p-3 bg-green-50/60 border border-green-200 rounded-xl flex items-center gap-2 text-green-900 font-medium">
            <Check size={14} className="text-green-600 shrink-0" />
            <span>Workforce headcount & shifts assigned</span>
          </div>
          <div className="p-3 bg-green-50/60 border border-green-200 rounded-xl flex items-center gap-2 text-green-900 font-medium">
            <Check size={14} className="text-green-600 shrink-0" />
            <span>Brand assets & messaging received</span>
          </div>
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 font-medium">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span>Physical booth fabrication in progress</span>
          </div>
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 font-medium">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span>Promoter digital training pending launch</span>
          </div>
        </div>

        <p className="text-[11px] text-muted">
          Campaign will automatically transition to <strong>ACTIVE</strong> in your live console once critical setup dependencies are completed.
        </p>
      </div>

      {/* Confirmation Checkbox */}
      <div className="p-4 bg-linen/30 border border-espresso/15 rounded-2xl flex items-start gap-3">
        <input
          id="agreeTerms"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 accent-gold w-4 h-4 rounded cursor-pointer"
        />
        <label htmlFor="agreeTerms" className="text-xs text-espresso cursor-pointer leading-relaxed">
          I approve this campaign execution plan and understand that funds are held in transparent escrow with live biometric check-in verification, watermarked proof chain, and end-of-shift reconciliation.
        </label>
      </div>

    </div>
  );
}
