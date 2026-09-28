/**
 * Ziggers Intelligence - Conjugate Beta-Binomial Bayesian Updating Engine
 * Mathematically rigorous Bayesian updating for conversion rates, QR scan rates, and interaction rates.
 * 
 * Model:
 * Prior: p ~ Beta(alpha_0, beta_0)
 * Likelihood: k successes out of n opportunities ~ Binomial(n, p)
 * Posterior: p | data ~ Beta(alpha_0 + k, beta_0 + (n - k))
 * Posterior Mean: E[p | data] = (alpha_0 + k) / (alpha_0 + beta_0 + n)
 * 95% Bayesian Credible Interval: [Q_beta(0.025, alpha_post, beta_post), Q_beta(0.975, alpha_post, beta_post)]
 */

// Source-dependent prior sample weight N_0 = alpha_0 + beta_0
export const PRIOR_STRENGTH_LEVELS = {
  GENERIC_INDUSTRY_PRIOR: 5,     // Weakest prior: standard industry benchmark
  CITY_HISTORICAL_DATA: 15,      // Medium prior: aggregated metro actuals
  LOCATION_TYPE_DATA: 30,        // Strong prior: specific venue category (e.g. IT Parks)
  H3_CELL_GROUND_TRUTH: 50       // Dominant prior: exact H3 cell verified historical actuals
};

// Canonical Bayesian metric registry with objective-flexible opportunity event definitions
export const BAYESIAN_METRIC_DEFINITIONS = {
  qr_scan_rate: {
    metric: 'qr_scan_rate',
    successEvent: 'unique_qr_scan',
    opportunityEvent: 'qr_exposed_audience',
    opportunityByObjective: {
      'Product Sampling': 'physical_samples_distributed',
      'Lead Generation': 'engaged_promoter_interactions',
      'Retail Activation & POSM': 'qr_exposed_store_visitors',
      'App Downloads': 'booth_kiosk_interactions',
      'Store Visits': 'flyer_pamphlet_recipients'
    },
    defaultPriorMean: 0.14,
    defaultPriorLevel: 'LOCATION_TYPE_DATA'
  },
  landing_to_lead_rate: {
    metric: 'landing_to_lead_rate',
    successEvent: 'lead_captured',
    opportunityEvent: 'landing_page_visits',
    defaultPriorMean: 0.28,
    defaultPriorLevel: 'LOCATION_TYPE_DATA'
  },
  landing_to_signup_rate: {
    metric: 'landing_to_signup_rate',
    successEvent: 'app_signup',
    opportunityEvent: 'landing_page_visits',
    defaultPriorMean: 0.18,
    defaultPriorLevel: 'LOCATION_TYPE_DATA'
  },
  lead_to_customer_rate: {
    metric: 'lead_to_customer_rate',
    successEvent: 'activated_customer',
    opportunityEvent: 'leads_captured',
    defaultPriorMean: 0.35,
    defaultPriorLevel: 'LOCATION_TYPE_DATA'
  },
  footfall_interaction_rate: {
    metric: 'footfall_interaction_rate',
    successEvent: 'promoter_interaction',
    opportunityEvent: 'reachable_shift_footfall',
    defaultPriorMean: 0.08,
    defaultPriorLevel: 'CITY_HISTORICAL_DATA'
  }
};

/**
 * Log-Gamma function via Lanczos approximation (used for exact Beta PDF and CDF)
 */
function logGamma(z) {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095836524,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  z -= 1;
  let base = C[0];
  for (let i = 1; i < g + 2; i++) {
    base += C[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(base);
}

/**
 * Regularized Incomplete Beta function I_x(a, b) via continued fraction expansion
 */
function regularizedIncompleteBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Use symmetry transformation if x > (a + 1) / (a + b + 2)
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularizedIncompleteBeta(1 - x, b, a);
  }

  const lbeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const factor = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta) / a;

  // Lentz method continued fraction
  let c = 1.0;
  let d = 1.0 - (a + b) * x / (a + 1.0);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1.0 / d;
  let h = d;

  for (let m = 1; m <= 120; m++) {
    const m2 = 2 * m;
    // Even step
    let numerator = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    h *= d * c;

    // Odd step
    numerator = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    const delta = d * c;
    h *= delta;

    if (Math.abs(delta - 1.0) < 1e-12) break;
  }

  return factor * h;
}

