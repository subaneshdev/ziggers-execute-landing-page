"use client";
import React, { useState } from 'react';
import { Sparkles, Cpu, Play, CheckCircle, AlertTriangle, ArrowRight, BarChart, Layers, MapPin, Users } from 'lucide-react';

export default function AiCampaignPlanner({ onDeployDraft }) {
  const [prompt, setPrompt] = useState("");
  const [targetCity, setTargetCity] = useState("Chennai");
  const [budgetVal, setBudgetVal] = useState("250000");
  const [objectiveVal, setObjectiveVal] = useState("Product Sampling");
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
          targetAudience: prompt || 'Metro Youth & Shoppers',
          promoterCount: Math.max(6, Math.round((Number(budgetVal) || 250000) / 18000)),
          durationDays: 7
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
            <h2 className="text-xl font-extrabold text-espresso tracking-tight">AI Campaign Planner & Simulator</h2>
          </div>
          <p className="text-xs text-muted mt-1">
            Describe your offline activation goal. The Edge AI engine calculates promoter headcount, inventory allocation, and venue recommendations backed by real-time benchmarks.
          </p>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Activation Objective</label>
              <select
                value={objectiveVal}
                onChange={(e) => setObjectiveVal(e.target.value)}
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
              >
                <option>Product Sampling</option>
                <option>Retail Activation & POSM</option>
                <option>Product Launch Roadshow</option>
                <option>Merchant Onboarding Drive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-espresso">Target Metro Hub</label>
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="w-full bg-linen/30 border border-espresso/10 rounded-xl px-3 py-2 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
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
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Target young professionals in tech parks and high-footfall malls..."
              className="flex-1 bg-linen/25 border border-espresso/15 rounded-xl px-4 py-3 text-xs font-semibold text-espresso focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="bg-gold hover:bg-gold/90 text-espresso font-extrabold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Calculating on Edge...' : '✨ Generate AI Blueprint'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated AI Draft Result & Simulator */}
      {generatedPlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="col-span-2 bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider block">Generated Edge Blueprint</span>
                <h3 className="text-base font-extrabold text-espresso">{generatedPlan.name}</h3>
              </div>
              <span className="text-xs font-mono font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Ready for Dispatch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-linen/30 border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] text-muted font-bold block uppercase">Budget</span>
                <strong className="text-espresso font-mono text-sm">{generatedPlan.budget}</strong>
              </div>
              <div className="p-3 bg-linen/30 border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] text-muted font-bold block uppercase">Headcount</span>
                <strong className="text-espresso font-mono text-sm">{generatedPlan.headcount} Promoters</strong>
              </div>
              <div className="p-3 bg-linen/30 border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] text-muted font-bold block uppercase">Est. Samples</span>
                <strong className="text-espresso font-mono text-sm">{(generatedPlan.metrics?.totalSamplesProjected || 0).toLocaleString()}</strong>
              </div>
              <div className="p-3 bg-linen/30 border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] text-muted font-bold block uppercase">Projected CPL</span>
                <strong className="text-green-700 font-mono text-sm">{generatedPlan.metrics?.estimatedCpl}</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-espresso uppercase tracking-wider text-[10px] block">Recommended High-Footfall Venues</span>
              <div className="flex flex-wrap gap-2">
                {generatedPlan.recommendedLocations?.map((loc, idx) => (
                  <span key={idx} className="bg-linen/40 px-3 py-1 rounded-lg text-espresso font-semibold text-xs border border-espresso/10">
                    📍 {loc}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-linen/20 rounded-xl text-xs space-y-2 border border-espresso/5">
              <strong className="text-espresso uppercase tracking-wider text-[10px] block">Wave Staffing Strategy:</strong>
              <p className="text-muted leading-relaxed">{generatedPlan.staffingStrategy}</p>
            </div>

            <button
              onClick={() => onDeployDraft && onDeployDraft(generatedPlan)}
              className="w-full bg-espresso hover:bg-muted text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Play size={14} />
              <span>Deploy Blueprint to Live Campaign Console</span>
            </button>
          </div>

          {/* Audit Checkpoints Sidebar */}
          <div className="bg-white border border-espresso/10 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-espresso uppercase tracking-wider">Mandatory Verification Audit</h3>
            <div className="space-y-2 text-xs">
              {generatedPlan.auditParameters?.map((param, idx) => (
                <div key={idx} className="p-3 bg-linen/25 rounded-xl border border-espresso/5 flex items-start gap-2">
                  <CheckCircle size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-espresso font-medium">{param}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
