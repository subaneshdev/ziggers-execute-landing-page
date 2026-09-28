"use client";
import React, { useState } from 'react';
import { 
  Users, ShieldCheck, Clock, Calendar, MapPin, 
  Check, UserCheck, Sparkles, DollarSign, Award, Layers 
} from 'lucide-react';

export default function Step8WorkforcePlanning({ draft, onUpdate }) {
  const {
    locations = [],
    campaignDurationDays = 3,
    campaignDays = 3,
    shiftHours = 5,
    shiftStartTime = '10:00',
    shiftEndTime = '15:00',
    workforceDeploymentMode = 'ziggers', // 'ziggers' | 'client'
    promoterCount = 4,
    supervisorCount = 1,
    promoterDailyRate = 1200,
    supervisorDailyRate = 1800,
    requiredSkills = ['Customer Engagement', 'Product Pitching', 'Sampling Hygiene', 'English & Tamil Speaking'],
    dressCode = 'Branded Polo T-Shirt & Clean Black Denims / Shoes'
  } = draft;

  const totalDays = campaignDurationDays || campaignDays || 3;
  const targetCity = locations[0]?.city || 'Chennai';

  const [newSkillInput, setNewSkillInput] = useState('');

  const toggleSkill = (skill) => {
    let next;
    if (requiredSkills.includes(skill)) {
      next = requiredSkills.filter(s => s !== skill);
    } else {
      next = [...requiredSkills, skill];
    }
    onUpdate({ requiredSkills: next });
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!requiredSkills.includes(newSkillInput.trim())) {
      onUpdate({ requiredSkills: [...requiredSkills, newSkillInput.trim()] });
    }
    setNewSkillInput('');
  };

  const totalPromoterPayout = promoterCount * promoterDailyRate * totalDays;
  const totalSupervisorPayout = supervisorCount * supervisorDailyRate * totalDays;
  const totalWorkforceCost = totalPromoterPayout + totalSupervisorPayout;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 8 • Workforce Planning & Shift Configuration
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          Who will be on the ground?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Define headcount, roles, shift timings, required skills, and choose between Ziggers managed deployment or client-provided workforce.
        </p>
      </div>

      {/* Insufficient Budget Callout */}
      {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
            ⚠️
          </div>
          <div className="space-y-1 flex-1 text-xs">
            <div className="flex items-center justify-between">
              <strong className="font-extrabold text-amber-950 uppercase font-mono tracking-wider">
                Workforce Constraint: BUDGET_INSUFFICIENT
              </strong>
              <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Min Required: {draft.forecast.capacity.minimumRequiredBudgetFormatted}
              </span>
            </div>
            <p className="text-amber-900 leading-relaxed font-semibold">
              {draft.forecast.capacity.staffingStrategy || 'Budget is insufficient to meet statutory promoter and supervisor minimum wages.'}
            </p>
            <p className="text-[11px] text-amber-800/80">
              Increase budget in Step 1 or reduce campaign duration to afford the minimum viable workforce deployment.
            </p>
          </div>
        </div>
      )}

      {/* Deployment Sourcing Choice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Option 1: Deploy Through Ziggers */}
        <div
          onClick={() => onUpdate({ workforceDeploymentMode: 'ziggers' })}
          className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
            workforceDeploymentMode === 'ziggers'
              ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40'
              : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-gold text-espresso flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
              workforceDeploymentMode === 'ziggers' ? 'bg-linen/20 text-gold' : 'bg-green-50 text-green-800'
            }`}>
              Ziggers Core
            </span>
          </div>

          <div>
            <strong className="text-sm font-black block font-serif">
              Deploy Through Ziggers Execute
            </strong>
            <p className={`text-xs mt-1 leading-relaxed ${workforceDeploymentMode === 'ziggers' ? 'text-linen/70' : 'text-muted'}`}>
              Ziggers sources, screens, trains, and manages verified promoters with GPS check-in verification and live attendance telemetry.
            </p>
          </div>
        </div>

        {/* Option 2: Client Provides Workforce */}
        <div
          onClick={() => onUpdate({ workforceDeploymentMode: 'client' })}
          className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
            workforceDeploymentMode === 'client'
              ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40'
              : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-linen/10 text-gold flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
              workforceDeploymentMode === 'client' ? 'bg-linen/20 text-gold' : 'bg-linen/40 text-espresso'
            }`}>
              Client Arranged
            </span>
          </div>

          <div>
            <strong className="text-sm font-black block font-serif">
              Client Provides Workforce
            </strong>
            <p className={`text-xs mt-1 leading-relaxed ${workforceDeploymentMode === 'client' ? 'text-linen/70' : 'text-muted'}`}>
              Your brand or existing agency will arrange promoters internally. Ziggers will still provide the tracking & verification portal.
            </p>
          </div>
        </div>

      </div>

      {/* Headcount, Roles & Shift Parameters */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        
        <div className="flex items-center justify-between border-b border-espresso/10 pb-3">
          <strong className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
            <Users size={14} className="text-gold" />
            <span>Headcount & Daily Payout Sizing</span>
          </strong>
          <span className="text-[10px] font-mono text-muted">
            {locations.length || 1} Activation Locations in {targetCity}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          {/* Promoters Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Sampling / Brand Promoters (Suggested Starting Count)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={promoterCount}
              onChange={(e) => onUpdate({ promoterCount: Number(e.target.value) || 1 })}
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
            />
            <span className="text-[10px] text-muted block">₹{promoterDailyRate}/day per promoter</span>
          </div>

          {/* Supervisors Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Field Supervisors (Suggested Count • 1:10 Ratio)</label>
            <input
              type="number"
              min={1}
              max={20}
              value={supervisorCount}
              onChange={(e) => onUpdate({ supervisorCount: Number(e.target.value) || 1 })}
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
            />
            <span className="text-[10px] text-muted block">₹{supervisorDailyRate}/day per supervisor</span>
          </div>

          {/* Shift Hours */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Daily Shift Window (Default Shift)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={shiftStartTime}
                onChange={(e) => onUpdate({ shiftStartTime: e.target.value })}
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-2 py-1.5 text-xs font-bold text-espresso"
              />
              <span className="text-muted font-bold text-[10px]">to</span>
              <input
                type="time"
                value={shiftEndTime}
                onChange={(e) => onUpdate({ shiftEndTime: e.target.value })}
                className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-2 py-1.5 text-xs font-bold text-espresso"
              />
            </div>
            <span className="text-[10px] text-muted block">{shiftHours} Hours Daily Duration</span>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Execution Duration</label>
            <input
              type="number"
              min={1}
              max={60}
              value={totalDays}
              onChange={(e) => onUpdate({ campaignDurationDays: Number(e.target.value) || 1, campaignDays: Number(e.target.value) || 1 })}
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3 py-2 text-xs font-bold text-espresso"
            />
            <span className="text-[10px] text-muted block">Total Days of On-Ground Work</span>
          </div>

        </div>

        {/* Required Skills Checklist */}
        <div className="space-y-2 pt-3 border-t border-espresso/10">
          <label className="block text-xs font-bold text-espresso">
            Required Promoter Skills & Spoken Languages ({requiredSkills.length})
          </label>

          <div className="flex flex-wrap gap-1.5">
            {['Customer Engagement', 'Product Pitching', 'Sampling Hygiene', 'English & Tamil Speaking', 'English & Hindi Speaking', 'App Demo Tech Savvy', 'Active Sports Background'].map((sk) => {
              const isSelected = requiredSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-espresso text-gold border-espresso shadow-xs'
                      : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/40'
                  }`}
                >
                  {isSelected ? `✓ ${sk}` : `+ ${sk}`}
                </button>
              );
            })}
          </div>

          <form onSubmit={addCustomSkill} className="flex gap-2 pt-1 max-w-sm">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add custom skill or language requirement..."
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

        {/* Dress Code */}
        <div className="space-y-1.5 pt-3 border-t border-espresso/10">
          <label className="block text-xs font-bold text-espresso">
            Mandatory Dress Code & On-Ground Presentation
          </label>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => onUpdate({ dressCode: e.target.value })}
            placeholder="e.g. Branded Polo T-Shirt, Black Denims, Clean Dark Sneakers"
            className="w-full bg-linen/20 border border-espresso/15 rounded-xl px-3.5 py-2 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
          />
        </div>

        {/* Cost Summary Card */}
        {workforceDeploymentMode === 'ziggers' && (
          <div className="p-4 bg-linen/25 border border-espresso/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-muted uppercase block">Total Workforce Payout (Direct to Workers)</span>
              <strong className="text-sm font-black text-espresso font-mono">
                ₹{totalWorkforceCost.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-muted block">
                {promoterCount} Promoters (₹{totalPromoterPayout.toLocaleString('en-IN')}) + {supervisorCount} Supervisor (₹{totalSupervisorPayout.toLocaleString('en-IN')}) for {totalDays} Days
              </span>
            </div>

            <span className="text-[10px] font-mono font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-xl self-start sm:self-auto">
              100% Escrow Protected
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
