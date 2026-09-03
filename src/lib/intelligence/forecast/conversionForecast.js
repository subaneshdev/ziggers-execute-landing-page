/**
 * Ziggers Intelligence - Conversion Forecast Engine
 * 
 * Calculates objective-specific conversions, QR scans, leads, app installs,
 * and unit economics with explicit Data Provenance and honest planning bounds.
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
 * Forecast conversions and financial attribution metrics with provenance
 * @param {Object} params
 * @returns {Object}
 */
export function forecastConversions(params) {
  const {
    interactions = 2000,
    budgetInr = 250000,
    objective = 'Product Sampling',
    weightedInterestAffinity = 0.80,
    ageEligibilityRatio = 0.54,
    inventoryCap = null
  } = params;

  const prior = CONVERSION_PRIORS[objective] || CONVERSION_PRIORS.Default;
  const numBudget = Math.max(1, Number(budgetInr) || 250000);
  const numInteractions = Math.max(0, Number(interactions) || 0);

  // Quality multiplier based on audience affinity
  const qualityMultiplier = Math.max(0.70, Math.min(1.30, (weightedInterestAffinity * 0.7) + (ageEligibilityRatio * 0.4) + 0.20));

  // 1. Samples Projected
  let potentialSamples = Math.round(numInteractions * prior.sampleDistributionRate * qualityMultiplier);
  if (inventoryCap !== null && Number(inventoryCap) > 0) {
    potentialSamples = Math.min(Number(inventoryCap), potentialSamples);
  }

  // 2. Attribution Funnel
  const qrScans = Math.round(potentialSamples * prior.qrScanRate * qualityMultiplier);
  const landingVisits = Math.round(qrScans * prior.landingConversionRate);
  const signups = Math.round(landingVisits * prior.signupRate);
  
  // 3. Leads and App Installs
  const leads = Math.round(numInteractions * prior.leadConvRate * qualityMultiplier);
  const appInstalls = Math.round(numInteractions * prior.appInstallRate * qualityMultiplier);

  // 4. Unit Economics (Honest ranges)
  const minLeads = Math.max(1, Math.round(leads * 0.75));
  const maxLeads = Math.round(leads * 1.35);

  const minCpl = Math.round(numBudget / maxLeads);
  const maxCpl = Math.round(numBudget / minLeads);

  const costPerSample = potentialSamples > 0 ? parseFloat((numBudget / potentialSamples).toFixed(2)) : null;
  const costPerLead = leads > 0 ? Math.round(numBudget / leads) : null;
  const costPerAcquisition = signups > 0 ? Math.round(numBudget / signups) : null;

  const leadsProvenance = createProvenanceValue({
    value: leads,
    minRange: minLeads,
    maxRange: maxLeads,
    sourceType: SOURCE_TYPES.HEURISTIC,
    maturityLevel: MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.LOW,
    methodology: 'conversion_prior_heuristic',
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
    sourceType: SOURCE_TYPES.HEURISTIC,
    maturityLevel: MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.LOW,
    methodology: 'budget_to_conversion_heuristic_ratio',
    uncertaintyDrivers: [
      { factor: 'contingent_on_promoter_productivity_and_lead_qualification', impact: 'HIGH' }
    ],
    label: `₹${minCpl.toLocaleString('en-IN')} – ₹${maxCpl.toLocaleString('en-IN')} estimated CPL`
  });

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
      costPerLead: costPerLead !== null ? `₹${costPerLead.toLocaleString('en-IN')}` : 'N/A (No Leads)',
      costPerLeadNum: costPerLead,
      costPerLeadRange: `₹${minCpl} – ₹${maxCpl}`,
      cac: costPerAcquisition !== null ? `₹${costPerAcquisition.toLocaleString('en-IN')}` : null,
      cacFormatted: costPerAcquisition !== null ? `₹${costPerAcquisition.toLocaleString('en-IN')}` : 'N/A (No Conversions)',
      projectedRoi: (prior.benchmarkRoiMultiplier * qualityMultiplier).toFixed(1) + 'x'
    },
    qualityMultiplier: parseFloat(qualityMultiplier.toFixed(3))
  };
}
