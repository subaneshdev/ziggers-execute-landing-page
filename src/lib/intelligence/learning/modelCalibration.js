/**
 * Ziggers Intelligence - Multi-Dimensional Empirical Calibration Engine
 * Blends baseline prior predictions with empirical ground-truth observations conditioned on:
 * H3 Cell + Day Type + Time Bucket + Location Type + Objective
 */

import { getHistoricalObservations } from './observationAggregator.js';

/**
 * Recalibrate prediction values using context-conditioned empirical shrinkage
 * @param {Object} baselinePrediction
 * @param {Object} contextParams
 * @returns {Object} Recalibrated prediction object with explainable weights
 */
export function recalibrateWithGroundTruth(baselinePrediction, locationKey, objective, contextOptions = {}) {
  const contextParams = {
    h3Resolution: contextOptions.h3Resolution || 9,
    h3Cell: contextOptions.h3Cell || locationKey || 'node_default',
    dayType: contextOptions.dayType || 'WEEKEND',
    timeBucket: contextOptions.timeBucket || 'EVENING_PEAK',
    locationType: contextOptions.locationType || 'COMMERCIAL',
    campaignObjective: objective || 'Product Sampling'
  };

  const observations = getHistoricalObservations(contextParams);
  const n = observations.length;

  if (n === 0) {
    return {
      ...baselinePrediction,
      recalibrationApplied: false,
      observationCount: 0,
      observationWeight: 0,
      contextKey: 'NO_HISTORICAL_DATA',
      modelVersion: 'ZIGGERS_DETERMINISTIC_V2.1',
      modelType: 'BASELINE_PRIOR'
    };
  }

  // Calculate average actuals from verified observations
  let sumInteractions = 0;
  let sumConversions = 0;
  let sumFootfall = 0;

  observations.forEach(obs => {
    sumInteractions += obs.actual.interactions || 0;
    sumConversions += obs.actual.conversions || 0;
    sumFootfall += obs.actual.footfall || 0;
  });

  const meanObservedInteractions = sumInteractions / n;
  const meanObservedConversions = sumConversions / n;
  const meanObservedFootfall = sumFootfall / n;

  // Sample-size-weighted shrinkage weight: w_obs = min(0.85, n / (n + 5))
  const observationWeight = Math.min(0.85, n / (n + 5));
  const priorWeight = 1.0 - observationWeight;

  const calibratedInteractions = Math.round(
    (baselinePrediction.expectedInteractions * priorWeight) + (meanObservedInteractions * observationWeight)
  );

  const calibratedLeads = Math.round(
    (baselinePrediction.expectedLeads * priorWeight) + (meanObservedConversions * observationWeight)
  );

  return {
    ...baselinePrediction,
    expectedInteractions: calibratedInteractions,
    expectedLeads: calibratedLeads,
    recalibrationApplied: true,
    observationCount: n,
    observationWeight: parseFloat(observationWeight.toFixed(3)),
    priorWeight: parseFloat(priorWeight.toFixed(3)),
    empiricalMeanInteractions: Math.round(meanObservedInteractions),
    modelVersion: 'ZIGGERS_EMPIRICAL_V2.1',
    modelType: 'SAMPLE_WEIGHTED_EMPIRICAL_SHRINKAGE'
  };
}
