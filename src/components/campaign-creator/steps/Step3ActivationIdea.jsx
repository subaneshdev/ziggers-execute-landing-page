"use client";
import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Compass, Edit3, 
  Search, ListOrdered, Layers, Check, ArrowRight, Lightbulb, MessageSquare 
} from 'lucide-react';
import { 
  BTL_ACTIVITY_LIBRARY, 
  generateObjectiveActivationPlan,
  generateActivationRequirements 
} from '@/lib/ecosystem/btlTaxonomy';

export default function Step3ActivationIdea({ draft, onUpdate }) {
  const {
    brand = 'Brand',
    brandIndustry = 'Retail',
    brandProductLine = 'Product',
    objective = 'Product Sampling',
    locations = [],
    selectedInterests = [],
    ageRange = [20, 35],
    suggestedEnvironments = [],
    activationPath = 'ai', // 'manual' | 'ai'
    customActivationIdea = '',
    btlFormat = '',
    activationPlan = null
  } = draft;

  // Initialize or generate Objective-Driven Activation Plan
  const [currentPlan, setCurrentPlan] = useState(() => {
    if (activationPlan && activationPlan.activationName) {
      return activationPlan;
    }
    return generateObjectiveActivationPlan({
      objective,
      btlFormat,
      brandName: brand,
      brandCategory: brandIndustry,
      productLine: brandProductLine,
      audienceName: draft.audienceName || 'Target Audience',
      ageRange,
      environments: suggestedEnvironments,
      city: locations[0]?.city || 'Chennai'
    });
  });

  const [formatSearch, setFormatSearch] = useState('');
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editTitle, setEditTitle] = useState(currentPlan.activationName);
  const [editRationale, setEditRationale] = useState(currentPlan.whyThisActivationFits);

  const handleUpdatePlan = (newPlan, newFormat) => {
    setCurrentPlan(newPlan);
    const newRequirements = generateActivationRequirements({
      activationPlan: newPlan,
      objective,
      brandCategory: brandIndustry,
      productLine: brandProductLine,
      brandName: brand,
      locationsCount: locations.length || 1,
      city: locations[0]?.city || 'Chennai'
    });

    onUpdate({
      btlFormat: newFormat || newPlan.activationName,
      activationPlan: newPlan,
      activationRequirements: newRequirements
    });
  };

  const handleApplyCustomIdea = () => {
    if (!customActivationIdea.trim()) return;
    const customPlan = {
      activationName: customActivationIdea.slice(0, 60),
      objective,
      strategicFocus: 'Custom On-Ground Execution • Audience Trial • Verified Outcomes',
      whyThisActivationFits: customActivationIdea,
      targetAudienceSummary: `${draft.audienceName || 'Target Consumers'} (${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (suggestedEnvironments || []).slice(0, 3).map(e => e.environment || e).join(' • ') || 'Gyms • Fitness Corridors',
      executionFlow: [
        '1. Set up branded activation point at designated venue',
        '2. Deploy Ziggers verified field promoters and supervisor',
        '3. Approach target consumers with core product message',
        '4. Distribute product samples & conduct live demonstration',
        '5. Prompt consumers to scan dynamic QR code for feedback',
        '6. Monitor sample distribution velocity & stock levels',
        '7. Capture watermarked photo proof and GPS attendance',
        '8. Synthesize end-of-day execution report & telemetry'
      ]
    };
    handleUpdatePlan(customPlan, customPlan.activationName);
  };

  const handleSelectFormat = (formatName) => {
    setShowFormatPicker(false);
    const reGenerated = generateObjectiveActivationPlan({
      objective,
      btlFormat: formatName,
      brandName: brand,
      brandCategory: brandIndustry,
      productLine: brandProductLine,
      audienceName: draft.audienceName || 'Target Audience',
      ageRange,
      environments: suggestedEnvironments,
      city: locations[0]?.city || 'Chennai'
    });
    handleUpdatePlan(reGenerated, formatName);
  };

  const handleSaveInlineEdit = () => {
    const updated = {
      ...currentPlan,
      activationName: editTitle,
      whyThisActivationFits: editRationale
    };
    handleUpdatePlan(updated, editTitle);
    setIsEditingPlan(false);
  };

  const filteredFormats = BTL_ACTIVITY_LIBRARY.filter(f => 
    f.name.toLowerCase().includes(formatSearch.toLowerCase()) || 
    f.cluster.toLowerCase().includes(formatSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 3 • Define Campaign Idea
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          What activation do you want to run?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Choose whether you already have a specific activation concept in mind, or let Ziggers suggest high-performing formats based on your objective.
        </p>
      </div>

      {/* Two Paths Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Option A: I Already Have an Idea */}
        <div
          onClick={() => onUpdate({ activationPath: 'manual' })}
          className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
            activationPath === 'manual'
              ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40'
              : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-linen/10 text-gold flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activationPath === 'manual' ? 'bg-linen/20 text-gold' : 'bg-linen/40 text-espresso'
            }`}>
              Option A
            </span>
          </div>

          <div>
            <strong className="text-sm font-black block font-serif">
              I Already Have an Activation Idea
            </strong>
            <p className={`text-xs mt-1 leading-relaxed ${activationPath === 'manual' ? 'text-linen/70' : 'text-muted'}`}>
              Describe your idea in plain English (e.g. <em>&quot;We want to distribute samples to fitness enthusiasts through gyms in Chennai&quot;</em>).
            </p>
          </div>
        </div>

        {/* Option B: Help Me Plan the Activation */}
        <div
          onClick={() => onUpdate({ activationPath: 'ai' })}
          className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
            activationPath === 'ai'
              ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-gold/40'
              : 'bg-white border-espresso/15 hover:border-espresso/30 text-espresso'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-2xl bg-gold text-espresso flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activationPath === 'ai' ? 'bg-linen/20 text-gold' : 'bg-linen/40 text-espresso'
            }`}>
              Option B (AI Assisted)
            </span>
          </div>

          <div>
            <strong className="text-sm font-black block font-serif">
              Help Me Plan the Activation
            </strong>
            <p className={`text-xs mt-1 leading-relaxed ${activationPath === 'ai' ? 'text-linen/70' : 'text-muted'}`}>
              Ziggers recommends high-fit BTL formats based on your objective ({objective}), product, and target audience.
            </p>
          </div>
        </div>

      </div>

      {/* Option A: Custom Idea Input Box */}
      {activationPath === 'manual' && (
        <div className="bg-white border border-espresso/15 rounded-3xl p-5 shadow-xs space-y-3 animate-in fade-in duration-150">
          <label className="block text-xs font-bold text-espresso">
            Describe Your Activation Idea
          </label>
          <textarea
            rows={3}
            value={customActivationIdea}
            onChange={(e) => onUpdate({ customActivationIdea: e.target.value })}
            placeholder="e.g. We want to distribute free energy drink samples to fitness enthusiasts and gym members during peak morning and evening workout hours across top fitness centers in Chennai..."
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl p-3.5 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleApplyCustomIdea}
              className="px-5 py-2 bg-espresso hover:bg-muted text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Build Activation Plan</span>
              <ArrowRight size={13} className="text-gold" />
            </button>
          </div>
        </div>
      )}

      {/* Option B: Format Library Browser */}
      {activationPath === 'ai' && (
        <div className="bg-white border border-espresso/15 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-gold" />
              <strong className="text-xs font-bold text-espresso uppercase tracking-wider">
                Select from 75+ Tested BTL Activation Formats
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setShowFormatPicker(!showFormatPicker)}
              className="text-xs font-bold text-gold hover:text-espresso flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={12} />
              <span>{showFormatPicker ? 'Hide Library' : 'Browse All Formats'}</span>
            </button>
          </div>

          {showFormatPicker && (
            <div className="space-y-3 pt-2 border-t border-espresso/10 animate-in fade-in duration-150">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={formatSearch}
                  onChange={(e) => setFormatSearch(e.target.value)}
                  placeholder="Search formats (e.g. Gym sampling, Mall experience, College fest, Test ride)..."
                  className="w-full bg-linen/20 border border-espresso/15 rounded-xl pl-9 pr-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredFormats.map(fmt => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleSelectFormat(fmt.name)}
                    className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                      (btlFormat || currentPlan.activationName) === fmt.name
                        ? 'bg-espresso text-gold border-espresso font-bold shadow-xs'
                        : 'bg-linen/20 border-espresso/10 text-espresso hover:bg-linen/50'
                    }`}
                  >
                    <strong className="block text-[11px] truncate">{fmt.name}</strong>
                    <span className="text-[9px] text-muted block">{fmt.cluster}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approved Activation Plan Card */}
      <div className="bg-espresso text-linen p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl border border-gold/30">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-linen/15 pb-5">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider bg-linen/10 px-2.5 py-0.5 rounded-full">
                Approved Activation Plan
              </span>
              <span className="text-[10px] font-mono font-bold text-green-300 bg-green-950/60 px-2.5 py-0.5 rounded-full border border-green-800 flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>Objective-Aligned</span>
              </span>
            </div>

            {isEditingPlan ? (
              <div className="space-y-2 pt-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white/10 border border-linen/30 rounded-xl px-3 py-2 text-sm text-white font-bold"
                />
                <textarea
                  rows={2}
                  value={editRationale}
                  onChange={(e) => setEditRationale(e.target.value)}
                  className="w-full bg-white/10 border border-linen/30 rounded-xl p-3 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleSaveInlineEdit}
                  className="px-4 py-1.5 bg-gold text-espresso font-black text-xs rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-black text-white font-serif tracking-tight">
                  {currentPlan.activationName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-linen/80 flex-wrap pt-0.5">
                  <span>Goal: <strong className="text-gold">{objective}</strong></span>
                  <span>•</span>
                  <span>Focus: <strong className="text-white">{currentPlan.strategicFocus}</strong></span>
                </div>
              </>
            )}
          </div>

          {!isEditingPlan && (
            <button
              type="button"
              onClick={() => {
                setEditTitle(currentPlan.activationName);
                setEditRationale(currentPlan.whyThisActivationFits);
                setIsEditingPlan(true);
              }}
              className="text-xs font-bold text-gold hover:text-white flex items-center gap-1 cursor-pointer transition-colors self-start"
            >
              <Edit3 size={13} />
              <span>Edit Plan</span>
            </button>
          )}
        </div>

        {/* How It Works: 8-Stage On-Ground Sequence */}
        <div className="space-y-3">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ListOrdered size={14} className="text-gold" />
            <span>How It Works (On-Ground Execution Flow)</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {currentPlan.executionFlow.map((step, idx) => (
              <div key={idx} className="p-2.5 bg-linen/10 rounded-xl border border-linen/10 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="text-linen/90 font-medium text-[11px] leading-snug">{step.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
