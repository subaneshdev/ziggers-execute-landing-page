"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import CampaignStepper from './CampaignStepper';
import CampaignSummaryPanel from './CampaignSummaryPanel';
import DraftSaveIndicator from './DraftSaveIndicator';

import Step1BasicDetails from './steps/Step1BasicDetails';
import Step2BrandIntelligence from './steps/Step2BrandIntelligence';
import Step3ActivationIdea from './steps/Step3ActivationIdea';
import Step4TargetAudience from './steps/Step4TargetAudience';
import Step5LocationGeography from './steps/Step5LocationGeography';
import Step6ActivationRequirements from './steps/Step6ActivationRequirements';
import Step7PartnerCoordination from './steps/Step7PartnerCoordination';
import Step8WorkforcePlanning from './steps/Step8WorkforcePlanning';
import Step9ExecutionPlan from './steps/Step9ExecutionPlan';
import Step10BudgetApproval from './steps/Step10BudgetApproval';
import { adaptCampaignProfile } from '@/lib/intelligence/brandAdaptation';
import { generateCampaignForecast } from '@/lib/intelligence/clientForecast';
import { generateActivationRequirements, generateTopObjectiveActivationPlans } from '@/lib/ecosystem/btlTaxonomy';

const STEPS = [
  { id: 1, name: '1. Basic Details' },
  { id: 2, name: '2. Brand & Product' },
  { id: 3, name: '3. Activation Idea' },
  { id: 4, name: '4. Audience' },
  { id: 5, name: '5. Locations' },
  { id: 6, name: '6. Requirements' },
  { id: 7, name: '7. Partners' },
  { id: 8, name: '8. Workforce' },
  { id: 9, name: '9. Plan' },
  { id: 10, name: '10. Budget & Launch' }
];

const INITIAL_DRAFT = {
  name: '',
  brand: '',
  productOrService: '',
  productDescription: '',
  priceRange: '',
  existingBrief: '',
  objective: 'Brand Awareness',
  selectedObjectives: ['Brand Awareness'],
  customObjectiveText: '',
  campaignDurationDays: 3,
  campaignDays: 3,
  estimatedBudget: 75000,
  budgetInr: 75000,
  blueprintActive: false,
  brandCategory: 'Retail',
  brandSubcategory: 'D2C Consumer Products & Lifestyle',
  brandProductLine: 'Consumer Product / Service',
  brandPricePositioning: 'Mid-Market',
  activationPath: 'ai',
  customActivationIdea: '',
  btlFormat: 'Brand Awareness & High-Visibility Reach',
  activationPlan: null,
  audienceName: 'Primary Target Audience',
  ageRange: [20, 35],
  gender: 'All',
  occupation: 'Working Professionals & Active Consumers',
  incomeSegment: 'SEC A/B (Upper Middle & Affluent)',
  lifeStage: 'Early Career & Urban Adults',
  selectedInterests: ['lifestyle & retail', 'brand discovery', 'shopping'],
  behaviours: ['Regular high-street & mall shoppers', 'Digital brand followers'],
  locations: [
    {
      id: 'loc_1',
      name: 'Chennai Central Commercial Hub',
      city: 'Chennai',
      lat: 13.0827,
      lng: 80.2707,
      radiusKm: 3.0,
      radiusText: '3 km radius',
      analyzed: false
    }
  ],
  suggestedEnvironments: [],
  activationRequirements: [],
  workforceDeploymentMode: 'ziggers',
  promoterCount: 4,
  supervisorCount: 1,
  shiftHours: 5,
  shiftStartTime: '10:00',
  shiftEndTime: '15:00',
  promoterDailyRate: 1200,
  supervisorDailyRate: 1800,
  requiredSkills: ['Customer Engagement', 'Product Pitching', 'English & Regional Language'],
  dressCode: 'Branded Uniform / Professional Attire',
  forecast: null
};

