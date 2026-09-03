/**
 * Ziggers Intelligence - Campaign Match & Alignment Scoring Engine
 * 
 * Evaluates location and audience alignment using operational criteria.
 * Replaces uncalibrated false-precision point percentages with qualitative alignment tiers
 * (High, Moderate, Low Match) and explicit contributing drivers.
 */

import { createProvenanceValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } from '../provenance.js';

// Objective-specific subscore weights for Audience Quality Score (AQS)
export const OBJECTIVE_AQS_WEIGHTS = {
  'Product Sampling': {
    ageMatch: 0.15,
    economicMatch: 0.20,
    interestMatch: 0.25,
    locationSuitability: 0.15,
    footfallScore: 0.15,
    confidence: 0.10
  },
  'Lead Generation': {
    ageMatch: 0.25,
    economicMatch: 0.30,
    interestMatch: 0.20,
    locationSuitability: 0.10,
    footfallScore: 0.05,
    confidence: 0.10
  },
  'App Downloads': {
    ageMatch: 0.30,
    economicMatch: 0.15,
    interestMatch: 0.25,
    locationSuitability: 0.10,
    footfallScore: 0.10,
    confidence: 0.10
  },
  'Store Visits': {
    ageMatch: 0.15,
    economicMatch: 0.25,
    interestMatch: 0.20,
    locationSuitability: 0.25,
    footfallScore: 0.10,
    confidence: 0.05
  },
  'Default': {
    ageMatch: 0.20,
    economicMatch: 0.20,
    interestMatch: 0.25,
    locationSuitability: 0.15,
    footfallScore: 0.10,
    confidence: 0.10
  }
};

/**
 * Maps a numeric index to an honest qualitative tier
 */
export function getAlignmentTier(score) {
  if (score >= 80) return { tier: 'HIGH', label: 'High Location Match', color: 'emerald' };
  if (score >= 60) return { tier: 'MODERATE', label: 'Moderate Location Match', color: 'amber' };
  return { tier: 'LOW', label: 'Low Location Match', color: 'rose' };
}

/**
 * Calculate Normalized Audience Quality & Alignment with Data Provenance
 * @param {Object} params
 * @returns {Object}
 */
export function calculateAudienceQualityScore(params) {
  const {
    ageEligibilityRatio = 0.54,
    affluenceScore = 85,
    weightedInterestAffinity = 0.80,
    commercialScore = 88,
    shiftFootfallExposure = 20000,
    confidenceScore = 0.90,
    objective = 'Product Sampling'
  } = params;

  const weights = OBJECTIVE_AQS_WEIGHTS[objective] || OBJECTIVE_AQS_WEIGHTS.Default;

  // Normalize subscores to 0-100 scale
  const sAge = Math.min(100, Math.round(ageEligibilityRatio * 100));
  const sEcon = Math.min(100, Math.max(0, Math.round(affluenceScore)));
  const sInterest = Math.min(100, Math.round(weightedInterestAffinity * 100));
  const sLoc = Math.min(100, Math.max(0, Math.round(commercialScore)));
  
  // Normalized footfall score against urban high-density thresholds
  const sFootfall = Math.min(100, Math.max(20, Math.round((shiftFootfallExposure / 25000) * 100)));
  const sConfidence = Math.min(100, Math.round(confidenceScore * 100));

  const rawScore = Math.round(
    sAge * weights.ageMatch +
    sEcon * weights.economicMatch +
    sInterest * weights.interestMatch +
    sLoc * weights.locationSuitability +
    sFootfall * weights.footfallScore +
    sConfidence * weights.confidence
  );

  const boundedScore = Math.min(100, Math.max(1, rawScore));
  const alignment = getAlignmentTier(boundedScore);

  const provenance = createProvenanceValue({
    value: boundedScore,
    label: alignment.label,
    sourceType: SOURCE_TYPES.HEURISTIC,
    maturityLevel: MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.MODERATE,
    methodology: 'weighted_multi_criteria_heuristic',
    uncertaintyDrivers: [
      { factor: 'uncalibrated_interest_affinity_weights', impact: 'MEDIUM' },
      { factor: 'lack_of_historical_campaign_sample_size', impact: 'HIGH' }
    ]
  });

  return {
    audienceQualityScore: boundedScore,
    alignmentTier: alignment.tier,
    alignmentLabel: alignment.label,
    provenance,
    subScores: {
      ageMatch: sAge,
      economicMatch: sEcon,
      interestMatch: sInterest,
      locationSuitability: sLoc,
      footfallScore: sFootfall,
      confidenceScore: sConfidence
    },
    appliedWeights: weights
  };
}

/**
 * Calculate Campaign Suitability Score (CSS) with honest qualitative classification
 */
export function calculateCampaignSuitabilityScore(params) {
  const {
    audienceQualityScore = 85,
    reachPotential = 50000,
    conversions = 300,
    costPerConversion = 150,
    promoterCost = 25000,
    budgetInr = 250000,
    confidenceScore = 0.90
  } = params;

  const sReach = Math.min(100, Math.round((reachPotential / 50000) * 100));
  const sConversion = Math.min(100, Math.round((conversions / 500) * 100));
  const cplVal = Number(costPerConversion) || 150;
  const sCostEff = Math.min(100, Math.max(20, Math.round(100 - (cplVal / 4))));
  const sFeasibility = promoterCost <= budgetInr * 0.70 ? 95 : 70;
  const sConf = Math.round(confidenceScore * 100);

  const rawSuitability = Math.round(
    audienceQualityScore * 0.25 +
    sReach * 0.20 +
    sConversion * 0.20 +
    sCostEff * 0.15 +
    sFeasibility * 0.10 +
    sConf * 0.10
  );

  const boundedScore = Math.min(100, Math.max(1, rawSuitability));
  const alignment = getAlignmentTier(boundedScore);

  const provenance = createProvenanceValue({
    value: boundedScore,
    label: `${alignment.label} (${alignment.tier})`,
    sourceType: SOURCE_TYPES.HEURISTIC,
    maturityLevel: MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: CONFIDENCE_LEVELS.MODERATE,
    methodology: 'operational_feasibility_composite_heuristic',
    uncertaintyDrivers: [
      { factor: 'self_reported_budget_allocations', impact: 'LOW' },
      { factor: 'location_specific_conversion_prior_variance', impact: 'HIGH' }
    ]
  });

  return {
    campaignSuitabilityScore: boundedScore,
    suitabilityTier: alignment.tier,
    suitabilityLabel: alignment.label,
    provenance,
    suitabilityBreakdown: {
      audienceQuality: audienceQualityScore,
      reachPotential: sReach,
      conversionPotential: sConversion,
      costEfficiency: sCostEff,
      operationalFeasibility: sFeasibility,
      confidence: sConf
    }
  };
}
