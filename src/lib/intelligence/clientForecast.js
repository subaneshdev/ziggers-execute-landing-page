/**
 * Ziggers Client-Safe Intelligence & Preview Engine
 * File: src/lib/intelligence/clientForecast.js
 * 
 * Provides pure mathematical calculations for client-side UI previews:
 * - Geometric H3 resolution and radial cells
 * - Demographics and age eligibility
 * - Interest affinity scoring
 * - Footfall and 24h curve estimation
 * - Discrete staffing optimization
 * - Physical interaction funnel
 * - Conversion forecast
 * - GST exact calculation
 * - Two-tier escrow allocation
 * - Attribution funnels
 * - Validation metrics
 * 
 * Contains ZERO Node.js native dependencies (no fs, path, or node:sqlite),
 * making it 100% safe for React browser components.
 */

import { getH3CellsForRadius, getRecommendedResolution } from './geo/h3Engine.js';
import { calculateScheduleMetrics } from './schedule/scheduleEngine.js';
import { calculateAgeEligibility, calculateGenderAvailability } from './audience/demographicMatcher.js';
import { calculateInterestAffinity } from './audience/interestAffinityEngine.js';
import { estimateFootfallAndAudience } from './footfall/footfallEstimator.js';
import { optimizeStaffing, solveDiscreteStaffingOptimization, calculateMinimumRequiredGrossBudget } from './capacity/staffingOptimizer.js';
import { calculatePhysicalFunnel } from './forecast/exposureForecast.js';
import { forecastConversions } from './forecast/conversionForecast.js';
import { calculateForecastRange } from './forecast/uncertaintyEngine.js';
import { calculateAudienceQualityScore, calculateCampaignSuitabilityScore } from './ranking/campaignScoring.js';
import { calculateGstBreakdown } from './finance/gstCalculator.js';
import { allocateCampaignEscrow, allocateActualCampaignEscrow, calculateWorkerShiftPayout } from './finance/campaignAllocator.js';
import { calculateAttributionFunnel } from './attribution/attributionFunnel.js';
import { calculateModelValidationMetrics, performTemporalHoldoutValidation, getModelMaturity, MODEL_MATURITY_LEVELS, METRIC_BENCHMARKS } from './learning/modelValidation.js';
import { updateBetaBinomialRate, BAYESIAN_METRIC_DEFINITIONS, PRIOR_STRENGTH_LEVELS } from './learning/bayesianEngine.js';

export {
  calculateGstBreakdown,
  allocateCampaignEscrow,
  allocateActualCampaignEscrow,
  calculateWorkerShiftPayout,
  calculateAttributionFunnel,
  calculateModelValidationMetrics,
  performTemporalHoldoutValidation,
  getModelMaturity,
  MODEL_MATURITY_LEVELS,
  METRIC_BENCHMARKS,
  updateBetaBinomialRate,
  BAYESIAN_METRIC_DEFINITIONS,
  PRIOR_STRENGTH_LEVELS,
  optimizeStaffing,
  solveDiscreteStaffingOptimization,
  calculateMinimumRequiredGrossBudget,
  forecastConversions
};

/**
 * Client-Side Instant Campaign Forecast Preview
 */
// Geometry depends on the radius, not on each budget, brand, or audience keystroke.
// Cache only the scalar aggregate, bounded to avoid retaining large cell arrays.
const populationPreviewCache = new Map();
function getPreviewPopulation(radiusKm) {
  const resolution = getRecommendedResolution(radiusKm, 'dense_urban');
  const key = `${radiusKm}:${resolution}`;
  if (populationPreviewCache.has(key)) return populationPreviewCache.get(key);
  const cells = getH3CellsForRadius(13.0827, 80.2707, radiusKm, resolution);
  const population = cells.reduce((sum, cell) => sum + Math.round(18500 * cell.overlapWeight), 0) || 100000;
  if (populationPreviewCache.size >= 24) populationPreviewCache.delete(populationPreviewCache.keys().next().value);
  populationPreviewCache.set(key, population);
  return population;
}

