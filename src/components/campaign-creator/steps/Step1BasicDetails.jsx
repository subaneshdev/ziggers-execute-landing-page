"use client";
import React, { useMemo } from 'react';
import { 
  Target, Sparkles, Calendar, Clock, Globe, Wallet, Check, 
  Layers, AlertTriangle, Megaphone, Rocket, Package, 
  Bike, ClipboardList, UserPlus, CreditCard, Smartphone, 
  Store, PartyPopper, BarChart3, MessageSquare, Info,
  TrendingUp, CalendarDays, Sun
} from 'lucide-react';
import { 
  validateCampaignSchedule, 
  calculateScheduleMetrics, 
  formatDateDisplay, 
  formatTimeDisplay, 
  getTodayDateString,
  SCHEDULE_CONFIG_LIMITS 
} from '@/lib/intelligence/schedule/scheduleEngine';

export const CAMPAIGN_OBJECTIVES = [
  { id: 'Brand Awareness', title: 'Brand Awareness', desc: 'Maximize high-visibility reach & footfall dwell time', Icon: Megaphone },
  { id: 'Product Launch', title: 'Product Launch', desc: 'Create launch buzz, unveiling events & first impressions', Icon: Rocket },
  { id: 'Product Sampling', title: 'Product Sampling', desc: 'Distribute physical product units & verify taste/trial', Icon: Package },
  { id: 'Product Trial', title: 'Product Trial', desc: 'Hands-on test rides, product demos & guided experience', Icon: Bike },
  { id: 'Lead Generation', title: 'Lead Generation', desc: 'Capture OTP-verified customer leads & consultations', Icon: ClipboardList },
  { id: 'Customer Acquisition', title: 'Customer Acquisition', desc: 'Direct sign-ups, first orders & customer onboarding', Icon: UserPlus },
  { id: 'Sales / Conversion', title: 'Sales / Conversion', desc: 'In-store promotions, vouchers & assisted retail sales', Icon: CreditCard },
  { id: 'App Downloads', title: 'App Downloads', desc: 'Drive guided mobile app installs & referral codes', Icon: Smartphone },
  { id: 'Store Visits', title: 'Store Visits', desc: 'Channel footfall into retail showrooms & outlet launches', Icon: Store },
  { id: 'Engagement', title: 'Engagement', desc: 'Gamification, spin-the-wheel, contests & UGC social moments', Icon: PartyPopper },
  { id: 'Market Research', title: 'Market Research', desc: 'Blind taste tests, surveys & structured feedback capture', Icon: BarChart3 },
  { id: 'Feedback Collection', title: 'Feedback Collection', desc: 'Post-trial reviews, sentiment analysis & consumer insights', Icon: MessageSquare },
  { id: 'Other', title: 'Other Custom Objective', desc: 'Define unique custom on-ground activation goals', Icon: Layers }
];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST • +05:30)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST • +04:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT • +08:00)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (EST • -05:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT • +00:00)' }
];

const BUDGET_PRESETS = [50000, 75000, 125000, 250000];

