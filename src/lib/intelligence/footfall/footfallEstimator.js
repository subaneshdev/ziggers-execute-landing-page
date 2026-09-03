/**
 * Ziggers Intelligence - Footfall Estimation Engine
 * 
 * Separates Resident, Transient, and Workforce population segments,
 * applies objective-specific operational weights, and computes daily and shift-level footfall opportunities.
 * Fully provenance-tagged as MODELLED_ESTIMATE / HEURISTIC.
 */

import { calculateTimeWindowExposure } from './timeDistribution.js';
import { createProvenanceValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } from '../provenance.js';

// Operational objective-specific segment planning weights
export const OBJECTIVE_POPULATION_WEIGHTS = {
  'Product Sampling': { resident: 0.25, transient: 0.60, workforce: 0.35 },
  'Lead Generation': { resident: 0.35, transient: 0.45, workforce: 0.50 },
  'App Downloads': { resident: 0.20, transient: 0.55, workforce: 0.45 },
  'Store Visits': { resident: 0.45, transient: 0.40, workforce: 0.25 },
  'Retail Activation & POSM': { resident: 0.40, transient: 0.50, workforce: 0.20 },
  'Merchant Onboarding Drive': { resident: 0.10, transient: 0.20, workforce: 0.80 },
  'Default': { resident: 0.30, transient: 0.50, workforce: 0.30 }
};

/**
 * Calculate Available Audience and Footfall Exposure with Data Provenance
 * @param {Object} params
 * @returns {Object}
 */
export function estimateFootfallAndAudience(params) {
  const {
    locationNode,
    totalPopulation = 100000,
    objective = 'Product Sampling',
    startHour = 16,
    shiftHours = 5,
    campaignDays = 7,
    mobilityFactor = 1.0,
    weatherCoefficient = 1.0
  } = params;

  const populationMix = locationNode?.populationMix || {
    residentShare: 0.35,
    transientShare: 0.45,
    workforceShare: 0.20
  };

  // Segregate total population into components
  const residentPop = Math.round(totalPopulation * populationMix.residentShare);
  const transientPop = Math.round(totalPopulation * populationMix.transientShare);
  const workforcePop = Math.round(totalPopulation * populationMix.workforceShare);

  // Apply objective weights (Heuristic planning assumption)
  const weights = OBJECTIVE_POPULATION_WEIGHTS[objective] || OBJECTIVE_POPULATION_WEIGHTS.Default;
  const availableAudienceBase = Math.round(
    residentPop * weights.resident +
    transientPop * weights.transient +
    workforcePop * weights.workforce
  );

  // 24-Hour Time Distribution for the shift
  const timeExposure = calculateTimeWindowExposure(
    locationNode?.locationType,
    startHour,
    shiftHours
  );

  // Daily Traffic adjusted by environmental coefficients
  const baseDailyFootfall = Math.round(availableAudienceBase * mobilityFactor * weatherCoefficient);
  
  // Shift-Level Exposure during active campaign hours
  const shiftFootfallExposure = Math.round(baseDailyFootfall * timeExposure.activeHourFraction);
  const totalCampaignExposure = shiftFootfallExposure * Math.max(1, Number(campaignDays) || 1);

  // Provenance-wrapped exposure values
  const minOpportunity = Math.round(totalCampaignExposure * 0.75);
  const maxOpportunity = Math.round(totalCampaignExposure * 1.35);

  const exposureProvenance = createProvenanceValue({
    value: totalCampaignExposure,
    minRange: minOpportunity,
    maxRange: maxOpportunity,
    sourceType: locationNode ? SOURCE_TYPES.MODELLED_ESTIMATE : SOURCE_TYPES.HEURISTIC,
    maturityLevel: locationNode ? MATURITY_LEVELS.LEVEL_2_EXTERNAL_DATA_MODEL : MATURITY_LEVELS.LEVEL_1_HEURISTIC,
    confidence: locationNode ? CONFIDENCE_LEVELS.MODERATE : CONFIDENCE_LEVELS.LOW,
    methodology: 'population_density_grid_aggregation',
    uncertaintyDrivers: [
      { factor: 'diurnal_time_distribution_approximation', impact: 'MEDIUM' },
      { factor: 'weather_and_mobility_variability', impact: 'MEDIUM' },
      { factor: 'lack_of_realtime_optical_sensors', impact: 'HIGH' }
    ],
    label: `${minOpportunity.toLocaleString()} – ${maxOpportunity.toLocaleString()} estimated opportunity`
  });

  return {
    populationBreakdown: {
      residentPopulation: residentPop,
      transientPopulation: transientPop,
      workforcePopulation: workforcePop,
      totalPopulation
    },
    availableAudienceBase,
    baseDailyFootfall,
    shiftFootfallExposure,
    totalCampaignExposure,
    exposureProvenance,
    timeExposure,
    environmentalCoefficients: {
      mobilityFactor,
      weatherCoefficient
    }
  };
}
