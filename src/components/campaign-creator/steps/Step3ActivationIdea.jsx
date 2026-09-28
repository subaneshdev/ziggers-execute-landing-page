"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Compass, Edit3, 
  Search, ListOrdered, Layers, Check, ArrowRight, Lightbulb, MessageSquare,
  TrendingUp, Users, Target, Zap
} from 'lucide-react';
import { 
  BTL_ACTIVITY_LIBRARY, 
  generateObjectiveActivationPlan,
  generateTopObjectiveActivationPlans,
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

  // Generate top 3 activation blueprints tailored to brand, objective & audience
  const computeTop3 = () => {
    return generateTopObjectiveActivationPlans({
      objective,
      btlFormat,
      brandName: brand || 'Brand',
      brandCategory: brandIndustry || 'Retail',
      productLine: brandProductLine || 'Consumer Product',
      audienceName: draft.audienceName || `${brand || 'Target'} Audience`,
      ageRange,
      environments: suggestedEnvironments,
      city: locations[0]?.city || 'Chennai'
    });
  };

  const [topPlans, setTopPlans] = useState(() => computeTop3());

  // Determine current active plan
  const [currentPlan, setCurrentPlan] = useState(() => {
    if (activationPlan && activationPlan.activationName) {
      return activationPlan;
    }
    const plans = computeTop3();
    return plans[0];
  });

  // Re-generate top 3 when brand, objective, or product line updates
  useEffect(() => {
    const plans = computeTop3();
    setTopPlans(plans);

    if (activationPlan && activationPlan.activationName) {
      setCurrentPlan(activationPlan);
    } else {
      setCurrentPlan(plans[0]);
    }
  }, [brand, brandIndustry, brandProductLine, objective]);

  const [formatSearch, setFormatSearch] = useState('');
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editTitle, setEditTitle] = useState(currentPlan.activationName);
  const [editRationale, setEditRationale] = useState(currentPlan.whyThisActivationFits);

  const handleSelectPlan = (plan) => {
    setCurrentPlan(plan);
    const newRequirements = generateActivationRequirements({
      activationPlan: plan,
      objective,
      brandCategory: brandIndustry,
      productLine: brandProductLine,
      brandName: brand,
      locationsCount: locations.length || 1,
      city: locations[0]?.city || 'Chennai'
    });

    onUpdate({
      btlFormat: plan.activationName,
      activationPlan: plan,
      activationRequirements: newRequirements
    });
  };

  const handleApplyCustomIdea = () => {
    if (!customActivationIdea.trim()) return;
    const customPlan = {
      id: 'custom_user_plan',
      activationName: customActivationIdea.slice(0, 60),
      badge: 'Custom Tailored Blueprint',
      objective,
      strategicFocus: 'Custom On-Ground Execution • Audience Trial • Verified Outcomes',
      whyThisActivationFits: customActivationIdea,
      expectedImpact: 'Tailored customer touchpoints focused on direct consumer engagement.',
      targetAudienceSummary: `${draft.audienceName || 'Target Consumers'} (${ageRange[0]}–${ageRange[1]} yrs)`,
      recommendedLocations: (suggestedEnvironments || []).slice(0, 3).map(e => e.environment || e.type || e).join(' • ') || 'Commercial Hubs • Shopping Malls • Tech Parks',
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
    handleSelectPlan(customPlan);
  };

  const handleSelectFromLibrary = (formatName) => {
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
    handleSelectPlan(reGenerated);
  };

  const handleSaveInlineEdit = () => {
    const updated = {
      ...currentPlan,
      activationName: editTitle,
      whyThisActivationFits: editRationale
    };
    handleSelectPlan(updated);
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
          Step 3 • Activation Blueprints
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          Select Your Activation Strategy
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Ziggers intelligence generated the top 3 high-impact activation blueprints tailored to your objective (<strong>{objective}</strong>) and target audience. Select your preferred execution strategy or browse 75+ formats.
        </p>
      </div>

      {/* Top 3 Blueprint Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold" />
            <span>Top 3 Tailored Blueprints for {brand || 'Your Brand'}</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-muted">
            Click to compare & select
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {topPlans.map((plan, idx) => {
            const isSelected = (currentPlan?.activationName === plan.activationName) || 
                               (currentPlan?.id === plan.id) || 
                               (!currentPlan && idx === 0);
            return (
              <div
                key={plan.id || idx}
                onClick={() => handleSelectPlan(plan)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-lg ring-2 ring-gold/60'
                    : 'bg-white border-espresso/15 hover:border-espresso/35 text-espresso shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-gold text-espresso'
                        : 'bg-linen/60 text-espresso border border-espresso/10'
                    }`}>
                      Option {idx + 1} • {plan.badge || `Blueprint #${idx + 1}`}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-green-300 bg-green-950/60 px-2 py-0.5 rounded-full border border-green-700 flex items-center gap-1">
                        <Check size={11} strokeWidth={3} />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm sm:text-base font-black font-serif tracking-tight leading-snug ${
                    isSelected ? 'text-white' : 'text-espresso'
                  }`}>
                    {plan.activationName}
                  </h3>

                  <p className={`text-[11px] leading-relaxed line-clamp-3 font-medium ${
                    isSelected ? 'text-linen/80' : 'text-muted'
                  }`}>
                    {plan.whyThisActivationFits}
                  </p>
                </div>

                <div className={`pt-3 border-t space-y-2 text-xs ${
                  isSelected ? 'border-linen/15' : 'border-espresso/10'
                }`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-linen/60' : 'text-muted'}>Focus:</span>
                    <span className={`font-bold truncate max-w-[170px] ${isSelected ? 'text-gold' : 'text-espresso'}`}>
                      {plan.strategicFocus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-linen/60' : 'text-muted'}>Expected Impact:</span>
                    <span className={`font-medium truncate max-w-[170px] ${isSelected ? 'text-green-300' : 'text-green-700'}`}>
                      {plan.expectedImpact || 'High Conversion'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all mt-1 cursor-pointer ${
                      isSelected
                        ? 'bg-gold text-espresso shadow-xs'
                        : 'bg-linen/40 hover:bg-linen text-espresso border border-espresso/15'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={13} strokeWidth={2.5} />
                        <span>Selected Strategy</span>
                      </>
                    ) : (
                      <>
                        <span>Select Option {idx + 1}</span>
                        <ArrowRight size={12} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alternative Options: Custom Brief or Format Library */}
      <div className="bg-linen/25 border border-espresso/10 rounded-3xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-gold" />
            <strong className="text-xs font-bold text-espresso uppercase tracking-wider">
              Need A Custom Idea or Specialized Format?
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdate({ activationPath: activationPath === 'manual' ? 'ai' : 'manual' })}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activationPath === 'manual' 
                  ? 'bg-espresso text-gold border-espresso shadow-2xs' 
                  : 'bg-white border-espresso/15 text-espresso hover:bg-linen/50'
              }`}
            >
              <MessageSquare size={12} className="inline mr-1" />
              <span>Custom Brief</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFormatPicker(!showFormatPicker)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-espresso/15 text-gold hover:text-espresso hover:bg-linen/50 transition-all cursor-pointer flex items-center gap-1"
            >
              <Edit3 size={12} />
              <span>{showFormatPicker ? 'Hide Library' : 'Browse 75+ BTL Formats'}</span>
            </button>
          </div>
        </div>

        {/* Custom Idea Box */}
        {activationPath === 'manual' && (
          <div className="bg-white border border-espresso/15 rounded-2xl p-4 shadow-xs space-y-2.5 animate-in fade-in duration-150">
            <label className="block text-xs font-bold text-espresso">
              Describe Your Specific Execution Brief
            </label>
            <textarea
              rows={2}
              value={customActivationIdea}
              onChange={(e) => onUpdate({ customActivationIdea: e.target.value })}
              placeholder="e.g. We want an interactive sampling pop-up booth with spin-the-wheel instant giveaways and free samples across high-footfall tech parks..."
              className="w-full bg-linen/20 border border-espresso/15 rounded-xl p-3 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplyCustomIdea}
                className="px-4 py-2 bg-espresso hover:bg-muted text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Apply Custom Plan</span>
                <ArrowRight size={13} className="text-gold" />
              </button>
            </div>
          </div>
        )}

        {/* Format Library Browser */}
        {showFormatPicker && (
          <div className="space-y-3 pt-2 border-t border-espresso/10 animate-in fade-in duration-150">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-muted pointer-events-none" />
              <input
                type="text"
                value={formatSearch}
                onChange={(e) => setFormatSearch(e.target.value)}
                placeholder="Search formats (e.g. Gym sampling, Mall experience, College fest, Tech park roadshow)..."
                className="w-full bg-white border border-espresso/15 rounded-xl pl-9 pr-3 py-2 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredFormats.map(fmt => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => handleSelectFromLibrary(fmt.name)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                    (btlFormat || currentPlan.activationName) === fmt.name
                      ? 'bg-espresso text-gold border-espresso font-bold shadow-xs'
                      : 'bg-white border-espresso/10 text-espresso hover:bg-linen/50'
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

      {/* Selected Activation Plan Detailed Execution Blueprint Card */}
      <div className="bg-espresso text-linen p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl border border-gold/30">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-linen/15 pb-5">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider bg-linen/10 px-2.5 py-0.5 rounded-full">
                Selected Execution Blueprint
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
              <span>Edit Details</span>
            </button>
          )}
        </div>

        {/* How It Works: 8-Stage On-Ground Sequence */}
        <div className="space-y-3">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ListOrdered size={14} className="text-gold" />
            <span>How It Works (8-Stage On-Ground Execution Flow)</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {(currentPlan.executionFlow || []).map((step, idx) => (
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
