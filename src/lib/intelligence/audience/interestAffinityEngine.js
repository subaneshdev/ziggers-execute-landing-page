/**
 * Ziggers Intelligence - Area Interest & Persona Affinity Engine
 * Infers area-level audience interest affinities from POI density vectors,
 * environmental signals, and cosine persona vector alignment.
 */

// Global Persona & Interest Taxonomy
export const PERSONA_TAXONOMY = {
  SPORTS: {
    name: 'Sports & Active Living',
    interests: [
      { key: 'fitness', name: 'Gym & Fitness', poiCategories: ['fitness'], baseRelevance: 0.95 },
      { key: 'cricket', name: 'Cricket & Team Sports', poiCategories: ['fitness', 'entertainment'], baseRelevance: 0.85 },
      { key: 'running', name: 'Marathon & Running', poiCategories: ['fitness'], baseRelevance: 0.90 },
      { key: 'badminton', name: 'Badminton & Rackets', poiCategories: ['fitness'], baseRelevance: 0.88 }
    ]
  },
  FOOD: {
    name: 'Food & Culinary',
    interests: [
      { key: 'foodies', name: 'Dining & Foodies', poiCategories: ['food'], baseRelevance: 0.95 },
      { key: 'cafes', name: 'Artisan Coffee & Cafes', poiCategories: ['food'], baseRelevance: 0.92 },
      { key: 'premium_dining', name: 'Gourmet & Fine Dining', poiCategories: ['food'], baseRelevance: 0.90 },
      { key: 'street_food', name: 'Street Food & Quick Bites', poiCategories: ['food'], baseRelevance: 0.94 }
    ]
  },
  SHOPPING: {
    name: 'Shopping & Retail',
    interests: [
      { key: 'fashion', name: 'Apparel & High Fashion', poiCategories: ['fashion'], baseRelevance: 0.96 },
      { key: 'luxury', name: 'Luxury Goods & Gold', poiCategories: ['fashion'], baseRelevance: 0.92 },
      { key: 'beauty', name: 'Cosmetics & Personal Care', poiCategories: ['fashion'], baseRelevance: 0.89 },
      { key: 'electronics', name: 'Gadgets & Tech Retail', poiCategories: ['technology', 'fashion'], baseRelevance: 0.91 }
    ]
  },
  LIFESTYLE: {
    name: 'Lifestyle & Tech',
    interests: [
      { key: 'gaming', name: 'Esports & Gaming', poiCategories: ['entertainment', 'technology'], baseRelevance: 0.88 },
      { key: 'entertainment', name: 'Movies & Concerts', poiCategories: ['entertainment'], baseRelevance: 0.92 },
      { key: 'automotive', name: 'Cars & Bikes', poiCategories: ['transit', 'technology'], baseRelevance: 0.82 }
    ]
  },
  DEMOGRAPHIC_PERSONAS: {
    name: 'Target Personas',
    interests: [
      { key: 'students', name: 'College & Students', poiCategories: ['education', 'food'], baseRelevance: 0.94 },
      { key: 'young_pros', name: 'Young Working Professionals', poiCategories: ['technology', 'food', 'fitness'], baseRelevance: 0.95 },
      { key: 'it_employees', name: 'IT & Software Engineers', poiCategories: ['technology'], baseRelevance: 0.98 },
      { key: 'families', name: 'Parents & Families', poiCategories: ['food', 'fashion', 'entertainment'], baseRelevance: 0.90 },
      { key: 'business_owners', name: 'Entrepreneurs & Merchants', poiCategories: ['technology', 'fashion'], baseRelevance: 0.92 }
    ]
  }
};

/**
 * Calculate Interest Affinity Scores from POI density vectors
 * Uses distance-decayed POI category weights and neutral priors (0.50) when signals are missing.
 * @param {Array<string>} selectedInterests - e.g. ['fitness', 'foodies', 'fashion']
 * @param {Object} poiCounts - Density map from POIProvider
 * @param {Object} historicalAffinities - Optional known location affinity cache
 * @returns {{ weightedAffinityScore: number, interestBreakdown: Object, confidenceImpact: number, isNeutralPrior: boolean }}
 */
