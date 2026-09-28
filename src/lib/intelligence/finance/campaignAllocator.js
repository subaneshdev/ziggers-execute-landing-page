/**
 * Ziggers Intelligence - Canonical Campaign Escrow Allocator & Worker Settlement Engine
 * Reconciles 100% of Net Campaign Fund with two-tier accounting:
 * 1. Forecast Planning Allocation (Canonical Baseline Weights)
 * 2. Actual Operational Settlement (Dynamic labour costs with unused supervisor fee flowing into Instant Refundable Reserve)
 */

import { calculateGstBreakdown } from './gstCalculator.js';
import { CANONICAL_FINANCIAL_RATES, resolveOperationalRates } from '../capacity/staffingOptimizer.js';

export const FORECAST_ESCROW_WEIGHTS = {
  promoterWagePool: 0.60,      // 60% target for on-ground promoters
  supervisorLeadFee: 0.10,     // 10% target for shift supervisors & quality auditors
  platformOsFee: 0.08,         // 8% Ziggers software & telemetry fee
  instantEscrowReserve: 0.22   // 22% refundable reserve / contingency buffer
};

/**
 * 1. Forecast Planning Allocation (Used during AI Campaign Planning)
 * @param {number} budgetInr 
 * @param {boolean} isGstInclusive 
 * @returns {Object}
 */
export function allocateCampaignEscrow(budgetInr, isGstInclusive = true) {
  const { taxableBase, gstAmount, grossBudget } = calculateGstBreakdown(budgetInr, isGstInclusive);
  const netCampaignFund = taxableBase;

  const promoterWagePool = Math.round(netCampaignFund * FORECAST_ESCROW_WEIGHTS.promoterWagePool);
  const supervisorLeadFee = Math.round(netCampaignFund * FORECAST_ESCROW_WEIGHTS.supervisorLeadFee);
  const platformOsFee = Math.round(netCampaignFund * FORECAST_ESCROW_WEIGHTS.platformOsFee);

  // Exact residual ensures 100% mathematical reconciliation without rounding drift
  const instantEscrowReserve = netCampaignFund - promoterWagePool - supervisorLeadFee - platformOsFee;

  const totalReconciled = promoterWagePool + supervisorLeadFee + platformOsFee + instantEscrowReserve;

  return {
    grossBudget,
    gstAmount,
    netCampaignFund,
    escrowWaterfall: {
      promoterWagePool,
      supervisorLeadFee,
      platformOsFee,
      instantEscrowReserve,
      totalReconciled,
      reconciliationCheck: totalReconciled === netCampaignFund
    },
    formatted: {
      grossBudget: `₹${grossBudget.toLocaleString('en-IN')}`,
      gstAmount: `₹${gstAmount.toLocaleString('en-IN')}`,
      netCampaignFund: `₹${netCampaignFund.toLocaleString('en-IN')}`,
      promoterWagePool: `₹${promoterWagePool.toLocaleString('en-IN')}`,
      supervisorLeadFee: `₹${supervisorLeadFee.toLocaleString('en-IN')}`,
      totalLabour: `₹${(promoterWagePool + supervisorLeadFee).toLocaleString('en-IN')}`,
      platformOsFee: `₹${platformOsFee.toLocaleString('en-IN')}`,
      instantEscrowReserve: `₹${instantEscrowReserve.toLocaleString('en-IN')}`
    }
  };
}

/**
 * 2. Actual Operational Settlement Allocation (Used when specific promoters/supervisors are deployed)
 * Dynamic Labour = (P * Wage * Days) + (S * SupFee * Days)
 * Any unused supervisor allocation flows directly into the Instant Refundable Reserve!
 */
export function allocateActualCampaignEscrow({
  budgetInr,
  isGstInclusive = true,
  promotersDeployed = 1,
  supervisorsDeployed = 1,
  shiftHours = 5,
  campaignDays = 7,
  materialsCost = 0,
  tenantConfig = null,
  rates = null
}) {
  const activeRates = resolveOperationalRates(tenantConfig || rates);
  const { taxableBase, gstAmount, grossBudget } = calculateGstBreakdown(budgetInr, isGstInclusive, activeRates.gstRate);
  const netCampaignFund = taxableBase;

  const singlePromoterCost = activeRates.promoterHourlyRate * shiftHours * campaignDays;
  const singleSupervisorCost = activeRates.supervisorDailyFee * campaignDays;

  const actualPromoterCost = promotersDeployed * singlePromoterCost;
  const actualSupervisorCost = supervisorsDeployed * singleSupervisorCost;
  const totalActualLabour = actualPromoterCost + actualSupervisorCost;

  const platformOsFee = Math.round(netCampaignFund * activeRates.platformFeeRate);
  const dynamicReserve = Math.max(0, netCampaignFund - totalActualLabour - platformOsFee - materialsCost);

  const totalReconciled = totalActualLabour + platformOsFee + materialsCost + dynamicReserve;

  return {
    grossBudget,
    gstAmount,
    netCampaignFund,
    settlementWaterfall: {
      actualPromoterCost,
      actualSupervisorCost,
      totalActualLabour,
      platformOsFee,
      materialsCost,
      dynamicReserve,
      totalReconciled,
      reconciliationCheck: totalReconciled === netCampaignFund
    },
    formatted: {
      grossBudget: `₹${grossBudget.toLocaleString('en-IN')}`,
      netCampaignFund: `₹${netCampaignFund.toLocaleString('en-IN')}`,
      actualPromoterCost: `₹${actualPromoterCost.toLocaleString('en-IN')}`,
      actualSupervisorCost: `₹${actualSupervisorCost.toLocaleString('en-IN')}`,
      totalActualLabour: `₹${totalActualLabour.toLocaleString('en-IN')}`,
      platformOsFee: `₹${platformOsFee.toLocaleString('en-IN')}`,
      dynamicReserve: `₹${dynamicReserve.toLocaleString('en-IN')}`
    }
  };
}

/**
 * Calculate verified payout for an individual worker shift
 */
export function calculateWorkerShiftPayout({
  workerRole = 'PROMOTER',
  baseHourlyRate = CANONICAL_FINANCIAL_RATES.promoterHourlyRate,
  shiftHours = 5,
  attendanceScore = 1.0,
  verifiedSamplesDelivered = 0,
  targetSamples = 150,
  supervisorApproval = true
}) {
  if (!supervisorApproval || attendanceScore < 0.5) {
    return {
      payoutApproved: false,
      disbursedAmount: 0,
      reason: !supervisorApproval ? 'Pending supervisor audit sign-off' : 'Attendance below 50% threshold'
    };
  }

  const baseWage = baseHourlyRate * shiftHours * attendanceScore;
  const sampleDeliveryRatio = targetSamples > 0 ? (verifiedSamplesDelivered / targetSamples) : 1.0;
  const performanceIncentive = sampleDeliveryRatio >= 1.0 ? (baseWage * 0.15) : 0;
  const totalDisbursed = Math.round(baseWage + performanceIncentive);

  return {
    payoutApproved: true,
    baseWage: Math.round(baseWage),
    performanceIncentive: Math.round(performanceIncentive),
    disbursedAmount: totalDisbursed,
    formatted: `₹${totalDisbursed.toLocaleString('en-IN')}`
  };
}
