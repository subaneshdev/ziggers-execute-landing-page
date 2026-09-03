/**
 * Ziggers Intelligence - Staffing & Capacity Optimizer
 * Solves the discrete promoter + supervisor optimization problem against the canonical financial waterfall (Option B Dynamic Reserve):
 * max P  subject to:  P * PromoterCost + S(P) * SupervisorCost <= LabourFund
 * 
 * Where:
 * NetFund = Budget / 1.18 (if GST inclusive)
 * PlatformFee = NetFund * 0.08
 * MinimumReserve = max(2000, NetFund * 0.10)   [Constraint before staffing]
 * LabourFund = NetFund - PlatformFee - MaterialsCost - MinimumReserve
 * 
 * After staffing:
 * ActualLabourCost = (P * PromoterCost) + (S * SupervisorCost)
 * DynamicReserve = NetFund - PlatformFee - MaterialsCost - ActualLabourCost  [Actual leftover]
 * Guarantees: DynamicReserve >= MinimumReserve
 */

import { getThroughputConfig } from './throughputModel.js';

// Canonical financial operational parameters & configurable supervisor policies
export const CANONICAL_FINANCIAL_RATES = {
  gstRate: 0.18,                // Statutory 18% GST in India
  platformFeeRate: 0.08,        // 8% Ziggers software & telemetry fee
  minimumReserveFloorRate: 0.10,// 10% Minimum target reserve constraint
  minimumReserveAbsolute: 2000, // ₹2,000 minimum absolute safety reserve
  materialsRate: 0.00,          // Configurable materials/POSM printing rate
  promoterHourlyRate: 240,      // ₹240 / hour (₹1,200 per 5h shift)
  supervisorDailyFee: 2000      // ₹2,000 / shift (covers field oversight & audit sign-off)
};

// Configurable Supervisor Allocation Policies
export const SUPERVISOR_POLICIES = {
  STANDARD_RATIO_1_TO_10: {
    name: 'STANDARD_RATIO_1_TO_10',
    ratio: 10,
    calculateSupervisors: (p) => (p > 0 ? Math.ceil(p / 10) : 0)
  },
  TIERED_LEAN_TEAM: {
    name: 'TIERED_LEAN_TEAM',
    // 1-5 promoters: 0 supervisor, 6-15: 1 supervisor, 16-25: 2 supervisors
    calculateSupervisors: (p) => {
      if (p <= 0) return 0;
      if (p <= 5) return 0;
      if (p <= 15) return 1;
      return Math.ceil((p - 5) / 10);
    }
  }
};

/**
 * Calculate supervisors needed for a given promoter headcount under specified policy
 */
export function getRequiredSupervisors(promoterCount = 0, policyKey = 'STANDARD_RATIO_1_TO_10') {
  const p = Math.max(0, Number(promoterCount) || 0);
  if (p === 0) return 0;
  const policy = SUPERVISOR_POLICIES[policyKey] || SUPERVISOR_POLICIES.STANDARD_RATIO_1_TO_10;
  return policy.calculateSupervisors(p);
}

/**
 * Solve discrete promoter optimization problem
 * @param {number} availableLabourFund
 * @param {number} shiftHours
 * @param {number} campaignDays
 * @param {string} supervisorPolicyKey
 * @returns {{ maxAffordablePromoters: number, requiredSupervisors: number, totalLabourCost: number }}
 */
export function solveDiscreteStaffingOptimization(
  availableLabourFund, 
  shiftHours = 5, 
  campaignDays = 7,
  supervisorPolicyKey = 'STANDARD_RATIO_1_TO_10'
) {
  const singlePromoterShiftCost = CANONICAL_FINANCIAL_RATES.promoterHourlyRate * shiftHours;
  const singlePromoterTotalCost = singlePromoterShiftCost * campaignDays;
  const singleSupervisorTotalCost = CANONICAL_FINANCIAL_RATES.supervisorDailyFee * campaignDays;

  let bestP = 0;
  let bestSupervisors = 0;
  let bestLabourCost = 0;

  // Search discrete promoter counts up to 200
  for (let P = 1; P <= 200; P++) {
    const requiredSupervisors = getRequiredSupervisors(P, supervisorPolicyKey);
    const totalCost = (P * singlePromoterTotalCost) + (requiredSupervisors * singleSupervisorTotalCost);

    if (totalCost <= availableLabourFund) {
      bestP = P;
      bestSupervisors = requiredSupervisors;
      bestLabourCost = totalCost;
    } else {
      break; // Exceeded available labour fund
    }
  }

  return {
    maxAffordablePromoters: bestP,
    requiredSupervisors: bestSupervisors,
    totalLabourCost: bestLabourCost,
    singlePromoterTotalCost,
    singleSupervisorTotalCost
  };
}

/**
 * Calculate the exact minimum gross budget required to deploy a campaign for given days
 * Solves backward from operational labour + minimum reserve:
 * RequiredOperationalLabour = (1 * PromoterCost) + (S(1) * SupervisorCost)
 * MinimumNetFund = (RequiredOperationalLabour + MinimumReserve) / (1 - PlatformRate - MaterialsRate)
 * MinimumGrossBudget = MinimumNetFund * 1.18
 */