export function calculateInterestAffinity(selectedInterests = [], poiCounts = {}, historicalAffinities = {}) {
  if (!selectedInterests || selectedInterests.length === 0) {
    return {
      weightedAffinityScore: 0.50, // Neutral prior
      interestBreakdown: {},
      confidenceImpact: 0.65,
      isNeutralPrior: true,
      source: 'neutral_prior_no_selection'
    };
  }

  let totalWeightedScore = 0;
  let totalWeightSum = 0;
  const interestBreakdown = {};
  let missingSignalsCount = 0;

  selectedInterests.forEach(interestKey => {
    // 1. Check historical / calibrated ground truth first
    if (historicalAffinities && historicalAffinities[interestKey] !== undefined) {
      const score = historicalAffinities[interestKey];
      interestBreakdown[interestKey] = {
        score,
        source: 'calibrated_location_vector',
        confidence: 0.90
      };
      totalWeightedScore += score * 1.0;
      totalWeightSum += 1.0;
      return;
    }

    // 2. Infer from POI vector categories
    let mappedCategories = [];
    Object.values(PERSONA_TAXONOMY).forEach(group => {
      const match = group.interests.find(i => i.key === interestKey);
      if (match) mappedCategories = match.poiCategories;
    });

    if (mappedCategories.length > 0) {
      let inferredScoreSum = 0;
      let catCount = 0;

      mappedCategories.forEach(cat => {
        const poiInfo = poiCounts[cat];
        if (poiInfo && poiInfo.count > 0) {
          // Normalize POI count against urban commercial benchmarks
          // (e.g. 50+ gyms is near 1.0, 10 is ~0.60)
          const normalizedDensity = Math.min(0.98, Math.max(0.40, 0.40 + Math.log10(Math.max(1, poiInfo.count)) * 0.32));
          inferredScoreSum += normalizedDensity;
          catCount++;
        }
      });

      if (catCount > 0) {
        const score = parseFloat((inferredScoreSum / catCount).toFixed(3));
        interestBreakdown[interestKey] = {
          score,
          source: 'poi_environmental_inference',
          confidence: 0.85
        };
        totalWeightedScore += score * 1.0;
        totalWeightSum += 1.0;
      } else {
        // Missing POI signals - use neutral prior (0.50) with lower confidence
        missingSignalsCount++;
        interestBreakdown[interestKey] = {
          score: 0.50,
          source: 'neutral_prior_sparse_data',
          confidence: 0.50
        };
        totalWeightedScore += 0.50 * 0.8;
        totalWeightSum += 0.8;
      }
    } else {
      // Unmapped interest - fallback to 0.50 neutral prior
      missingSignalsCount++;
      interestBreakdown[interestKey] = {
        score: 0.50,
        source: 'neutral_prior_unmapped',
        confidence: 0.50
      };
      totalWeightedScore += 0.50 * 0.8;
      totalWeightSum += 0.8;
    }
  });

  const weightedAffinityScore = totalWeightSum > 0 
    ? parseFloat((totalWeightedScore / totalWeightSum).toFixed(3))
    : 0.50;

  // Reduce overall confidence if many signals were inferred with neutral priors
  const confidenceImpact = Math.max(0.45, 0.90 - (missingSignalsCount / selectedInterests.length) * 0.35);

  return {
    weightedAffinityScore,
    interestBreakdown,
    confidenceImpact: parseFloat(confidenceImpact.toFixed(3)),
    isNeutralPrior: missingSignalsCount === selectedInterests.length,
    source: 'poi_vector_engine'
  };
}

/**
 * Cosine Similarity between Campaign Persona Vector and Location Audience Vector
 */
export function calculateCosinePersonaSimilarity(campaignVector = {}, locationVector = {}) {
  const keys = Array.from(new Set([...Object.keys(campaignVector), ...Object.keys(locationVector)]));
  if (keys.length === 0) return 0.50;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  keys.forEach(k => {
    const valA = campaignVector[k] || 0.50;
    const valB = locationVector[k] || 0.50;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0.50;
  return parseFloat((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
}
