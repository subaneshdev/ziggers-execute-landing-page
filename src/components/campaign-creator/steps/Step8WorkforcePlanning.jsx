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
    shiftStartTime = draft.dailyStartTime || draft.shiftStartTime || '16:00',
    shiftEndTime = draft.dailyEndTime || draft.shiftEndTime || '21:00',
    workforceDeploymentMode = 'ziggers', // 'ziggers' | 'client'
    promoterCount = 4,
    supervisorCount = 1,
    promoterDailyRate = 1200,
    supervisorDailyRate = 1800,
    requiredSkills = ['Customer Engagement', 'Product Pitching', 'Sampling Hygiene', 'English & Tamil Speaking'],
    dressCode = 'Branded Polo T-Shirt & Clean Black Denims / Shoes'
  } = draft;

  const totalDays = draft.campaignDays || campaignDurationDays || campaignDays || 3;
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
      
      {/* Step Header */}
      <div className="border-b border-espresso/10 pb-5">
        <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 8 • Workforce Planning & Shift Configuration
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight font-serif mt-1">
          Who will be on the ground?
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
          Define headcount, roles, shift timings, required skills, and choose between Ziggers managed deployment or client-provided workforce.
        </p>
      </div>

      {/* Insufficient Budget Callout */}
      {draft?.forecast?.capacity?.status === 'BUDGET_INSUFFICIENT' && (
        <div className="p-5 bg-amber-50 border border-amber-300 rounded-3xl flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-base">
            ⚠️
          </div>
          <div className="space-y-1 flex-1 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <strong className="font-extrabold text-amber-950 uppercase font-mono tracking-wider">
                Workforce Constraint: BUDGET_INSUFFICIENT
              </strong>
              <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
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

      {/* Section 01: Deployment Sourcing Choice */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
            01
          </span>
          <h3 className="text-xs font-black text-espresso uppercase tracking-wider">
            Workforce Deployment Sourcing Model
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option 1: Deploy Through Ziggers */}
          <div
            onClick={() => onUpdate({ workforceDeploymentMode: 'ziggers' })}
            className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 ${
              workforceDeploymentMode === 'ziggers'
                ? 'bg-espresso text-white border-espresso shadow-lg ring-2 ring-gold/40'
                : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gold text-espresso flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full ${
                workforceDeploymentMode === 'ziggers' ? 'bg-linen/20 text-gold' : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                Ziggers Core
              </span>
            </div>

            <div>
              <strong className="text-base font-black block font-serif">
                Deploy Through Ziggers Execute
              </strong>
              <p className={`text-xs mt-1.5 leading-relaxed ${workforceDeploymentMode === 'ziggers' ? 'text-linen/80' : 'text-muted'}`}>
                Ziggers sources, screens, trains, and manages verified promoters with GPS check-in verification and live attendance telemetry.
              </p>
            </div>
          </div>

          {/* Option 2: Client Provides Workforce */}
          <div
            onClick={() => onUpdate({ workforceDeploymentMode: 'client' })}
            className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 ${
              workforceDeploymentMode === 'client'
                ? 'bg-espresso text-white border-espresso shadow-lg ring-2 ring-gold/40'
                : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-linen/10 text-gold flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full ${
                workforceDeploymentMode === 'client' ? 'bg-linen/20 text-gold' : 'bg-linen/50 text-espresso'
              }`}>
                Client Arranged
              </span>
            </div>

            <div>
              <strong className="text-base font-black block font-serif">
                Client Provides Workforce
              </strong>
              <p className={`text-xs mt-1.5 leading-relaxed ${workforceDeploymentMode === 'client' ? 'text-linen/80' : 'text-muted'}`}>
                Your brand or existing agency will arrange promoters internally. Ziggers will still provide the tracking & verification portal.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Section 02: Headcount, Roles & Shift Parameters */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center">
                02
              </span>
              <h3 className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-2">
                <Users size={14} className="text-gold" />
                <span>Headcount, Daily Payout Rates & Shift Schedule</span>
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted">
              {locations.length || 1} Activation Locations in {targetCity}
            </span>
          </div>
          <p className="text-xs text-muted mt-1 ml-7">
            Staffing and shift hours are synchronized with your campaign schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
          
          {/* Promoters Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Sampling / Brand Promoters</label>
            <input
              type="number"
              min={1}
              max={100}
              value={promoterCount}
              onChange={(e) => onUpdate({ promoterCount: Number(e.target.value) || 1 })}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
            <span className="text-[10px] text-muted block">₹{promoterDailyRate}/day per promoter</span>
          </div>

          {/* Supervisors Count */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Field Supervisors (1:10 Ratio)</label>
            <input
              type="number"
              min={1}
              max={20}
              value={supervisorCount}
              onChange={(e) => onUpdate({ supervisorCount: Number(e.target.value) || 1 })}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
            <span className="text-[10px] text-muted block">₹{supervisorDailyRate}/day per supervisor</span>
          </div>

          {/* Shift Hours */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Daily Shift Window</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={shiftStartTime}
                onChange={(e) => onUpdate({ shiftStartTime: e.target.value, dailyStartTime: e.target.value })}
                className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-2 text-center text-xs font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
              <span className="text-muted font-bold text-xs">to</span>
              <input
                type="time"
                value={shiftEndTime}
                onChange={(e) => onUpdate({ shiftEndTime: e.target.value, dailyEndTime: e.target.value })}
                className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-2 text-center text-xs font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>
            <span className="text-[10px] text-muted block">{shiftHours} Hours Daily Duration</span>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="font-bold text-espresso block">Execution Duration (Days)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={totalDays}
              onChange={(e) => onUpdate({ campaignDurationDays: Number(e.target.value) || 1, campaignDays: Number(e.target.value) || 1 })}
              className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3 text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
            <span className="text-[10px] text-muted block">Total Days of On-Ground Work</span>
          </div>

        </div>

        {/* Section 03: Required Skills Checklist */}
        <div className="space-y-3 pt-4 border-t border-espresso/10">
          <label className="block text-xs font-bold text-espresso">
            Required Promoter Skills & Spoken Languages ({requiredSkills.length} selected)
          </label>

          <div className="flex flex-wrap gap-2">
            {['Customer Engagement', 'Product Pitching', 'Sampling Hygiene', 'English & Tamil Speaking', 'English & Hindi Speaking', 'App Demo Tech Savvy', 'Active Sports Background'].map((sk) => {
              const isSelected = requiredSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-espresso text-gold border-espresso shadow-xs ring-1 ring-gold/40'
                      : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                  }`}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={addCustomSkill} className="flex gap-2 pt-1 max-w-md">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add custom skill or language requirement..."
              className="flex-1 h-11 bg-linen/10 border border-espresso/15 rounded-xl px-3.5 text-xs text-espresso focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold font-medium transition-all"
            />
            <button
              type="submit"
              className="h-11 px-5 bg-espresso hover:bg-muted text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Add Skill
            </button>
          </form>
        </div>

        {/* Section 04: Dress Code */}
        <div className="space-y-2 pt-4 border-t border-espresso/10">
          <label className="block text-xs font-bold text-espresso">
            Mandatory Dress Code & On-Ground Presentation
          </label>
          <input
            type="text"
            value={dressCode}
            onChange={(e) => onUpdate({ dressCode: e.target.value })}
            placeholder="e.g. Branded Polo T-Shirt, Black Denims, Clean Dark Sneakers"
            className="w-full h-11 bg-linen/10 border border-espresso/15 rounded-xl px-4 text-xs sm:text-sm text-espresso font-semibold focus:bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>

        {/* Section 05: Cost Summary Card */}
        {workforceDeploymentMode === 'ziggers' && (
          <div className="p-5 sm:p-6 bg-linen/25 border border-espresso/15 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                Total Workforce Payout (Direct to Workers)
              </span>
              <strong className="text-base sm:text-lg font-black text-espresso font-mono block">
                ₹{totalWorkforceCost.toLocaleString('en-IN')}
              </strong>
              <span className="text-xs text-muted block">
                {promoterCount} Promoters (₹{totalPromoterPayout.toLocaleString('en-IN')}) + {supervisorCount} Supervisor (₹{totalSupervisorPayout.toLocaleString('en-IN')}) for {totalDays} Days
              </span>
            </div>

            <span className="text-xs font-mono font-bold text-green-800 bg-green-50 border border-green-300 px-3.5 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck size={14} className="text-green-600" />
              <span>100% Escrow Protected</span>
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
