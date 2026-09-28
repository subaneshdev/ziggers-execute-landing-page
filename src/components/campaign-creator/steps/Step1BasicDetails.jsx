"use client";
import React from 'react';
import { Target, Sparkles, Calendar, Wallet, Check, Layers } from 'lucide-react';

export const CAMPAIGN_OBJECTIVES = [
  { id: 'Brand Awareness', title: 'Brand Awareness', desc: 'Maximize high-visibility reach & footfall dwell time', icon: '📢' },
  { id: 'Product Launch', title: 'Product Launch', desc: 'Create launch buzz, unveiling events & first impressions', icon: '🚀' },
  { id: 'Product Sampling', title: 'Product Sampling', desc: 'Distribute physical product units & verify taste/trial', icon: '🥤' },
  { id: 'Product Trial', title: 'Product Trial', desc: 'Hands-on test rides, product demos & guided experience', icon: '🏍️' },
  { id: 'Lead Generation', title: 'Lead Generation', desc: 'Capture OTP-verified customer leads & consultations', icon: '📋' },
  { id: 'Customer Acquisition', title: 'Customer Acquisition', desc: 'Direct sign-ups, first orders & customer onboarding', icon: '🎯' },
  { id: 'Sales / Conversion', title: 'Sales / Conversion', desc: 'In-store promotions, vouchers & assisted retail sales', icon: '💳' },
  { id: 'App Downloads', title: 'App Downloads', desc: 'Drive guided mobile app installs & referral codes', icon: '📱' },
  { id: 'Store Visits', title: 'Store Visits', desc: 'Channel footfall into retail showrooms & outlet launches', icon: '🏬' },
  { id: 'Engagement', title: 'Engagement', desc: 'Gamification, spin-the-wheel, contests & UGC social moments', icon: '🎪' },
  { id: 'Market Research', title: 'Market Research', desc: 'Blind taste tests, surveys & structured feedback capture', icon: '📊' },
  { id: 'Feedback Collection', title: 'Feedback Collection', desc: 'Post-trial reviews, sentiment analysis & consumer insights', icon: '📝' },
  { id: 'Other', title: 'Other Custom Objective', desc: 'Define unique custom on-ground activation goals', icon: '✨' }
];