export function generateCampaignForecast(params = {}) {
  const {
    targetLocations = ['Chennai Central Commercial Hub'],
    radiusKm = 3.0,
    ageMin = 18,
    ageMax = 35,
    gender = 'All',
    selectedInterests = [],
    objective = 'Product Sampling',
    shiftHours = 5,
    campaignDays = 7,
    budgetInr = 250000,
    isGstInclusive = true,
    city = 'Chennai',
    startDate = null,
    endDate = null,
    dailyStartTime = null,
    dailyEndTime = null,
    timezone = null,
    schedule = null
  } = params;

  const inputSchedule = schedule || (startDate && endDate ? { startDate, endDate, dailyStartTime, dailyEndTime, timezone } : null);
  let scheduleMetrics = null;
  if (inputSchedule && inputSchedule.startDate && inputSchedule.endDate) {
    scheduleMetrics = calculateScheduleMetrics(inputSchedule);
  }

  const effectiveCampaignDays = (scheduleMetrics && scheduleMetrics.campaignDays > 0) ? scheduleMetrics.campaignDays : campaignDays;
  const effectiveShiftHours = (scheduleMetrics && scheduleMetrics.hoursPerDay > 0) ? scheduleMetrics.hoursPerDay : shiftHours;

  const totalAggregatedPopulation = getPreviewPopulation(radiusKm);

  const ageEligibility = calculateAgeEligibility(ageMin, ageMax, { '18-24': 0.25, '25-34': 0.35, '35-44': 0.20 });
  const genderAvailability = calculateGenderAvailability(gender, { male: 0.51, female: 0.49 });
  const interestAffinity = calculateInterestAffinity(selectedInterests, {}, {});

  const footfallData = estimateFootfallAndAudience({
    totalPopulation: totalAggregatedPopulation,
    locationNode: { locationType: 'commercial_high_street' },
    objective,
    startHour: scheduleMetrics?.startHour ?? 16,
    shiftHours: effectiveShiftHours,
    campaignDays: effectiveCampaignDays,
    city
  });

  const staffingData = optimizeStaffing({
    budgetInr,
    isGstInclusive,
    objective,
    shiftHours: effectiveShiftHours,
    campaignDays: effectiveCampaignDays,
    reachableAudience: footfallData.availableAudienceBase
  });

  const funnelData = calculatePhysicalFunnel({
    availableAudienceBase: footfallData.availableAudienceBase,
    ageEligibilityRatio: ageEligibility.ageEligibilityRatio,
    genderAvailabilityRatio: genderAvailability.genderAvailabilityRatio,
    weightedInterestAffinity: interestAffinity.weightedAffinityScore,
    shiftFootfallExposure: footfallData.shiftFootfallExposure,
    totalCampaignExposure: footfallData.totalCampaignExposure,
    physicalCapacity: staffingData.capacity?.expectedInteractions ?? 0,
    campaignDays: effectiveCampaignDays
  });

  const conversionData = forecastConversions({
    interactions: funnelData.interactions.expected,
    budgetInr,
    objective,
    weightedInterestAffinity: interestAffinity.weightedAffinityScore,
    ageEligibilityRatio: ageEligibility.ageEligibilityRatio
  });

  const finalInteractions = funnelData.interactions.expected;
  const finalLeads = conversionData.expectedLeads || 0;
  const finalSamples = conversionData.potentialSamples || 0;
  const cpl = finalLeads > 0 ? Math.round(Number(budgetInr) / finalLeads) : null;

  return {
    nodeName: targetLocations[0] || 'Chennai Hub',
    city,
    expected: {
      audience: totalAggregatedPopulation,
      reach: funnelData.totalCampaignReach,
      interactions: finalInteractions,
      leads: finalLeads,
      samples: finalSamples,
      costPerLead: cpl
    },
    capacity: {
      status: staffingData.status,
      promoterCount: staffingData.recommendedPromoters,
      supervisorCount: staffingData.supervisorCount,
      maxAffordablePromoters: staffingData.maxAffordablePromoters,
      requiredPromotersForDemand: staffingData.requiredPromotersForDemand,
      minimumRequiredBudget: staffingData.minimumRequiredBudget,
      minimumRequiredBudgetFormatted: staffingData.minimumRequiredBudgetFormatted,
      budgetDeficit: staffingData.budgetDeficit,
      budgetDeficitFormatted: staffingData.budgetDeficitFormatted,
      throughputPerHour: staffingData.capacity?.throughputPerHour || 0,
      totalPromoterHours: staffingData.capacity?.totalPromoterHours || 0,
      totalPromoterLabourCost: staffingData.totalPromoterLabourCost,
      totalSupervisorLabourCost: staffingData.totalSupervisorLabourCost,
      staffingStrategy: typeof staffingData.staffingStrategy === 'string'
        ? staffingData.staffingStrategy
        : (staffingData.staffingStrategy?.description || ''),
      financialWaterfall: staffingData.financialWaterfall
    },
    staffing: {
      promoters: staffingData.recommendedPromoters,
      supervisors: staffingData.supervisorCount
    },
    schedule: scheduleMetrics || {
      startDate: null,
      endDate: null,
      dailyStartTime: null,
      dailyEndTime: null,
      timezone: 'Asia/Kolkata',
      campaignDays: effectiveCampaignDays,
      hoursPerDay: effectiveShiftHours,
      totalCampaignHours: effectiveCampaignDays * effectiveShiftHours
    },
    provenance: {
      modelType: 'HEURISTIC_PREVIEW',
      modelVersion: 'preview-v1.1',
      maturityLevel: 1,
      confidenceTier: 'LOW',
      dataSource: 'DEFAULT_PLANNING_ASSUMPTIONS'
    }
  };
}
