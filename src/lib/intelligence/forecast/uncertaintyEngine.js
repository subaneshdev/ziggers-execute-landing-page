/**
 * Ziggers Intelligence - Forecast Uncertainty & Risk Engine
 * 
 * Generates transparent forecast intervals based on identifiable uncertainty drivers:
 * - Data Freshness & Completeness
 * - Historical Sample Depth
 * - Execution & Permit Feasibility
 * - Weather & Local Footfall Volatility
 */

import { createProvenanceValue, SOURCE_TYPES, MATURITY_LEVELS, CONFIDENCE_LEVELS } from '../provenance.js';

/**
 * Calculate realistic planning forecast ranges with explicit uncertainty drivers
 * @param {number} expectedValue 
 * @param {Object} confidenceContext 
 * @returns {Object}
 */
export function calculateForecastRange(expectedValue, confidenceContext = {}) {
  const val = Math.max(0, Number(expectedValue) || 0);
  if (val === 0) {
    return {
      lower: 0,
      expected: 0,
      upper: 0,
      rangeStr: '0',
      uncertaintyPercentage: 0,
      confidenceLabel: 'No Forecast Available',
      uncertaintyDrivers: []
    };
  }

  const {
    historicalSampleCount = 0,
    isSparseLocation = false,
    isNeutralPrior = true,
    hasWeatherRisk = false,
    confidenceScore = 0.70
  } = confidenceContext;

  const uncertaintyDrivers = [];

  let uncertaintyFraction = 0.20; // 20% baseline heuristic dispersion

  if (historicalSampleCount === 0) {
    uncertaintyFraction += 0.15;
    uncertaintyDrivers.push({ factor: 'No historical Ziggers campaign observations at this exact venue', impact: 'HIGH' });
  } else if (historicalSampleCount < 10) {
    uncertaintyFraction += 0.08;
    uncertaintyDrivers.push({ factor: 'Limited historical sample count (<10 verified campaigns)', impact: 'MEDIUM' });
  }

  if (isSparseLocation) {
    uncertaintyFraction += 0.10;
    uncertaintyDrivers.push({ factor: 'Sparse POI & demographic polygon coverage', impact: 'HIGH' });
  }

  if (isNeutralPrior) {
    uncertaintyDrivers.push({ factor: 'Industry standard conversion heuristic applied without brand baseline', impact: 'MEDIUM' });
  }

  if (hasWeatherRisk) {
    uncertaintyFraction += 0.10;
    uncertaintyDrivers.push({ factor: 'Adverse weather or monsoon variability during campaign window', impact: 'HIGH' });
  }

  // Clamped bounds (20% to 50% spread for physical campaigns)
  const clampedUncertainty = Math.max(0.15, Math.min(0.50, uncertaintyFraction));
  const lowerBound = Math.max(0, Math.round(val * (1 - clampedUncertainty)));
  const upperBound = Math.round(val * (1 + clampedUncertainty));

  const confidenceLevel = clampedUncertainty <= 0.22 
    ? CONFIDENCE_LEVELS.HIGH 
    : (clampedUncertainty <= 0.35 ? CONFIDENCE_LEVELS.MODERATE : CONFIDENCE_LEVELS.LOW);

  const confidenceLabel = confidenceLevel === CONFIDENCE_LEVELS.HIGH 
    ? 'High Confidence' 
    : (confidenceLevel === CONFIDENCE_LEVELS.MODERATE ? 'Moderate Confidence' : 'Low Confidence (Planning Estimate)');

  return {
    lower: lowerBound,
    expected: val,
    upper: upperBound,
    rangeStr: `${lowerBound.toLocaleString('en-IN')} – ${upperBound.toLocaleString('en-IN')}`,
    uncertaintyPercentage: Math.round(clampedUncertainty * 100),
    confidenceLevel,
    confidenceLabel,
    uncertaintyDrivers
  };
}