export function calculateMinimumRequiredGrossBudget(
  shiftHours = 5, 
  campaignDays = 7, 
  minPromoters = 1,
  supervisorPolicyKey = 'STANDARD_RATIO_1_TO_10'
) {
  const singlePromoterTotal = (CANONICAL_FINANCIAL_RATES.promoterHourlyRate * shiftHours) * campaignDays;
  const supervisorsNeeded = getRequiredSupervisors(minPromoters, supervisorPolicyKey);
  const singleSupervisorTotal = (CANONICAL_FINANCIAL_RATES.supervisorDailyFee * campaignDays) * supervisorsNeeded;
  
  const requiredOperationalLabour = (minPromoters * singlePromoterTotal) + singleSupervisorTotal;
  const netFundDenominator = 1 - CANONICAL_FINANCIAL_RATES.platformFeeRate - CANONICAL_FINANCIAL_RATES.materialsRate - CANONICAL_FINANCIAL_RATES.minimumReserveFloorRate;
  
  const minimumNetFund = requiredOperationalLabour / netFundDenominator;
  const minimumGrossBudget = Math.ceil(minimumNetFund * (1 + CANONICAL_FINANCIAL_RATES.gstRate));

  return {
    minimumGrossBudget,
    minimumNetFund: Math.round(minimumNetFund),
    requiredOperationalLabour: Math.round(requiredOperationalLabour),
    minimumGrossBudgetFormatted: `₹${minimumGrossBudget.toLocaleString('en-IN')}`
  };
}

/**
 * Optimize staffing headcount based on demand, supervisor policy, and canonical financial constraints
 * @param {Object} params
 * @returns {Object}
 */
