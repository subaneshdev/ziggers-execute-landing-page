/**
 * Ziggers Intelligence - Exposure & Reach Funnel Engine
 * Calculates physical funnel progression:
 * Available Audience -> Demographic Eligible -> Persona Matched -> Time Adjusted -> Exposure -> Reach -> Interactions
 */

/**
 * Calculate Physical Activation Exposure and Interactions
 * @param {Object} params
 * @returns {Object}
 */
export function calculatePhysicalFunnel(params) {
  const {
    availableAudienceBase = 50000,
    ageEligibilityRatio = 0.54,
    genderAvailabilityRatio = 1.0,
    weightedInterestAffinity = 0.80,
    shiftFootfallExposure = 25000,
    totalCampaignExposure = 175000,
    physicalCapacity = 5000,
    campaignDays = 7
  } = params;

  // 1. Demographic Eligible Audience
  const demographicEligibleAudience = Math.round(
    availableAudienceBase * ageEligibilityRatio * genderAvailabilityRatio
  );

  // 2. Persona / Interest Matched Audience
  const personaMatchedAudience = Math.round(
    demographicEligibleAudience * Math.max(0.20, weightedInterestAffinity)
  );

  // 3. Realistic Unique Reach (People directly exposed in physical proximity)
  // Reach is derived as a proportion of active footfall exposure bounded by demographic qualification
  const estimatedReachDaily = Math.round(
    shiftFootfallExposure * ageEligibilityRatio * genderAvailabilityRatio * weightedInterestAffinity * 0.65
  );
  const totalCampaignReach = Math.min(
    demographicEligibleAudience,
    Math.round(estimatedReachDaily * Math.min(Number(campaignDays) || 1, 3.8)) // Unique deduplication curve across days
  );

  // 4. Engagement Opportunity (Audience pausing / receptive to interaction)
  const engagementOpportunityRate = 0.28; // ~28% of reachable audience stops or engages
  const engagementOpportunity = Math.round(totalCampaignReach * engagementOpportunityRate);

  // 5. Expected Actual Interactions (Strictly bounded by physical promoter capacity vs opportunity)
  // NEVER use max(250) or hardcoded floors. If opportunity is 80, interactions cannot exceed 80.
  const expectedInteractions = Math.min(
    physicalCapacity,
    engagementOpportunity
  );

  const minInteractions = Math.round(expectedInteractions * 0.80);
  const maxInteractions = Math.min(physicalCapacity, Math.round(expectedInteractions * 1.20));

  return {
    demographicEligibleAudience,
    personaMatchedAudience,
    totalCampaignReach,
    estimatedReachDaily,
    engagementOpportunity,
    interactions: {
      lower: minInteractions,
      expected: expectedInteractions,
      upper: maxInteractions
    },
    funnelRatios: {
      demographicMatchPct: Math.round(ageEligibilityRatio * genderAvailabilityRatio * 100),
      interestAffinityPct: Math.round(weightedInterestAffinity * 100),
      reachEfficiencyPct: Math.round((totalCampaignReach / Math.max(1, availableAudienceBase)) * 100)
    }
  };
}
