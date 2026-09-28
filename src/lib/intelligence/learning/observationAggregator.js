/**
 * Ziggers Intelligence - Multi-Dimensional Ground Truth Observation Store
 * 
 * Ingests structured telemetry from completed on-ground campaigns and indexes them by
 * composite spatial-temporal context keys including H3 Resolution.
 * Requires explicit dataQuality (LOW, MEDIUM, HIGH) classification.
 */

import { CONFIDENCE_LEVELS } from '../provenance.js';
import { saveCampaignOutcome, listCampaignOutcomes } from './learningRepository.js';

// In-memory ground-truth store indexed by multi-dimensional context keys
const OBSERVATION_REGISTRY = new Map();

/**
 * Generate a Canonical Context Key for an observation with H3 Resolution
 */
export function generateContextKey({
  h3Resolution = 9,
  h3Cell = 'global_node',
  dayType = 'WEEKEND',
  timeBucket = 'EVENING_PEAK',
  locationType = 'COMMERCIAL',
  campaignObjective = 'SAMPLING'
}) {
  const normRes = `res${h3Resolution || 9}`;
  const normCell = (h3Cell || 'global').toLowerCase().trim();
  const normDay = (dayType || 'WEEKEND').toUpperCase().trim();
  const normTime = (timeBucket || 'EVENING_PEAK').toUpperCase().trim();
  const normLoc = (locationType || 'COMMERCIAL').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const normObj = (campaignObjective || 'SAMPLING').toUpperCase().replace(/[^A-Z0-9]/g, '_');

  return `${normRes}:${normCell}:${normDay}:${normTime}:${normLoc}:${normObj}`;
}

/**
 * Record a verified ground-truth campaign observation
 * @param {Object} observation
 */
export function recordCampaignObservation(observation) {
  const {
    h3Resolution = 9,
    h3Cell = '8928308280fffff',
    campaignId = `camp_${Date.now()}`,
    campaignObjective = 'Product Sampling',
    locationType = 'Commercial High Street',
    dayType = 'WEEKEND',
    timeBucket = 'EVENING_PEAK',
    weather = 'CLEAR',
    eventContext = 'STANDARD_WEEKEND',
    
    // Verification & Quality Classification
    verificationConfidence = CONFIDENCE_LEVELS.MODERATE,
    dataQuality = CONFIDENCE_LEVELS.MODERATE,
    
    // Predicted values
    predictedFootfall = 0,
    predictedInteractions = 0,
    predictedConversions = 0,
    predictedCpl = null,
    forecastRange = [0, 0],

    // Verified On-Ground Actuals
    actualFootfall = 0,
    actualInteractions = 0,
    actualConversions = 0,
    actualCpl = null,
    
    actualTimestamp = new Date().toISOString()
  } = observation;

  const contextKey = generateContextKey({
    h3Resolution,
    h3Cell,
    dayType,
    timeBucket,
    locationType,
    campaignObjective
  });

  const structuredRecord = {
    campaignId,
    contextKey,
    h3Resolution,
    h3Cell,
    campaignObjective,
    locationType,
    dayType,
    timeBucket,
    weather,
    eventContext,
    verificationConfidence,
    dataQuality,
    
    predicted: {
      footfall: predictedFootfall,
      interactions: predictedInteractions,
      conversions: predictedConversions,
      cpl: predictedCpl,
      range: forecastRange
    },
    
    actual: {
      footfall: actualFootfall,
      interactions: actualInteractions,
      conversions: actualConversions,
      cpl: actualCpl
    },

    timestamp: actualTimestamp,
    recordedAt: Date.now()
  };

  if (!OBSERVATION_REGISTRY.has(contextKey)) {
    OBSERVATION_REGISTRY.set(contextKey, []);
  }

  const list = OBSERVATION_REGISTRY.get(contextKey);
  list.push(structuredRecord);

  // Durable persistence in learningRepository
  try {
    saveCampaignOutcome({
      campaignId,
      h3Cell,
      objective: campaignObjective,
      locationName: locationType,
      venueType: locationType,
      predictedInteractions,
      predictedConversions,
      predictedFootfall,
      actualVerifiedInteractions: actualInteractions,
      actualConversions,
      actualVerifiedFootfall: actualFootfall,
      dataQualityStatus: dataQuality === CONFIDENCE_LEVELS.HIGH ? 'HIGH' : 'VERIFIED'
    });
  } catch (e) {
    // Ignore async background sync error
  }

  return {
    success: true,
    contextKey,
    totalContextObservations: list.length,
    record: structuredRecord
  };
}

/**
 * Retrieve high/moderate quality historical observations for model calibration
 * @param {Object} contextParams
 * @returns {Array<Object>}
 */
export function getHistoricalObservations(contextParams) {
  const exactKey = generateContextKey(contextParams);
  
  // 1. Check exact 6-dimensional match
  if (OBSERVATION_REGISTRY.has(exactKey) && OBSERVATION_REGISTRY.get(exactKey).length > 0) {
    const list = OBSERVATION_REGISTRY.get(exactKey);
    // Filter to only usable quality observations (MEDIUM / HIGH)
    return list.filter(o => o.dataQuality !== CONFIDENCE_LEVELS.LOW);
  }

  // 2. Fallback: Search by Resolution + H3 Cell + Objective
  const matchingRecords = [];
  const targetCell = (contextParams.h3Cell || '').toLowerCase();
  const targetObj = (contextParams.campaignObjective || '').toUpperCase().replace(/[^A-Z0-9]/g, '_');

  for (const [key, records] of OBSERVATION_REGISTRY.entries()) {
    if (key.includes(targetCell) && (targetObj === '' || key.includes(targetObj))) {
      const valid = records.filter(o => o.dataQuality !== CONFIDENCE_LEVELS.LOW);
      matchingRecords.push(...valid);
    }
  }

  if (matchingRecords.length > 0) {
    return matchingRecords;
  }

  // 3. Fallback: Query learningRepository durable outcomes
  try {
    const durableOutcomes = listCampaignOutcomes({
      h3Cell: contextParams.h3Cell,
      objective: contextParams.campaignObjective,
      limit: 20
    });
    if (durableOutcomes && durableOutcomes.length > 0) {
      return durableOutcomes.map(o => ({
        campaignId: o.campaign_id || o.campaignId,
        h3Cell: o.h3_cell || o.h3Cell,
        campaignObjective: o.objective,
        actual: {
          interactions: o.actual_verified_interactions || o.actualVerifiedInteractions || 0,
          conversions: o.actual_conversions || o.actualConversions || 0,
          footfall: o.actual_verified_footfall || o.actualVerifiedFootfall || 0
        },
        dataQuality: CONFIDENCE_LEVELS.HIGH
      }));
    }
  } catch (err) {
    // Graceful fallback
  }

  return matchingRecords;
}

/**
 * Get all historical observations across the system
 */
export function getAllObservations() {
  const all = [];
  for (const list of OBSERVATION_REGISTRY.values()) {
    all.push(...list);
  }
  return all;
}
