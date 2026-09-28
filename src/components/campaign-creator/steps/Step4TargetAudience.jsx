"use client";
import React, { useState } from 'react';
import { 
  Users, Plus, X, Sparkles, Check, ChevronDown, 
  ChevronUp, ShieldCheck, Activity, Target, Zap, Filter 
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
      
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
            Step 4 • Target Audience Definition
          </span>
          <span className="text-[10px] font-mono font-bold text-muted bg-linen/40 px-2.5 py-0.5 rounded-full border border-espresso/10">
            Industry Profile: {currentIndKey.replace(/_/g, ' ')}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Who do you want to reach?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Define demographic parameters, consumer affinities, and on-ground behavioral triggers customized for {brand || 'your brand'}.
        </p>
      </div>

      {/* Primary Target Audience Profile Card */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        
        <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gold" />
            <strong className="text-sm font-black text-espresso">
              {audienceName || activeProfile.defaultAudienceName || 'Primary Target Audience'}
            </strong>
          </div>
          <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2.5 py-1 rounded-full">
            Active Blueprint
          </span>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          {/* Age Range */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Age Bracket</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={16}
                max={ageRange[1] - 1}
                value={ageRange[0]}
                onChange={(e) => onUpdate({ ageRange: [Number(e.target.value), ageRange[1]] })}
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-2.5 py-2 text-center text-xs font-bold text-espresso"
              />
              <span className="text-muted font-bold">to</span>
              <input
                type="number"
                min={ageRange[0] + 1}
                max={75}
                value={ageRange[1]}
                onChange={(e) => onUpdate({ ageRange: [ageRange[0], Number(e.target.value)] })}
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-2.5 py-2 text-center text-xs font-bold text-espresso"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Gender</label>
            <select
              value={gender}
              onChange={(e) => onUpdate({ gender: e.target.value })}
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="All">All Genders (100% Cohort)</option>
              <option value="Male">Male Skewed</option>
              <option value="Female">Female Skewed</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Occupation</label>
            <input
              type="text"
              value={occupation || activeProfile.defaultOccupation || 'Working Professionals & Active Consumers'}
              onChange={(e) => onUpdate({ occupation: e.target.value })}
              placeholder="e.g. Working Professionals, Students"
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
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
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
            />
          </div>

        </div>

        {/* Interests Category Tabs & Chips */}
        <div className="space-y-3 pt-3 border-t border-espresso/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-espresso">
                Consumer Interests ({selectedInterests.length} selected)
              </label>
              <span className="text-[10px] text-muted">Click chips to toggle or add custom tags below</span>
            </div>
            
            {/* Category Quick Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {ALL_CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryTab === tab.id
                      ? 'bg-espresso text-gold'
                      : 'bg-linen/30 text-muted hover:text-espresso'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Category Interest Chips */}
          <div className="flex flex-wrap gap-1.5">
            {currentTabProfile.interests.map((interest) => {
              const isSelected = selectedInterests.includes(interest.toLowerCase());
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-espresso text-gold border-espresso shadow-xs'
                      : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/40'
                  }`}
                >
                  {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                </button>
              );
            })}
          </div>

          {/* Custom Interest Input Form */}
          <form onSubmit={addCustomInterest} className="flex gap-2 pt-1 max-w-sm">
            <input
              type="text"
              value={newInterestInput}
              onChange={(e) => setNewInterestInput(e.target.value)}
              placeholder="Add any custom interest tag..."
              className="flex-1 bg-linen/20 border border-espresso/15 rounded-xl px-3 py-1.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-espresso text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* Behavioral Triggers */}
        <div className="space-y-2 pt-3 border-t border-espresso/10">
          <label className="block text-xs font-bold text-espresso">
            Target Consumer Behaviors ({behaviours.length} active)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentTabProfile.behaviours.map((beh) => {
              const isSelected = behaviours.includes(beh);
              return (
                <div
                  key={beh}
                  onClick={() => toggleBehaviour(beh)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-espresso text-white border-espresso shadow-xs'
                      : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/40'
                  }`}
                >
                  <span className="font-bold text-[11px]">{beh}</span>
                  {isSelected && <Check size={13} className="text-gold" strokeWidth={3} />}
                </div>
              );
            })}
          </div>

          <form onSubmit={addCustomBehaviour} className="flex gap-2 pt-1.5 max-w-sm">
            <input
              type="text"
              value={newBehaviourInput}
              onChange={(e) => setNewBehaviourInput(e.target.value)}
              placeholder="Add custom behavioral trigger..."
              className="flex-1 bg-linen/20 border border-espresso/15 rounded-xl px-3 py-1.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-espresso text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
