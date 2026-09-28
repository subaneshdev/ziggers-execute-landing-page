"use client";
import React, { useState } from 'react';
import { 
  Target, Users, MapPin, Calendar, Wallet, ChevronDown, 
  ChevronUp, Sparkles, CheckCircle2, Compass, Layers, ShieldCheck, UserCheck 
} from 'lucide-react';

export default function CampaignSummaryPanel({ draft, onJumpToStep }) {
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(false);

  const {
    name,
    brand,
    productOrService,
    objective,
    selectedObjectives = [],
    audienceName,
    ageRange,
    gender,
    selectedInterests = [],
    locations = [],
    campaignDurationDays = 3,
    campaignDays = 3,
    shiftHours = 5,
    budgetInr,
    estimatedBudget,
    promoterCount = 4,
    supervisorCount = 1,
    activationPlan,
    btlFormat,
    activationRequirements = []
  } = draft;

  const totalDays = campaignDurationDays || campaignDays || 3;
  const rawBudget = budgetInr ?? estimatedBudget;
  const budgetVal = (rawBudget !== undefined && rawBudget !== null && rawBudget !== '')
    ? Number(rawBudget)
    : 75000;
  const formattedBudget = `₹${budgetVal.toLocaleString('en-IN')}`;

  return (
    <aside className="w-full lg:w-80 bg-white border border-espresso/15 rounded-3xl p-5 shadow-xs flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
          <div>
            <span className="text-[9px] font-mono font-bold text-muted uppercase tracking-wider block">Live Blueprint</span>
            <h3 className="text-sm font-extrabold text-espresso tracking-tight">Campaign Summary</h3>
          </div>
          <button 
            type="button"
            onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
            className="lg:hidden p-1 text-muted hover:text-espresso"
          >
            {isCollapsedMobile ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        <div className={`space-y-4 pt-4 text-xs ${isCollapsedMobile ? 'hidden lg:block' : 'block'}`}>
          
          {/* 1. Basic Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Target size={11} className="text-gold" /> 1. Brief & Objective
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(1)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="font-extrabold text-espresso text-xs truncate">
              {name || (brand ? `${brand} Campaign` : <span className="text-muted/60 font-normal italic">Name not set</span>)}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-linen/50 border border-espresso/10 text-[10px] font-bold text-espresso">
                {objective || selectedObjectives[0] || 'Product Sampling'}
              </span>
            </div>
          </div>

          {/* 2. Brand & Product */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={11} className="text-gold" /> 2. Brand & Product
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(2)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-[11px] text-espresso font-medium space-y-0.5">
              <div className="flex justify-between">
                <span className="text-muted">Brand:</span>
                <span className="font-bold">{brand || 'Not set'}</span>
              </div>
              {productOrService && (
                <div className="flex justify-between">
                  <span className="text-muted">Product:</span>
                  <span className="font-bold truncate max-w-[130px]">{productOrService}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Activation Idea */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Compass size={11} className="text-gold" /> 3. Activation Plan
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(3)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="text-[11px] font-bold text-espresso truncate">
              {activationPlan?.activationName || btlFormat || (objective ? `${objective} Activation` : 'Direct Brand Activation')}
            </p>
          </div>

          {/* 4. Audience */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Users size={11} className="text-gold" /> 4. Audience
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(4)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-[11px] text-espresso font-medium space-y-0.5">
              <div className="flex justify-between">
                <span className="text-muted">Demographics:</span>
                <span className="font-bold">
                  {ageRange ? `${ageRange[0]}–${ageRange[1]} yrs, ${gender || 'All'}` : '20–35 yrs, All'}
                </span>
              </div>
              {selectedInterests.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedInterests.slice(0, 2).map((item) => (
                    <span key={item} className="px-1.5 py-0.5 bg-linen/60 text-[9px] font-bold rounded text-espresso">
                      {item}
                    </span>
                  ))}
                  {selectedInterests.length > 2 && (
                    <span className="text-[9px] text-muted self-center">+{selectedInterests.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 5. Locations */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <MapPin size={11} className="text-gold" /> 5. Locations ({locations.length})
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(5)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            {locations.length > 0 ? (
              <div className="space-y-1">
                {locations.slice(0, 2).map((loc, idx) => (
                  <div key={loc.id || idx} className="p-1.5 bg-linen/30 border border-espresso/10 rounded-lg text-[11px]">
                    <div className="font-bold text-espresso truncate">{loc.name}</div>
                    <div className="text-[9px] text-muted">{loc.city || 'India'} • {loc.radiusText || '3 km'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted/60 italic">No locations selected</p>
            )}
          </div>

          {/* 6. Requirements & Partners */}
          {activationRequirements.length > 0 && (
            <div className="space-y-1 pt-3 border-t border-espresso/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                  <Layers size={11} className="text-gold" /> 6-7. Ecosystem
                </span>
                <button 
                  type="button" 
                  onClick={() => onJumpToStep(6)} 
                  className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <span className="text-[11px] text-espresso font-bold block">
                {activationRequirements.length} Categorized Components
              </span>
            </div>
          )}

          {/* 8. Workforce */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <UserCheck size={11} className="text-gold" /> 8. Workforce
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(8)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-[11px] text-espresso font-medium space-y-0.5">
              {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' ? (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[10px] space-y-0.5">
                  <div className="font-extrabold flex items-center gap-1 text-amber-950">
                    <span>⚠️ BUDGET_INSUFFICIENT</span>
                  </div>
                  <div>0 Promoters (Budget below minimum threshold)</div>
                  <div className="font-mono text-amber-800 font-bold">
                    Min Viable: {draft.forecast.capacity.minimumRequiredBudgetFormatted || '₹32,235'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted">Staffing:</span>
                    <span className="font-bold">{promoterCount} Promoters • {supervisorCount} Team Leader</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Execution:</span>
                    <span className="font-bold">{totalDays} Days ({shiftHours}h / shift)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 10. Budget */}
          <div className="space-y-1 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Wallet size={11} className="text-gold" /> 10. Budget
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(10)} 
                className="text-[10px] font-bold text-gold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-espresso">
              <span className="text-muted">Total Budget:</span>
              <span className="font-extrabold text-espresso font-mono">{formattedBudget}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Safety & Escrow Badge */}
      <div className="mt-6 pt-3 border-t border-espresso/10 text-[10px] text-muted flex items-center gap-1.5">
        <CheckCircle2 size={13} className="text-green-600 shrink-0" />
        <span>100% Escrow Protected & GST Separated</span>
      </div>
    </aside>
  );
}
