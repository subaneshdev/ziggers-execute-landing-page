/**
 * Ziggers Intelligence OS - Data Provenance & Maturity Engine
 * 
 * Standardized data structure for tagging every analytical output with:
 * - Source Type (USER_PROVIDED, HEURISTIC, MODELLED_ESTIMATE, EMPIRICAL_MODEL, TRAINED_MODEL, UNKNOWN)
 * - Maturity Level (0: No Data, 1: Heuristic, 2: External Model, 3: Ziggers Empirical, 4: Validated ML)
 * - Confidence Level (LOW, MODERATE, HIGH)
 * - Methodology & Uncertainty Drivers
 */

export const SOURCE_TYPES = {
  USER_PROVIDED: 'USER_PROVIDED',
  HEURISTIC: 'HEURISTIC',
  MODELLED_ESTIMATE: 'MODELLED_ESTIMATE',
  EMPIRICAL_MODEL: 'EMPIRICAL_MODEL',
  TRAINED_MODEL: 'TRAINED_MODEL',
  UNKNOWN: 'UNKNOWN'
};

export const MATURITY_LEVELS = {
  LEVEL_0_NO_DATA: 0,
  LEVEL_1_HEURISTIC: 1,
  LEVEL_2_EXTERNAL_DATA_MODEL: 2,
  LEVEL_3_ZIGGERS_EMPIRICAL: 3,
  LEVEL_4_VALIDATED_PREDICTIVE_MODEL: 4
};

export const CONFIDENCE_LEVELS = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH'
};

/**
 * Creates a standard data provenance wrapper for any value
 * @param {Object} options
 * @returns {Object} Provenance-wrapped value
 */
export function createProvenanceValue({
  value,
  sourceType = SOURCE_TYPES.HEURISTIC,
  maturityLevel = MATURITY_LEVELS.LEVEL_1_HEURISTIC,
  confidence = CONFIDENCE_LEVELS.LOW,
  methodology = 'operational_assumption',
  uncertaintyDrivers = [],
  sampleCount = 0,
  minRange = null,
  maxRange = null,
  label = null
}) {
  return {
    value,
    minRange: minRange !== null ? minRange : value,
    maxRange: maxRange !== null ? maxRange : value,
    label: label || (typeof value === 'string' ? value : String(value)),
    sourceType,
    maturityLevel,
    confidence,
    methodology,
    uncertaintyDrivers,
    sampleCount,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

/**
 * Creates an explicit "Insufficient Data" provenance output
 */
export function createInsufficientDataValue(metricName) {
  return {
    value: null,
    minRange: null,
    maxRange: null,
    label: 'Insufficient data to estimate reliably',
    sourceType: SOURCE_TYPES.UNKNOWN,
    maturityLevel: MATURITY_LEVELS.LEVEL_0_NO_DATA,
    confidence: CONFIDENCE_LEVELS.LOW,
    methodology: 'data_gap_detection',
    uncertaintyDrivers: [
      { factor: `No verified observations available for ${metricName}`, impact: 'HIGH' }
    ],
    sampleCount: 0,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}
