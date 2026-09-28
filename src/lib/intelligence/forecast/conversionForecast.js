/**
 * Ziggers Intelligence - Conversion Forecast Engine
 * 
 * Calculates objective-specific conversions, QR scans, leads, app installs,
 * and unit economics with explicit Data Provenance and integer paise financials.
 */

import { createProvenanceValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } from '../provenance.js';

// Operational Conversion Priors based on Indian offline campaign benchmarks
export const CONVERSION_PRIORS = {
  'Product Sampling': {
    sampleDistributionRate: 0.95,
    qrScanRate: 0.18,
    landingConversionRate: 0.55,
    signupRate: 0.28,
    leadConvRate: 0.14,
    appInstallRate: 0.08,
    benchmarkRoiMultiplier: 3.2
  },
  'Lead Generation': {
    sampleDistributionRate: 0.40,
    qrScanRate: 0.35,
    landingConversionRate: 0.72,
    signupRate: 0.45,
    leadConvRate: 0.28,
    appInstallRate: 0.06,
    benchmarkRoiMultiplier: 2.9
  },
  'App Downloads': {
    sampleDistributionRate: 0.50,
    qrScanRate: 0.48,
    landingConversionRate: 0.65,
    signupRate: 0.52,
    leadConvRate: 0.18,
    appInstallRate: 0.32,
    benchmarkRoiMultiplier: 3.5
  },
  'Store Visits': {
    sampleDistributionRate: 0.85,
    qrScanRate: 0.24,
    landingConversionRate: 0.60,
    signupRate: 0.35,
    leadConvRate: 0.22,
    appInstallRate: 0.05,
    benchmarkRoiMultiplier: 3.8
  },
  'Retail Activation & POSM': {
    sampleDistributionRate: 0.70,
    qrScanRate: 0.22,
    landingConversionRate: 0.58,
    signupRate: 0.30,
    leadConvRate: 0.20,
    appInstallRate: 0.05,
    benchmarkRoiMultiplier: 3.4
  },
  'Merchant Onboarding Drive': {
    sampleDistributionRate: 0.30,
    qrScanRate: 0.65,
    landingConversionRate: 0.80,
    signupRate: 0.60,
    leadConvRate: 0.38,
    appInstallRate: 0.12,
    benchmarkRoiMultiplier: 4.2
  },
  'Default': {
    sampleDistributionRate: 0.75,
    qrScanRate: 0.25,
    landingConversionRate: 0.60,
    signupRate: 0.30,
    leadConvRate: 0.15,
    appInstallRate: 0.10,
    benchmarkRoiMultiplier: 2.8
  }
};

/**
 * Forecast conversions and financial attribution metrics with provenance and integer paise
 * @param {Object} params
 * @returns {Object}
 */
