/**
 * Ziggers Intelligence - Multi-Location Ranking Engine
 * Evaluates candidate locations across metro zones, computes comparative scores,
 * and generates natural language explainable rationales.
 */

import { METRO_NODES_DATA } from '../providers/populationProvider.js';
import { calculateAgeEligibility } from '../audience/demographicMatcher.js';
import { calculateInterestAffinity } from '../audience/interestAffinityEngine.js';
import { calculateAudienceQualityScore, calculateCampaignSuitabilityScore } from './campaignScoring.js';

/**
 * Generate Natural Language Explainability Rationale for a location
 */
export function generateLocationExplanation(node, scores, params) {
  const topReasons = [];
  const risks = [];
  const assumptions = [];

  // Age match rationale
  if (scores.subScores.ageMatch >= 60) {
    topReasons.push(`High density of target ${params.ageMin || 18}–${params.ageMax || 35} demographic (${scores.subScores.ageMatch}% match).`);
  }

  // POI & Affluence rationale
  topReasons.push(`Strong economic affluence score (${node.affluenceScore}/100) aligned with ${node.secClassification}.`);
  topReasons.push(`Prime ${node.locationType} with high commercial pedestrian intensity.`);

  // Interest rationale
  if (scores.subScores.interestMatch >= 75) {
    topReasons.push(`High environmental interest alignment (${scores.subScores.interestMatch}%) based on local POI vector density.`);
  }

  // Operational considerations / risks
  if (node.populationMix?.transientShare > 0.40) {
    assumptions.push('High transient pedestrian share requires fast hand-to-hand engagement pitches.');
  }
  if (scores.subScores.confidenceScore < 85) {
    risks.push('Sparse recent telemetry in this specific micro-cell; predictions rely on Census/WorldPop priors.');
  }

  return {
    summary: `${node.city} ${node.nodeId?.toUpperCase() || ''}: Ranked with a Campaign Score of ${scores.campaignSuitabilityScore}/100.`,
    topReasons,
    risks,
    assumptions,
    dataSources: ['WorldPop 2024', 'Census Demographics', 'Ziggers Ground POI Grid', 'MOSPI MPCE']
  };
}

/**
 * Rank all candidate locations for a campaign setup
 * @param {Object} params
 * @returns {Array<Object>}
 */
export function rankCandidateLocations(params, forecastRunner) {
  const candidateKeys = Object.keys(METRO_NODES_DATA);
  const cityFilter = params.city || params.targetCity;

  const filteredCandidates = cityFilter 
    ? candidateKeys.filter(k => METRO_NODES_DATA[k].city.toLowerCase() === cityFilter.toLowerCase())
    : candidateKeys;

  const targetList = filteredCandidates.length > 0 ? filteredCandidates : candidateKeys;

  const ranked = targetList.map((locKey) => {
    const node = METRO_NODES_DATA[locKey];
    const candidateParams = { ...params, targetLocations: [locKey] };
    
    // Run unified forecast for this candidate
    const forecast = forecastRunner(candidateParams);

    const aqsObj = calculateAudienceQualityScore({
      ageEligibilityRatio: forecast.demographics?.ageEligibilityRatio || 0.54,
      affluenceScore: node.affluenceScore,
      weightedInterestAffinity: forecast.interests?.weightedAffinityScore || 0.80,
      commercialScore: node.populationDensitySqKm > 15000 ? 95 : 85,
      shiftFootfallExposure: forecast.footfall?.shiftFootfallExposure || 20000,
      confidenceScore: node.confidenceScore || 0.88,
      objective: params.objective
    });

    const cssObj = calculateCampaignSuitabilityScore({
      audienceQualityScore: aqsObj.audienceQualityScore,
      reachPotential: forecast.forecast?.reach || 30000,
      conversions: forecast.forecast?.leads || 200,
      costPerConversion: forecast.forecast?.cplNum || 120,
      promoterCost: forecast.capacity?.totalPromoterLabourCost || 25000,
      budgetInr: params.budgetInr || 250000,
      confidenceScore: node.confidenceScore || 0.88
    });

    const explanation = generateLocationExplanation(node, { ...aqsObj, ...cssObj }, params);

    return {
      locationName: locKey,
      city: node.city,
      district: node.locationType,
      secClassification: node.secClassification,
      affluenceScore: node.affluenceScore,
      campaignScore: cssObj.campaignSuitabilityScore,
      audienceQualityScore: aqsObj.audienceQualityScore,
      subScores: aqsObj.subScores,
      estimatedFootfall: forecast.footfall?.shiftFootfallExposure || 0,
      estimatedReach: forecast.forecast?.reach || 0,
      expectedInteractions: forecast.forecast?.interactions || 0,
      expectedSamples: forecast.forecast?.samples || 0,
      expectedLeads: forecast.forecast?.leads || 0,
      expectedInstalls: forecast.forecast?.appInstalls || 0,
      estimatedCpl: forecast.forecast?.cplFormatted || 'N/A',
      estimatedCplNum: forecast.forecast?.cplNum,
      confidenceScore: node.confidenceScore || 0.88,
      explanation
    };
  });

  return ranked.sort((a, b) => b.campaignScore - a.campaignScore).map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));
}
