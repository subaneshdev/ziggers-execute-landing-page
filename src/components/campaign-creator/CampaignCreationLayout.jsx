"use client";
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import CampaignStepper from './CampaignStepper';
import CampaignSummaryPanel from './CampaignSummaryPanel';
import DraftSaveIndicator from './DraftSaveIndicator';

import Step1BasicDetails from './steps/Step1BasicDetails';
const StepLoading = () => <p role="status" className="p-8 text-sm text-muted">Loading campaign details…</p>;
const Step2BrandIntelligence = dynamic(() => import('./steps/Step2BrandIntelligence'), { loading: StepLoading });
const Step3ActivationIdea = dynamic(() => import('./steps/Step3ActivationIdea'), { loading: StepLoading });
const Step4TargetAudience = dynamic(() => import('./steps/Step4TargetAudience'), { loading: StepLoading });
const Step5LocationGeography = dynamic(() => import('./steps/Step5LocationGeography'), { loading: StepLoading });
const Step6ActivationRequirements = dynamic(() => import('./steps/Step6ActivationRequirements'), { loading: StepLoading });
const Step7PartnerCoordination = dynamic(() => import('./steps/Step7PartnerCoordination'), { loading: StepLoading });
const Step8WorkforcePlanning = dynamic(() => import('./steps/Step8WorkforcePlanning'), { loading: StepLoading });
const Step9ExecutionPlan = dynamic(() => import('./steps/Step9ExecutionPlan'), { loading: StepLoading });
const Step10BudgetApproval = dynamic(() => import('./steps/Step10BudgetApproval'), { loading: StepLoading });
import { validateCampaignSchedule } from '@/lib/intelligence/schedule/scheduleEngine';
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
  startDate: '2026-10-15',
  endDate: '2026-10-17',
  dailyStartTime: '16:00',
  dailyEndTime: '21:00',
  timezone: 'Asia/Kolkata',
  campaignDurationDays: 3,
  campaignDays: 3,
  shiftHours: 5,
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
  const [formError, setFormError] = useState('');
  const stepContent = useRef(null);
  const draftChanged = useRef(false);
  const latestDraft = useRef(draft);

  const navigateToStep = (step) => {
    if (step > currentStep && currentStep === 1 && !validateBasics()) return;
    setFormError('');
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => stepContent.current?.focus({ preventScroll: true }));
  };

  const validateBasics = () => {
    const missing = [['name', 'campaign name'], ['brand', 'brand name'], ['productOrService', 'product or service']]
      .filter(([key]) => !draft[key]?.trim()).map(([, label]) => label);
    const schedule = validateCampaignSchedule(draft);
    const message = missing.length ? `Please add your ${missing.join(', ')}.`
      : !schedule.isValid ? schedule.errors.join(' ')
      : !Number.isFinite(Number(draft.budgetInr ?? draft.estimatedBudget)) || Number(draft.budgetInr ?? draft.estimatedBudget) <= 0
        ? 'Enter a campaign budget greater than ₹0.' : '';
    if (message) {
      setFormError(message);
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => stepContent.current?.focus({ preventScroll: true }));
      return false;
    }
    return true;
  };

  // Restore browser storage after the initial paint.
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 0);
    return () => clearTimeout(timer);
  }, [initialDraft]);

  // Ensure forecast is populated on mount
  useEffect(() => {
    const timer = setTimeout(() => setDraft(prev => {
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
          city: prev.locations?.[0]?.city || 'Chennai',
          startDate: prev.startDate || '2026-10-15',
          endDate: prev.endDate || '2026-10-17',
          dailyStartTime: prev.dailyStartTime || '16:00',
          dailyEndTime: prev.dailyEndTime || '21:00',
          timezone: prev.timezone || 'Asia/Kolkata',
          schedule: prev.schedule || null
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
    }), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    latestDraft.current = draft;
    if (!draftChanged.current || isSuccess) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('ziggers_campaign_draft', JSON.stringify(draft));
        setLastSaved(new Date());
      } catch {
        setFormError('Your draft could not be saved on this device. Keep this page open to avoid losing your work.');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, isSuccess]);

  useEffect(() => {
    const flushDraft = () => {
      if (!draftChanged.current) return;
      try {
        localStorage.setItem('ziggers_campaign_draft', JSON.stringify(latestDraft.current));
      } catch (error) {
        console.warn('Draft could not be saved before leaving:', error.message);
      }
    };
    window.addEventListener('pagehide', flushDraft);
    return () => {
      window.removeEventListener('pagehide', flushDraft);
      flushDraft();
    };
  }, []);

  const updateDraft = (patch) => {
    draftChanged.current = true;
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
                              (patch.shiftHours !== undefined && patch.shiftHours !== prev.shiftHours) ||
                              (patch.startDate !== undefined && patch.startDate !== prev.startDate) ||
                              (patch.endDate !== undefined && patch.endDate !== prev.endDate) ||
                              (patch.dailyStartTime !== undefined && patch.dailyStartTime !== prev.dailyStartTime) ||
                              (patch.dailyEndTime !== undefined && patch.dailyEndTime !== prev.dailyEndTime) ||
                              (patch.timezone !== undefined && patch.timezone !== prev.timezone) ||
                              (patch.schedule !== undefined && patch.schedule !== prev.schedule);
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
            city: next.locations?.[0]?.city || 'Chennai',
            startDate: next.startDate,
            endDate: next.endDate,
            dailyStartTime: next.dailyStartTime,
            dailyEndTime: next.dailyEndTime,
            timezone: next.timezone,
            schedule: next.schedule
          });

          if (liveForecast) {
            next.forecast = liveForecast;
            if (liveForecast.schedule?.campaignDays && patch.campaignDays === undefined && patch.campaignDurationDays === undefined) {
              next.campaignDays = liveForecast.schedule.campaignDays;
              next.campaignDurationDays = liveForecast.schedule.campaignDays;
            }
            if (liveForecast.schedule?.hoursPerDay && patch.shiftHours === undefined) {
              next.shiftHours = liveForecast.schedule.hoursPerDay;
            }
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

      return next;
    });
  };

  const handleManualSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('ziggers_campaign_draft', JSON.stringify(draft));
      setLastSaved(new Date());
    } catch {
      setFormError('Could not save your draft on this device. Keep this page open to avoid losing your work.');
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      navigateToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (isPublishing || !validateBasics()) return;
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
        draftChanged.current = false;
        setCreatedCampaign(data.campaign);
        setIsSuccess(true);
        try {
          localStorage.removeItem('ziggers_campaign_draft');
        } catch (e) {
          // ignore
        }
      } else {
        console.error('Publish error:', data.error);
        setFormError(data.error || 'Could not save your campaign. Please try again.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      setFormError('Could not save your campaign. Check your connection and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="campaign-builder min-h-screen bg-linen/30 flex flex-col font-sans text-espresso selection:bg-gold/30">
      
      {/* Top Creation Header */}
      <header className="bg-white border-b border-espresso/10 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              aria-label="Back to dashboard"
              className="p-2 rounded-xl text-muted hover:text-espresso hover:bg-linen/40 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-[10px] font-mono font-bold text-gold bg-espresso px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Create campaign
                </span>
                <DraftSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-espresso tracking-tight truncate max-w-[200px] sm:max-w-md">
                {draft.name || (draft.brand ? `${draft.brand} Campaign` : 'New Campaign Blueprint')}
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
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
            onStepClick={navigateToStep}
          />
        </div>
      </div>

      {/* Main Campaign Builder Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          
          {/* Active Step Content */}
          <div ref={stepContent} tabIndex={-1} aria-label={STEPS[currentStep - 1].name} className="campaign-step min-w-0 w-full bg-white border border-espresso/15 rounded-3xl p-4 sm:p-8 shadow-xs">
            {formError && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{formError}</div>}
            {currentStep === 1 && <Step1BasicDetails draft={draft} onUpdate={updateDraft} />}
            {currentStep === 2 && <Step2BrandIntelligence draft={draft} onUpdate={updateDraft} />}
            {currentStep === 3 && <Step3ActivationIdea draft={draft} onUpdate={updateDraft} />}
            {currentStep === 4 && <Step4TargetAudience draft={draft} onUpdate={updateDraft} />}
            {currentStep === 5 && <Step5LocationGeography draft={draft} onUpdate={updateDraft} />}
            {currentStep === 6 && <Step6ActivationRequirements draft={draft} onUpdate={updateDraft} />}
            {currentStep === 7 && <Step7PartnerCoordination draft={draft} onUpdate={updateDraft} onJumpToStep={navigateToStep} />}
            {currentStep === 8 && <Step8WorkforcePlanning draft={draft} onUpdate={updateDraft} />}
            {currentStep === 9 && <Step9ExecutionPlan draft={draft} onJumpToStep={navigateToStep} />}
            {currentStep === 10 && (
              <Step10BudgetApproval 
                draft={draft} 
                onUpdate={updateDraft}
                onJumpToStep={navigateToStep}
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
              onJumpToStep={navigateToStep}
            />
          )}

        </div>
      </main>

      {/* Fixed Sticky Footer Navigation */}
      {!isSuccess && (
        <footer className="bg-white border-t border-espresso/10 py-3 px-4 sm:px-6 sticky bottom-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <button
              type="button"
              onClick={handleManualSave}
              className="text-xs font-bold text-muted hover:text-espresso flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Save Progress</span><span className="sm:hidden">Save</span>
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
                  <span>Next: {STEPS[currentStep].name.replace(/^\d+\. /, '')}</span>
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
