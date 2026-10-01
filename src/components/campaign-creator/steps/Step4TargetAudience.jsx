"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, X, Sparkles, Check, ChevronDown, 
  ChevronUp, ShieldCheck, Activity, Target, Zap, Filter,
  TrendingUp, Info, Building2, ExternalLink
} from 'lucide-react';
import { resolveIndustryKey, INDUSTRY_METRIC_PROFILES } from '@/lib/intelligence/brandAdaptation';

const ALL_CATEGORY_TABS = [
  { id: 'AUTO', label: 'Automotive & Bikes' },
  { id: 'TECH', label: 'Tech & SaaS' },
  { id: 'FOOD', label: 'Food & Dining' },
  { id: 'BEV', label: 'Beverages' },
  { id: 'FASHION', label: 'Fashion & Lifestyle' },
  { id: 'BEAUTY', label: 'Beauty & Skincare' },
  { id: 'FITNESS', label: 'Sports & Fitness' },
  { id: 'FINANCE', label: 'Finance & Cards' },
  { id: 'RETAIL', label: 'Retail & E-Commerce' }
];

export default function Step4TargetAudience({ draft, onUpdate }) {
  const {
    brand = '',
    brandCategory = '',
    brandIndustry = '',
    brandSubcategory = '',
    audienceName = 'Primary Target Audience',
    ageRange = [20, 35],
    gender = 'All',
    occupation = '',
    incomeSegment = 'SEC A/B (Upper Middle & Affluent)',
    lifeStage = 'Early Career & Urban Adults',
    selectedInterests = [],
    behaviours = [],
    secondaryAudiences = []
  } = draft;

  const currentIndKey = resolveIndustryKey(`${brandCategory} ${brandIndustry} ${brandSubcategory} ${brand}`);
  const activeProfile = INDUSTRY_METRIC_PROFILES[currentIndKey] || INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE;

  const [activeCategoryTab, setActiveCategoryTab] = useState(() => {
    if (currentIndKey === 'AUTOMOTIVE') return 'AUTO';
    if (currentIndKey === 'TECHNOLOGY') return 'TECH';
    if (currentIndKey === 'FOOD_AND_DINING') return 'FOOD';
    if (currentIndKey === 'BEVERAGES') return 'BEV';
    if (currentIndKey === 'FASHION_AND_LIFESTYLE') return 'FASHION';
    if (currentIndKey === 'BEAUTY_AND_PERSONAL_CARE') return 'BEAUTY';
    if (currentIndKey === 'FITNESS_AND_SPORTS') return 'FITNESS';
    if (currentIndKey === 'FINANCE') return 'FINANCE';
    return 'RETAIL';
  });

  const [newInterestInput, setNewInterestInput] = useState('');
  const [newBehaviourInput, setNewBehaviourInput] = useState('');
  const [marketContext, setMarketContext] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loc = draft.city || draft.targetCity || 'Tamil Nadu';
    setMarketLoading(true);
    fetch(`/api/data-library?action=market&location=${encodeURIComponent(loc)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.data) {
          setMarketContext(data.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setMarketLoading(false);
      });
    return () => { isMounted = false; };
  }, [draft.city, draft.targetCity]);

  // Get interests for chosen category tab
  const getTabProfile = (tabId) => {
    switch (tabId) {
      case 'AUTO': return INDUSTRY_METRIC_PROFILES.AUTOMOTIVE;
      case 'TECH': return INDUSTRY_METRIC_PROFILES.TECHNOLOGY;
      case 'FOOD': return INDUSTRY_METRIC_PROFILES.FOOD_AND_DINING;
      case 'BEV': return INDUSTRY_METRIC_PROFILES.BEVERAGES;
      case 'FASHION': return INDUSTRY_METRIC_PROFILES.FASHION_AND_LIFESTYLE;
      case 'BEAUTY': return INDUSTRY_METRIC_PROFILES.BEAUTY_AND_PERSONAL_CARE;
      case 'FITNESS': return INDUSTRY_METRIC_PROFILES.FITNESS_AND_SPORTS;
      case 'FINANCE': return INDUSTRY_METRIC_PROFILES.FINANCE;
      default: return INDUSTRY_METRIC_PROFILES.RETAIL_AND_ECOMMERCE;
    }
  };

  const currentTabProfile = getTabProfile(activeCategoryTab);

  const toggleInterest = (interest) => {
    let next;
    const lower = interest.toLowerCase();
    if (selectedInterests.includes(lower)) {
      next = selectedInterests.filter(i => i !== lower);
    } else {
      next = [...selectedInterests, lower];
    }
    onUpdate({ selectedInterests: next });
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    const item = newInterestInput.trim().toLowerCase();
    if (!selectedInterests.includes(item)) {
      onUpdate({ selectedInterests: [...selectedInterests, item] });
    }
    setNewInterestInput('');
  };

  const toggleBehaviour = (beh) => {
    let next;
    if (behaviours.includes(beh)) {
      next = behaviours.filter(b => b !== beh);
    } else {
      next = [...behaviours, beh];
    }
    onUpdate({ behaviours: next });
  };

  const addCustomBehaviour = (e) => {
    e.preventDefault();
    if (!newBehaviourInput.trim()) return;
    const beh = newBehaviourInput.trim();
    if (!behaviours.includes(beh)) {
      onUpdate({ behaviours: [...behaviours, beh] });
    }
    setNewBehaviourInput('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
            Step 4 • Target Audience Definition
          </span>
          <span className="text-[10px] font-mono font-bold text-muted bg-linen/40 px-2.5 py-0.5 rounded-full border border-espresso/10">
            Industry Profile: {currentIndKey.replace(/_/g, ' ')}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Who do you want to reach?
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Define demographic parameters, consumer affinities, and on-ground behavioral triggers customized for {brand || 'your brand'}.
        </p>
      </div>

      {/* Section 01: Core Demographic Profile */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
                01
              </span>
              <h3 className="text-xs font-black text-espresso uppercase tracking-wider">
                Demographic Cohort & Socio-Economic Tier
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-1 rounded-full">
              Active Blueprint
            </span>
          </div>
          <p className="text-xs text-muted mt-1 ml-7">
            Targeting: <strong className="text-espresso">{audienceName || activeProfile.defaultAudienceName || 'Primary Target Audience'}</strong>
          </p>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
          
          {/* Age Range */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Age Bracket (Years)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={16}
                max={ageRange[1] - 1}
                value={ageRange[0]}
                onChange={(e) => onUpdate({ ageRange: [Number(e.target.value), ageRange[1]] })}
                className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-2.5 text-center text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
              <span className="text-muted font-bold text-xs">to</span>
              <input
                type="number"
                min={ageRange[0] + 1}
                max={75}
                value={ageRange[1]}
                onChange={(e) => onUpdate({ ageRange: [ageRange[0], Number(e.target.value)] })}
                className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-2.5 text-center text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Gender Distribution</label>
            <select
              value={gender}
              onChange={(e) => onUpdate({ gender: e.target.value })}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer transition-all"
            >
              <option value="All">All Genders (100% Cohort)</option>
              <option value="Male">Male Skewed</option>
              <option value="Female">Female Skewed</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Occupation Profile</label>
            <input
              type="text"
              value={occupation || activeProfile.defaultOccupation || 'Working Professionals & Active Consumers'}
              onChange={(e) => onUpdate({ occupation: e.target.value })}
              placeholder="e.g. Working Professionals, Students"
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3.5 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

          {/* Spending Power */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Spending Power / SEC</label>
            <input
              type="text"
              value={incomeSegment}
              onChange={(e) => onUpdate({ incomeSegment: e.target.value })}
              placeholder="e.g. SEC A/B (Upper Middle)"
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3.5 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

        </div>
      </div>

      {/* Section 02: Consumer Interests & Affinities */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
                02
              </span>
              <h3 className="text-xs font-black text-espresso uppercase tracking-wider">
                Consumer Interests & Lifestyle Affinities ({selectedInterests.length} selected)
              </h3>
            </div>
            <p className="text-xs text-muted mt-1 ml-7">
              Select lifestyle categories to filter relevant footfall points of interest.
            </p>
          </div>
          
          {/* Category Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {ALL_CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryTab === tab.id
                    ? 'bg-espresso text-gold shadow-2xs'
                    : 'bg-linen/40 text-muted hover:text-espresso hover:bg-linen/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Category Interest Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {currentTabProfile.interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.toLowerCase());
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold/40'
                    : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{interest}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Interest Input Form */}
        <form onSubmit={addCustomInterest} className="flex gap-2 pt-2 max-w-md border-t border-espresso/10">
          <input
            type="text"
            value={newInterestInput}
            onChange={(e) => setNewInterestInput(e.target.value)}
            placeholder="Add any custom interest tag..."
            className="flex-1 h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium transition-all"
          />
          <button
            type="submit"
            className="h-11 px-5 bg-espresso hover:bg-muted text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Add Tag
          </button>
        </form>
      </div>

      {/* Section 03: On-Ground Behavioral Triggers */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
              03
            </span>
            <h3 className="text-xs font-black text-espresso uppercase tracking-wider">
              On-Ground Behavioral Triggers ({behaviours.length} active)
            </h3>
          </div>
          <p className="text-xs text-muted mt-1 ml-7">
            Identify contextual physical habits and movement behaviors that trigger engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {currentTabProfile.behaviours.map((beh) => {
            const isSelected = behaviours.includes(beh);
            return (
              <div
                key={beh}
                onClick={() => toggleBehaviour(beh)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-xs ring-1 ring-gold/40'
                    : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                }`}
              >
                <span className="font-bold text-xs">{beh}</span>
                {isSelected && <Check size={14} className="text-gold shrink-0" strokeWidth={3} />}
              </div>
            );
          })}
        </div>

        <form onSubmit={addCustomBehaviour} className="flex gap-2 pt-2 max-w-md border-t border-espresso/10">
          <input
            type="text"
            value={newBehaviourInput}
            onChange={(e) => setNewBehaviourInput(e.target.value)}
            placeholder="Add custom behavioral trigger..."
            className="flex-1 h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium transition-all"
          />
          <button
            type="submit"
            className="h-11 px-5 bg-espresso hover:bg-muted text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Add Trigger
          </button>
        </form>
      </div>

      {/* Section 04: Sourced Macro Consumption Context (MoSPI HCES 2022-23 / Table 1) */}
      <div className="bg-linen/25 border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-espresso/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
              04
            </span>
            <div>
              <h3 className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
                <span>Macro Market Spending Context</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  MoSPI Sourced
                </span>
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted">
            Aug 2023 – Jul 2024 Survey
          </span>
        </div>

        {marketLoading ? (
          <div className="py-4 text-center text-xs text-muted">
            Loading official state consumption survey records...
          </div>
        ) : marketContext ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-espresso/10 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  {marketContext.areaName} Urban MPCE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-espresso font-mono">
                    {marketContext.urban ? `₹${marketContext.urban.value.toLocaleString('en-IN')}` : 'Not available'}
                  </span>
                  <span className="text-[10px] text-muted">per person / month</span>
                </div>
                <span className="text-[9px] text-muted mt-1 block">
                  MoSPI HCES 2022-23 Table 1 Urban
                </span>
              </div>

              <div className="bg-white border border-espresso/10 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  {marketContext.areaName} Rural MPCE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-espresso font-mono">
                    {marketContext.rural ? `₹${marketContext.rural.value.toLocaleString('en-IN')}` : 'Not available'}
                  </span>
                  <span className="text-[10px] text-muted">per person / month</span>
                </div>
                <span className="text-[9px] text-muted mt-1 block">
                  MoSPI HCES 2022-23 Table 1 Rural
                </span>
              </div>
            </div>

            {/* Strict Non-Substitution Notice */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
              <Info size={15} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Contextual Benchmark Only: </strong>
                State spending statistics measure broad household consumption. In accordance with system policy, these values provide geographic economic context only and are <em>never</em> substituted into individual audience reach, footfall, or conversion calculations.
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-muted bg-white p-3 rounded-xl border border-espresso/10">
            National benchmark: All-India Urban MPCE ₹6,996 / mo (MoSPI HCES 2022-23).
          </div>
        )}
      </div>

    </div>
  );
}
