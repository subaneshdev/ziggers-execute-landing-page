/**
 * Ziggers Intelligence - GST Tax Calculator
 * Handles exact GST (18%) separation for GST-inclusive and GST-exclusive Indian enterprise billings.
 */

export const GST_RATE = 0.18;

/**
 * Calculate compliant GST breakdown with exact division
 * @param {number} budget - Gross amount
 * @param {boolean} isGstInclusive - Whether the entered budget includes 18% GST
 * @returns {Object}
 */
export function calculateGstBreakdown(budget = 35000, isGstInclusive = true, customGstRate = GST_RATE) {
  const numBudget = Math.max(0, Number(budget) || 0);
  const effectiveRate = Number(customGstRate) >= 0 ? Number(customGstRate) : GST_RATE;

  let taxableBase = 0;
  let gstAmount = 0;
  let grossTotal = 0;

  if (isGstInclusive) {
    // Exact division: Base = Budget / (1 + Rate)
    taxableBase = Math.round(numBudget / (1 + effectiveRate));
    gstAmount = Math.round(numBudget - taxableBase);
    grossTotal = Math.round(numBudget);
  } else {
    // Base is given: GST = Base * Rate
    taxableBase = Math.round(numBudget);
    gstAmount = Math.round(numBudget * effectiveRate);
    grossTotal = Math.round(taxableBase + gstAmount);
  }

  // CGST (9%) and SGST (9%) split for intra-state Tamil Nadu / domestic operations
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount - cgst);

  return {
    isGstInclusive,
    taxableBase,
    gstAmount,
    cgst,
    sgst,
    grossTotal,
    grossBudget: grossTotal,
    taxableBaseFormatted: `₹${taxableBase.toLocaleString('en-IN')}`,
    gstAmountFormatted: `₹${gstAmount.toLocaleString('en-IN')}`,
    grossTotalFormatted: `₹${grossTotal.toLocaleString('en-IN')}`,
    effectiveGstRate: '18%'
  };
}
