"use client";
import React, { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, Upload, MapPin, Calculator, 
  Calendar, ShieldCheck, FileText, Image as ImageIcon, Video, 
  User, Phone, Sparkles, AlertCircle, Clock, DollarSign, Users, Briefcase, Zap
} from 'lucide-react';

export default function CampaignCreator({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Chennai Store Opening & Sampling',
    brand: 'Artisan Cafe & Bakery',
    objective: 'Store opening',
    targetArea: 'OMR IT Corridor & Tidel Park',
    radiusKm: 5,
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    shiftTiming: 'Full Day (10:00 AM - 06:00 PM)',
    peopleType: 'Friendly Brand Promoters & Flyer Distributors',
    workersRequired: 20,
    budget: 25000,
    instructions: 'Engage pedestrians, hand out sample drink vouchers and flyer menus with a warm greeting. Log verified QR scan leads and check in with GPS selfie.',
    briefingFile: 'Store_Opening_Flyer_Voucher.pdf',
    contactPerson: {
      name: 'Priya Narayanan (Store Owner)',
      phone: '+91 98401 55443',
      email: 'priya@artisancafe.in'
    }
  });

  // The 11 Objectives specified for Ziggers
  const objectives = [
    { id: 'Brand awareness', title: 'Brand Awareness', desc: 'Maximize high-visibility on-ground presence in high-traffic footfall zones.', icon: '📢' },
    { id: 'Product promotion', title: 'Product Promotion', desc: 'Promote new SKU launches with branded merchandise and live demonstrations.', icon: '🏷️' },
    { id: 'Store opening', title: 'Store Opening', desc: 'Drive neighborhood foot traffic and queue buzz for a new retail/restaurant outlet.', icon: '🎉' },
    { id: 'Sampling', title: 'Sampling', desc: 'Distribute cold beverages, food trials, or cosmetics with photo evidence.', icon: '🥤' },
    { id: 'Flyer distribution', title: 'Flyer Distribution', desc: 'Hand to hand pamphlet and coupon distribution in a geofenced radius.', icon: '📄' },
    { id: 'Lead generation', title: 'Lead Generation', desc: 'Capture customer names, phone numbers, and survey responses with SMS OTP.', icon: '📋' },
    { id: 'Event promotion', title: 'Event Promotion', desc: 'Promote college fests, marathon registrations, concerts, or regional exhibitions.', icon: '🎟️' },
    { id: 'App downloads', title: 'App Downloads', desc: 'On-ground assistants guide customers through app installs and KYC verification.', icon: '📱' },
    { id: 'Survey', title: 'Market Survey', desc: 'Collect structured consumer feedback and competitor price intelligence.', icon: '📊' },
    { id: 'Sales promotion', title: 'Sales Promotion', desc: 'Direct on-field sales incentives, merchant onboarding, and discount drives.', icon: '🛍️' },
    { id: 'On-ground activation', title: 'On-Ground Activation', desc: 'Full experiential kiosks, mascot engagement, flash mobs, and trade setups.', icon: '🎪' }
  ];

  // Quick Preset Templates for Small Businesses, D2C Brands & Agencies
  const presets = [
    {
      name: 'Small Restaurant Store Opening',
      brand: 'Artisan Cafe & Bakery',
      objective: 'Store opening',
      targetArea: 'OMR Food Street Hub',
      radiusKm: 3,
      workers: 5,
      budget: 10000,
      timing: 'Full Day (10 AM - 6 PM)',
      type: 'Flyer Distributors & Samplers'
    },
    {
      name: 'D2C Beverage Mega Sampling',
      brand: 'Pulse Energy Drink',
      objective: 'Sampling',
      targetArea: 'Indiranagar & Koramangala',
      radiusKm: 5,
      workers: 20,
      budget: 25000,
      timing: 'Full Day (10 AM - 6 PM)',
      type: 'Sampling Promoters'
    },
    {
      name: 'Regional Multi-City Metro Tour',
      brand: 'NeoBank Mobile App',
      objective: 'App downloads',
      targetArea: 'Chennai Central + Bangalore Indiranagar',
      radiusKm: 10,
      workers: 50,
      budget: 75000,
      timing: 'Full Day (10 AM - 6 PM)',
      type: 'Onboarding Agents'
    }
  ];

  const applyPreset = (p) => {
    setFormData(prev => ({
      ...prev,
      name: p.name,
      brand: p.brand,
      objective: p.objective,
      targetArea: p.targetArea,
      radiusKm: p.radiusKm,
      workersRequired: p.workers,
      budget: p.budget,
      shiftTiming: p.timing,
      peopleType: p.type
    }));
  };

  // Outcome Calculation Engine
  const calculateOutcome = (budgetAmount) => {
    const numBudget = parseInt(budgetAmount) || 25000;
    const workerDailyPayoutRate = 750;
    const estimatedWorkers = Math.max(1, Math.floor((numBudget * 0.60) / workerDailyPayoutRate));
    const estimatedReachMin = estimatedWorkers * 400;
    const estimatedReachMax = estimatedWorkers * 650;
    const workerPayoutTotal = estimatedWorkers * workerDailyPayoutRate;
    const platformFee = Math.round(numBudget * 0.10);
    const logisticsAndAudit = numBudget - workerPayoutTotal - platformFee;

    return {
      estimatedReach: `${estimatedReachMin.toLocaleString('en-IN')} – ${estimatedReachMax.toLocaleString('en-IN')} people`,
      workersRequired: estimatedWorkers,
      workerPayout: `₹${workerPayoutTotal.toLocaleString('en-IN')}`,
      platformFee: `₹${platformFee.toLocaleString('en-IN')}`,
      logisticsAudit: `₹${logisticsAndAudit.toLocaleString('en-IN')}`,
      totalCost: `₹${numBudget.toLocaleString('en-IN')}`,
      duration: '1 Day'
    };
  };

  const outcome = calculateOutcome(formData.budget);

  const handleLaunch = () => {
    onPublish({
      name: formData.name,
      brand: formData.brand,
      objective: formData.objective,
      city: formData.targetArea.split(' ')[0] || 'Chennai',
      budget: `₹${parseInt(formData.budget).toLocaleString('en-IN')}`,
      workers: outcome.workersRequired,
      locations: 1,
      targetCpl: '₹75',
      actualCpl: '₹62',
      status: true,
      stage: 'Live'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-espresso/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-white text-espresso border border-espresso/15 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh] font-sans">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-espresso/10 flex items-center justify-between bg-espresso text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold text-espresso flex items-center justify-center font-black text-xs shadow-xs">
              Z
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white uppercase">
                Create Offline Campaign
              </h2>
              <span className="text-[10px] text-gold font-bold block">
                Step {step} of 3 — {
                  step === 1 ? '1. Choose Campaign Objective' :
                  step === 2 ? '2. Define Audience & Geofence' :
                  '3. Set Budget & Instant Launch'
                }
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-linen/70 hover:text-white p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets Bar */}
        {step === 1 && (
          <div className="bg-linen/30 px-6 py-2.5 border-b border-espresso/10 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Sparkles size={11} className="text-gold" /> Quick Templates:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-[10px] font-bold bg-white hover:bg-gold hover:text-espresso text-espresso border border-espresso/10 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {p.name} (₹{p.budget.toLocaleString('en-IN')})
              </button>
            ))}
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 flex-grow overflow-y-auto text-xs text-espresso">
          
          {/* STEP 1: Choose Campaign Objective (11 Objectives) */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                    placeholder="e.g. Chennai Store Opening & Sampling"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-linen/25 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                    placeholder="e.g. Artisan Cafe, D2C Brand, Local Shop"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">
                  Select Campaign Objective *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {objectives.map((obj) => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, objective: obj.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        formData.objective === obj.id
                          ? 'border-gold bg-gold/15 text-espresso ring-1 ring-gold shadow-2xs font-bold'
                          : 'border-espresso/10 bg-white text-muted hover:border-gold hover:text-espresso'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{obj.icon}</span>
                          {formData.objective === obj.id && (
                            <span className="w-4 h-4 bg-gold text-espresso rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-xs text-espresso">{obj.title}</h4>
                        <p className="text-[10px] text-muted leading-tight mt-0.5">{obj.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Define Audience (Location -> Radius -> Date -> Time -> Type of people) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-linen/40 rounded-2xl border border-espresso/10 space-y-1">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                  🎯 Meta-Style Audience Abstraction
                </span>
                <p className="text-[11px] text-muted font-medium">
                  Instead of Meta's Age → Gender → Interests, Ziggers targets <strong>Location → Radius → Date → Time → Type of People Needed</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Target Location Area *
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                    <input
                      type="text"
                      value={formData.targetArea}
                      onChange={(e) => setFormData({ ...formData, targetArea: e.target.value })}
                      className="w-full bg-linen/20 border border-espresso/15 rounded-xl pl-9 pr-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-semibold"
                      placeholder="e.g. OMR IT Corridor / Anna Nagar / Indiranagar"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                    <span>Geofence Radius</span>
                    <span className="text-gold font-mono font-extrabold">{formData.radiusKm} KM Radius</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={formData.radiusKm}
                    onChange={(e) => setFormData({ ...formData, radiusKm: parseInt(e.target.value) })}
                    className="w-full accent-gold cursor-pointer mt-1"
                  />
                  <div className="flex justify-between text-[9px] text-muted font-mono mt-0.5">
                    <span>1 KM (Hyper Local Store)</span>
                    <span>5 KM (Metro Zone)</span>
                    <span>15 KM (Wide Hub)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Activation Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value, endDate: e.target.value })}
                    className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Shift Timings
                  </label>
                  <select
                    value={formData.shiftTiming}
                    onChange={(e) => setFormData({ ...formData, shiftTiming: e.target.value })}
                    className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold"
                  >
                    <option value="Full Day (10:00 AM - 06:00 PM)">Full Day (10 AM - 6 PM)</option>
                    <option value="Morning Rush (08:00 AM - 01:00 PM)">Morning Rush (8 AM - 1 PM)</option>
                    <option value="Evening Prime (04:00 PM - 09:00 PM)">Evening Prime (4 PM - 9 PM)</option>
                    <option value="Weekend Special (11:00 AM - 08:00 PM)">Weekend Special (11 AM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Type of People Needed
                  </label>
                  <input
                    type="text"
                    value={formData.peopleType}
                    onChange={(e) => setFormData({ ...formData, peopleType: e.target.value })}
                    className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold"
                    placeholder="e.g. Promoters, Samplers, Hosts"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                  Brief Instructions for Workers
                </label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-2.5 text-xs text-espresso focus:outline-none focus:border-gold"
                  placeholder="What should the Ziggers say or do on-field?"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Set Budget & Live Outcome Forecast */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                  Set Your Campaign Budget *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-muted text-sm">₹</span>
                    <input
                      type="number"
                      step="1000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-linen/25 border border-espresso/15 rounded-xl pl-8 pr-3 py-2.5 text-sm font-extrabold text-espresso focus:outline-none focus:border-gold font-mono"
                      placeholder="25000"
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {[10000, 25000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: amt })}
                        className="px-2.5 py-1 bg-white hover:bg-gold hover:text-espresso border border-espresso/15 rounded-xl text-[10px] font-mono font-bold text-espresso cursor-pointer transition-colors shadow-2xs"
                      >
                        ₹{(amt/1000)}k
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instant Outcome Box */}
              <div className="bg-linen/30 border border-gold/40 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    <h3 className="font-extrabold text-sm text-espresso">Estimated Campaign Outcome</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-gold/20 text-espresso px-2.5 py-0.5 rounded-full font-bold">
                    Algorithmic Forecast
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-white p-3 rounded-2xl border border-espresso/10">
                    <span className="text-[9px] text-muted uppercase font-bold block">Estimated Reach</span>
                    <strong className="text-espresso text-sm block mt-0.5">{outcome.estimatedReach}</strong>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-espresso/10">
                    <span className="text-[9px] text-muted uppercase font-bold block">Workers Required</span>
                    <strong className="text-gold text-sm block mt-0.5">{outcome.workersRequired} Ziggers</strong>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-espresso/10">
                    <span className="text-[9px] text-muted uppercase font-bold block">Worker Payout</span>
                    <strong className="text-espresso text-sm block mt-0.5">{outcome.workerPayout}</strong>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-espresso/10">
                    <span className="text-[9px] text-muted uppercase font-bold block">Platform & Audit</span>
                    <strong className="text-espresso text-sm block mt-0.5">{outcome.platformFee}</strong>
                  </div>
                </div>

                {/* Ziggers Handles Execution Guarantee */}
                <div className="p-3.5 bg-white rounded-2xl border border-espresso/10 text-[11px] text-muted flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-green-600 shrink-0" />
                  <span>
                    <strong className="text-espresso">Zero Staffing Hassles:</strong> Ziggers automatically matches Ziggers → assigns workers → briefs them → verifies GPS check-in → collects photo proofs → processes payouts.
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 px-6 border-t border-espresso/10 bg-linen/20 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 bg-white hover:bg-linen text-espresso font-bold px-4 py-2 rounded-xl text-xs border border-espresso/15 cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 bg-espresso hover:bg-muted text-white font-extrabold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm ml-auto"
            >
              Next Step <ArrowRight size={14} className="text-gold" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-espresso font-black px-6 py-2.5 rounded-xl text-xs cursor-pointer shadow-lg ml-auto uppercase tracking-wider transition-all transform hover:scale-102"
            >
              <Zap size={15} />
              <span>🚀 Launch Campaign</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
