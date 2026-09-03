"use client";
import React, { useState } from 'react';
import { 
  Sparkles, Cpu, Play, CheckCircle, AlertTriangle, ArrowRight, 
  BarChart2, Layers, MapPin, Users, Target, ShieldCheck, Clock, 
  DollarSign, Activity, TrendingUp, Award, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function AiCampaignPlanner({ onDeployDraft }) {
  const [prompt, setPrompt] = useState("");
  const [targetCity, setTargetCity] = useState("Chennai");
  const [budgetVal, setBudgetVal] = useState("250000");
  const [objectiveVal, setObjectiveVal] = useState("Product Sampling");
  const [durationVal, setDurationVal] = useState(7);
  const [shiftHoursVal, setShiftHoursVal] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: objectiveVal,
          budget: Number(budgetVal) || 250000,
          cities: [targetCity],
          targetAudience: prompt || 'Metro Youth & Fitness Enthusiasts (18-35)',
          durationDays: Number(durationVal) || 7,
          shiftHours: Number(shiftHoursVal) || 5,
          startHour: 16,
          radiusKm: 3.0,
          selectedInterests: ['fitness', 'foodies', 'fashion']
        })
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch (err) {
      console.error('Failed to generate AI plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white border border-espresso/10 p-6 rounded-2xl shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="text-gold" size={24} />
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">
              Unified Campaign Intelligence & Planning Engine
            </h2>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Generate mathematical, H3-calibrated campaign forecasts. Staffing, hourly footfall, physical capacity, and conversions are derived from the unified Ziggers intelligence pipeline.
          </p>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Activation Objective</label>
              <select
                value={objectiveVal}
                onChange={(e) => setObjectiveVal(e.target.value)}
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
              >
                <option>Product Sampling</option>
                <option>Lead Generation</option>
                <option>App Downloads</option>
                <option>Store Visits</option>
                <option>Retail Activation & POSM</option>
                <option>Merchant Onboarding Drive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Target Metro Hub</label>
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
              >
                <option value="Chennai">Chennai Hub</option>
                <option value="Bangalore">Bangalore Hub</option>
                <option value="Mumbai">Mumbai Hub</option>
                <option value="Hyderabad">Hyderabad Hub</option>
                <option value="Delhi NCR">Delhi NCR Hub</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Campaign Budget (₹ INR)</label>
              <input
                type="number"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                placeholder="250000"
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-xs font-semibold text-espresso focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Duration (Days)</label>
              <select
                value={durationVal}
                onChange={(e) => setDurationVal(e.target.value)}
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2.5 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
              >
                <option value={1}>1 Day Activation</option>
                <option value={3}>3 Days (Weekend Drive)</option>
                <option value={7}>7 Days (Full Sprint)</option>
                <option value={14}>14 Days (Two Weeks)</option>
                <option value={30}>30 Days (Month Long)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Target fitness enthusiasts and college students in high-footfall high streets..."
              className="flex-1 bg-linen/25 border border-espresso/15 rounded-xl px-4 py-3 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Calculating Forecast on Edge...' : '✨ Generate AI Blueprint'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated AI Blueprint Result */}
      {generatedPlan && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Banner with Model Info */}
          <div className="bg-espresso text-white rounded-3xl p-6 md:p-8 shadow-xl border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider bg-gold/20 px-2.5 py-0.5 rounded border border-gold/30">
                    {generatedPlan.planId?.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-green-400 bg-green-950/60 px-2.5 py-0.5 rounded border border-green-800">
                    {generatedPlan.modelMetadata?.modelType || 'Unified Pipeline v2.1'}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-1.5">{generatedPlan.name}</h3>
                <p className="text-xs text-linen/70 mt-0.5 font-medium">
                  {generatedPlan.cities?.join(', ')} • {generatedPlan.durationDays} Days • {generatedPlan.operatingWindow} ({generatedPlan.shiftHours} hrs/shift)
                </p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-[10px] text-linen/70 uppercase block font-mono">Audience Quality Score</span>
                  <strong className="text-3xl font-extrabold text-gold font-mono">
                    {generatedPlan.scores?.audienceQualityScore || 88}<span className="text-sm font-normal text-linen/50">/100</span>
                  </strong>
                </div>
              </div>
            </div>

            {/* Core KPI Metrics Grid with Range Tooltips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Optimal Staffing</span>
                <strong className="text-white text-base block mt-1">
                  {generatedPlan.headcount} Promoters
                </strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">
                  +{generatedPlan.supervisorCount} Supervisor(s)
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Projected Reach</span>
                <strong className="text-white text-base block mt-1">
                  {(generatedPlan.metrics?.projectedReach || 0).toLocaleString('en-IN')}
                </strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">
                  Range: {generatedPlan.ranges?.reach?.rangeStr || 'N/A'}
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Expected Interactions</span>
                <strong className="text-white text-base block mt-1">
                  {(generatedPlan.metrics?.projectedInteractions || 0).toLocaleString('en-IN')}
                </strong>
                <span className="text-[9px] text-linen/50 block mt-0.5">
                  Range: {generatedPlan.ranges?.interactions?.rangeStr || 'N/A'}
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-[9px] text-linen/70 uppercase block font-sans">Estimated CPL</span>
                <strong className="text-green-400 text-base block mt-1">
                  {generatedPlan.metrics?.estimatedCpl || 'N/A'}
                </strong>
                <span className="text-[9px] text-green-400/80 block mt-0.5">
                  ROI: {generatedPlan.metrics?.projectedRoi || '3.2x'}
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Detailed Intelligence View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Explanations, Location Ranking & Staffing Strategy */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Explainable Insights Card */}
              <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-espresso/10 pb-3">
                  <Activity className="text-gold" size={18} />
                  <h4 className="text-sm font-extrabold text-espresso tracking-tight">
                    Transparent Algorithmic Rationale ("Why this blueprint?")
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  {generatedPlan.explanation?.topReasons?.map((reason, idx) => (
                    <div key={idx} className="p-3 bg-linen/25 rounded-xl border border-espresso/5 flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-green-700 flex-shrink-0 mt-0.5" />
                      <span className="text-espresso font-medium leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Staffing Strategy Box */}
                <div className="p-4 bg-linen/30 rounded-xl border border-espresso/10 space-y-1.5 text-xs">
                  <strong className="text-espresso font-bold uppercase tracking-wider text-[10px] block">
                    Dual-Constrained Staffing Strategy
                  </strong>
                  <p className="text-muted leading-relaxed">
                    {generatedPlan.staffingStrategy}
                  </p>
                </div>
              </div>

              {/* Multi-Location Comparative Rankings */}
              {generatedPlan.rankedLocationDetails && generatedPlan.rankedLocationDetails.length > 0 && (
                <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gold" size={18} />
                      <h4 className="text-sm font-extrabold text-espresso tracking-tight">
                        Comparative Candidate Location Rankings
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-muted uppercase">Ranked by Campaign Suitability</span>
                  </div>

                  <div className="space-y-3">
                    {generatedPlan.rankedLocationDetails.map((cand, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border transition-all ${
                          idx === 0 
                            ? 'bg-gold/10 border-gold/40 shadow-xs' 
                            : 'bg-linen/20 border-espresso/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                              idx === 0 ? 'bg-espresso text-gold' : 'bg-espresso/10 text-espresso'
                            }`}>
                              #{cand.rank}
                            </span>
                            <strong className="text-xs font-extrabold text-espresso">{cand.locationName}</strong>
                            <span className="text-[10px] text-muted">({cand.secClassification})</span>
                          </div>

                          <div className="text-right font-mono">
                            <span className="text-[10px] font-bold text-espresso bg-white px-2 py-0.5 rounded border border-espresso/10">
                              Score: {cand.campaignScore}/100
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] font-mono text-muted">
                          <div>Reach: <strong className="text-espresso font-bold">{cand.estimatedReach?.toLocaleString('en-IN')}</strong></div>
                          <div>Expected Leads: <strong className="text-espresso font-bold">{cand.expectedLeads?.toLocaleString('en-IN')}</strong></div>
                          <div>Est. CPL: <strong className="text-green-700 font-bold">{cand.estimatedCpl}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right 1 Col: Financial Waterfall & Deployment CTA */}
            <div className="space-y-6">
              
              {/* Financial Escrow Waterfall */}
              <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-espresso/10 pb-3">
                  <DollarSign className="text-gold" size={18} />
                  <h4 className="text-sm font-extrabold text-espresso tracking-tight">
                    100% Reconciled Financial Waterfall
                  </h4>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-muted">
                    <span>Gross Budget (Inclusive GST 18%):</span>
                    <strong className="text-espresso">{generatedPlan.budget}</strong>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Taxable Net Campaign Base:</span>
                    <strong className="text-espresso font-bold">
                      ₹{generatedPlan.financials?.financialOverview?.netCampaignFund?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Promoter Wage Pool (60%):</span>
                    <strong className="text-espresso">{generatedPlan.financials?.formatted?.promoterWagePool}</strong>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Supervisor Lead Fee (10%):</span>
                    <strong className="text-espresso">{generatedPlan.financials?.formatted?.supervisorLeadFee}</strong>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Platform Telemetry (8%):</span>
                    <strong className="text-espresso">{generatedPlan.financials?.formatted?.platformOsFee}</strong>
                  </div>
                  <div className="flex justify-between items-center text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                    <span>Instant Escrow Reserve (22%):</span>
                    <strong className="font-bold">{generatedPlan.financials?.formatted?.instantEscrowReserve}</strong>
                  </div>
                </div>
              </div>

              {/* Mandatory Audit Checkpoints */}
              <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-extrabold text-espresso uppercase tracking-wider">
                  Mandatory Execution Audit Protocol
                </h4>
                <div className="space-y-2 text-xs">
                  {generatedPlan.auditParameters?.map((param, idx) => (
                    <div key={idx} className="p-2.5 bg-linen/25 rounded-xl border border-espresso/5 flex items-start gap-2">
                      <ShieldCheck size={14} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-espresso font-medium leading-tight">{param}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onDeployDraft && onDeployDraft(generatedPlan)}
                  className="w-full bg-espresso hover:bg-muted text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-4"
                >
                  <Play size={14} className="text-gold" />
                  <span>Deploy Blueprint to Live Console</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