export function forecastConversions(params) {
  const {
    interactions = 2000,
    budgetInr = 250000,
    budgetPaise = null,
    objective = 'Product Sampling',
    weightedInterestAffinity = 0.80,
    ageEligibilityRatio = 0.54,
    inventoryCap = null,
    priors = null
  } = params;

  const prior = priors || CONVERSION_PRIORS[objective] || CONVERSION_PRIORS.Default;
  const numBudgetInr = Math.max(1, Number(budgetInr) || 250000);
  const numBudgetPaise = budgetPaise !== null ? Number(budgetPaise) : Math.round(numBudgetInr * 100);
  const numInteractions = Math.max(0, Number(interactions) || 0);

  // Quality multiplier based on audience affinity
  const qualityMultiplier = Math.max(0.70, Math.min(1.30, (weightedInterestAffinity * 0.7) + (ageEligibilityRatio * 0.4) + 0.20));

  // 1. Samples Projected
  const rawSampleRate = prior.sampleDistributionRate ?? prior.sample_distribution_rate ?? 0.95;
  let potentialSamples = Math.round(numInteractions * rawSampleRate * qualityMultiplier);
  if (inventoryCap !== null && Number(inventoryCap) > 0) {
    potentialSamples = Math.min(Number(inventoryCap), potentialSamples);
  }

  // 2. Attribution Funnel
  const rawQrRate = prior.qrScanRate ?? prior.qr_scan_rate ?? 0.18;
  const rawLandingRate = prior.landingConversionRate ?? prior.landing_conversion_rate ?? 0.55;
  const rawSignupRate = prior.signupRate ?? prior.signup_rate ?? 0.28;

  const qrScans = Math.round(potentialSamples * rawQrRate * qualityMultiplier);
  const landingVisits = Math.round(qrScans * rawLandingRate);
  const signups = Math.round(landingVisits * rawSignupRate);
  
  // 3. Leads and App Installs
  const rawLeadRate = prior.leadConvRate ?? prior.lead_conversion_rate ?? 0.14;
  const rawAppRate = prior.appInstallRate ?? prior.app_install_rate ?? 0.08;

  const leads = Math.round(numInteractions * rawLeadRate * qualityMultiplier);
  const appInstalls = Math.round(numInteractions * rawAppRate * qualityMultiplier);

  // 4. Unit Economics in Integer Paise and Rupee formatting
  const minLeads = Math.max(1, Math.round(leads * 0.75));
  const maxLeads = Math.round(leads * 1.35);

  const costPerLeadPaise = leads > 0 ? Math.round(numBudgetPaise / leads) : null;
  const minCplPaise = Math.round(numBudgetPaise / maxLeads);
  const maxCplPaise = Math.round(numBudgetPaise / minLeads);

  const costPerSamplePaise = potentialSamples > 0 ? Math.round(numBudgetPaise / potentialSamples) : null;
  const cacPaise = signups > 0 ? Math.round(numBudgetPaise / signups) : null;

  const costPerLead = costPerLeadPaise !== null ? Math.round(costPerLeadPaise / 100) : null;
  const minCpl = Math.round(minCplPaise / 100);
  const maxCpl = Math.round(maxCplPaise / 100);
  const costPerSample = costPerSamplePaise !== null ? parseFloat((costPerSamplePaise / 100).toFixed(2)) : null;
  const costPerAcquisition = cacPaise !== null ? Math.round(cacPaise / 100) : null;

  const leadsProvenance = createProvenanceValue({
    value: leads,
    minRange: minLeads,
    maxRange: maxLeads,
    sourceType: priors ? SOURCE_TYPES.MODELLED_ESTIMATE : SOURCE_TYPES.HEURISTIC,
    maturityLevel: priors ? MATURITY_LEVELS.LEVEL_3_ZIGGERS_EMPIRICAL : MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.MODERATE,
    methodology: priors ? 'database_bayesian_posterior' : 'conversion_prior_heuristic',
    uncertaintyDrivers: [
      { factor: 'lack_of_brand_historical_conversion_baseline', impact: 'HIGH' },
      { factor: 'human_promoter_pitch_variability', impact: 'MEDIUM' }
    ],
    label: `${minLeads.toLocaleString('en-IN')} – ${maxLeads.toLocaleString('en-IN')} estimated leads`
  });

  const cplProvenance = createProvenanceValue({
    value: costPerLead,
    minRange: minCpl,
    maxRange: maxCpl,
    sourceType: priors ? SOURCE_TYPES.MODELLED_ESTIMATE : SOURCE_TYPES.HEURISTIC,
    maturityLevel: priors ? MATURITY_LEVELS.LEVEL_3_ZIGGERS_EMPIRICAL : MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.MODERATE,
    methodology: 'budget_to_conversion_paise_ratio',
    uncertaintyDrivers: [
      { factor: 'contingent_on_promoter_productivity_and_lead_qualification', impact: 'HIGH' }
    ],
    label: `₹${minCpl.toLocaleString('en-IN')} – ₹${maxCpl.toLocaleString('en-IN')} estimated CPL`
  });

  const roiMultiplier = prior.benchmarkRoiMultiplier ?? prior.benchmark_roi_multiplier ?? 3.0;

  return {
    potentialSamples,
    qrScans,
    landingVisits,
    signups,
    leads,
    appInstalls,
    leadsProvenance,
    cplProvenance,
    unitEconomics: {
      costPerSample: costPerSample !== null ? `₹${costPerSample.toLocaleString('en-IN')}` : 'N/A (No Samples)',
      costPerSampleNum: costPerSample,
      costPerSamplePaise,
      costPerLead: costPerLead !== null ? `₹${costPerLead.toLocaleString('en-IN')}` : 'N/A (No Leads)',
      costPerLeadNum: costPerLead,
      costPerLeadPaise,
      costPerLeadRange: `₹${minCpl} – ₹${maxCpl}`,
      cac: costPerAcquisition !== null ? `₹${costPerAcquisition.toLocaleString('en-IN')}` : null,
      cacFormatted: costPerAcquisition !== null ? `₹${costPerAcquisition.toLocaleString('en-IN')}` : 'N/A (No Conversions)',
      cacPaise,
      projectedRoi: (roiMultiplier * qualityMultiplier).toFixed(1) + 'x'
    },
    qualityMultiplier: parseFloat(qualityMultiplier.toFixed(3))
  };
}
