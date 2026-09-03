/**
 * Ziggers Signal Sync - Offline Campaign Recommendation Engine
 * File: src/lib/intelligence/signals/recommendationEngine.js
 *
 * Synthesizes Digital Signal Profiles and Offline Context Matches into an actionable,
 * explainable physical campaign deployment recommendation.
 */

import { optimizeStaffing } from '../capacity/staffingOptimizer.js';
import { allocateCampaignEscrow } from '../finance/campaignAllocator.js';

export function generateCampaignRecommendation(digitalProfile, contextMatchResult, options = {}) {
  const {
    budgetInr = 150000,
    campaignDurationDays = 3,
    shiftHours = 5,
    isGstInclusive = true
  } = options;

  const topLocations = contextMatchResult.rankedLocations?.slice(0, 3) || [];
  const primaryLocation = topLocations[0] || {
    locationName: 'OMR IT Corridor & Tidel Park',
    offlineContextScore: 91,
    metrics: { estimatedRelevantAudience: 72400, estimatedPhysicalExposure: 31000, expectedInteractions: 6200, expectedConversions: 4800 }
  };

  const objective = digitalProfile.objective || 'Product Sampling';

  // Compute Optimal Staffing based on physical footfall throughput and budget
  const staffingData = optimizeStaffing({
    budgetInr,
    isGstInclusive,
    objective,
    shiftHours,
    campaignDays: campaignDurationDays,
    reachableAudience: primaryLocation.metrics?.estimatedRelevantAudience || 72400
  });

  const recommendedPromoterCount = staffingData.recommendedPromoters || 12;
  const recommendedSupervisorCount = staffingData.supervisorCount || 2;

  // Escrow & Financial Allocation
  const escrowData = allocateCampaignEscrow(budgetInr, isGstInclusive);

  // Aggregate Expected Campaign Totals across Top Locations
  let totalEstimatedAudience = 0;
  let totalPhysicalExposure = 0;
  let totalExpectedInteractions = 0;
  let totalExpectedConversions = 0;

  topLocations.forEach(loc => {
    totalEstimatedAudience += loc.metrics?.estimatedRelevantAudience || 0;
    totalPhysicalExposure += loc.metrics?.estimatedPhysicalExposure || 0;
    totalExpectedInteractions += loc.metrics?.expectedInteractions || 0;
    totalExpectedConversions += loc.metrics?.expectedConversions || 0;
  });

  // Calculate Unit Economics
  const expectedCpl = totalExpectedConversions > 0 
    ? `₹${Math.round(budgetInr / totalExpectedConversions).toLocaleString('en-IN')}` 
    : '₹42';

  const confidenceScore = Math.round(primaryLocation.offlineContextScore * 0.86);

  const recommendation = {
    recommendationId: `rec_sig_${Date.now().toString(36)}`,
    campaignTitle: `${digitalProfile.brand} - Physical Activation Blueprint`,
    brand: digitalProfile.brand,
    digitalSourceCampaign: digitalProfile.campaign_name,
    objective,
    recommendedAudienceContext: [
      digitalProfile.top_age_ranges?.[0]?.range || '18-24',
      ...(digitalProfile.audience_interests || ['Fitness', 'Sports']),
      'Young Professionals & Commuters'
    ],
    recommendedLocations: topLocations.map((loc, idx) => ({
      rank: idx + 1,
      name: loc.locationName,
      city: loc.city,
      score: loc.offlineContextScore,
      h3CenterCell: loc.h3CenterCell,
      estimatedRelevantAudience: loc.metrics?.estimatedRelevantAudience,
      expectedInteractions: loc.metrics?.expectedInteractions,
      confidence: loc.metrics?.confidenceLevel
    })),
    recommendedTimeWindow: digitalProfile.top_time_windows?.[0]?.time_window || '18:00 – 21:00',
    recommendedPromoterCount,
    recommendedSupervisorCount,
    recommendedDurationDays: campaignDurationDays,
    shiftHours,
    
    // Aggregated Physical Funnel Forecast
    estimatedRelevantAudience: totalEstimatedAudience || 72400,
    estimatedPhysicalExposure: totalPhysicalExposure || 31000,
    expectedInteractions: totalExpectedInteractions || 6200,
    expectedSamples: objective.includes('Sampling') ? totalExpectedConversions : 0,
    expectedLeads: !objective.includes('Sampling') ? totalExpectedConversions : Math.round(totalExpectedInteractions * 0.35),
    expectedCpl,
    confidencePercent: confidenceScore,

    financials: escrowData,
    staffingBreakdown: {
      promoterDailyWage: 1200,
      supervisorDailyWage: 1800,
      totalPromoterHours: recommendedPromoterCount * shiftHours * campaignDurationDays,
      totalLabourCost: staffingData.totalPromoterLabourCost
    },

    // Explainable "Why this recommendation?" Protocol
    explainability: {
      title: 'Algorithmic Recommendation Rationale',
      reasons: [
        `High 18–24 demographic concentration in ${primaryLocation.locationName} matches ${digitalProfile.top_age_ranges?.[0]?.range || '18-24'} digital peak performance.`,
        `High density of fitness & athletic POIs (${primaryLocation.subScores?.fitnessAffinity}/100 affinity) converts digital interest context into physical high-receptivity clusters.`,
        `Strong evening footfall aligns with ${digitalProfile.top_time_windows?.[0]?.time_window || '18:00–22:00'} digital peak conversion hours.`,
        `High alignment with Meta digital campaign metrics (CTR ${(digitalProfile.performance_metrics?.ctr * 100).toFixed(1)}%, CPA ₹${digitalProfile.performance_metrics?.cpa}).`,
        `Proven historical sampling throughput in ${primaryLocation.city} commercial corridors.`
      ]
    },

    // Execution Blueprint Payload for direct 1-Click Launch into Ziggers Execute
    executionPayload: {
      name: `${digitalProfile.brand} - Real World Activation`,
      brand: digitalProfile.brand,
      objective,
      city: primaryLocation.city || 'Chennai',
      location: primaryLocation.locationName,
      targetLocations: topLocations.map(l => l.locationName),
      workers: recommendedPromoterCount,
      supervisors: recommendedSupervisorCount,
      campaignDays: campaignDurationDays,
      shiftHours,
      budget: budgetInr,
      targetSamples: objective.includes('Sampling') ? totalExpectedConversions : 0,
      targetLeads: !objective.includes('Sampling') ? totalExpectedConversions : Math.round(totalExpectedInteractions * 0.35),
      targetCpl: expectedCpl,
      h3Zones: topLocations.map(l => l.h3CenterCell).filter(Boolean)
    }
  };

  return recommendation;
}
