"use client";
import React, { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, Upload, MapPin, Calculator, 
  Calendar, ShieldCheck, FileText, Image as ImageIcon, Video, 
  User, Phone, Sparkles, AlertCircle, Clock, DollarSign, Users, Briefcase, Zap,
  Target, Sliders, Layers, Award, Building, School, ShoppingBag, Eye, TrendingUp,
  BarChart2, Info, CheckCircle2, GraduationCap, Utensils, Hotel, Dumbbell, Train
} from 'lucide-react';
import { calculateAudienceIntelligence, locationIntelligenceDb } from '@/lib/audienceEngine';

export default function CampaignCreator({ onClose, onPublish }) {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: 'T. Nagar Store Launch & Product Sampling',
    brand: 'Artisan Cafe & Bakery',
    objective: 'Product Sampling',
    targetArea: 'T. Nagar & Ranganathan Street',
    radiusKm: 3,
    ageRange: [18, 35],
    gender: 'All',
    secCategory: 'SEC A/B (Mid-High Income)',
    selectedPersonas: ['shoppers', 'foodies', 'luxury'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    shiftTiming: 'Evening Prime (04:00 PM - 09:00 PM)',
    peopleType: 'Energetic Brand Promoters & Sampling Specialists',
    workersRequired: 15,
    budget: 35000,
    instructions: 'Engage shoppers near high-street entries. Hand out sample drink vouchers with live phone OTP lead capture.'
  });

  // Calculate 7-Layer Audience Intelligence Output
  const intel = calculateAudienceIntelligence(formData);

  // Structured Objectives
  const objectives = [
    { id: 'Product Sampling', title: 'Product Sampling', desc: 'Distribute FMCG, beverage, or food trials with photo evidence.', icon: '🥤' },
    { id: 'Store Visits', title: 'Store Visits & Launch', desc: 'Drive neighborhood foot traffic and queue buzz for retail outlets.', icon: '🎉' },
    { id: 'Brand Awareness', title: 'Brand Awareness', desc: 'Maximize on-ground brand presence in high-density metro hubs.', icon: '📢' },
    { id: 'Lead Generation', title: 'Lead Generation', desc: 'Capture verified names, phone numbers, and survey responses via OTP.', icon: '📋' },
    { id: 'App Downloads', title: 'App Installs', desc: 'Guided app installs, promo code redemptions, and user onboarding.', icon: '📱' },
    { id: 'Event Promotion', title: 'Event Promotion', desc: 'Promote college expos, marathons, concerts, and trade shows.', icon: '🎟️' },
    { id: 'Recruitment', title: 'On-Field Recruitment', desc: 'Direct merchant & partner onboarding drives.', icon: '💼' }
  ];

  const togglePersona = (key) => {
    setFormData(prev => {
      const exists = prev.selectedPersonas.includes(key);
      if (exists) {
        return { ...prev, selectedPersonas: prev.selectedPersonas.filter(k => k !== key) };
      } else {
        return { ...prev, selectedPersonas: [...prev.selectedPersonas, key] };
      }
    });
  };

  const handleLaunch = () => {
    onPublish({
      name: formData.name,
      brand: formData.brand,
      objective: formData.objective,
      city: intel.city,
      budget: `₹${parseInt(formData.budget).toLocaleString('en-IN')}`,
      workers: formData.workersRequired,
      locations: 1,
      targetCpl: intel.estimatedCpl,
      actualCpl: intel.estimatedCpl,
      status: true,
      stage: 'Live'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/70 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white text-espresso border border-espresso/15 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh] font-sans">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-espresso/10 flex items-center justify-between bg-espresso text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold text-espresso flex items-center justify-center font-black text-sm shadow-md">
              Z
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30 uppercase">
                  Audience Intelligence Console
                </span>
                <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">
                  Campaign Studio
                </h2>
              </div>
              <p className="text-[11px] text-linen/70 mt-0.5">
                Census Demographics • MOSPI Affluence Scoring • Google POIs • Footfall Curves
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 1 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              1. Objective
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 2 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              2. Geography & POIs
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 3 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              3. Demographics & Affluence
            </span>
            <span className="text-linen/40">→</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${step === 4 ? 'bg-gold text-espresso' : 'text-linen/70'}`}>
              4. Intent Personas
            </span>
          </div>

          <button onClick={onClose} className="text-linen/70 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Main 2-Column Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow overflow-y-auto">
          
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 p-6 space-y-6 text-xs text-espresso border-b lg:border-b-0 lg:border-r border-espresso/10">
            
            {/* STEP 1: Campaign Objective */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 1: Campaign Objective Selection
                  </span>
                  <p className="text-xs text-muted font-medium">
                    What is your primary activation goal? The Ziggers engine adjusts lead conversion rates and promoter capacity caps based on your selection.
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
                      placeholder="e.g. Artisan Cafe, D2C Beverage"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                    Select Campaign Objective *
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

            {/* STEP 2: Geography & POI Infrastructure Map */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 2: Target Location & Physical POIs
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Search your target geofence node. The system fetches live Google Places/Mappls POI counts for education, retail, office, and transit nodes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                      Search Location Node *
                    </label>
                    <select
                      value={formData.targetArea}
                      onChange={(e) => setFormData({ ...formData, targetArea: e.target.value })}
                      className="w-full bg-white border border-espresso/15 rounded-xl px-3.5 py-2.5 text-xs text-espresso font-extrabold focus:outline-none focus:border-gold"
                    >
                      {Object.keys(locationIntelligenceDb).map((area) => (
                        <option key={area} value={area}>
                          📍 {area} ({locationIntelligenceDb[area].city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                      <span>Geofence Radius</span>
                      <span className="text-gold font-mono font-extrabold">{formData.radiusKm}.0 KM Radius</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.radiusKm}
                      onChange={(e) => setFormData({ ...formData, radiusKm: parseInt(e.target.value) })}
                      className="w-full accent-gold cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Google Places / Mappls POI Infrastructure Grid */}
                <div className="bg-espresso text-white rounded-3xl p-5 space-y-4 shadow-xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gold" size={18} />
                      <h3 className="font-extrabold text-sm text-white">
                        Geospatial POI Infrastructure ({intel.nodeName})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-gold font-bold bg-gold/20 px-2.5 py-0.5 rounded-full border border-gold/30">
                      Google Places / Mappls Layer
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <School size={11} className="text-gold" /> Schools
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.schools}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <GraduationCap size={11} className="text-gold" /> Colleges
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.colleges}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <ShoppingBag size={11} className="text-gold" /> Malls
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.malls}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Building size={11} className="text-gold" /> Offices
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.offices}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Utensils size={11} className="text-gold" /> Restaurants
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.restaurants}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Hotel size={11} className="text-gold" /> Hotels
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.hotels}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Dumbbell size={11} className="text-gold" /> Gyms
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.gyms}</strong>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-[9px] text-linen/70 uppercase block font-bold flex items-center gap-1">
                        <Train size={11} className="text-gold" /> Transit Hubs
                      </span>
                      <strong className="text-white text-base block mt-0.5">{intel.poiCounts.transit}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Demographics & Ziggers Economic Affluence Score */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 3: Demographics & Economic Affluence Score
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Calibrated against Census C-14 5-year age bands and MOSPI 2023-24 Urban MPCE household consumption statistics.
                  </p>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted">
                      <span className="flex items-center gap-1"><Users size={12} className="text-gold" /> Census C-14 Age Filter</span>
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
                      Gender Ratio Filter
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

                {/* Ziggers Economic Affluence Score Meter (MOSPI Calibrated) */}
                <div className="bg-white border border-espresso/10 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                        Ziggers Economic Affluence Score (MOSPI HCES Calibrated Model)
                      </span>
                      <p className="text-[11px] text-muted font-medium mt-0.5">
                        Est. MPCE Household Income: <strong className="text-espresso font-mono">{intel.mpceIncomeEstimate}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gold/20 text-espresso border border-gold/40 px-3 py-1.5 rounded-xl">
                      <TrendingUp size={14} className="text-gold" />
                      <span className="text-sm font-extrabold font-mono">{intel.affluenceScore} / 100</span>
                    </div>
                  </div>

                  {/* Affluence Scale Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="h-3 w-full bg-linen/50 rounded-full overflow-hidden flex relative">
                      <div
                        className="bg-gradient-to-r from-amber-500 via-gold to-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${intel.affluenceScore}%` }}
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

            {/* STEP 4: Location-Intent Personas & AI Rationale */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-linen/30 p-4 rounded-2xl border border-espresso/10 space-y-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                    Step 4: Location-Intent Personas & Confidence Bounds
                  </span>
                  <p className="text-xs text-muted font-medium">
                    Personas are inferred by mapping POIs and demographic signals to location intent rather than third-party tracking cookies.
                  </p>
                </div>

                {/* Persona Rationale Grid */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Location-Intent Personas for {intel.nodeName}
                  </label>
                  <div className="space-y-2">
                    {intel.matchedPersonas.map((persona) => (
                      <div
                        key={persona.key}
                        onClick={() => togglePersona(persona.key)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          persona.isSelected
                            ? 'border-gold bg-gold/15 text-espresso ring-1 ring-gold shadow-2xs font-bold'
                            : 'border-espresso/10 bg-white text-muted hover:border-gold'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-espresso">{persona.name}</span>
                            <span className="text-[9px] font-mono font-bold bg-espresso/5 px-2 py-0.5 rounded text-gold">
                              Affinity: {persona.affinity}/100
                            </span>
                          </div>
                          <p className="text-[10px] text-muted leading-relaxed flex items-center gap-1">
                            <Sparkles size={11} className="text-gold shrink-0" />
                            <span><strong>AI Rationale:</strong> {persona.rationale}</span>
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          persona.isSelected ? 'bg-gold text-espresso border-gold' : 'border-espresso/20'
                        }`}>
                          {persona.isSelected && <Check size={12} className="font-bold" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidence Interval Card */}
                <div className="bg-white border border-espresso/10 p-4 rounded-2xl space-y-2 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                      <ShieldCheck size={14} className="text-green-600" /> Statistical Confidence Interval
                    </span>
                    <span className="text-xs font-mono font-extrabold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                      {intel.confidencePercent}% Model Confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Estimated Audience Range: <strong className="text-espresso font-mono text-xs">{intel.confidenceRangeStr}</strong> (±{intel.errorMarginPercent}% Census projection variance).
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: 3-Metric Separation & Media Planning Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-linen/20 space-y-5 text-xs text-espresso flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-espresso/10">
            
            <div className="space-y-4">
              
              {/* 3-METRIC SEPARATION SIDEBAR CARD */}
              <div className="bg-espresso text-white p-4 rounded-2xl shadow-md space-y-3.5 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                    <BarChart2 size={13} /> 3-Metric Media Planning
                  </span>
                  <span className="text-[9px] font-mono text-linen/70 font-bold">
                    Calibrated Output
                  </span>
                </div>

                <div className="space-y-2.5 font-mono">
                  {/* Metric 1: Potential Audience */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
                    <span className="text-[9px] text-gold uppercase font-bold block">1. Potential Audience</span>
                    <strong className="text-white text-sm block">{intel.potentialAudience.toLocaleString('en-IN')} People</strong>
                    <span className="text-[9px] text-linen/60 block leading-tight font-sans">Census demographic match in radius</span>
                  </div>

                  {/* Metric 2: Estimated Exposure */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5">
                    <span className="text-[9px] text-gold uppercase font-bold block">2. Estimated Exposure</span>
                    <strong className="text-white text-sm block">{intel.estimatedExposure.toLocaleString('en-IN')} People</strong>
                    <span className="text-[9px] text-linen/60 block leading-tight font-sans">Footfall & time-of-day exposure curve</span>
                  </div>

                  {/* Metric 3: Reachable Audience */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-0.5 bg-gold/10">
                    <span className="text-[9px] text-gold uppercase font-bold block">3. Reachable Audience (Physical Cap)</span>
                    <strong className="text-gold text-base block">{intel.reachableAudience.toLocaleString('en-IN')} Engagements</strong>
                    <span className="text-[9px] text-linen/60 block leading-tight font-sans">Bounded by promoters & shift hours</span>
                  </div>
                </div>
              </div>

              {/* Physical Promoter Interaction Throughput Meter */}
              <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs space-y-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Promoter Capacity vs Opportunity
                </span>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted">Promoters Assigned:</span>
                    <span className="font-bold text-espresso">{formData.workersRequired} Ziggers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Max Physical Capacity:</span>
                    <span className="font-bold text-espresso">{intel.physicalPromoterCapacity.toLocaleString('en-IN')} / Day</span>
                  </div>
                  <div className="flex justify-between border-t border-espresso/10 pt-1 mt-1">
                    <span className="text-muted">Est. Verified Leads:</span>
                    <span className="font-bold text-gold">{intel.expectedVerifiedLeads.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Est. Cost-Per-Lead:</span>
                    <span className="font-bold text-green-700">{intel.estimatedCpl}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Total Budget Card */}
            <div className="bg-white p-4 rounded-2xl border border-espresso/10 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-muted uppercase block">Total Escrow Budget</span>
                <span className="text-lg font-extrabold text-espresso font-mono">₹{parseInt(formData.budget).toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                Escrow Protected
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

          {step < 4 ? (
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
    </div>
  );
}