/**
 * High-Precision Inverse Regularized Beta Quantile Function Q(p; alpha, beta)
 * Computes exact x such that I_x(alpha, beta) = p using Brent-Dekker / Bisection root finding
 */
export function betaQuantile(p, alpha, beta) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;

  let low = 0;
  let high = 1;
  let mid = (alpha) / (alpha + beta); // Start at prior/posterior mean

  for (let iter = 0; iter < 60; iter++) {
    mid = (low + high) / 2;
    const cdf = regularizedIncompleteBeta(mid, alpha, beta);
    const diff = cdf - p;

    if (Math.abs(diff) < 1e-7 || (high - low) < 1e-7) {
      break;
    }

    if (diff > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return parseFloat(mid.toFixed(4));
}

/**
 * Execute Conjugate Beta-Binomial Bayesian Update
 * @param {Object} options
 * @returns {Object} Full posterior parameterization and credible intervals
 */
export function updateBetaBinomialRate({
  metricKey = 'qr_scan_rate',
  successCount = 0,               // k successes
  opportunityCount = 0,           // n trials
  priorMean = null,               // mu_0
  priorStrengthLevel = 'LOCATION_TYPE_DATA', // 'GENERIC_INDUSTRY_PRIOR' | 'CITY_HISTORICAL_DATA' | 'LOCATION_TYPE_DATA' | 'H3_CELL_GROUND_TRUTH'
  customPriorN0 = null
}) {
  const metricDef = BAYESIAN_METRIC_DEFINITIONS[metricKey] || BAYESIAN_METRIC_DEFINITIONS.qr_scan_rate;
  const mu0 = priorMean !== null ? Math.max(0.001, Math.min(0.999, Number(priorMean))) : metricDef.defaultPriorMean;
  const N0 = customPriorN0 || PRIOR_STRENGTH_LEVELS[priorStrengthLevel] || PRIOR_STRENGTH_LEVELS.LOCATION_TYPE_DATA;

  // 1. Establish Prior Parameters: alpha_0 = mu_0 * N_0, beta_0 = (1 - mu_0) * N_0
  const alpha0 = mu0 * N0;
  const beta0 = (1 - mu0) * N0;

  // 2. Ingest Observations (k successes out of n trials)
  const k = Math.max(0, Number(successCount) || 0);
  const n = Math.max(k, Number(opportunityCount) || 0);
  const failures = n - k;

  // 3. Exact Conjugate Bayesian Posterior Update
  const alphaPost = alpha0 + k;
  const betaPost = beta0 + failures;
  const totalWeight = alphaPost + betaPost;

  // 4. Posterior Statistical Moments
  const posteriorMean = alphaPost / totalWeight;
  const posteriorMode = (alphaPost > 1 && betaPost > 1) 
    ? ((alphaPost - 1) / (alphaPost + betaPost - 2)) 
    : posteriorMean;
  const posteriorVariance = (alphaPost * betaPost) / (Math.pow(totalWeight, 2) * (totalWeight + 1));
  const posteriorStdDev = Math.sqrt(posteriorVariance);

  // 5. Exact 95% Bayesian Credible Interval [Q(0.025), Q(0.975)]
  const lower95Credible = betaQuantile(0.025, alphaPost, betaPost);
  const upper95Credible = betaQuantile(0.975, alphaPost, betaPost);

  return {
    metric: metricDef.metric,
    successEvent: metricDef.successEvent,
    opportunityEvent: metricDef.opportunityEvent,
    prior: {
      alpha: parseFloat(alpha0.toFixed(3)),
      beta: parseFloat(beta0.toFixed(3)),
      priorMean: parseFloat(mu0.toFixed(4)),
      priorSampleWeightN0: N0,
      priorLevel: priorStrengthLevel
    },
    observations: {
      successes: k,
      opportunities: n,
      empiricalRate: n > 0 ? parseFloat((k / n).toFixed(4)) : null
    },
    posterior: {
      alpha: parseFloat(alphaPost.toFixed(3)),
      beta: parseFloat(betaPost.toFixed(3)),
      posteriorMean: parseFloat(posteriorMean.toFixed(4)),
      posteriorMode: parseFloat(posteriorMode.toFixed(4)),
      variance: parseFloat(posteriorVariance.toFixed(6)),
      stdDev: parseFloat(posteriorStdDev.toFixed(4)),
      credibleInterval95: [lower95Credible, upper95Credible]
    },
    explainability: `Bayesian Posterior Mean: ${(posteriorMean * 100).toFixed(2)}% (95% Credible Interval: [${(lower95Credible * 100).toFixed(1)}% – ${(upper95Credible * 100).toFixed(1)}%]) updated with ${k} ${metricDef.successEvent}s across ${n} ${metricDef.opportunityEvent}s.`
  };
}

import { getHierarchicalPosterior, upsertBayesianPosterior } from './learningRepository.js';

/**
 * Get Adaptive Bayesian Rate with Hierarchical Fallback:
 * H3 Cell + Objective -> Venue Type + Objective -> City + Objective -> Global Benchmark
 */
export async function getAdaptiveBayesianRate({
  tenantId = 'global',
  h3Cell,
  venueType = 'COMMERCIAL',
  city = 'Chennai',
  objective = 'Product Sampling',
  metricKey = 'landing_to_lead_rate'
}) {
  const metricDef = BAYESIAN_METRIC_DEFINITIONS[metricKey] || BAYESIAN_METRIC_DEFINITIONS.landing_to_lead_rate;
  
  // 1. Check Hierarchical Posterior from Repository
  const resolved = await getHierarchicalPosterior({
    tenantId,
    h3Cell,
    venueType,
    city,
    objective,
    metricName: metricKey
  });

  if (resolved && (resolved.alpha || resolved.beta)) {
    const alpha = Number(resolved.alpha);
    const beta = Number(resolved.beta);
    const total = alpha + beta;
    const posteriorMean = total > 0 ? alpha / total : metricDef.defaultPriorMean;
    const lower90 = betaQuantile(0.05, alpha, beta);
    const upper90 = betaQuantile(0.95, alpha, beta);
    const lower95 = betaQuantile(0.025, alpha, beta);
    const upper95 = betaQuantile(0.975, alpha, beta);

    return {
      metric: metricKey,
      rate: parseFloat(posteriorMean.toFixed(4)),
      credibleInterval90: [lower90, upper90],
      credibleInterval95: [lower95, upper95],
      alpha,
      beta,
      isAdaptive: true,
      hierarchyTier: resolved.hierarchyTier || 'H3_CELL_GROUND_TRUTH',
      dataSource: resolved.dataSource || `h3_cell:${h3Cell}`,
      observationCount: resolved.observation_count || 1,
      modelVersion: resolved.model_version || 'bayes-v1.2'
    };
  }

  // 2. Default Prior Baseline (Non-informative / Industry benchmark)
  const mu0 = metricDef.defaultPriorMean;
  const N0 = PRIOR_STRENGTH_LEVELS[metricDef.defaultPriorLevel] || PRIOR_STRENGTH_LEVELS.LOCATION_TYPE_DATA;
  const alpha0 = mu0 * N0;
  const beta0 = (1 - mu0) * N0;
  const lower90 = betaQuantile(0.05, alpha0, beta0);
  const upper90 = betaQuantile(0.95, alpha0, beta0);

  return {
    metric: metricKey,
    rate: mu0,
    credibleInterval90: [lower90, upper90],
    credibleInterval95: [betaQuantile(0.025, alpha0, beta0), betaQuantile(0.975, alpha0, beta0)],
    alpha: alpha0,
    beta: beta0,
    isAdaptive: false,
    hierarchyTier: 'INDUSTRY_PRIOR_BENCHMARK',
    dataSource: 'industry_benchmark',
    observationCount: 0,
    modelVersion: 'baseline-prior-v1.0'
  };
}

/**
 * Ingest verified campaign outcome into hierarchical Bayesian posteriors
 */
export async function ingestCampaignOutcomeToBayesian(outcome) {
  const {
    tenantId = 'global',
    h3Cell = '892f254f177ffff',
    locationName = 'Chennai Node',
    venueType = 'COMMERCIAL',
    city = 'Chennai',
    objective = 'Product Sampling',
    actualInteractions = 0,
    actualConversions = 0,
    actualFootfall = 0,
    actualQrScans = 0
  } = outcome;

  const normObj = (objective || 'Product Sampling').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const normCity = (city || 'chennai').toLowerCase().trim();
  const normVenue = (venueType || 'commercial').toLowerCase().trim();
  const cellKey = `${(h3Cell || '892f254f177ffff').toLowerCase()}:${normObj}`;
  const venueKey = `${normVenue}:${normObj}`;
  const cityKey = `${normCity}:${normObj}`;
  const globalKey = `global:${normObj}`;

  const updates = [];

  // 1. Conversion Rate (Conversions out of Interactions)
  if (actualInteractions > 0) {
    const k = actualConversions;
    const n = actualInteractions;
    const metricKey = 'landing_to_lead_rate';
    const metricDef = BAYESIAN_METRIC_DEFINITIONS[metricKey];
    const baseMu = metricDef.defaultPriorMean;
    const baseN = PRIOR_STRENGTH_LEVELS.LOCATION_TYPE_DATA;

    // Update for H3 Cell Scope
    const cellPost = await getHierarchicalPosterior({ tenantId, h3Cell, venueType, city, objective, metricName: metricKey });
    const curAlpha = cellPost ? Number(cellPost.alpha) : baseMu * baseN;
    const curBeta = cellPost ? Number(cellPost.beta) : (1 - baseMu) * baseN;
    const curObs = cellPost ? Number(cellPost.observation_count) : 0;

    const newAlpha = curAlpha + k;
    const newBeta = curBeta + (n - k);
    const newObs = curObs + 1;

    // Upsert Cell Scope
    const cellRecord = await upsertBayesianPosterior({
      tenantId,
      scopeType: 'h3_cell_objective',
      scopeKey: cellKey,
      metricName: metricKey,
      alpha: parseFloat(newAlpha.toFixed(3)),
      beta: parseFloat(newBeta.toFixed(3)),
      observationCount: newObs,
      modelVersion: 'bayes-v1.2'
    });
    updates.push(cellRecord);

    // Upsert Venue Scope
    await upsertBayesianPosterior({
      tenantId,
      scopeType: 'venue_objective',
      scopeKey: venueKey,
      metricName: metricKey,
      alpha: parseFloat(newAlpha.toFixed(3)),
      beta: parseFloat(newBeta.toFixed(3)),
      observationCount: newObs,
      modelVersion: 'bayes-v1.2'
    });

    // Upsert City Scope
    await upsertBayesianPosterior({
      tenantId,
      scopeType: 'city_objective',
      scopeKey: cityKey,
      metricName: metricKey,
      alpha: parseFloat(newAlpha.toFixed(3)),
      beta: parseFloat(newBeta.toFixed(3)),
      observationCount: newObs,
      modelVersion: 'bayes-v1.2'
    });
  }

  // 2. Interaction Rate (Interactions out of Footfall)
  if (actualFootfall > 0 && actualInteractions > 0) {
    const k = Math.min(actualFootfall, actualInteractions);
    const n = actualFootfall;
    const metricKey = 'footfall_interaction_rate';
    const metricDef = BAYESIAN_METRIC_DEFINITIONS[metricKey];
    const baseMu = metricDef.defaultPriorMean;
    const baseN = PRIOR_STRENGTH_LEVELS.CITY_HISTORICAL_DATA;

    const cellPost = await getHierarchicalPosterior({ tenantId, h3Cell, venueType, city, objective, metricName: metricKey });
    const curAlpha = cellPost ? Number(cellPost.alpha) : baseMu * baseN;
    const curBeta = cellPost ? Number(cellPost.beta) : (1 - baseMu) * baseN;
    const curObs = cellPost ? Number(cellPost.observation_count) : 0;

    const newAlpha = curAlpha + k;
    const newBeta = curBeta + (n - k);
    const newObs = curObs + 1;

    const record = await upsertBayesianPosterior({
      tenantId,
      scopeType: 'h3_cell_objective',
      scopeKey: cellKey,
      metricName: metricKey,
      alpha: parseFloat(newAlpha.toFixed(3)),
      beta: parseFloat(newBeta.toFixed(3)),
      observationCount: newObs,
      modelVersion: 'bayes-v1.2'
    });
    updates.push(record);
  }

  return {
    success: true,
    h3Cell,
    objective,
    updatesCount: updates.length,
    timestamp: new Date().toISOString()
  };
}