export default function CampaignCreationLayout({ initialDraft = null }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState(initialDraft || INITIAL_DRAFT);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  // Autosave to LocalStorage with cache sanity check
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ziggers_campaign_draft');
      if (saved && !initialDraft) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // If stored draft was the old legacy hardcoded Red Bull / Energy Drink mock without a brand name, clear it
          const isLegacyMock = (parsed.brandSubcategory === 'Beverage → Energy Drink' || parsed.productLine === 'Energy Drink Can (250ml)') && (!parsed.brand || parsed.brand.toLowerCase() !== 'red bull');
          if (isLegacyMock) {
            localStorage.removeItem('ziggers_campaign_draft');
          } else {
            setDraft(prev => ({ ...prev, ...parsed }));
          }
        }
      }
    } catch (e) {
      console.warn('Autosave notice:', e.message);
    }
  }, [initialDraft]);

  // Ensure forecast is populated on mount
  useEffect(() => {
    setDraft(prev => {
      if (prev.forecast && prev.forecast.capacity?.status) return prev;
      try {
        const rawBudget = prev.budgetInr ?? prev.estimatedBudget;
        const initialBudget = (rawBudget !== undefined && rawBudget !== null && rawBudget !== '')
          ? Number(rawBudget)
          : 75000;
        const fc = generateCampaignForecast({
          targetLocations: (prev.locations || []).map(l => l.name || 'Chennai Central Commercial Hub'),
          radiusKm: prev.locations?.[0]?.radiusKm || 3.0,
          ageMin: Array.isArray(prev.ageRange) ? prev.ageRange[0] : 20,
          ageMax: Array.isArray(prev.ageRange) ? prev.ageRange[1] : 35,
          gender: prev.gender || 'All',
          selectedInterests: prev.selectedInterests || [],
          objective: prev.objective || 'Brand Awareness',
          shiftHours: Number(prev.shiftHours || 5),
          campaignDays: Number(prev.campaignDurationDays || prev.campaignDays || 3),
          budgetInr: initialBudget,
          city: prev.locations?.[0]?.city || 'Chennai'
        });
        return {
          ...prev,
          forecast: fc,
          promoterCount: fc?.capacity?.promoterCount !== undefined ? fc.capacity.promoterCount : prev.promoterCount,
          supervisorCount: fc?.capacity?.supervisorCount !== undefined ? fc.capacity.supervisorCount : prev.supervisorCount
        };
      } catch (e) {
        return prev;
      }
    });
  }, []);

  const updateDraft = (patch) => {
    setDraft(prev => {
      let next = { ...prev, ...patch };

      // Check what changed
      const brandChanged = patch.brand !== undefined && patch.brand !== prev.brand && patch.brand.trim().length > 1;
      const productChanged = patch.productOrService !== undefined && patch.productOrService !== prev.productOrService && patch.productOrService.trim().length > 1;
      const objectiveChanged = patch.objective !== undefined && patch.objective !== prev.objective;
      const locationsChanged = patch.locations !== undefined && JSON.stringify(patch.locations) !== JSON.stringify(prev.locations);
      const budgetChanged = (patch.budgetInr !== undefined && patch.budgetInr !== prev.budgetInr) || 
                            (patch.estimatedBudget !== undefined && patch.estimatedBudget !== prev.estimatedBudget);
      const scheduleChanged = (patch.campaignDurationDays !== undefined && patch.campaignDurationDays !== prev.campaignDurationDays) ||
                              (patch.campaignDays !== undefined && patch.campaignDays !== prev.campaignDays) ||
                              (patch.shiftHours !== undefined && patch.shiftHours !== prev.shiftHours);
      const audienceChanged = (patch.ageRange !== undefined && JSON.stringify(patch.ageRange) !== JSON.stringify(prev.ageRange)) ||
                              (patch.gender !== undefined && patch.gender !== prev.gender) ||
                              (patch.selectedInterests !== undefined && JSON.stringify(patch.selectedInterests) !== JSON.stringify(prev.selectedInterests));

      // 1. Intelligent Brand & Audience Adaptation
      if (brandChanged || productChanged || (objectiveChanged && !prev.blueprintActive)) {
        try {
          const adapted = adaptCampaignProfile({
            brandName: next.brand,
            productOrService: next.productOrService,
            objective: next.objective,
            city: next.locations?.[0]?.city || 'Chennai',
            existingDraft: next
          });
          next = { ...next, ...adapted, ...patch };
        } catch (e) {
          console.warn('Brand profile adaptation notice:', e);
        }
      }

      // 2. Intelligent Real-Time Forecast & Staffing Recalculation
      if (brandChanged || productChanged || objectiveChanged || locationsChanged || budgetChanged || scheduleChanged || audienceChanged) {
        try {
          const rawBudget = next.budgetInr ?? next.estimatedBudget;
          const currentBudget = (rawBudget !== undefined && rawBudget !== null && rawBudget !== '')
            ? Number(rawBudget)
            : 75000;
          const currentDays = Number(next.campaignDurationDays || next.campaignDays || 3);
          const currentHours = Number(next.shiftHours || 5);
          const locNames = (next.locations || []).map(l => l.name || l.label || 'Chennai Central Commercial Hub');

          const liveForecast = generateCampaignForecast({
            targetLocations: locNames.length > 0 ? locNames : ['Chennai Central Commercial Hub'],
            radiusKm: next.locations?.[0]?.radiusKm || 3.0,
            ageMin: Array.isArray(next.ageRange) ? next.ageRange[0] : 20,
            ageMax: Array.isArray(next.ageRange) ? next.ageRange[1] : 35,
            gender: next.gender || 'All',
            selectedInterests: next.selectedInterests || [],
            objective: next.objective || 'Brand Awareness',
            shiftHours: currentHours,
            campaignDays: currentDays,
            budgetInr: currentBudget,
            city: next.locations?.[0]?.city || 'Chennai'
          });

          if (liveForecast) {
            next.forecast = liveForecast;
            // Update staffing recommendation if not explicitly locked in this patch
            if (patch.promoterCount === undefined && liveForecast.capacity?.promoterCount !== undefined) {
              next.promoterCount = liveForecast.capacity.promoterCount;
            }
            if (patch.supervisorCount === undefined && liveForecast.capacity?.supervisorCount !== undefined) {
              next.supervisorCount = liveForecast.capacity.supervisorCount;
            }
          }
        } catch (forecastErr) {
          console.warn('Dynamic forecast calculation notice:', forecastErr.message);
        }

        // 3. Intelligent Requirements Adaptation
        if (objectiveChanged || locationsChanged || brandChanged) {
          try {
            const reqs = generateActivationRequirements({
              activationPlan: next.activationPlan,
              objective: next.objective,
              brandCategory: next.brandCategory || next.brandIndustry,
              productLine: next.brandProductLine || next.productOrService,
              brandName: next.brand,
              locationsCount: next.locations?.length || 1,
              city: next.locations?.[0]?.city || 'Chennai'
            });
            if (Array.isArray(reqs) && reqs.length > 0) {
              next.activationRequirements = reqs;
            }
          } catch (reqErr) {
            console.warn('Dynamic requirements adaptation notice:', reqErr.message);
          }
        }
      }

      try {
        localStorage.setItem('ziggers_campaign_draft', JSON.stringify(next));
        setLastSaved(new Date());
      } catch (e) {
        // ignore quota
      }
      return next;
    });
  };

  const handleManualSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ziggers_campaign_draft', JSON.stringify(draft));
      setLastSaved(new Date());
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const rawBudget = draft.budgetInr ?? draft.estimatedBudget;
      const effectiveBudget = (rawBudget !== undefined && rawBudget !== null && rawBudget !== '')
        ? Number(rawBudget)
        : 75000;

      const campaignName = draft.name?.trim() || (draft.brand ? `${draft.brand} ${draft.objective || 'Activation'} Campaign` : 'New Campaign Activation');

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          name: campaignName,
          title: campaignName,
          budget: effectiveBudget,
          budgetInr: effectiveBudget,
          estimatedBudget: effectiveBudget,
          status: 'DRAFT_READY'
        })
      });
      const data = await res.json();
      if (data.success) {
        setCreatedCampaign(data.campaign);
        setIsSuccess(true);
        try {
          localStorage.removeItem('ziggers_campaign_draft');
        } catch (e) {
          // ignore
        }
      } else {
        console.error('Publish error:', data.error);
        alert(data.error || 'Failed to deploy campaign');
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert('Error deploying campaign: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen/15 flex flex-col font-sans text-espresso selection:bg-gold/30">
      
      {/* Top Creation Header */}
      <header className="bg-white border-b border-espresso/10 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="p-2 rounded-xl text-muted hover:text-espresso hover:bg-linen/40 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-gold bg-espresso px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Campaign Engine
                </span>
                <DraftSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-espresso tracking-tight truncate max-w-[200px] sm:max-w-md">
                {draft.name || (draft.brand ? `${draft.brand} Campaign` : 'New Campaign Blueprint')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-espresso/15 text-xs font-bold text-espresso hover:bg-linen/30 transition-colors cursor-pointer"
            >
              <Save size={13} />
              <span>Save Draft</span>
            </button>

            {currentStep === STEPS.length ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-espresso hover:bg-muted text-white text-xs font-black px-5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? <Loader2 size={13} className="animate-spin text-gold" /> : <Sparkles size={13} className="text-gold" />}
                <span>Launch Campaign</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="bg-espresso hover:bg-muted text-white text-xs font-black px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={13} className="text-gold" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Stepper Header Navigation */}
      <div className="bg-white border-b border-espresso/10 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <CampaignStepper 
            currentStep={currentStep} 
            steps={STEPS} 
            onStepClick={(stepNum) => setCurrentStep(stepNum)} 
          />
        </div>
      </div>

      {/* Main Campaign Builder Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          
          {/* Active Step Content */}
          <div className="flex-1 w-full bg-white border border-espresso/15 rounded-3xl p-6 sm:p-8 shadow-xs">
            {currentStep === 1 && <Step1BasicDetails draft={draft} onUpdate={updateDraft} />}
            {currentStep === 2 && <Step2BrandIntelligence draft={draft} onUpdate={updateDraft} />}
            {currentStep === 3 && <Step3ActivationIdea draft={draft} onUpdate={updateDraft} />}
            {currentStep === 4 && <Step4TargetAudience draft={draft} onUpdate={updateDraft} />}
            {currentStep === 5 && <Step5LocationGeography draft={draft} onUpdate={updateDraft} />}
            {currentStep === 6 && <Step6ActivationRequirements draft={draft} onUpdate={updateDraft} />}
            {currentStep === 7 && <Step7PartnerCoordination draft={draft} onUpdate={updateDraft} onJumpToStep={(s) => setCurrentStep(s)} />}
            {currentStep === 8 && <Step8WorkforcePlanning draft={draft} onUpdate={updateDraft} />}
            {currentStep === 9 && <Step9ExecutionPlan draft={draft} onJumpToStep={(s) => setCurrentStep(s)} />}
            {currentStep === 10 && (
              <Step10BudgetApproval 
                draft={draft} 
                onUpdate={updateDraft}
                onJumpToStep={(s) => setCurrentStep(s)}
                isPublishing={isPublishing}
                isSuccess={isSuccess}
                createdCampaign={createdCampaign}
                onNavigateHome={() => router.push('/dashboard')}
                onPublish={handlePublish}
              />
            )}
          </div>

          {/* Right-Side Live Campaign Summary */}
          {!isSuccess && (
            <CampaignSummaryPanel 
              draft={draft} 
              onJumpToStep={(s) => setCurrentStep(s)} 
            />
          )}

        </div>
      </main>

      {/* Fixed Sticky Footer Navigation */}
      {!isSuccess && (
        <footer className="bg-white border-t border-espresso/10 py-4 px-6 sticky bottom-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <button
              type="button"
              onClick={handleManualSave}
              className="text-xs font-bold text-muted hover:text-espresso flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save size={14} />
              <span>Save Progress</span>
            </button>

            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl border border-espresso/15 hover:border-espresso/30 text-xs font-extrabold text-espresso transition-all cursor-pointer bg-white"
                >
                  Previous
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} className="text-gold" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-8 py-2.5 rounded-xl bg-espresso hover:bg-muted text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? <Loader2 size={14} className="animate-spin text-gold" /> : <Sparkles size={14} className="text-gold" />}
                  <span>Launch Campaign</span>
                </button>
              )}
            </div>

          </div>
        </footer>
      )}

    </div>
  );
}
