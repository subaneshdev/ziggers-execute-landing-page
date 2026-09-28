/**
 * Ziggers Enterprise Offline Audience Intelligence Engine
 * File: src/lib/audienceEngine.js
 *
 * Backwards-compatible facade over the Unified Ziggers Intelligence Subsystem
 * (`src/lib/intelligence/`). All calculations now flow through the unified
 * H3 geospatial, demographic interpolation, 24h footfall, dual-constrained capacity,
 * and Bayesian calibrated pipeline.
 */

import {
  generateCampaignForecast,
  optimizeStaffing,
  forecastConversions,
  calculateAttributionFunnel,
  calculateGstBreakdown,
  allocateCampaignEscrow
} from './intelligence/clientForecast.js';

import { getH3CellsForRadius } from './intelligence/geo/h3Engine.js';
import { calculateAgeEligibility, calculateGenderAvailability } from './intelligence/audience/demographicMatcher.js';
import { calculateInterestAffinity, PERSONA_TAXONOMY } from './intelligence/audience/interestAffinityEngine.js';
import { estimateFootfallAndAudience } from './intelligence/footfall/footfallEstimator.js';
import { calculateForecastRange } from './intelligence/forecast/uncertaintyEngine.js';
import { rankCandidateLocations as rankLocations } from './intelligence/ranking/locationRanking.js';
import { validateGeofenceCheckin } from './intelligence/verification/geofenceValidator.js';
import { createChainedAuditProof } from './intelligence/verification/proofHashChain.js';
import { recordCampaignObservation } from './intelligence/learning/observationAggregator.js';

import { METRO_NODES_DATA } from './intelligence/providers/populationProvider.js';

// 1. Hierarchical Persona & Interest Taxonomy
export const personaTaxonomy = PERSONA_TAXONOMY;

// 2. Comprehensive Geospatial Grid Database Across Major Cities of India
export const geoGridCellsDb = METRO_NODES_DATA;

/**
 * Fallback node generator for unlisted locations
 */
export function getOrCreateLocationNode(locationName) {
  if (METRO_NODES_DATA[locationName]) {
    return METRO_NODES_DATA[locationName];
  }

  const foundKey = Object.keys(METRO_NODES_DATA).find(
    k => k.toLowerCase().includes((locationName || '').toLowerCase()) ||
         (locationName || '').toLowerCase().includes(k.toLowerCase())
  );
  if (foundKey) return METRO_NODES_DATA[foundKey];

  return {
    nodeId: `custom_${(locationName || 'node').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: locationName || 'Metro Hub',
    city: locationName || 'Chennai',
    locationType: 'Urban Commercial & Residential Mix',
    centerLat: 13.0827,
    centerLng: 80.2707,
    populationDensitySqKm: 14000,
    baseCellPopulation: 14000,
    secClassification: 'SEC A/B',
    affluenceScore: 80,
    mpceIncomeEstimate: '₹65,000 / mo',
    ageDistribution: {
      '18-24': 0.26,
      '25-34': 0.35,
      '35-44': 0.21,
      '45-54': 0.10,
      '55-64': 0.05,
      '65+': 0.03
    },
    genderDistribution: { male: 0.51, female: 0.49 },
    populationMix: {
      residentShare: 0.40,
      transientShare: 0.35,
      workforceShare: 0.25
    },
    confidenceScore: 0.82
  };
}

/**
 * 3. Master Audience Prediction & Scoring Engine
 * Unified with the intelligence pipeline
 */
export function calculateAudiencePrediction(params) {
  return generateCampaignForecast(params);
}

/**
 * 4. Multi-Location Ranking Engine
 */
export function rankLocationCandidates(params) {
  return rankLocations(params);
}

// Re-export all modular subsystems
export {
  generateCampaignForecast,
  rankLocations,
  getH3CellsForRadius,
  calculateAgeEligibility,
  calculateGenderAvailability,
  calculateInterestAffinity,
  estimateFootfallAndAudience,
  optimizeStaffing,
  forecastConversions,
  calculateForecastRange,
  calculateAttributionFunnel,
  calculateGstBreakdown,
  allocateCampaignEscrow,
  validateGeofenceCheckin,
  createChainedAuditProof,
  recordCampaignObservation
};
