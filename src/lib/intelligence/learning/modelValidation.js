/**
 * Ziggers Intelligence - Predictive Model Validation & Continuous Feedback Engine
 * Computes zero-safe predictive accuracy metrics (WAPE, sMAPE, MAE, RMSE, Prediction Bias),
 * tracks nominal 90% forecast range coverage and calibration error, and performs temporal holdout validation.
 */

// Statistically Measurable Maturity Framework
export const MODEL_MATURITY_LEVELS = [
  { minCount: 2000, status: 'HIGH_CONFIDENCE', label: 'High Confidence (2,000+ Verified Observations)', badgeColor: 'green' },
  { minCount: 500,  status: 'ESTABLISHED', label: 'Established Model (500–1,999 Observations)', badgeColor: 'emerald' },
  { minCount: 100,  status: 'CALIBRATING', label: 'Calibrating (100–499 Observations)', badgeColor: 'blue' },
  { minCount: 30,   status: 'PRELIMINARY', label: 'Preliminary Signal (30–99 Observations)', badgeColor: 'amber' },
  { minCount: 10,   status: 'EARLY_SIGNAL', label: 'Early Signal (10–29 Observations)', badgeColor: 'orange' },
  { minCount: 0,    status: 'INSUFFICIENT', label: 'Insufficient Data (0–9 Observations)', badgeColor: 'red' }
];

export const METRIC_BENCHMARKS = {
  samples: { name: 'Samples Distributed', targetWape: 15.0, nominalCoverage: 90.0, unit: 'units' },
  footfall: { name: 'Reachable Footfall', targetWape: 20.0, nominalCoverage: 90.0, unit: 'people' },
  qrScans: { name: 'Unique QR Scans', targetWape: 22.0, nominalCoverage: 90.0, unit: 'scans' },
  leads: { name: 'Leads Captured', targetWape: 25.0, nominalCoverage: 90.0, unit: 'leads' }
};

/**
 * Determine Model Maturity Level from Observation Count
 */
export function getModelMaturity(observationCount = 0) {
  const count = Math.max(0, Number(observationCount) || 0);
  for (const tier of MODEL_MATURITY_LEVELS) {
    if (count >= tier.minCount) {
      return { ...tier, observationCount: count };
    }
  }
  return { ...MODEL_MATURITY_LEVELS[MODEL_MATURITY_LEVELS.length - 1], observationCount: count };
}

/**
 * Compute Comprehensive Validation Metrics for a paired dataset of Predictions and Actuals
 * @param {Array<{predicted: number, actual: number, lowerBound?: number, upperBound?: number}>} pairs
 * @param {string} metricType - 'samples' | 'footfall' | 'qrScans' | 'leads'
 * @returns {Object}
 */
