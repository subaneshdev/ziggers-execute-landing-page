"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, Upload, MapPin, Calculator, 
  Calendar, ShieldCheck, FileText, Image as ImageIcon, Video, 
  User, Phone, Sparkles, AlertCircle, Clock, DollarSign, Users, Briefcase, Zap,
  Target, Sliders, Layers, Award, Building, School, ShoppingBag, Eye, TrendingUp,
  BarChart2, Info, CheckCircle2, GraduationCap, Utensils, Hotel, Dumbbell, Train,
  HelpCircle, ChevronDown, ChevronUp, Layers3, Activity, Search
} from 'lucide-react';
import { calculateAudiencePrediction, rankLocationCandidates, geoGridCellsDb, personaTaxonomy } from '@/lib/audienceEngine';

export default function CampaignCreator({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showLocationRankings, setShowLocationRankings] = useState(false);

  // Form Targeting State
  const [formData, setFormData] = useState({
    name: 'T. Nagar Store Launch & Product Sampling',
    brand: 'Artisan Cafe & Bakery',
    objective: 'Product Sampling',
    targetLocations: ['T. Nagar & Ranganathan Street'],
    radiusKm: 3.0,
    ageRange: [18, 35],
    gender: 'All',
    secClassification: 'SEC A/B (Mid-High Income)',
    selectedInterests: ['fashion', 'foodies', 'fitness'],
    promoterCount: 10,
    shiftHours: 5,
    campaignDays: 1,
    budgetInr: 35000
  });

  // Calculate Live Forecast Engine Output
  const pred = calculateAudiencePrediction({
    targetLocations: formData.targetLocations,
    radiusKm: formData.radiusKm,
    ageMin: formData.ageRange[0],
    ageMax: formData.ageRange[1],
    gender: formData.gender,
    secClassification: formData.secClassification,
    selectedInterests: formData.selectedInterests,
    objective: formData.objective,
    promoterCount: formData.promoterCount,
    shiftHours: formData.shiftHours,
    campaignDays: formData.campaignDays,
    budgetInr: formData.budgetInr
  });

  // Multi-Location Rankings
  const rankedLocations = rankLocationCandidates({
    radiusKm: formData.radiusKm,
    ageMin: formData.ageRange[0],
    ageMax: formData.ageRange[1],
    gender: formData.gender,
    secClassification: formData.secClassification,
    selectedInterests: formData.selectedInterests,
    objective: formData.objective,
    promoterCount: formData.promoterCount,
    shiftHours: formData.shiftHours,
    campaignDays: formData.campaignDays,
    budgetInr: formData.budgetInr
  });

  // Structured Objectives (Section 9 - Step 1)
  const objectives = [
    { id: 'Brand Awareness', title: 'Brand Awareness', desc: 'Maximize high-visibility on-ground presence in high-density metro hubs.', icon: '📢' },
    { id: 'Product Sampling', title: 'Product Sampling', desc: 'Distribute FMCG, beverage, or food trials with photo & inventory evidence.', icon: '🥤' },
    { id: 'Lead Generation', title: 'Lead Generation', desc: 'Capture verified customer names, phone numbers, and surveys via OTP.', icon: '📋' },
    { id: 'App Downloads', title: 'App Downloads', desc: 'Guided app installs, promo code redemptions, and user onboarding.', icon: '📱' },
    { id: 'Store Visits', title: 'Store Visits & Opening', desc: 'Drive neighborhood foot traffic and queue buzz for retail outlets.', icon: '🎉' },
    { id: 'Event Promotion', title: 'Event Promotion', desc: 'Promote college fests, marathons, concerts, and regional trade shows.', icon: '🎟️' },
    { id: 'Recruitment', title: 'On-Field Recruitment', desc: 'Direct merchant, driver, or partner onboarding drives.', icon: '💼' }
  ];

  const toggleInterest = (interestKey) => {
    setFormData(prev => {
      const exists = prev.selectedInterests.includes(interestKey);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter(k => k !== interestKey) };
      } else {
        return { ...prev, selectedInterests: [...prev.selectedInterests, interestKey] };
      }
    });
  };

  const handleLaunch = () => {
    onPublish({
      name: formData.name,
      brand: formData.brand,
      objective: formData.objective,
      city: pred.city,
      budget: `₹${parseInt(formData.budgetInr).toLocaleString('en-IN')}`,
      workers: formData.promoterCount,
      locations: formData.targetLocations.length,
      targetCpl: pred.estimatedCpl,
      actualCpl: pred.estimatedCpl,
      status: true,
      stage: 'Live'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/70 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-5 animate-in fade-in duration-200">
      <div className="bg-white text-espresso border border-espresso/15 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[94vh] font-sans">
        
        {/* Header Console Bar */}
        <div className="p-4 px-6 border-b border-espresso/10 flex items-center justify-between bg-espresso text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold text-espresso flex items-center justify-center font-black text-sm shadow-md">
              Z
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30 uppercase">
                  Ziggers Audience Intelligence Platform
                </span>
                <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">
                  Media Planning Studio
                </h2>
              </div>
              <p className="text-[11px] text-linen/70 mt-0.5">
                H3 Geospatial Grid • Census C-14 • MOSPI Affluence Scoring • LightGBM ML Pipeline
              </p>
            </div>
          </div>

          {/* Stepper Dots (6 Steps) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono">
            {[
              '1. Objective',
              '2. Location',
              '3. Demographics',
              '4. Personas',
              '5. Capacity',
              '6. Forecast Review'
            ].map((stName, idx) => (
              <React.Fragment key={idx}>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] cursor-pointer transition-colors ${
                  step === (idx + 1) ? 'bg-gold text-espresso font-extrabold' : 'text-linen/60 hover:text-white'
                }`} onClick={() => setStep(idx + 1)}>
                  {stName}
                </span>
                {idx < 5 && <span className="text-linen/30 text-[9px]">›</span>}
              </React.Fragment>
            ))}
          </div>

          <button onClick={onClose} className="text-linen/70 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Main 2-Column Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow overflow-y-auto">
          
          {/* Left Column — 6-Step Workflow (8 cols) */}
          <div className="lg:col-span-8 p-6 space-y-6 text-xs text-espresso border-b lg:border-b-0 lg:border-r border-espresso/10">
            
            {/* STEP 1: OBJECTIVE */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 1: Campaign Objective
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Select your marketing goal. Ziggers uses objective-specific conversion functions to calculate lead yield and app installs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                      placeholder="e.g. T. Nagar Store Launch & Product Sampling"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Brand / Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                      placeholder="e.g. Artisan Cafe, D2C Brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                    Campaign Objective *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {objectives.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, objective: obj.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          formData.objective === obj.id
                            ? 'border-gold bg-gold/15 text-espresso ring-2 ring-gold/40 shadow-xs font-bold'
                            : 'border-espresso/10 bg-white text-muted hover:border-gold hover:text-espresso'
                        }`}
                      >
                        <span className="text-2xl p-2 rounded-xl bg-linen/50 shrink-0">{obj.icon}</span>
                        <div>
                          <h4 className="font-extrabold text-xs text-espresso">{obj.title}</h4>
                          <p className="text-[10px] text-muted leading-relaxed mt-0.5">{obj.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & GEOSPATIAL MAP */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                      Step 2: Location & H3 Cellular Geofence
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLocationRankings(true)}
                      className="text-[10px] font-bold text-espresso bg-gold hover:bg-gold/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <TrendingUp size={12} /> Rank Alternative Locations
                    </button>
                  </div>
                  <p className="text-xs text-muted font-medium">
                    Divides selected metro zones into H3 geospatial cells to aggregate Census demographics, MPCE scores, and Google POIs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Search Target Location Node *
                    </label>
                    <select
                      value={formData.targetLocations[0] || 'T. Nagar & Ranganathan Street'}
                      onChange={(e) => setFormData({ ...formData, targetLocations: [e.target.value] })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso font-extrabold focus:outline-none focus:border-gold"
                    >
                      {Object.keys(geoGridCellsDb).map((area) => (
                        <option key={area} value={area}>
                          📍 {area} ({geoGridCellsDb[area].city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                      <span>Geofence Radius Limit</span>
                      <span className="text-gold font-mono font-extrabold">{formData.radiusKm}.0 KM Radius ({pred.h3CellsCount} H3 Cells)</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.radiusKm}
                      onChange={(e) => setFormData({ ...formData, radiusKm: parseFloat(e.target.value) })}
                      className="w-full accent-gold cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Geospatial Map Visualization Card */}
                <div className="bg-espresso text-white rounded-3xl p-5 space-y-4 shadow-xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers3 className="text-gold" size={18} />
                      <h3 className="font-extrabold text-sm text-white">
                        H3 Spatial Cell Grid ({pred.nodeName})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-gold font-bold bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/30">
                      {pred.h3CellsCount} Active H3 Index Resolution 8 Cells
                    </span>
                  </div>

                  {/* POI Densities Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <School size={11} className="text-gold" /> Schools
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.schools}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <GraduationCap size={11} className="text-gold" /> Colleges
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.colleges}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <ShoppingBag size={11} className="text-gold" /> Malls
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.malls}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Building size={11} className="text-gold" /> Offices
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.offices}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Utensils size={11} className="text-gold" /> Restaurants
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.restaurants}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Dumbbell size={11} className="text-gold" /> Gyms
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.gyms}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Hotel size={11} className="text-gold" /> Hotels
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.hotels}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Train size={11} className="text-gold" /> Transit Hubs
                      </span>
                      <strong className="text-white text-base block mt-0.5">{pred.poiDensities.transit}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: DEMOGRAPHICS */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 3: Demographics & Ziggers Economic Affluence Score
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Hard filtering layers eliminate non-qualifying age bands. Calibrated against MOSPI HCES urban MPCE consumption scores.
                  </p>
                </div>

                {/* Age Range Slider & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted">
                      <span className="flex items-center gap-1"><Users size={12} className="text-gold" /> Census C-14 Age Bracket</span>
                      <span className="text-espresso font-mono font-extrabold">{formData.ageRange[0]} – {formData.ageRange[1]} Years</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={formData.ageRange[1]}
                      onChange={(e) => setFormData({ ...formData, ageRange: [formData.ageRange[0], parseInt(e.target.value)] })}
                      className="w-full accent-gold cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-muted">
                      <span>18 (Youth/Gen-Z)</span>
                      <span>35 (Working Pros)</span>
                      <span>65+ (Senior)</span>
                    </div>
                  </div>

                  <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      Gender Hard Filter
                    </span>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['All', 'Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            formData.gender === g
                              ? 'bg-espresso text-white border-espresso shadow-xs'
                              : 'bg-linen/20 text-espresso border-espresso/15 hover:border-gold'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ziggers Economic Affluence Score Bar */}
                <div className="bg-white border border-espresso/10 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                        Ziggers Economic Affluence Score (MOSPI HCES MPCE Calibrated Model)
                      </span>
                      <p className="text-[11px] text-muted font-medium mt-0.5">
                        Est. Household Consumption: <strong className="text-espresso font-mono">{pred.mpceIncomeEstimate}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gold/20 text-espresso border border-gold/40 px-3 py-1.5 rounded-xl">
                      <TrendingUp size={14} className="text-gold" />
                      <span className="text-sm font-extrabold font-mono">{pred.affluenceScore} / 100</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="h-3 w-full bg-linen/50 rounded-full overflow-hidden flex relative">
                      <div
                        className="bg-gradient-to-r from-amber-500 via-gold to-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pred.affluenceScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted">
                      <span>0 (Mass Market)</span>
                      <span>50 (Middle Income)</span>
                      <span className="text-espresso font-bold">85+ (Affluent / Premium)</span>
                      <span>100 (Ultra High)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: INTERESTS / PERSONAS */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 4: Hierarchical Persona & Interest Soft Ranking Signals
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Soft targeting signals do not delete people from the candidate pool; they rank cells and calculate the <strong>Audience Quality Score</strong>.
                  </p>
                </div>

                {/* Hierarchical Persona Taxonomy */}
                <div className="space-y-4">
                  {Object.keys(personaTaxonomy).map((catKey) => {
                    const category = personaTaxonomy[catKey];
                    return (
                      <div key={catKey} className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] font-extrabold text-espresso uppercase tracking-wider block">
                          {category.name}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {category.interests.map((interest) => {
                            const isSelected = formData.selectedInterests.includes(interest.key);
                            return (
                              <button
                                key={interest.key}
                                type="button"
                                onClick={() => toggleInterest(interest.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-gold text-espresso border-gold shadow-2xs font-extrabold'
                                    : 'bg-linen/20 text-espresso border-espresso/15 hover:border-gold'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {interest.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: CAMPAIGN CAPACITY */}
            {step === 5 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 5: Physical Execution Capacity Controls
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Separates population opportunity from physical campaign capacity (Promoters × Shift Hours × Campaign Days × Hourly Capacity).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Promoter Count *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.promoterCount}
                      onChange={(e) => setFormData({ ...formData, promoterCount: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-espresso"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Shift Hours / Day *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.shiftHours}
                      onChange={(e) => setFormData({ ...formData, shiftHours: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-espresso"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Campaign Days *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.campaignDays}
                      onChange={(e) => setFormData({ ...formData, campaignDays: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-espresso"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Campaign Budget (₹ INR) *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={formData.budgetInr}
                    onChange={(e) => setFormData({ ...formData, budgetInr: parseInt(e.target.value) || 35000 })}
                    className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs font-mono font-extrabold text-espresso"
                  />
                </div>

                {/* Capacity Cap Audit Box */}
                <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2 shadow-xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Physical Interaction Throughput Cap
                  </span>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span>Promoter Capacity Cap:</span>
                    <strong className="text-gold font-extrabold">{pred.physicalPromoterCapacity.toLocaleString('en-IN')} Interactions</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono border-t border-espresso/10 pt-1.5">
                    <span>Estimated Verified Leads:</span>
                    <strong className="text-green-700 font-extrabold">{pred.expectedLeads.toLocaleString('en-IN')} Leads ({pred.estimatedCpl})</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: FORECAST REVIEW */}
            {step === 6 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 6: Complete Audience Forecast & Final Launch Review
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Review your complete 12-point audience forecast, confidence bounds, and recommendations before instant dispatch.
                  </p>
                </div>

                <div className="bg-espresso text-white p-5 rounded-3xl space-y-4 shadow-xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-extrabold text-base text-white">{formData.name}</h3>
                      <span className="text-[11px] text-gold font-mono">{formData.brand} • {pred.nodeName} ({formData.radiusKm}km)</span>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-green-500/30">
                      {pred.audienceQualityScore} / 100 Quality
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <span className="text-[9px] text-linen/70 uppercase block">Potential Audience</span>
                      <strong className="text-white text-base block mt-0.5">{pred.potentialAudience.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <span className="text-[9px] text-linen/70 uppercase block">Qualified Audience</span>
                      <strong className="text-white text-base block mt-0.5">{pred.qualifiedAudience.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <span className="text-[9px] text-linen/70 uppercase block">Estimated Reach</span>
                      <strong className="text-white text-base block mt-0.5">{pred.estimatedReach.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <span className="text-[9px] text-linen/70 uppercase block">Expected Leads</span>
                      <strong className="text-gold text-base block mt-0.5">{pred.expectedLeads.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column — Live Meta-Style Audience Forecast Panel (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-linen/20 space-y-5 text-xs text-espresso flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-espresso/10">
            
            <div className="space-y-4">
              
              {/* META-STYLE LIVE FORECAST PANEL */}
              <div className="bg-espresso text-white p-5 rounded-3xl shadow-xl space-y-4 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} /> Live Audience Forecast
                  </span>
                  <span className="text-[9px] font-mono text-green-400 font-bold bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30">
                    {pred.confidencePercent}% Confidence
                  </span>
                </div>

                {/* 8 Core Metrics Stack */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Potential Audience:</span>
                    <strong className="text-white">{pred.potentialAudience.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Qualified Audience:</span>
                    <strong className="text-white">{pred.qualifiedAudience.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Estimated Exposure:</span>
                    <strong className="text-white">{pred.estimatedExposure.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Estimated Reach:</span>
                    <strong className="text-white">{pred.estimatedReach.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Expected Interactions:</span>
                    <strong className="text-white">{pred.expectedInteractions.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Expected Leads:</span>
                    <strong className="text-gold font-black">{pred.expectedLeads.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                    <span className="text-[10px] text-linen/70">Estimated CPL:</span>
                    <strong className="text-green-400 font-extrabold">{pred.estimatedCpl}</strong>
                  </div>
                </div>
              </div>

              {/* AUDIENCE QUALITY SCORE CARD (Section 11) */}
              <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    Audience Quality Score
                  </span>
                  <span className="text-sm font-black font-mono text-espresso bg-linen/50 px-2.5 py-0.5 rounded-lg border border-espresso/10">
                    {pred.audienceQualityScore} / 100
                  </span>
                </div>

                {/* Sub-breakdowns */}
                <div className="space-y-1.5 text-[10px] font-mono text-muted">
                  <div className="flex justify-between">
                    <span>Age Match:</span>
                    <span className="font-bold text-espresso">{pred.qualitySubScores.ageMatch}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Economic Match:</span>
                    <span className="font-bold text-espresso">{pred.qualitySubScores.economicMatch}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Match:</span>
                    <span className="font-bold text-espresso">{pred.qualitySubScores.interestMatch}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location Relevance:</span>
                    <span className="font-bold text-espresso">{pred.qualitySubScores.locationRelevance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Footfall Availability:</span>
                    <span className="font-bold text-espresso">{pred.qualitySubScores.footfallAvailability}%</span>
                  </div>
                </div>
              </div>

              {/* EXPANDABLE "WHY THIS AUDIENCE?" (Section 20) */}
              <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs space-y-2">
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-espresso cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><HelpCircle size={13} className="text-gold" /> Why this audience forecast?</span>
                  {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showExplanation && (
                  <div className="pt-2 border-t border-espresso/10 space-y-1.5 text-[10px] text-muted leading-relaxed font-sans animate-in fade-in">
                    {pred.audienceExplanation.map((exp, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-gold font-bold">•</span>
                        <span>{exp}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIONABLE RECOMMENDATIONS (Section 17) */}
              <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl space-y-2 text-amber-900">
                <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-600" /> Optimization Suggestions
                </span>
                <ul className="space-y-1 text-[10px] leading-tight">
                  {pred.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-amber-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MODEL DISCLAIMER (Section 13) */}
              <div className="text-[9px] text-muted text-center font-mono leading-tight px-1">
                {pred.modelLabel}
              </div>

            </div>

            {/* Total Budget Card */}
            <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-muted uppercase block">Escrow Protected Budget</span>
                <span className="text-lg font-extrabold text-espresso font-mono">₹{parseInt(formData.budgetInr).toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                Verified Escrow
              </span>
            </div>

          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 px-6 border-t border-espresso/10 bg-linen/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 bg-white hover:bg-linen text-espresso font-bold px-4 py-2 rounded-xl text-xs border border-espresso/15 cursor-pointer shadow-2xs transition-all"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-extrabold px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm ml-auto transition-all"
            >
              Next Step <ArrowRight size={14} className="text-gold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-espresso font-black px-7 py-3 rounded-xl text-xs cursor-pointer shadow-lg ml-auto uppercase tracking-wider transition-all transform hover:scale-102"
            >
              <Zap size={16} />
              <span>🚀 Deploy Campaign</span>
            </button>
          )}
        </div>

      </div>

      {/* MULTI-LOCATION RANKING MODAL (Section 15) */}
      {showLocationRankings && (
        <div className="fixed inset-0 bg-espresso/80 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 text-espresso max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div>
                <h3 className="font-extrabold text-base">Multi-Location Recommendation Engine</h3>
                <p className="text-xs text-muted">Locations ranked by expected campaign outcome based on actual cell feature values.</p>
              </div>
              <button onClick={() => setShowLocationRankings(false)} className="p-1 text-muted hover:text-espresso cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {rankedLocations.map((rankObj, idx) => (
                <div
                  key={rankObj.locationName}
                  onClick={() => {
                    setFormData({ ...formData, targetLocations: [rankObj.locationName] });
                    setShowLocationRankings(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    formData.targetLocations[0] === rankObj.locationName
                      ? 'border-gold bg-gold/15 text-espresso font-bold ring-2 ring-gold/40'
                      : 'border-espresso/10 bg-white hover:border-gold'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gold">#{idx + 1}</span>
                      <strong className="text-sm text-espresso font-extrabold font-sans">{rankObj.locationName}</strong>
                      <span className="text-[10px] text-muted">({rankObj.city})</span>
                    </div>
                    <div className="text-[10px] text-muted space-x-3 font-sans">
                      <span>Qual. Audience: <strong>{rankObj.qualifiedAudience.toLocaleString('en-IN')}</strong></span>
                      <span>Est. Reach: <strong>{rankObj.estimatedReach.toLocaleString('en-IN')}</strong></span>
                      <span>Est. Leads: <strong className="text-espresso">{rankObj.expectedLeads.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-black text-espresso bg-linen/50 px-2.5 py-1 rounded-lg block">
                      {rankObj.audienceQualityScore} / 100 Score
                    </span>
                    <span className="text-[10px] text-green-700 font-bold block">{rankObj.estimatedCpl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
