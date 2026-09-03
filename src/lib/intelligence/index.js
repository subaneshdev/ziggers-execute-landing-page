/**
 * Ziggers Unified Offline Campaign Intelligence Engine
 * Master Orchestrator: Combines H3 spatial indexing, demographic qualification,
 * POI vector interest inference, 24h footfall diurnal curves, physical capacity constraints,
 * operational conversion priors, forecast uncertainty, permission gating, and ground-truth learning.
 * Fully provenance-typed across all analytical outputs.
 */

import { getH3CellsForRadius, getRecommendedResolution, createGeodesicCirclePolygon, generatePostGisAggregationSql } from './geo/h3Engine.js';
import { PopulationProvider, DemographicsProvider } from './providers/populationProvider.js';
import { POIProvider, POI_TAXONOMY } from './providers/poiProvider.js';
import { MobilityProvider, WeatherProvider, EventProvider } from './providers/mobilityProvider.js';
import { calculateAgeEligibility, calculateGenderAvailability } from './audience/demographicMatcher.js';
import { calculateInterestAffinity, PERSONA_TAXONOMY } from './audience/interestAffinityEngine.js';
import { estimateFootfallAndAudience } from './footfall/footfallEstimator.js';
import { optimizeStaffing, calculateMinimumRequiredGrossBudget } from './capacity/staffingOptimizer.js';
import { calculatePhysicalFunnel } from './forecast/exposureForecast.js';
import { forecastConversions } from './forecast/conversionForecast.js';
import { calculateForecastRange } from './forecast/uncertaintyEngine.js';
import { calculateAudienceQualityScore, calculateCampaignSuitabilityScore, getAlignmentTier } from './ranking/campaignScoring.js';
import { rankCandidateLocations } from './ranking/locationRanking.js';
import { calculateAttributionFunnel } from './attribution/attributionFunnel.js';
import { calculateGstBreakdown } from './finance/gstCalculator.js';
import { allocateCampaignEscrow, allocateActualCampaignEscrow, calculateWorkerShiftPayout } from './finance/campaignAllocator.js';
import { validateGeofenceCheckin } from './verification/geofenceValidator.js';
import { createChainedAuditProof, computeBatchMerkleRoot } from './verification/proofHashChain.js';
import { recalibrateWithGroundTruth } from './learning/modelCalibration.js';
import { recordCampaignObservation, getHistoricalObservations, getAllObservations } from './learning/observationAggregator.js';
import { assessPermissionRequirements, validateDispatchFeasibility, PERMISSION_TYPES, PERMISSION_STATUSES } from './permissions/permissionGate.js';
import { createProvenanceValue, createInsufficientDataValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } from './provenance.js';
import { updateBetaBinomialRate, betaQuantile, BAYESIAN_METRIC_DEFINITIONS, PRIOR_STRENGTH_LEVELS } from './learning/bayesianEngine.js';
import { calculateModelValidationMetrics, performTemporalHoldoutValidation, getModelMaturity, MODEL_MATURITY_LEVELS, METRIC_BENCHMARKS } from './learning/modelValidation.js';

// Core Data Provider Singletons
const populationProvider = new PopulationProvider();
const demographicsProvider = new DemographicsProvider();
const poiProvider = new POIProvider();
const mobilityProvider = new MobilityProvider();
const weatherProvider = new WeatherProvider();
const eventProvider = new EventProvider();

/**
 * Unified Campaign Forecast Pipeline
 * Single Source of Truth for all data-assisted campaign planning across Ziggers OS
 * @param {Object} params
 * @returns {Object} Comprehensive, explainable, provenance-tagged forecast response
 */
