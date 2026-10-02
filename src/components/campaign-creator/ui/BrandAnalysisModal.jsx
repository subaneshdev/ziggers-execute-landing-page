"use client";
import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  Layers, Users, MapPin, Search, Compass, Target, Clock, Zap, Check 
} from 'lucide-react';

export default function BrandAnalysisModal({ isOpen, onClose, brandData, onApply }) {
  const [activeTab, setActiveTab] = useState('primary');
  if (!isOpen || !brandData) return null;
  
  const classification = brandData.brandClassification || {
    industry: brandData.category || 'Automotive',
    subcategory: 'Motorcycles & Two-Wheelers',
    productCategory: brandData.productLine || 'Vehicles & Accessories',
    businessModel: 'B2C',
    pricePositioning: brandData.pricePositioning || 'Mid-to-Premium',
    decisionMaker: 'Individual Buyer / Commuter'
  };

  const audiences = brandData.audiences || {
    primary: {
      name: 'Primary Target Audience',
      whyTheyMatter: 'Core high-probability customers with immediate purchase intent.',
      ageRange: [20, 34],
      gender: 'All',
      spendingPower: 'Upper Middle',
      occupations: ['Young Working Professionals', 'College Students'],
      lifeStage: 'Early Career',
      interests: ['Motorcycling', 'Retro Style', 'Performance Tuning'],
      purchaseIntent: { stage: 'Active Research', signals: ['Comparing specs', 'Watching reviews'] },
      behaviours: ['Attends weekend road trips', 'Follows automotive reviews'],
      digitalSignals: {
        searchKeywords: ['price in india', 'specs comparison'],
        apps: ['YouTube', 'Google Maps'],
        youtubeCategories: ['Walkarounds', 'Test Rides'],
        communities: ['Automotive Enthusiast Forums']
      },
      environments: [
        {
          environment: 'Dealership Corridors & Test Ride Hubs',
          whyExists: 'High-intent buyers looking for test rides.',
          relevanceScore: 98,
          footfallQuality: 'High Purchase Intent',
          dwellTime: '45–90 mins',
          activationFormat: 'Test Ride Pod & Booking Desk'
        }
      ]
    }
  };

  const currentAudience = audiences[activeTab] || audiences.primary || {};

  const handleApply = () => {
    onApply({
      blueprintActive: true,
      brand: brandData.extractedAttributes?.brandName || 'Brand',
      brandSummary: brandData.brandSummary || '',
      brandIndustry: classification.industry,
      brandCategory: classification.industry,
      brandSubcategory: classification.subcategory,
      brandProductLine: classification.productCategory,
      brandPricePositioning: classification.pricePositioning,
      brandBusinessModel: classification.businessModel,
      brandPurchaseFrequency: classification.purchaseFrequency,
      brandDecisionMaker: classification.decisionMaker,
      
      // Full audience blueprints
      audiences,
      activeAudienceTier: activeTab,
      selectedAudience: currentAudience,
      audienceName: currentAudience.name,
      audienceDescription: `${currentAudience.name} — ${currentAudience.whyTheyMatter}`,
      ageRange: currentAudience.ageRange || [20, 35],
      gender: currentAudience.gender || 'All',
      selectedInterests: currentAudience.interests || [],
      occupation: (currentAudience.occupations || []).join(', ') || 'Working Professionals',
      incomeSegment: currentAudience.spendingPower || 'Upper Middle',
      lifeStage: currentAudience.lifeStage || 'Early Career',
      purchaseIntent: currentAudience.purchaseIntent || { stage: 'High Purchase Intent', signals: [] },
      behaviours: currentAudience.behaviours || [],
      digitalSignals: currentAudience.digitalSignals || {},
      
      // Environments
      suggestedEnvironments: currentAudience.environments || [],
      recommendedEnvironments: currentAudience.environments || [],
      recommendedGooglePlaceTypes: brandData.aiInferredAttributes?.recommendedGooglePlaceTypes || ['corporate', 'shopping_mall', 'university'],
      recommendedSearchQueries: (currentAudience.environments || []).map(e => e.environment.split(' ')[0]).slice(0, 4),
      
      aiConfidence: brandData.confidence || 0.96,
      brandSpecificityScore: brandData.specificityScore || 96
    });
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Brand analysis" className="fixed inset-0 bg-espresso/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-espresso/15 rounded-3xl max-w-4xl w-full shadow-2xl p-5 sm:p-7 space-y-6 max-h-[92vh] overflow-y-auto font-sans animate-in fade-in duration-150">
        
        {/* Header with Specificity Badge */}
        <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-espresso text-gold flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider block">
                  AI Brand Intelligence Report
                </span>
                <span className="text-[10px] font-mono font-black text-green-800 bg-green-50 border border-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck size={11} className="text-green-600" />
                  <span>{brandData.specificityScore || 96}% Specificity Score</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-espresso tracking-tight font-serif">
                {brandData.extractedAttributes?.brandName || 'Brand'} Strategic Intelligence Blueprint
              </h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} aria-label="Close dialog"
            className="p-1.5 rounded-xl text-muted hover:text-espresso hover:bg-linen/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Executive Summary Box */}
        <div className="p-4 bg-linen/20 border border-espresso/10 rounded-2xl space-y-1.5">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Executive Brand Synthesis</span>
          <p className="text-xs text-espresso font-medium leading-relaxed">
            {brandData.brandSummary || 'Brand positioning analyzed from live verified sources.'}
          </p>
        </div>

        {/* Brand Classification Matrix */}
        <div className="bg-white border border-espresso/10 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-gold" />
            <span>Brand Taxonomy & Commercial Classification</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Top Industry</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.industry}</strong>
            </div>

            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Subcategory</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.subcategory}</strong>
            </div>

            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Business Model</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.businessModel}</strong>
            </div>

            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Price Positioning</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.pricePositioning}</strong>
            </div>

            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Purchase Freq</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.purchaseFrequency || 'Regular'}</strong>
            </div>

            <div className="p-2.5 bg-linen/30 border border-espresso/10 rounded-xl space-y-0.5">
              <span className="text-[9px] font-bold text-muted uppercase block">Decision Maker</span>
              <strong className="text-[11px] font-extrabold text-espresso truncate block">{classification.decisionMaker?.split('(')[0] || 'Individual'}</strong>
            </div>
          </div>
        </div>

        {/* 3-Tab Audience Segment Explorer */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between border-b border-espresso/10 pb-2">
            <span className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-gold" />
              <span>Multi-Layer Audience Segments</span>
            </span>

            {/* Segment Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('primary')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'primary' 
                    ? 'bg-espresso text-gold shadow-xs' 
                    : 'bg-linen/40 text-espresso hover:bg-linen'
                }`}
              >
                Primary Audience (Core)
              </button>
              {audiences.secondary && (
                <button
                  type="button"
                  onClick={() => setActiveTab('secondary')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'secondary' 
                      ? 'bg-espresso text-gold shadow-xs' 
                      : 'bg-linen/40 text-espresso hover:bg-linen'
                  }`}
                >
                  Secondary (Adjacent)
                </button>
              )}
              {audiences.tertiary && (
                <button
                  type="button"
                  onClick={() => setActiveTab('tertiary')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'tertiary' 
                      ? 'bg-espresso text-gold shadow-xs' 
                      : 'bg-linen/40 text-espresso hover:bg-linen'
                  }`}
                >
                  Tertiary (Experimental)
                </button>
              )}
            </div>
          </div>

          {/* Active Audience Card */}
          <div className="bg-linen/15 border border-espresso/15 rounded-3xl p-5 space-y-5">
            
            {/* Header: Segment Title & Why They Matter */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-espresso">
                {currentAudience.name}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {currentAudience.whyTheyMatter}
              </p>
            </div>

            {/* 1. Demographics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase block">Age Bracket</span>
                <strong className="text-xs font-black text-espresso font-mono">
                  {currentAudience.ageRange ? `${currentAudience.ageRange[0]} – ${currentAudience.ageRange[1]} yrs` : '18–35 yrs'}
                </strong>
              </div>

              <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase block">Gender Target</span>
                <strong className="text-xs font-black text-espresso">{currentAudience.gender || 'All'}</strong>
              </div>

              <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase block">Spending Capacity</span>
                <strong className="text-xs font-black text-espresso">{currentAudience.spendingPower || 'Middle'}</strong>
              </div>

              <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase block">Life Stage</span>
                <strong className="text-xs font-black text-espresso">{currentAudience.lifeStage || 'Young Professional'}</strong>
              </div>
            </div>

            {/* Occupations */}
            {currentAudience.occupations && (
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Key Occupations / Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAudience.occupations.map(occ => (
                    <span key={occ} className="px-2.5 py-1 bg-white border border-espresso/10 text-espresso rounded-lg font-semibold text-[11px]">
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Core Specific Interests */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Target size={12} className="text-gold" />
                <span>Domain-Specific Interests</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(currentAudience.interests || []).map(int => (
                  <span key={int} className="px-3 py-1 bg-white border border-gold/40 text-espresso rounded-xl text-[11px] font-black shadow-2xs">
                    {int}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Purchase Intent & Behavioral Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentAudience.purchaseIntent && (
                <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase block">Purchase Intent Stage</span>
                    <span className="text-[10px] font-bold text-gold bg-espresso px-2 py-0.5 rounded-md font-mono">
                      {currentAudience.purchaseIntent.stage}
                    </span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-muted list-disc list-inside">
                    {(currentAudience.purchaseIntent.signals || []).map((sig, idx) => (
                      <li key={idx} className="leading-snug">{sig}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentAudience.behaviours && (
                <div className="p-3 bg-white border border-espresso/10 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase block">Behavioral Traits</span>
                  <ul className="space-y-1 text-[11px] text-muted list-disc list-inside">
                    {currentAudience.behaviours.map((beh, idx) => (
                      <li key={idx} className="leading-snug">{beh}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 4. Ranked Offline Activation Environments */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-black text-espresso uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-gold" />
                <span>Ranked Offline Activation Environments ({currentAudience.environments?.length || 0})</span>
              </span>

              <div className="space-y-2.5">
                {(currentAudience.environments || []).map((env, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-espresso/10 rounded-2xl space-y-2 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold/20 text-espresso font-mono font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <strong className="text-xs font-black text-espresso block">{env.environment}</strong>
                          <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{env.whyExists}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200 block">
                          {env.relevanceScore}% Match
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1 border-t border-espresso/5 text-[10px] text-muted flex-wrap font-mono">
                      <span><strong>Footfall:</strong> {env.footfallQuality}</span>
                      <span>•</span>
                      <span><strong>Dwell Time:</strong> {env.dwellTime}</span>
                      <span>•</span>
                      <span><strong>Activation:</strong> {env.activationFormat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-espresso/10">
          <span className="text-[11px] text-muted">
            Clicking &quot;Add to Blueprint&quot; locks this intelligence into the campaign context and automatically customizes downstream target audience and offline venues.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-espresso/15 text-xs font-bold text-espresso hover:bg-linen/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Add to Blueprint ({currentAudience.name?.split(' ')[0] || 'Audience'})</span>
              <ArrowRight size={14} className="text-gold" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