export default function Step1BasicDetails({ draft, onUpdate }) {
  const {
    name = '',
    brand = '',
    productOrService = '',
    objective = 'Product Sampling',
    selectedObjectives = ['Product Sampling'],
    campaignDurationDays = 3,
    estimatedBudget = 75000,
    customObjectiveText = ''
  } = draft;

  const toggleObjective = (objId) => {
    let next;
    if (selectedObjectives.includes(objId)) {
      next = selectedObjectives.filter(o => o !== objId);
      if (next.length === 0) next = [objId];
    } else {
      next = [...selectedObjectives, objId];
    }
    onUpdate({ 
      selectedObjectives: next,
      objective: next[0] || objId
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 1 • Basic Campaign Details
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          What do you want to achieve?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Provide initial details and choose your primary campaign objectives to drive activation planning.
        </p>
      </div>

      {/* Basic Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Campaign Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-bold text-espresso">
            Campaign Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g. Summer Brand Activation Drive, Metro Retail Launch"
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-3 text-xs text-espresso font-semibold focus:outline-none focus:border-gold placeholder:text-muted/50"
          />
        </div>

        {/* Brand / Business */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Brand / Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={brand}
            onChange={(e) => onUpdate({ brand: e.target.value })}
            placeholder="e.g. Nike, Starbucks, Zoho, Apple, Cult.fit"
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-3 text-xs text-espresso font-semibold focus:outline-none focus:border-gold placeholder:text-muted/50"
          />
        </div>

        {/* Product or Service */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Product or Service Being Promoted <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={productOrService}
            onChange={(e) => onUpdate({ productOrService: e.target.value })}
            placeholder="e.g. Running Shoes, Cold Brew Coffee, Cloud CRM Suite"
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-3 text-xs text-espresso font-semibold focus:outline-none focus:border-gold placeholder:text-muted/50"
          />
        </div>

        {/* Campaign Duration */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Default Campaign Duration (Days)
          </label>
          <input
            type="number"
            min={1}
            max={90}
            value={campaignDurationDays}
            onChange={(e) => onUpdate({ campaignDurationDays: Number(e.target.value) || 1, campaignDays: Number(e.target.value) || 1 })}
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-3 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
          />
        </div>

        {/* Estimated Budget (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Suggested Starting Budget (INR, Editable)
          </label>
          <input
            type="number"
            step={5000}
            value={estimatedBudget || ''}
            onChange={(e) => onUpdate({ estimatedBudget: Number(e.target.value) || 0, budgetInr: Number(e.target.value) || 0 })}
            placeholder="75000"
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-3 text-xs text-espresso font-semibold focus:outline-none focus:border-gold font-mono"
          />
        </div>

      </div>

      {/* Budget Insufficiency Warning Callout */}
      {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' && (
        <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-3 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
            ⚠️
          </div>
          <div className="space-y-1 flex-1 text-xs">
            <div className="flex items-center justify-between">
              <strong className="font-extrabold text-amber-950 uppercase font-mono tracking-wider">
                Status: BUDGET_INSUFFICIENT
              </strong>
              <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Deficit: {draft.forecast.capacity.budgetDeficitFormatted || 'Deficit detected'}
              </span>
            </div>
            <p className="text-amber-900 leading-relaxed font-semibold">
              {draft.forecast.capacity.staffingStrategy || `Budget Insufficient: Minimum required budget to activate 1 certified promoter for ${campaignDurationDays} days is ${draft.forecast.capacity.minimumRequiredBudgetFormatted}.`}
            </p>
            <p className="text-[11px] text-amber-800/80">
              Rather than forcing an unviable 1-promoter campaign that violates operational labor and supervision minimums, the engine recommends a realistic minimum viable budget calculated backward from statutory minimum wage, supervisor ratio, and statutory reserves.
            </p>
            {draft?.forecast?.capacity?.minimumRequiredBudget && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onUpdate({
                    budgetInr: draft.forecast.capacity.minimumRequiredBudget,
                    estimatedBudget: draft.forecast.capacity.minimumRequiredBudget
                  })}
                  className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-[11px] transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Apply Recommended Minimum Budget ({draft.forecast.capacity.minimumRequiredBudgetFormatted})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campaign Objectives (Select One or More) */}
      <div className="space-y-3 pt-2 border-t border-espresso/10">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-extrabold text-espresso uppercase tracking-wider">
            Campaign Objective <span className="text-muted font-normal lowercase">(select one or more)</span>
          </label>
          <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2 py-0.5 rounded-md">
            {selectedObjectives.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {CAMPAIGN_OBJECTIVES.map((obj) => {
            const isSelected = selectedObjectives.includes(obj.id);
            return (
              <div
                key={obj.id}
                onClick={() => toggleObjective(obj.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-xs ring-1 ring-gold/40'
                    : 'bg-white border-espresso/10 hover:border-espresso/30 text-espresso'
                }`}
              >
                <div className="text-xl shrink-0 mt-0.5">{obj.icon}</div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black block truncate">{obj.title}</strong>
                    {isSelected && <Check size={13} className="text-gold shrink-0" strokeWidth={3} />}
                  </div>
                  <p className={`text-[10px] leading-snug line-clamp-2 ${isSelected ? 'text-linen/70' : 'text-muted'}`}>
                    {obj.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {selectedObjectives.includes('Other') && (
          <div className="pt-2 animate-in fade-in duration-150">
            <input
              type="text"
              value={customObjectiveText}
              onChange={(e) => onUpdate({ customObjectiveText: e.target.value })}
              placeholder="Describe your custom campaign objective..."
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
          </div>
        )}
      </div>

    </div>
  );
}
