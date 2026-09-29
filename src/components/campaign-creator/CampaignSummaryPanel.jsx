"use client";
import React, { useState } from 'react';
import { 
  Target, Users, MapPin, Calendar, Clock, Globe, Wallet, ChevronDown, 
  ChevronUp, Sparkles, CheckCircle2, Compass, Layers, ShieldCheck, UserCheck 
} from 'lucide-react';
import { formatDateDisplay, formatTimeDisplay } from '@/lib/intelligence/schedule/scheduleEngine';

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
    startDate = '2026-10-15',
    endDate = '2026-10-17',
    dailyStartTime = '16:00',
    dailyEndTime = '21:00',
    timezone = 'Asia/Kolkata',
    campaignDurationDays = 3,
    campaignDays = 3,
    shiftHours = 5,
    schedule,
    budgetInr,
    estimatedBudget,
    promoterCount = 4,
    supervisorCount = 1,
    activationPlan,
    btlFormat,
    activationRequirements = []
  } = draft;

  const totalDays = schedule?.campaignDays || campaignDurationDays || campaignDays || 3;
  const currentShiftHours = schedule?.hoursPerDay || shiftHours || 5;
  const totalHours = schedule?.totalCampaignHours || (totalDays * currentShiftHours);
  const rawBudget = budgetInr ?? estimatedBudget;
  const budgetVal = (rawBudget !== undefined && rawBudget !== null && rawBudget !== '')
    ? Number(rawBudget)
    : 75000;
  const formattedBudget = `₹${budgetVal.toLocaleString('en-IN')}`;

  const scheduleDateRangeStr = schedule?.scheduleDisplay || (startDate && endDate ? `${formatDateDisplay(startDate)} – ${formatDateDisplay(endDate)}` : `${totalDays} Days`);
  const scheduleDailyTimingStr = schedule?.dailyTimingDisplay || (dailyStartTime && dailyEndTime ? `${formatTimeDisplay(dailyStartTime)} – ${formatTimeDisplay(dailyEndTime)} (${currentShiftHours}h / day)` : `${currentShiftHours}h / day`);

  return (
    <aside className="w-full lg:w-80 bg-white border border-espresso/15 rounded-3xl p-5 shadow-xs flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-espresso/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">Live Blueprint</span>
            <h3 className="text-sm font-extrabold text-espresso tracking-tight">Campaign Summary</h3>
          </div>
          <button 
            type="button"
            onClick={() => setIsCollapsedMobile(!isCollapsedMobile)}
            className="lg:hidden p-1.5 text-muted hover:text-espresso rounded-lg hover:bg-linen/30 transition-colors"
          >
            {isCollapsedMobile ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        <div className={`space-y-4 pt-4 text-xs ${isCollapsedMobile ? 'hidden lg:block' : 'block'}`}>
          
          {/* 1. Basic Details */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Target size={12} className="text-gold" /> 1. Brief & Objective
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(1)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="font-extrabold text-espresso text-xs truncate">
              {name || (brand ? `${brand} Campaign` : <span className="text-muted/60 font-normal italic">Name not set</span>)}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-linen/50 border border-espresso/10 text-[10px] font-bold text-espresso">
                {objective || selectedObjectives[0] || 'Product Sampling'}
              </span>
            </div>
          </div>

          {/* Schedule Summary Card */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} className="text-gold" /> Campaign Schedule
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(1)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="p-3 bg-linen/30 border border-espresso/10 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted text-[11px] shrink-0">Dates:</span>
                <span className="font-bold text-espresso font-mono text-right text-[11px] leading-tight">
                  {scheduleDateRangeStr}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-muted text-[11px] shrink-0">Daily timing:</span>
                <span className="font-bold text-espresso font-mono text-right text-[11px] leading-tight">
                  {scheduleDailyTimingStr}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted text-[11px]">Total activation:</span>
                <span className="font-bold text-gold font-mono text-[11px]">
                  {totalHours} hours ({totalDays}d × {currentShiftHours}h)
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted text-[11px]">Timezone:</span>
                <span className="font-bold text-espresso font-mono text-[11px]">{timezone || 'Asia/Kolkata'}</span>
              </div>
            </div>
          </div>

          {/* 2. Brand & Product */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-gold" /> 2. Brand & Product
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(2)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-xs text-espresso font-medium space-y-1">
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
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={12} className="text-gold" /> 3. Activation Plan
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(3)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <p className="text-xs font-bold text-espresso truncate">
              {activationPlan?.activationName || btlFormat || (objective ? `${objective} Activation` : 'Direct Brand Activation')}
            </p>
          </div>

          {/* 4. Audience */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Users size={12} className="text-gold" /> 4. Audience
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(4)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-xs text-espresso font-medium space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Demographics:</span>
                <span className="font-bold">
                  {ageRange ? `${ageRange[0]}–${ageRange[1]} yrs, ${gender || 'All'}` : '20–35 yrs, All'}
                </span>
              </div>
              {selectedInterests.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedInterests.slice(0, 3).map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-linen/60 text-[10px] font-bold rounded text-espresso">
                      {item}
                    </span>
                  ))}
                  {selectedInterests.length > 3 && (
                    <span className="text-[10px] text-muted self-center">+{selectedInterests.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 5. Locations */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={12} className="text-gold" /> 5. Locations ({locations.length})
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(5)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            {locations.length > 0 ? (
              <div className="space-y-1.5">
                {locations.slice(0, 2).map((loc, idx) => (
                  <div key={loc.id || idx} className="p-2 bg-linen/30 border border-espresso/10 rounded-xl text-xs">
                    <div className="font-bold text-espresso truncate">{loc.name}</div>
                    <div className="text-[10px] text-muted">{loc.city || 'India'} • {loc.radiusText || '3 km'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted/60 italic">No locations selected</p>
            )}
          </div>

          {/* 6. Requirements & Partners */}
          {activationRequirements.length > 0 && (
            <div className="space-y-1.5 pt-3 border-t border-espresso/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={12} className="text-gold" /> 6-7. Ecosystem
                </span>
                <button 
                  type="button" 
                  onClick={() => onJumpToStep(6)} 
                  className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <span className="text-xs text-espresso font-bold block">
                {activationRequirements.length} Categorized Components
              </span>
            </div>
          )}

          {/* 8. Workforce (Suggested promoters and Suggested supervisors) */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={12} className="text-gold" /> 8. Workforce
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(8)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="text-xs text-espresso font-medium space-y-1">
              {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                  <div className="font-extrabold flex items-center gap-1 text-amber-950">
                    <span>⚠️ BUDGET_INSUFFICIENT</span>
                  </div>
                  <div>0 Promoters (Budget below minimum threshold)</div>
                  <div className="font-mono text-amber-800 font-bold text-[11px]">
                    Min Viable: {draft.forecast.capacity.minimumRequiredBudgetFormatted || '₹32,235'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Suggested promoters:</span>
                    <span className="font-bold text-espresso">{promoterCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Suggested supervisors:</span>
                    <span className="font-bold text-espresso">{supervisorCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Execution:</span>
                    <span className="font-bold text-espresso">{totalDays} Days ({currentShiftHours}h / shift)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 10. Budget */}
          <div className="space-y-1.5 pt-3 border-t border-espresso/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Wallet size={12} className="text-gold" /> 10. Budget
              </span>
              <button 
                type="button" 
                onClick={() => onJumpToStep(10)} 
                className="text-xs font-bold text-gold hover:text-espresso hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Total Budget:</span>
              <span className="font-black text-espresso font-mono text-sm">{formattedBudget}</span>
            </div>
          </div>

          {/* Forecast Timing Notice */}
          <div className="p-3 bg-linen/40 border border-espresso/10 rounded-2xl text-[11px] text-muted space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-espresso">
              <Sparkles size={12} className="text-gold" />
              <span>Forecast Timing Notice</span>
            </div>
            <p className="leading-relaxed">
              Forecast calibrated for {totalDays} days ({currentShiftHours}h/day, {totalHours} total activation hours) in {timezone || 'Asia/Kolkata'}.
            </p>
          </div>

        </div>
      </div>

      {/* Safety & Escrow Badge */}
      <div className="mt-6 pt-3.5 border-t border-espresso/10 text-xs text-stone-700 flex items-center gap-2">
        <CheckCircle2 size={15} className="text-green-600 shrink-0" />
        <span className="font-medium text-[11px]">100% Escrow Protected & GST Separated</span>
      </div>
    </aside>
  );
}