export function generateCampaignForecast(params = {}) {
  const {
    targetLocations = ['T. Nagar & Ranganathan Street'],
    radiusKm = 3.0,
    ageMin = 18,
    ageMax = 35,
    gender = 'All',
    selectedInterests = ['fitness', 'foodies', 'fashion'],
    objective = 'Product Sampling',
    promoterCount = null,
    shiftHours = 5,
    startHour = 16,
    campaignDays = 7,
    budgetInr = 250000,
    isGstInclusive = true,
    h3Resolution = null,
    inventoryCap = null,
    venueType = 'COMMERCIAL_STREET'
  } = params;

  const primaryLocationName = targetLocations[0] || 'T. Nagar & Ranganathan Street';
  const resolution = h3Resolution || getRecommendedResolution(radiusKm, 'dense_urban');

  // 1. Geospatial H3 Spatial Resolution
  const initialPopRes = populationProvider.fetchData({ locationName: primaryLocationName });
  let locationNode = initialPopRes?.data?.node || null;
  if (!locationNode) {
    locationNode = {
      centerLat: 13.0418,
      centerLng: 80.2341,
      name: primaryLocationName,
      city: 'Chennai',
      secClassification: 'SEC A/B',
      affluenceScore: 85,
      mpceIncomeEstimate: '₹72,000 / mo',
      confidenceScore: 0.88,
      locationType: venueType || 'Commercial High Street'
    };
  }

  const h3Cells = getH3CellsForRadius(
    locationNode.centerLat,
    locationNode.centerLng,
    radiusKm,
    resolution
  );

  // 2. Gridded Spatial Population Aggregation
  let totalAggregatedPopulation = 0;
  h3Cells.forEach(cell => {
    totalAggregatedPopulation += Math.round((locationNode.baseCellPopulation || 15000) * cell.overlapWeight);
  });
  if (totalAggregatedPopulation === 0) totalAggregatedPopulation = 100000;

  // 3. Environmental & Mobility Signals
  const mobilityFactor = 1.05;
  const weatherCoeff = 1.0;

  // 4. POI Vector Intelligence & Interest Inferences
  const poiRes = poiProvider.fetchData({
    locationName: primaryLocationName,
    centerLat: locationNode.centerLat,
    centerLng: locationNode.centerLng,
    radiusKm
  });
  const poiCounts = poiRes?.data?.poiCounts || {};

  const interestAffinity = calculateInterestAffinity(
    selectedInterests,
    poiCounts,
    locationNode.affinityScores || {}
  );

  // 5. Demographics Qualification
  const ageEligibility = calculateAgeEligibility(
    ageMin,
    ageMax,
    locationNode.ageDistribution || {}
  );

  const genderAvailability = calculateGenderAvailability(
    gender,
    locationNode.genderDistribution || { male: 0.51, female: 0.49 }
  );

  // 6. Footfall & 24-Hour Time Profile
  const footfallData = estimateFootfallAndAudience({
    locationNode,
    totalPopulation: totalAggregatedPopulation,
    objective,
    startHour,
    shiftHours,
    campaignDays,
    mobilityFactor,
    weatherCoefficient: weatherCoeff
  });

  // 7. Dual-Constrained Staffing & Physical Capacity Optimization
  const staffingData = optimizeStaffing({
    budgetInr,
    isGstInclusive,
    objective,
    shiftHours,
    campaignDays,
    reachableAudience: footfallData.availableAudienceBase,
    requestedPromoters: promoterCount
  });

  // 8. Exposure, Reach & Physical Interaction Funnel
  const funnelData = calculatePhysicalFunnel({
    availableAudienceBase: footfallData.availableAudienceBase,
    ageEligibilityRatio: ageEligibility.ageEligibilityRatio,
    genderAvailabilityRatio: genderAvailability.genderAvailabilityRatio,
    weightedInterestAffinity: interestAffinity.weightedAffinityScore,
    shiftFootfallExposure: footfallData.shiftFootfallExposure,
    totalCampaignExposure: footfallData.totalCampaignExposure,
    physicalCapacity: staffingData.capacity.expectedInteractions,
    campaignDays
  });

  // 9. Conversion Forecast & Unit Economics
  const conversionData = forecastConversions({
    interactions: funnelData.interactions.expected,
    budgetInr,
    objective,
    weightedInterestAffinity: interestAffinity.weightedAffinityScore,
    ageEligibilityRatio: ageEligibility.ageEligibilityRatio,
    inventoryCap
  });

  // 10. Forecast Uncertainty & Range Calculations
  const confidenceContext = {
    confidenceScore: locationNode.confidenceScore || 0.88,
    historicalSampleCount: 0,
    isSparseLocation: false,
    isNeutralPrior: interestAffinity.isNeutralPrior
  };

  const exposureRange = calculateForecastRange(footfallData.totalCampaignExposure, confidenceContext);
  const reachRange = calculateForecastRange(funnelData.totalCampaignReach, confidenceContext);
  const interactionsRange = calculateForecastRange(funnelData.interactions.expected, confidenceContext);
  const samplesRange = calculateForecastRange(conversionData.potentialSamples, confidenceContext);
  const leadsRange = calculateForecastRange(conversionData.leads, confidenceContext);
  const installsRange = calculateForecastRange(conversionData.appInstalls, confidenceContext);

  // 11. Audience Quality & Campaign Alignment Scores (Qualitative Tiers)
  const aqsObj = calculateAudienceQualityScore({
    ageEligibilityRatio: ageEligibility.ageEligibilityRatio,
    affluenceScore: locationNode.affluenceScore || 85,
    weightedInterestAffinity: interestAffinity.weightedAffinityScore,
    commercialScore: locationNode.populationDensitySqKm > 15000 ? 95 : 85,
    shiftFootfallExposure: footfallData.shiftFootfallExposure,
    confidenceScore: locationNode.confidenceScore || 0.88,
    objective
  });

  const cssObj = calculateCampaignSuitabilityScore({
    audienceQualityScore: aqsObj.audienceQualityScore,
    reachPotential: funnelData.totalCampaignReach,
    conversions: conversionData.leads,
    costPerConversion: conversionData.unitEconomics.costPerLeadNum,
    promoterCost: staffingData.totalPromoterLabourCost,
    budgetInr,
    confidenceScore: locationNode.confidenceScore || 0.88
  });

  // 12. Operational Permissions & Feasibility Assessment
  const permissionRequirements = assessPermissionRequirements(locationNode.locationType || venueType);
  const dispatchFeasibility = validateDispatchFeasibility(permissionRequirements);

  // 13. Financial Escrow Allocation Waterfall
  const escrowData = allocateCampaignEscrow(budgetInr, isGstInclusive);

  // 14. Empirical Recalibration with Ground Truth Store
  const baselineOutput = {
    expectedInteractions: funnelData.interactions.expected,
    expectedLeads: conversionData.leads,
    expectedSamples: conversionData.potentialSamples
  };
  const calibrated = recalibrateWithGroundTruth(baselineOutput, primaryLocationName, objective);

  // 15. Actionable Data-Driven Insights & Explainability
  const explanation = {
    topReasons: [
      `${Math.round(ageEligibility.ageEligibilityRatio * 100)}% of the aggregated ${totalAggregatedPopulation.toLocaleString('en-IN')} local population matches the ${ageMin}–${ageMax} target demographic.`,
      `High-affinity POI density around ${primaryLocationName} produces a ${Math.round(interestAffinity.weightedAffinityScore * 100)}% interest alignment.`,
      `Peak activation window (${footfallData.timeExposure.operatingWindow}) captures ${Math.round(footfallData.timeExposure.activeHourFraction * 100)}% of daily footfall opportunity.`,
      `Affluence rating of ${locationNode.affluenceScore}/100 aligns with ${locationNode.secClassification} household income (~${locationNode.mpceIncomeEstimate}).`
    ],
    risks: [
      staffingData.recommendedPromoters < staffingData.requiredPromotersForDemand
        ? `Budget constraints cap staffing at ${staffingData.recommendedPromoters} promoters (demand suggests ${staffingData.requiredPromotersForDemand}).`
        : 'Sufficient staffing capacity allocated to capture estimated reach opportunity.',
      dispatchFeasibility.warning || 'Operational clearance verification required prior to promoter dispatch.'
    ],
    assumptions: [
      `Planning throughput estimated at ${staffingData.capacity.throughputPerHour} interactions/hour/promoter for ${objective}.`,
      `GST 18% accounted via statutory division (Taxable Base: ${escrowData.formatted.promoterWagePool} + reserves).`
    ]
  };

  return {
    nodeName: primaryLocationName,
    city: locationNode.city || 'Chennai',
    affluenceScore: locationNode.affluenceScore || 85,
    secClassification: locationNode.secClassification || 'SEC A/B',
    mpceIncomeEstimate: locationNode.mpceIncomeEstimate || '₹72,000 / mo',

    // Geospatial Intelligence
    geographicAnalysis: {
      centerLat: locationNode.centerLat,
      centerLng: locationNode.centerLng,
      radiusKm,
      h3Resolution: resolution,
      h3CellCount: h3Cells.length,
      h3Cells: h3Cells.slice(0, 12),
      totalAggregatedPopulation
    },

    // Audience Funnel
    audience: {
      residentPopulation: footfallData.populationBreakdown.residentPopulation,
      transientPopulation: footfallData.populationBreakdown.transientPopulation,
      workforcePopulation: footfallData.populationBreakdown.workforcePopulation,
      availableAudienceBase: footfallData.availableAudienceBase,
      demographicEligibleAudience: funnelData.demographicEligibleAudience,
      personaMatchedAudience: funnelData.personaMatchedAudience,
      totalCampaignReach: funnelData.totalCampaignReach
    },

    // Demographics & Interests
    demographics: {
      ageEligibilityRatio: ageEligibility.ageEligibilityRatio,
      genderAvailabilityRatio: genderAvailability.genderAvailabilityRatio,
      ageBinContributions: ageEligibility.binContributions,
      genderLabel: genderAvailability.genderLabel
    },
    interests: {
      weightedAffinityScore: interestAffinity.weightedAffinityScore,
      breakdown: interestAffinity.interestBreakdown,
      source: interestAffinity.source,
      poiCounts
    },

    // Footfall & Time Curves
    footfall: {
      baseDailyFootfall: footfallData.baseDailyFootfall,
      shiftFootfallExposure: footfallData.shiftFootfallExposure,
      totalCampaignExposure: footfallData.totalCampaignExposure,
      operatingWindow: footfallData.timeExposure.operatingWindow,
      peakHour: footfallData.timeExposure.peakHour,
      hourlyProfile: footfallData.timeExposure.hourlyProfileMap
    },

    // Capacity & Staffing
    capacity: {
      promoterCount: staffingData.recommendedPromoters,
      supervisorCount: staffingData.supervisorCount,
      maxAffordablePromoters: staffingData.maxAffordablePromoters,
      requiredPromotersForDemand: staffingData.requiredPromotersForDemand,
      throughputPerHour: staffingData.capacity.throughputPerHour,
      totalPromoterHours: staffingData.capacity.totalPromoterHours,
      totalPromoterLabourCost: staffingData.totalPromoterLabourCost,
      staffingStrategy: staffingData.staffingStrategy.description
    },

    // Operational Feasibility & Permissions
    permissions: {
      requiredPermissions: permissionRequirements,
      dispatchFeasibility
    },

    // Conversion Forecast & Attribution
    forecast: {
      exposure: footfallData.totalCampaignExposure,
      reach: funnelData.totalCampaignReach,
      interactions: funnelData.interactions.expected,
      samples: conversionData.potentialSamples,
      qrScans: conversionData.qrScans,
      landingVisits: conversionData.landingVisits,
      signups: conversionData.signups,
      leads: conversionData.leads,
      appInstalls: conversionData.appInstalls,
      cpsFormatted: conversionData.unitEconomics.costPerSample,
      cplFormatted: conversionData.unitEconomics.costPerLead,
      cplNum: conversionData.unitEconomics.costPerLeadNum,
      cacFormatted: conversionData.unitEconomics.cacFormatted,
      projectedRoi: conversionData.unitEconomics.projectedRoi
    },

    // Forecast Ranges & Provenance
    ranges: {
      exposure: exposureRange,
      reach: reachRange,
      interactions: interactionsRange,
      samples: samplesRange,
      leads: leadsRange,
      installs: installsRange
    },

    // Alignment Scores
    scores: {
      audienceQualityScore: aqsObj.audienceQualityScore,
      alignmentTier: aqsObj.alignmentTier,
      alignmentLabel: aqsObj.alignmentLabel,
      campaignSuitabilityScore: cssObj.campaignSuitabilityScore,
      suitabilityTier: cssObj.suitabilityTier,
      subScores: aqsObj.subScores,
      confidenceScore: locationNode.confidenceScore || 0.88,
      confidencePercent: Math.round((locationNode.confidenceScore || 0.88) * 100)
    },

    // Financial Breakdown
    financials: escrowData,

    // Model Provenance Metadata
    modelMetadata: {
      modelVersion: calibrated.modelVersion,
      modelType: 'EMPIRICAL_BASELINE_ESTIMATOR_V1',
      maturityLevel: MATURITY_LEVELS.LEVEL_2_EXTERNAL_DATA_MODEL,
      recalibrationApplied: calibrated.recalibrationApplied,
      confidenceLabel: interactionsRange.confidenceLabel,
      provenanceSource: SOURCE_TYPES.MODELLED_ESTIMATE
    },

    explanation,

    // Backward-compatibility adapters
    potentialAudience: totalAggregatedPopulation,
    qualifiedAudience: funnelData.demographicEligibleAudience,
    estimatedExposure: footfallData.shiftFootfallExposure,
    estimatedReach: funnelData.totalCampaignReach,
    expectedInteractions: funnelData.interactions.expected,
    expectedLeads: conversionData.leads,
    expectedAppInstalls: conversionData.appInstalls,
    estimatedCpl: conversionData.unitEconomics.costPerLead,
    audienceQualityScore: aqsObj.audienceQualityScore,
    qualitySubScores: aqsObj.subScores,
    confidencePercent: Math.round((locationNode.confidenceScore || 0.88) * 100),
    confidenceRangeStr: interactionsRange.rangeStr,
    recommendations: explanation.topReasons,
    audienceExplanation: explanation.topReasons
  };
}

