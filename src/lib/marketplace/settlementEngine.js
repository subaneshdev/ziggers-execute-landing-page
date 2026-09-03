/**
 * Ziggers Multi-Party Campaign Funds & Procurement Settlement Engine
 * 
 * Manages allocation of campaign funds across:
 * - Manpower Staffing Fund
 * - Vendor Procurement (Printing & Fabrication)
 * - Logistics & Warehousing
 * - Venue Access Fees
 * - Ziggers Platform Software Fee
 * - Refundable Dynamic Reserve
 * 
 * TDS & Tax is modeled as a compliance accounting workflow, not fake instant banking automation.
 */

export const TDS_COMPLIANCE_STATUSES = {
  NOT_REVIEWED: 'NOT_REVIEWED',
  PENDING_DOCUMENTS: 'PENDING_DOCUMENTS',
  READY_FOR_ACCOUNTING: 'READY_FOR_ACCOUNTING',
  ACCOUNTANT_REVIEW_REQUIRED: 'ACCOUNTANT_REVIEW_REQUIRED',
  PROCESSED_EXTERNALLY: 'PROCESSED_EXTERNALLY'
};

/**
 * Calculates multi-party procurement settlement waterfall for a campaign budget
 * @param {number} grossBudgetInr 
 * @param {Object} allocationOverrides 
 * @returns {Object} Structured campaign funds allocation
 */
export function calculateCampaignFundAllocation(grossBudgetInr = 250000, allocationOverrides = {}) {
  const budget = Math.max(1000, Number(grossBudgetInr) || 250000);
  
  // Exact 18% statutory GST base separation
  const netFund = Math.round(budget / 1.18);
  const gstAmount = budget - netFund;

  const platformFee = Math.round(netFund * 0.08); // 8% Ziggers Software & Telemetry Fee
  const venueFee = Math.round(netFund * (allocationOverrides.venueFeeShare || 0.15));
  const printFabricationFund = Math.round(netFund * (allocationOverrides.productionShare || 0.25));
  const logisticsFund = Math.round(netFund * (allocationOverrides.logisticsShare || 0.07));
  const manpowerFund = Math.round(netFund * (allocationOverrides.manpowerShare || 0.35));
  
  // Remainder flows into Refundable Safety Reserve (Guarantees >= 10%)
  const allocatedSum = platformFee + venueFee + printFabricationFund + logisticsFund + manpowerFund;
  const refundableSafetyReserve = Math.max(2000, netFund - allocatedSum);

  return {
    grossBudgetInr: budget,
    netCampaignFund: netFund,
    gstBreakdown: {
      totalGst: gstAmount,
      cgst: Math.round(gstAmount / 2),
      sgst: Math.round(gstAmount / 2),
      rate: '18%'
    },
    allocations: {
      manpowerStaffingFund: manpowerFund,
      vendorProductionFund: printFabricationFund,
      logisticsFund: logisticsFund,
      venueAccessFund: venueFee,
      ziggersPlatformFee: platformFee,
      refundableSafetyReserve: refundableSafetyReserve
    },
    formatted: {
      manpowerStaffingFund: `₹${manpowerFund.toLocaleString('en-IN')}`,
      vendorProductionFund: `₹${printFabricationFund.toLocaleString('en-IN')}`,
      logisticsFund: `₹${logisticsFund.toLocaleString('en-IN')}`,
      venueAccessFund: `₹${venueFee.toLocaleString('en-IN')}`,
      ziggersPlatformFee: `₹${platformFee.toLocaleString('en-IN')}`,
      refundableSafetyReserve: `₹${refundableSafetyReserve.toLocaleString('en-IN')}`
    },
    settlementNotice: 'Funds held in Platform Campaign Escrow Account. Disbursed upon milestone QA sign-off.'
  };
}

/**
 * Calculates TDS deduction estimate for vendor payout based on section 194C / 194J
 */
export function calculateVendorTdsEstimate(invoiceAmountInr, vendorType = 'PVT_LTD', section = '194C') {
  const amount = Number(invoiceAmountInr) || 0;
  
  // Section 194C: 1% for Individual/HUF, 2% for Companies
  let tdsRate = 0.02;
  if (vendorType === 'INDIVIDUAL_FREELANCER' || vendorType === 'PROPRIETORSHIP') {
    tdsRate = 0.01;
  }
  if (section === '194J') { // Professional / Technical services
    tdsRate = 0.10;
  }

  const estimatedTds = Math.round(amount * tdsRate);
  const netPayable = amount - estimatedTds;

  return {
    grossInvoiceAmount: amount,
    applicableSection: section,
    estimatedTdsRate: `${tdsRate * 100}%`,
    estimatedTdsAmount: estimatedTds,
    estimatedNetPayable: netPayable,
    complianceStatus: TDS_COMPLIANCE_STATUSES.READY_FOR_ACCOUNTING,
    notice: 'TDS calculation is an accounting estimate. Final challan deposit reconciled by finance team.'
  };
}