export default function Step1BasicDetails({ draft, onUpdate }) {
  const {
    name = '',
    brand = '',
    productOrService = '',
    objective = 'Product Sampling',
    selectedObjectives = ['Product Sampling'],
    startDate = '2026-10-15',
    endDate = '2026-10-17',
    dailyStartTime = '16:00',
    dailyEndTime = '21:00',
    timezone = 'Asia/Kolkata',
    campaignDurationDays = 3,
    estimatedBudget = 75000,
    customObjectiveText = '',
    scheduleErrors = []
  } = draft;

  const todayDate = useMemo(() => getTodayDateString(timezone), [timezone]);

  // Derived live metrics for schedule preview
  const currentMetrics = useMemo(() => {
    return calculateScheduleMetrics({
      startDate,
      endDate,
      dailyStartTime,
      dailyEndTime,
      timezone
    });
  }, [startDate, endDate, dailyStartTime, dailyEndTime, timezone]);

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

  const handleScheduleChange = (field, value) => {
    const nextSchedule = {
      startDate: field === 'startDate' ? value : startDate,
      endDate: field === 'endDate' ? value : endDate,
      dailyStartTime: field === 'dailyStartTime' ? value : dailyStartTime,
      dailyEndTime: field === 'dailyEndTime' ? value : dailyEndTime,
      timezone: field === 'timezone' ? value : timezone
    };

    const validation = validateCampaignSchedule(nextSchedule, { allowPastDates: false });
    if (validation.isValid) {
      const metrics = validation.normalized;
      onUpdate({
        ...nextSchedule,
        campaignDays: metrics.campaignDays,
        campaignDurationDays: metrics.campaignDays,
        shiftHours: metrics.hoursPerDay,
        schedule: metrics,
        scheduleErrors: []
      });
    } else {
      onUpdate({
        ...nextSchedule,
        scheduleErrors: validation.errors
      });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Step 1 of 10
          </span>
          <span className="text-xs text-muted font-medium">Foundation & Ground Parameters</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-espresso tracking-tight font-serif">
          Start with the essentials
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed max-w-2xl font-medium">
          Tell us what you are promoting, what you want to achieve, and when. You can review everything before saving your campaign.
        </p>
      </div>

      {/* 1. General Details Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-espresso flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-linen text-espresso font-mono font-bold flex items-center justify-center text-[10px]">
              01
            </span>
            <span>Brand & Product Identity</span>
          </h3>
          <span className="text-[10px] text-muted font-medium">* Required fields</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Campaign Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="campaign-name" className="block text-xs font-bold text-espresso">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input id="campaign-name"
              type="text"
              required
              value={name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g. Summer Brand Activation Drive, Metro Retail Launch"
              className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-4 text-xs font-semibold text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-muted/50 transition-all shadow-2xs"
            />
          </div>

          {/* Brand / Business */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-brand" className="block text-xs font-bold text-espresso">
              Brand / Business Name <span className="text-red-500">*</span>
            </label>
            <input id="campaign-brand"
              type="text"
              required
              value={brand}
              onChange={(e) => onUpdate({ brand: e.target.value })}
              placeholder="e.g. Nike, Starbucks, Zoho, Cult.fit"
              className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-4 text-xs font-semibold text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-muted/50 transition-all shadow-2xs"
            />
          </div>

          {/* Product or Service */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-product" className="block text-xs font-bold text-espresso">
              Product or Service Being Promoted <span className="text-red-500">*</span>
            </label>
            <input id="campaign-product"
              type="text"
              required
              value={productOrService}
              onChange={(e) => onUpdate({ productOrService: e.target.value })}
              placeholder="e.g. Running Shoes, Cold Brew Coffee, Cloud CRM"
              className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-4 text-xs font-semibold text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-muted/50 transition-all shadow-2xs"
            />
          </div>

        </div>
      </section>

      {/* 2. Campaign Objectives Section */}
      <section className="space-y-4 pt-4 border-t border-espresso/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-espresso flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-linen text-espresso font-mono font-bold flex items-center justify-center text-[10px]">
              02
            </span>
            <span>Activation Objective</span>
            <span className="text-[11px] text-muted font-normal lowercase">(select one or more)</span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-0.5 rounded-full">
            {selectedObjectives.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAMPAIGN_OBJECTIVES.map((obj) => {
            const isSelected = selectedObjectives.includes(obj.id);
            const ObjectiveIcon = obj.Icon;
            return (
              <button
                key={obj.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleObjective(obj.id)}
                className={`text-left p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40'
                    : 'bg-white border-espresso/15 hover:border-gold/60 hover:bg-linen/10 text-espresso shadow-2xs'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-gold/20 text-gold' : 'bg-linen/60 text-espresso'
                }`}>
                  <ObjectiveIcon size={18} strokeWidth={2.2} />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-sm font-bold leading-tight">{obj.title}</strong>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-gold text-espresso flex items-center justify-center shrink-0">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-linen/80' : 'text-muted'}`}>
                    {obj.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedObjectives.includes('Other') && (
          <div className="pt-2 animate-in fade-in duration-150">
            <input
              type="text"
              value={customObjectiveText}
              onChange={(e) => onUpdate({ customObjectiveText: e.target.value })}
              placeholder="Describe your custom campaign objective in detail..."
              className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-4 text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium"
            />
          </div>
        )}
      </section>

      {/* 3. Campaign Schedule Section */}
      <section className="space-y-4 pt-4 border-t border-espresso/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-espresso flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-linen text-espresso font-mono font-bold flex items-center justify-center text-[10px]">
              03
            </span>
            <span>Campaign Schedule & Activation Window</span>
          </h3>
          <span className="text-[10px] font-mono font-semibold text-muted bg-linen/50 border border-espresso/10 px-2 py-0.5 rounded-md">
            Inclusive Calendar Window
          </span>
        </div>

        <div className="bg-linen/15 border border-espresso/15 rounded-3xl p-5 sm:p-6 space-y-6">
          
          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-espresso/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-espresso text-gold flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-espresso tracking-tight">
                  Activation Timing & Shift Parameters
                </h4>
                <p className="text-[11px] text-muted font-medium">
                  Sets operational duration and weights diurnal pedestrian traffic before running the forecast
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-espresso font-semibold bg-white border border-espresso/10 px-3 py-1.5 rounded-xl">
              <Globe size={13} className="text-gold" />
              <span>{timezone}</span>
            </div>
          </div>

          {/* Form Fields: Logical 2-Row Layout */}
          <div className="space-y-4">
            
            {/* Row 1: Calendar Dates & Time Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Campaign Start Date */}
              <div className="space-y-1.5">
                <label htmlFor="campaign-start" className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-gold" />
                  <span>Start Date</span>
                  <span className="text-red-500">*</span>
                </label>
                <input id="campaign-start"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleScheduleChange('startDate', e.target.value)}
                  className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono shadow-2xs transition-all"
                />
              </div>

              {/* Campaign End Date */}
              <div className="space-y-1.5">
                <label htmlFor="campaign-end" className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-gold" />
                  <span>End Date</span>
                  <span className="text-red-500">*</span>
                </label>
                <input id="campaign-end"
                  type="date"
                  required
                  value={endDate}
                  min={startDate || todayDate}
                  onChange={(e) => handleScheduleChange('endDate', e.target.value)}
                  className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono shadow-2xs transition-all"
                />
              </div>

              {/* Time Zone */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <label htmlFor="campaign-timezone" className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                  <Globe size={13} className="text-gold" />
                  <span>Time Zone</span>
                  <span className="text-red-500">*</span>
                </label>
                <select id="campaign-timezone"
                  value={timezone}
                  onChange={(e) => handleScheduleChange('timezone', e.target.value)}
                  className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-3 text-xs text-espresso font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold shadow-2xs transition-all"
                >
                  {TIMEZONE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Row 2: Shift Operating Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              
              {/* Daily Start Time */}
              <div className="space-y-1.5">
                <label htmlFor="campaign-time-start" className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                  <Clock size={13} className="text-gold" />
                  <span>Daily Shift Start</span>
                  <span className="text-red-500">*</span>
                </label>
                <input id="campaign-time-start"
                  type="time"
                  required
                  value={dailyStartTime}
                  onChange={(e) => handleScheduleChange('dailyStartTime', e.target.value)}
                  className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono shadow-2xs transition-all"
                />
              </div>

              {/* Daily End Time */}
              <div className="space-y-1.5">
                <label htmlFor="campaign-time-end" className="block text-xs font-bold text-espresso flex items-center gap-1.5">
                  <Clock size={13} className="text-gold" />
                  <span>Daily Shift End</span>
                  <span className="text-red-500">*</span>
                </label>
                <input id="campaign-time-end"
                  type="time"
                  required
                  value={dailyEndTime}
                  onChange={(e) => handleScheduleChange('dailyEndTime', e.target.value)}
                  className="w-full h-11 bg-white border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono shadow-2xs transition-all"
                />
              </div>

              {/* Operational Rules Note */}
              <div className="p-3 bg-white border border-espresso/10 rounded-xl flex items-center gap-2.5 text-muted sm:col-span-2 lg:col-span-1">
                <Info size={16} className="text-gold shrink-0" />
                <span className="text-[11px] leading-snug">
                  Shift bounds: <strong>2h min – 12h max</strong>. Overnight activations past midnight are rejected for field safety.
                </span>
              </div>

            </div>

          </div>

          {/* Bento Grid: Live Derived Schedule Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            {/* Metric 1: Days */}
            <div className="p-3.5 bg-white border border-espresso/10 rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Campaign Days
              </span>
              <div className="text-lg sm:text-xl font-black text-espresso font-mono">
                {currentMetrics.campaignDays || campaignDurationDays || 1}
                <span className="text-xs font-bold text-muted ml-1">Days</span>
              </div>
              <span className="text-[10px] text-muted block font-medium">Inclusive calendar window</span>
            </div>

            {/* Metric 2: Hours / Day */}
            <div className="p-3.5 bg-white border border-espresso/10 rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Hours Per Day
              </span>
              <div className="text-lg sm:text-xl font-black text-espresso font-mono">
                {currentMetrics.hoursPerDay || 5}
                <span className="text-xs font-bold text-muted ml-1">hrs / shift</span>
              </div>
              <span className="text-[10px] text-muted block font-mono truncate">
                {formatTimeDisplay(dailyStartTime)} – {formatTimeDisplay(dailyEndTime)}
              </span>
            </div>

            {/* Metric 3: Total Activation Hours */}
            <div className="p-3.5 bg-white border border-espresso/10 rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Total Hours
              </span>
              <div className="text-lg sm:text-xl font-black text-gold font-mono">
                {currentMetrics.totalCampaignHours || ((currentMetrics.campaignDays || 1) * 5)}
                <span className="text-xs font-bold text-espresso ml-1">hrs</span>
              </div>
              <span className="text-[10px] text-muted block font-medium">Total on-ground presence</span>
            </div>

            {/* Metric 4: Day Composition */}
            <div className="p-3.5 bg-white border border-espresso/10 rounded-2xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Diurnal Weighting
              </span>
              <div className="text-xs sm:text-sm font-black text-espresso truncate">
                {currentMetrics.weekdayCount} Wkday • {currentMetrics.weekendCount} Wkend
              </div>
              <span className="text-[10px] text-green-700 font-bold block flex items-center gap-1">
                <Sun size={10} /> Diurnal curve blended
              </span>
            </div>

          </div>

          {/* Validation Warnings Alert Callout */}
          {scheduleErrors && scheduleErrors.length > 0 && (
            <div className="p-4 bg-red-50/95 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-900 animate-in fade-in duration-150">
              <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <strong className="font-extrabold text-red-950 block text-xs">
                  Schedule Validation Alert
                </strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-red-800 font-medium">
                  {scheduleErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. Budget & Financial Waterfall Section */}
      <section className="space-y-4 pt-4 border-t border-espresso/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-espresso flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-linen text-espresso font-mono font-bold flex items-center justify-center text-[10px]">
              04
            </span>
            <span>Starting Campaign Budget</span>
          </h3>
          <span className="text-[10px] font-mono font-semibold text-muted bg-linen/50 border border-espresso/10 px-2 py-0.5 rounded-md">
            Planning estimate
          </span>
        </div>

        <div className="p-5 sm:p-6 bg-white border border-espresso/15 rounded-3xl space-y-4 shadow-2xs">
          
          <div className="space-y-2">
            <label htmlFor="campaign-budget" className="block text-xs font-bold text-espresso">
              Estimated Total Budget (INR, GST Inclusive) <span className="text-red-500">*</span>
            </label>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted font-mono">
                  ₹
                </span>
                <input
                  id="campaign-budget"
                  type="number"
                  step={5000}
                  value={estimatedBudget || ''}
                  onChange={(e) => onUpdate({ estimatedBudget: Number(e.target.value) || 0, budgetInr: Number(e.target.value) || 0 })}
                  placeholder="75000"
                  className="w-full h-11 bg-linen/20 border border-espresso/15 rounded-xl pl-8 pr-4 text-sm font-black text-espresso focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono transition-all"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {BUDGET_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onUpdate({ estimatedBudget: preset, budgetInr: preset })}
                    className={`h-11 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      Number(estimatedBudget) === preset
                        ? 'bg-espresso text-white border-espresso shadow-xs'
                        : 'bg-white border-espresso/15 hover:border-gold hover:bg-linen/20 text-espresso'
                    }`}
                  >
                    ₹{(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted font-medium">
              Your budget covers field staff, supervision, campaign costs, reserves, and GST. Review the full breakdown in the final step.
            </p>
          </div>

          {/* Budget Insufficiency Warning Callout */}
          {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' && (
            <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-3.5 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
                ⚠️
              </div>
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <strong className="font-extrabold text-amber-950 uppercase font-mono tracking-wider">
                    Status: BUDGET_INSUFFICIENT
                  </strong>
                  <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    Deficit: {draft.forecast.capacity.budgetDeficitFormatted || 'Deficit detected'}
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed font-semibold">
                  {draft.forecast.capacity.staffingStrategy || `Budget Insufficient: Minimum required budget to activate 1 certified promoter for ${currentMetrics.campaignDays || campaignDurationDays} days is ${draft.forecast.capacity.minimumRequiredBudgetFormatted}.`}
                </p>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  The engine enforces statutory labor minimums and prevents unviable under-funded deployments. You can apply the exact minimum required budget with one click below.
                </p>
                {draft?.forecast?.capacity?.minimumRequiredBudget && (
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdate({
                        budgetInr: draft.forecast.capacity.minimumRequiredBudget,
                        estimatedBudget: draft.forecast.capacity.minimumRequiredBudget
                      })}
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles size={13} />
                      <span>Apply Recommended Minimum ({draft.forecast.capacity.minimumRequiredBudgetFormatted})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