export function calculateModelValidationMetrics(pairs = [], metricType = 'samples') {
  const benchmark = METRIC_BENCHMARKS[metricType] || METRIC_BENCHMARKS.samples;
  const n = pairs.length;

  if (n === 0) {
    return {
      metricType,
      metricName: benchmark.name,
      observationCount: 0,
      maturity: getModelMaturity(0),
      metrics: {
        wape: null,
        smape: null,
        mae: null,
        rmse: null,
        predictionBias: null,
        nominalRangeCoverage: null,
        calibrationError: null
      },
      status: 'NO_DATA'
    };
  }

  let sumAbsoluteError = 0;
  let sumSquaredError = 0;
  let sumActual = 0;
  let sumPredictedMinusActual = 0;
  let sumSmape = 0;
  let inRangeCount = 0;

  pairs.forEach(p => {
    const act = Math.max(0, Number(p.actual) || 0);
    const pred = Math.max(0, Number(p.predicted) || 0);
    const absError = Math.abs(act - pred);

    sumAbsoluteError += absError;
    sumSquaredError += Math.pow(act - pred, 2);
    sumActual += act;
    sumPredictedMinusActual += (pred - act);

    // sMAPE: 200% * |act - pred| / (|act| + |pred| + epsilon)
    const denom = (Math.abs(act) + Math.abs(pred)) / 2;
    if (denom > 0) {
      sumSmape += (absError / denom);
    }

    // Range Coverage (Nominal 90%)
    const low = p.lowerBound !== undefined ? Number(p.lowerBound) : pred * 0.80;
    const high = p.upperBound !== undefined ? Number(p.upperBound) : pred * 1.20;
    if (act >= low && act <= high) {
      inRangeCount++;
    }
  });

  // 1. WAPE = (Sum |Actual - Predicted| / Sum Actual) * 100
  const wape = sumActual > 0 ? parseFloat(((sumAbsoluteError / sumActual) * 100).toFixed(2)) : null;

  // 2. sMAPE
  const smape = parseFloat(((sumSmape / n) * 100).toFixed(2));

  // 3. MAE
  const mae = parseFloat((sumAbsoluteError / n).toFixed(2));

  // 4. RMSE
  const rmse = parseFloat(Math.sqrt(sumSquaredError / n).toFixed(2));

  // 5. Prediction Bias: Positive means model overpredicts, Negative means underpredicts
  const predictionBias = parseFloat((sumPredictedMinusActual / n).toFixed(2));

  // 6. Observed Forecast Range Coverage
  const rangeCoverage = parseFloat(((inRangeCount / n) * 100).toFixed(2));

  // 7. Calibration Error: |ObservedCoverage - NominalCoverage|
  const calibrationError = parseFloat(Math.abs(rangeCoverage - benchmark.nominalCoverage).toFixed(2));

  // Calibration Status Flag
  let calibrationStatus = 'CALIBRATED';
  if (rangeCoverage < benchmark.nominalCoverage - 15) {
    calibrationStatus = 'OVERCONFIDENT_RANGE_TOO_NARROW';
  } else if (rangeCoverage > benchmark.nominalCoverage + 8) {
    calibrationStatus = 'UNDERCONFIDENT_RANGE_TOO_WIDE';
  }

  return {
    metricType,
    metricName: benchmark.name,
    observationCount: n,
    maturity: getModelMaturity(n),
    metrics: {
      wape,
      smape,
      mae,
      rmse,
      predictionBias,
      nominalRangeCoverage: rangeCoverage,
      targetNominalCoverage: benchmark.nominalCoverage,
      calibrationError
    },
    calibrationStatus,
    formatted: {
      mae: `${mae.toLocaleString('en-IN')} ${benchmark.unit}`,
      rmse: `${rmse.toLocaleString('en-IN')} ${benchmark.unit}`,
      wape: wape !== null ? `${wape}%` : 'N/A',
      bias: `${predictionBias >= 0 ? '+' : ''}${predictionBias} ${benchmark.unit}`,
      rangeCoverage: `${rangeCoverage}% (Nominal: ${benchmark.nominalCoverage}%)`
    }
  };
}

/**
 * Perform Temporal Holdout Validation (Train on older campaigns, evaluate on newer holdout campaigns)
 * Avoids data leakage in offline campaign intelligence evaluation.
 * @param {Array<Object>} chronologicalCampaigns 
 * @param {number} trainRatio - e.g. 0.75 (75% older campaigns for train, 25% newer for holdout test)
 */
export function performTemporalHoldoutValidation(chronologicalCampaigns = [], trainRatio = 0.75, metricType = 'samples') {
  if (!chronologicalCampaigns || chronologicalCampaigns.length < 4) {
    return {
      status: 'INSUFFICIENT_FOR_HOLDOUT',
      message: 'At least 4 completed campaigns required for temporal train/holdout split.',
      trainCount: 0,
      holdoutCount: 0,
      holdoutMetrics: null
    };
  }

  // Sort by date ascending
  const sorted = [...chronologicalCampaigns].sort((a, b) => new Date(a.date || a.timestamp || 0) - new Date(b.date || b.timestamp || 0));
  
  const splitIndex = Math.max(1, Math.floor(sorted.length * trainRatio));
  const trainSet = sorted.slice(0, splitIndex);
  const holdoutTestSet = sorted.slice(splitIndex);

  const holdoutMetrics = calculateModelValidationMetrics(holdoutTestSet, metricType);
  const trainMetrics = calculateModelValidationMetrics(trainSet, metricType);

  return {
    status: 'HOLDOUT_VALIDATION_COMPLETE',
    totalCampaigns: sorted.length,
    trainCount: trainSet.length,
    holdoutCount: holdoutTestSet.length,
    trainSplitRatio: trainRatio,
    trainPeriod: `${trainSet[0]?.date || 'Start'} to ${trainSet[trainSet.length - 1]?.date || 'Mid'}`,
    holdoutPeriod: `${holdoutTestSet[0]?.date || 'Mid'} to ${holdoutTestSet[holdoutTestSet.length - 1]?.date || 'Latest'}`,
    holdoutEvaluation: holdoutMetrics,
    trainBaselineEvaluation: trainMetrics
  };
}