export function optimizeStaffing(params) {
  const {
    budgetInr = 250000,
    isGstInclusive = true,
    objective = 'Product Sampling',
    shiftHours = 5,
    campaignDays = 7,
    reachableAudience = 50000,
    requestedPromoters = null,
    supervisorPolicy = 'STANDARD_RATIO_1_TO_10'
  } = params;

  const numBudget = Math.max(0, Number(budgetInr) || 0);
  const numDays = Math.max(1, Number(campaignDays) || 1);
  const numHours = Math.max(1, Math.min(14, Number(shiftHours) || 5));
  const throughput = getThroughputConfig(objective);

  // 1. Canonical Financial Waterfall
  const taxableBase = isGstInclusive ? (numBudget / (1 + CANONICAL_FINANCIAL_RATES.gstRate)) : numBudget;
  const gstAmount = isGstInclusive ? (numBudget - taxableBase) : (numBudget * CANONICAL_FINANCIAL_RATES.gstRate);
  const netCampaignFund = taxableBase;

  const platformFee = netCampaignFund * CANONICAL_FINANCIAL_RATES.platformFeeRate;
  const materialsCost = netCampaignFund * CANONICAL_FINANCIAL_RATES.materialsRate;
  
  // MinimumReserve = max(₹2,000, NetFund * 10%) [Constraint before staffing]
  const minimumReserve = Math.max(
    CANONICAL_FINANCIAL_RATES.minimumReserveAbsolute,
    netCampaignFund * CANONICAL_FINANCIAL_RATES.minimumReserveFloorRate
  );

  // LabourFund = NetFund - PlatformFee - MaterialsCost - MinimumReserve
  const labourFund = Math.max(0, netCampaignFund - platformFee - materialsCost - minimumReserve);

  // 2. Solve Discrete Staffing Optimization
  const discrete = solveDiscreteStaffingOptimization(labourFund, numHours, numDays, supervisorPolicy);
  const minBudgetCalc = calculateMinimumRequiredGrossBudget(numHours, numDays, 1, supervisorPolicy);

  // 3. Check for BUDGET_INSUFFICIENT condition (P = 0)
  if (discrete.maxAffordablePromoters < 1) {
    return {
      status: 'BUDGET_INSUFFICIENT',
      recommendedPromoters: 0,
      supervisorCount: 0,
      maxAffordablePromoters: 0,
      requiredPromotersForDemand: Math.ceil(reachableAudience * 0.25 / Math.max(1, numHours * throughput.expectedPerHour * numDays)),
      minimumRequiredBudget: minBudgetCalc.minimumGrossBudget,
      minimumRequiredBudgetFormatted: minBudgetCalc.minimumGrossBudgetFormatted,
      budgetDeficit: Math.max(0, minBudgetCalc.minimumGrossBudget - numBudget),
      budgetDeficitFormatted: `₹${Math.max(0, minBudgetCalc.minimumGrossBudget - numBudget).toLocaleString('en-IN')}`,
      singlePromoterCostTotal: discrete.singlePromoterTotalCost,
      totalPromoterLabourCost: 0,
      totalSupervisorLabourCost: 0,
      capacity: {
        minInteractions: 0,
        expectedInteractions: 0,
        maxInteractions: 0,
        throughputPerHour: throughput.expectedPerHour,
        totalPromoterHours: 0
      },
      staffingStrategy: {
        wave1CorePromoters: 0,
        wave2StandbyPromoters: 0,
        description: `Budget Insufficient: Minimum required budget to activate 1 certified promoter for ${numDays} days (${numHours}h/shift) is ${minBudgetCalc.minimumGrossBudgetFormatted}.`
      },
      financialWaterfall: {
        grossBudget: Math.round(numBudget),
        taxableBase: Math.round(taxableBase),
        gstAmount: Math.round(gstAmount),
        netCampaignFund: Math.round(netCampaignFund),
        minimumReserve: Math.round(minimumReserve),
        labourFund: Math.round(labourFund),
        actualLabourCost: 0,
        dynamicReserve: Math.round(netCampaignFund - platformFee),
        reserveConstraintMet: true
      }
    };
  }

  // 4. Operational Demand Constraint
  const targetEngagementVolume = Math.min(
    reachableAudience * 0.40,
    discrete.maxAffordablePromoters * numHours * throughput.expectedPerHour * numDays
  );

  const interactionCapacityPerPromoterTotal = numHours * throughput.expectedPerHour * numDays;
  const requiredPromotersForDemand = Math.max(
    1,
    Math.ceil(targetEngagementVolume / Math.max(1, interactionCapacityPerPromoterTotal))
  );

  // 5. Recommended Promoters: Bounded by discrete affordability
  let recommendedPromoters = Math.min(discrete.maxAffordablePromoters, requiredPromotersForDemand);

  if (requestedPromoters && Number(requestedPromoters) > 0) {
    const userRequested = Number(requestedPromoters);
    recommendedPromoters = Math.min(userRequested, discrete.maxAffordablePromoters);
  }

  recommendedPromoters = Math.max(1, recommendedPromoters);
  
  // Explicit zero-promoter safe supervisor count
  const supervisorCount = getRequiredSupervisors(recommendedPromoters, supervisorPolicy);

  const actualPromoterLabourCost = recommendedPromoters * discrete.singlePromoterTotalCost;
  const actualSupervisorLabourCost = supervisorCount * discrete.singleSupervisorTotalCost;
  const actualLabourCost = actualPromoterLabourCost + actualSupervisorLabourCost;

  // DynamicReserve = NetFund - PlatformFee - MaterialsCost - ActualLabourCost
  const dynamicReserve = Math.max(0, netCampaignFund - actualLabourCost - platformFee - materialsCost);

  // Ensure optimizer guarantees DynamicReserve >= MinimumReserve
  const reserveConstraintMet = dynamicReserve >= minimumReserve;

  // 6. Capacity Calculation
  const totalShiftPromoterHours = recommendedPromoters * numHours * numDays;
  const maxPhysicalCapacity = totalShiftPromoterHours * throughput.maxPerHour;
  const expectedPhysicalCapacity = totalShiftPromoterHours * throughput.expectedPerHour;
  const minPhysicalCapacity = totalShiftPromoterHours * throughput.minPerHour;

  const wave1CorePromoters = Math.max(1, Math.ceil(recommendedPromoters * 0.70));
  const wave2StandbyPromoters = Math.max(0, recommendedPromoters - wave1CorePromoters);

  return {
    status: 'OPTIMAL_STAFFING',
    recommendedPromoters,
    supervisorCount,
    maxAffordablePromoters: discrete.maxAffordablePromoters,
    requiredPromotersForDemand,
    singlePromoterCostTotal: discrete.singlePromoterTotalCost,
    totalPromoterLabourCost: actualPromoterLabourCost,
    totalSupervisorLabourCost: actualSupervisorLabourCost,
    totalActualLabourCost: actualLabourCost,
    capacity: {
      minInteractions: minPhysicalCapacity,
      expectedInteractions: expectedPhysicalCapacity,
      maxInteractions: maxPhysicalCapacity,
      throughputPerHour: throughput.expectedPerHour,
      totalPromoterHours: totalShiftPromoterHours
    },
    staffingStrategy: {
      wave1CorePromoters,
      wave2StandbyPromoters,
      description: `Wave 1: Deploy ${wave1CorePromoters} core tier-1 certified promoters. Wave 2: Maintain ${wave2StandbyPromoters} standby promoters on instant geofence fallback.`
    },
    financialWaterfall: {
      grossBudget: Math.round(numBudget),
      taxableBase: Math.round(taxableBase),
      gstAmount: Math.round(gstAmount),
      netCampaignFund: Math.round(netCampaignFund),
      minimumReserve: Math.round(minimumReserve),
      labourFund: Math.round(labourFund),
      platformFee: Math.round(platformFee),
      actualLabourCost: Math.round(actualLabourCost),
      dynamicReserve: Math.round(dynamicReserve),
      reserveConstraintMet,
      reconciliationCheck: (Math.round(actualLabourCost) + Math.round(platformFee) + Math.round(dynamicReserve)) === Math.round(netCampaignFund)
    }
  };
}
