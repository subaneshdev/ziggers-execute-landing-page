/**
 * Ziggers Intelligence - Data Provider Interface & Registry
 * Standardized contract with source-specific exponential data freshness decay policies,
 * dataset provenance taxonomies, and uncertainty penalty adjustments.
 */

// Canonical Source Provenance Types
export const SOURCE_TYPES = {
  OFFICIAL_CENSUS: 'OFFICIAL_CENSUS',                 // e.g. Census 2011 Baseline
  MODELLED_ESTIMATE: 'MODELLED_ESTIMATE',             // e.g. WorldPop Gridded Layer
  PROJECTED_ESTIMATE: 'PROJECTED_ESTIMATE',           // e.g. MOSPI MPCE 2024 projections
  POI_DATA: 'POI_DATA',                               // e.g. POI category density vector
  MOBILITY_DATA: 'MOBILITY_DATA',                     // e.g. Telco / Transit Mobility Index
  WEATHER_DATA: 'WEATHER_DATA',                       // e.g. Precipitation & temperature
  ZIGGERS_OBSERVED_ACTUAL: 'ZIGGERS_OBSERVED_ACTUAL' // e.g. Verified campaign actuals
};

// Source-Specific Freshness Decay Policies (Half-Life in Days)
export const FRESHNESS_POLICIES = {
  OFFICIAL_CENSUS: { halfLifeDays: 3650, label: 'Official Census (10-year half-life)' },
  MODELLED_ESTIMATE: { halfLifeDays: 730, label: 'WorldPop Gridded Population (2-year half-life)' },
  PROJECTED_ESTIMATE: { halfLifeDays: 365, label: 'Demographic Projections (1-year half-life)' },
  POI_DATA: { halfLifeDays: 90, label: 'POI Density (90-day half-life)' },
  MOBILITY_DATA: { halfLifeDays: 30, label: 'Urban Mobility (30-day half-life)' },
  WEATHER_DATA: { halfLifeDays: 1, label: 'Weather Forecast (24-hour half-life)' },
  ZIGGERS_OBSERVED_ACTUAL: { halfLifeDays: 180, label: 'Ziggers Ground Telemetry (180-day half-life)' }
};

export class DataProviderInterface {
  constructor(name, providerType, sourceType = SOURCE_TYPES.MODELLED_ESTIMATE) {
    this.name = name;
    this.providerType = providerType;
    this.sourceType = sourceType;
  }

  async fetchData(queryContext) {
    throw new Error(`fetchData() not implemented in ${this.constructor.name}`);
  }

  /**
   * Calculate data freshness score using source-specific exponential decay: Freshness = e^(-lambda * days)
   * Note: Freshness influences forecast uncertainty / confidence bounds, NOT the baseline population itself.
   * @param {string|Date} collectedAt 
   * @param {string} sourceType
   */
  calculateFreshness(collectedAt, sourceType = this.sourceType) {
    if (!collectedAt) return 0.70;
    const policy = FRESHNESS_POLICIES[sourceType] || FRESHNESS_POLICIES.MODELLED_ESTIMATE;
    const ageMs = Math.max(0, new Date().getTime() - new Date(collectedAt).getTime());
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const lambda = Math.LN2 / policy.halfLifeDays;
    const freshnessScore = Math.max(0.10, Math.exp(-lambda * ageDays));
    return parseFloat(freshnessScore.toFixed(3));
  }
}

/**
 * Robust provider runner with caching, source-specific decay, and graceful fallbacks
 */
export async function executeProviderPipeline(primaryProvider, fallbackProvider, queryContext) {
  try {
    const result = await primaryProvider.fetchData(queryContext);
    if (result && result.data) {
      const freshness = primaryProvider.calculateFreshness(result.collectedAt || '2024-01-01', primaryProvider.sourceType);
      return {
        data: result.data,
        source: primaryProvider.name,
        sourceType: primaryProvider.sourceType,
        collectedAt: result.collectedAt || '2024-01-01',
        validUntil: result.validUntil || '2027-12-31',
        freshnessScore: freshness,
        // Confidence combines provider quality with temporal freshness
        confidence: parseFloat(((result.confidence || 0.90) * (0.5 + 0.5 * freshness)).toFixed(3)),
        // Uncertainty penalty factor for forecast ranges (older data inflates interval width)
        uncertaintyInflationFactor: parseFloat((1.0 + (1.0 - freshness) * 0.40).toFixed(3)),
        isFallback: false
      };
    }
  } catch (err) {
    console.warn(`Primary provider ${primaryProvider.name} failed:`, err.message);
  }

  // Fallback Provider execution
  if (fallbackProvider) {
    try {
      const fallbackResult = await fallbackProvider.fetchData(queryContext);
      const freshness = fallbackProvider.calculateFreshness(fallbackResult.collectedAt || '2023-01-01', fallbackProvider.sourceType);
      return {
        data: fallbackResult.data,
        source: fallbackProvider.name,
        sourceType: fallbackProvider.sourceType,
        collectedAt: fallbackResult.collectedAt || '2023-01-01',
        validUntil: fallbackResult.validUntil || '2026-12-31',
        freshnessScore: freshness,
        confidence: Math.max(0.40, parseFloat(((fallbackResult.confidence || 0.75) * (0.5 + 0.5 * freshness) * 0.85).toFixed(3))),
        uncertaintyInflationFactor: 1.35,
        isFallback: true,
        fallbackReason: 'Primary provider unreachable or sparse data'
      };
    } catch (fallbackErr) {
      console.warn(`Fallback provider ${fallbackProvider.name} failed:`, fallbackErr.message);
    }
  }

  return {
    data: null,
    source: 'none',
    sourceType: 'NONE',
    confidence: 0.30,
    freshnessScore: 0.20,
    uncertaintyInflationFactor: 1.60,
    isFallback: true,
    error: 'All providers failed'
  };
}
