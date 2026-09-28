"use client";
import React, { useState } from 'react';
import { 
  Sparkles, Globe, ShieldCheck, Check, Edit3, Loader2, ArrowRight, 
  Layers, ExternalLink, HelpCircle, CheckCircle2 
} from 'lucide-react';
import BrandAnalysisModal from '../ui/BrandAnalysisModal';

export default function Step2BrandIntelligence({ draft, onUpdate }) {
  const {
    brand = '',
    websiteUrl = '',
    productOrService = '',
    productDescription = '',
    priceRange = '',
    existingBrief = '',
    brandIndustry = '',
    brandCategory = '',
    brandSubcategory = '',
    brandProductLine = '',
    brandPricePositioning = '',
    blueprintActive = false,
    aiConfidence = 0.96
  } = draft;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const handleAnalyze = async () => {
    if (!brand.trim() && !websiteUrl.trim()) {
      setAnalysisError('Please enter at least a Brand Name or Website URL to run intelligence analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const res = await fetch('/api/brand/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brand,
          websiteUrl,
          productOrService,
          brandDescription: productDescription || existingBrief
        })
      });

      const data = await res.json();
      if (data.success && data.brand) {
        setAnalysisResult(data.brand);
        setShowAnalysisModal(true);
      } else {
        setAnalysisError(data.error || 'Brand intelligence lookup failed. Please verify the URL.');
      }
    } catch (err) {
      setAnalysisError('Brand intelligence lookup encountered a network error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAnalysis = (applied) => {
    onUpdate({
      blueprintActive: true,
      brand: applied.brand || brand,
      brandSummary: applied.brandSummary || '',
      brandIndustry: applied.brandIndustry || applied.brandCategory,
      brandCategory: applied.brandCategory,
      brandSubcategory: applied.brandSubcategory,
      brandProductLine: applied.brandProductLine || productOrService,
      brandPricePositioning: applied.brandPricePositioning || priceRange,
      brandBusinessModel: applied.brandBusinessModel,
      audiences: applied.audiences,
      activeAudienceTier: applied.activeAudienceTier,
      selectedAudience: applied.selectedAudience,
      audienceName: applied.audienceName,
      audienceDescription: applied.audienceDescription,
      ageRange: applied.ageRange || [20, 35],
      gender: applied.gender || 'All',
      selectedInterests: applied.selectedInterests || [],
      occupation: applied.occupation || 'Working Professionals',
      incomeSegment: applied.incomeSegment || 'Upper Middle',
      lifeStage: applied.lifeStage || 'Early Career',
      behaviours: applied.behaviours || [],
      suggestedEnvironments: applied.suggestedEnvironments || [],
      recommendedEnvironments: applied.recommendedEnvironments || [],
      aiConfidence: applied.aiConfidence || 0.97
    });
    setShowAnalysisModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">
          Step 2 • Brand & Product Intelligence
        </span>
        <h2 className="text-xl md:text-2xl font-black text-espresso tracking-tight font-serif mt-0.5">
          What are you promoting?
        </h2>
        <p className="text-xs text-muted mt-1 font-medium">
          Ziggers analyses your brand, product taxonomy, and price positioning to automatically infer audience blueprints and high-fit physical environments.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-espresso/15 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-espresso">
              Brand / Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => onUpdate({ brand: e.target.value })}
              placeholder="e.g. Nike, Starbucks, Zoho, Apple"
              className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-2.5 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-espresso">
              Website URL <span className="text-muted font-normal">(for deep scraping)</span>
            </label>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-3 text-muted pointer-events-none" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
                placeholder="https://www.yourbrand.com"
                className="w-full bg-linen/20 border border-espresso/15 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-espresso">
              Specific Product Being Promoted
            </label>
            <input
              type="text"
              value={productOrService}
              onChange={(e) => onUpdate({ productOrService: e.target.value, brandProductLine: e.target.value })}
              placeholder="e.g. Running Shoes, Cold Brew Coffee, Cloud CRM Suite"
              className="w-full bg-linen/20 border border-espresso/15 rounded-2xl px-4 py-2.5 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-espresso">
                Price Range / Product Positioning
              </label>
              <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2 py-0.5 rounded-full">
                Currency: ₹ INR
              </span>
            </div>
            
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-espresso text-xs select-none pointer-events-none">
                ₹
              </span>
              <input
                type="text"
                value={priceRange ? priceRange.replace(/^₹\s*/, '') : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const formatted = val ? (val.startsWith('₹') ? val : `₹ ${val}`) : '';
                  onUpdate({ priceRange: formatted, brandPricePositioning: formatted });
                }}
                placeholder="2,999 (Mid-to-Premium) or 150 (Affordable QSR)"
                className="w-full bg-linen/20 border border-espresso/15 rounded-2xl pl-8 pr-4 py-2.5 text-xs text-espresso font-semibold focus:outline-none focus:border-gold"
              />
            </div>

            {/* Quick Price Tier Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-muted font-medium">Quick Tiers:</span>
              {[
                { label: 'Under ₹100', tier: 'Under ₹100 (Mass Market / FMCG)' },
                { label: '₹100–₹500', tier: '₹100–₹500 (Affordable Consumer)' },
                { label: '₹500–₹2,500', tier: '₹500–₹2,500 (Mid-Market / Premium)' },
                { label: '₹2,500–₹10,000', tier: '₹2,500–₹10,000 (Upper Premium)' },
                { label: '₹10,000+', tier: '₹10,000+ (Luxury / Enterprise)' }
              ].map((pill) => {
                const isSelected = priceRange === pill.tier || priceRange.includes(pill.label);
                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => onUpdate({ priceRange: pill.tier, brandPricePositioning: pill.tier })}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-espresso text-gold border-espresso shadow-2xs'
                        : 'bg-linen/40 text-espresso/80 border-espresso/10 hover:bg-linen/80'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Product Description / Key USPs
          </label>
          <textarea
            rows={2}
            value={productDescription}
            onChange={(e) => onUpdate({ productDescription: e.target.value })}
            placeholder="e.g. Revitalizes body and mind, contains high quality ingredients like caffeine, taurine, B-group vitamins..."
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl p-3 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-espresso">
            Existing Campaign Brief / Context <span className="text-muted font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={existingBrief}
            onChange={(e) => onUpdate({ existingBrief: e.target.value })}
            placeholder="Paste any existing client brief notes, guidelines, or requirements..."
            className="w-full bg-linen/20 border border-espresso/15 rounded-2xl p-3 text-xs text-espresso focus:outline-none focus:border-gold font-medium"
          />
        </div>

        {analysisError && (
          <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
            {analysisError}
          </p>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-muted">
            {blueprintActive ? '✓ Brand Blueprint Active & Synchronized' : 'Ready to analyze brand taxonomy'}
          </span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={14} className="animate-spin text-gold" />
                <span>Analyzing Brand Taxonomy...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-gold" />
                <span>Run Brand Intelligence Analysis</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Reviewable Output Card */}
      {blueprintActive && (
        <div className="bg-espresso text-linen p-5 sm:p-6 rounded-3xl space-y-4 shadow-md border border-gold/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
                Reviewable Brand Taxonomy Output
              </span>
              <span className="text-[10px] font-mono font-bold text-green-300 bg-green-950/60 px-2 py-0.5 rounded-full border border-green-800 flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>{Math.round(aiConfidence * 100)}% Specificity Match</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAnalysisModal(true)}
              className="text-xs font-bold text-gold hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Edit3 size={13} />
              <span>Edit Blueprint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-linen/15">
            <div className="p-3 bg-linen/10 rounded-2xl border border-linen/10 space-y-1">
              <span className="text-[9px] font-bold text-gold uppercase block">Brand Category</span>
              <strong className="text-white block font-serif text-sm">
                {brandCategory || brandIndustry || 'FMCG'} 
                {brandSubcategory && ` → ${brandSubcategory}`}
              </strong>
            </div>

            <div className="p-3 bg-linen/10 rounded-2xl border border-linen/10 space-y-1">
              <span className="text-[9px] font-bold text-gold uppercase block">Product Line</span>
              <strong className="text-white block font-serif text-sm">
                {brandProductLine || productOrService || `${brand} Mainline`}
              </strong>
            </div>

            <div className="p-3 bg-linen/10 rounded-2xl border border-linen/10 space-y-1">
              <span className="text-[9px] font-bold text-gold uppercase block">Positioning</span>
              <strong className="text-white block font-serif text-sm">
                {brandPricePositioning || priceRange || 'Premium Segment'}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Brand Analysis Modal */}
      <BrandAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        brandData={analysisResult || {
          brand,
          brandIndustry,
          brandCategory,
          brandSubcategory,
          brandProductLine: brandProductLine || productOrService,
          brandPricePositioning: brandPricePositioning || priceRange,
          audiences: draft.audiences,
          activeAudienceTier: draft.activeAudienceTier || 'PRIMARY',
          suggestedEnvironments: draft.suggestedEnvironments || []
        }}
        onApply={handleApplyAnalysis}
      />

    </div>
  );
}