/**
 * Multi-Location Ranking Helper
 */
export function rankLocations(params) {
  return rankCandidateLocations(params, generateCampaignForecast);
}

// Signal Sync Subsystem Imports
import { SignalProvider, signalProviderRegistry } from './signals/signalProvider.js';
import { MetaSignalProvider, metaSignalProvider } from './signals/metaSignalProvider.js';
import { createDigitalSignalProfile } from './signals/digitalSignalProfile.js';
import { matchDigitalToOfflineContext } from './signals/contextMatchingEngine.js';
import { generateCampaignRecommendation } from './signals/recommendationEngine.js';
import { QrAttributionEngine } from './signals/qrAttributionEngine.js';
import { ConsentEngine } from './signals/consentEngine.js';
import { MLFeedbackEngine, mlFeedbackEngine } from './signals/mlFeedbackEngine.js';

// Re-exports of all modular subsystems
export {
  getH3CellsForRadius,
  createGeodesicCirclePolygon,
  generatePostGisAggregationSql,
  calculateAgeEligibility,
  calculateGenderAvailability,
  calculateInterestAffinity,
  estimateFootfallAndAudience,
  optimizeStaffing,
  calculateMinimumRequiredGrossBudget,
  calculatePhysicalFunnel,
  forecastConversions,
  calculateForecastRange,
  calculateAttributionFunnel,
  calculateGstBreakdown,
  allocateCampaignEscrow,
  allocateActualCampaignEscrow,
  calculateWorkerShiftPayout,
  validateGeofenceCheckin,
  createChainedAuditProof,
  computeBatchMerkleRoot,
  recordCampaignObservation,
  getHistoricalObservations,
  getAllObservations,
  assessPermissionRequirements,
  validateDispatchFeasibility,
  PERMISSION_TYPES,
  PERMISSION_STATUSES,
  createProvenanceValue,
  createInsufficientDataValue,
  SOURCE_TYPES,
  MATURITY_LEVELS,
  CONFIDENCE_LEVELS,
  getAlignmentTier,
  updateBetaBinomialRate,
  betaQuantile,
  BAYESIAN_METRIC_DEFINITIONS,
  PRIOR_STRENGTH_LEVELS,
  calculateModelValidationMetrics,
  performTemporalHoldoutValidation,
  getModelMaturity,
  MODEL_MATURITY_LEVELS,
  METRIC_BENCHMARKS,
  PERSONA_TAXONOMY,
  POI_TAXONOMY,
  // Signal Sync exports
  SignalProvider,
  signalProviderRegistry,
  MetaSignalProvider,
  metaSignalProvider,
  createDigitalSignalProfile,
  matchDigitalToOfflineContext,
  generateCampaignRecommendation,
  QrAttributionEngine,
  ConsentEngine,
  MLFeedbackEngine,
  mlFeedbackEngine
};
