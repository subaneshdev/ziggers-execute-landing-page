/**
 * Ziggers RFQ & Vendor Procurement Engine
 * 
 * Matches approved campaign requirements to verified physical vendors,
 * manages Request For Quote (RFQ) lifecycles, and compares real submitted quotes.
 * Never fabricates market pricing or vendor ratings.
 */

export const RFQ_STATUSES = {
  OPEN: 'OPEN',
  QUOTES_RECEIVED: 'QUOTES_RECEIVED',
  AWARDED: 'AWARDED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED'
};

export const QUOTE_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

/**
 * Match vendors for an RFQ based on service category, city, and active KYC status
 * @param {Object} rfqParams 
 * @param {Array} vendorPool 
 * @returns {Array} List of eligible matched vendors
 */
export function matchVendorsForRfq(rfqParams, vendorPool = []) {
  const { category, deliveryCity } = rfqParams;

  if (!vendorPool || vendorPool.length === 0) {
    return [];
  }

  return vendorPool.filter(vendor => {
    // 1. Must be verified
    if (vendor.kycStatus !== 'VERIFIED') return false;

    // 2. Must support the requested service category
    const supportsCategory = vendor.categories && vendor.categories.includes(category);
    if (!supportsCategory) return false;

    // 3. Must cover the target delivery city
    const coversCity = vendor.serviceableCities && (
      vendor.serviceableCities.includes(deliveryCity) ||
      vendor.serviceableCities.includes('All Tamil Nadu') ||
      vendor.serviceableCities.includes('Pan India')
    );

    return coversCity;
  });
}

/**
 * Generate a structured RFQ for an operational requirement item
 */
export function createRfqFromRequirement(requirementItem, campaignContext = {}) {
  const rfqId = `rfq_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

  return {
    id: rfqId,
    rfqNumber: `RFQ-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
    campaignId: campaignContext.campaignId || 'camp_unknown',
    requirementItemId: requirementItem.id,
    category: requirementItem.category,
    serviceRequired: requirementItem.itemTitle,
    specification: requirementItem.specification,
    quantity: requirementItem.quantity,
    unitMetric: requirementItem.unitMetric,
    deliveryCity: campaignContext.city || 'Chennai',
    deliveryVenue: campaignContext.venue || 'Target Venue',
    startDate: campaignContext.startDate || new Date().toISOString().split('T')[0],
    endDate: campaignContext.endDate || new Date().toISOString().split('T')[0],
    submissionDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h SLA
    status: RFQ_STATUSES.OPEN,
    quotes: [],
    createdAt: new Date().toISOString()
  };
}

/**
 * Compare real submitted quotes for an RFQ
 * @param {Array} quotes
 * @returns {Object} Quote comparison matrix
 */
export function compareVendorQuotes(quotes = []) {
  if (!quotes || quotes.length === 0) {
    return {
      status: 'INSUFFICIENT_MARKET_DATA',
      message: 'No quotes received yet. Request quotes from marketplace vendors.',
      totalQuotes: 0,
      lowestQuote: null,
      highestQuote: null,
      medianQuote: null,
      quotes: []
    };
  }

  const sorted = [...quotes].sort((a, b) => a.totalAmountInr - b.totalAmountInr);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];

  const mid = Math.floor(sorted.length / 2);
  const medianTotal = sorted.length % 2 !== 0 
    ? sorted[mid].totalAmountInr 
    : (sorted[mid - 1].totalAmountInr + sorted[mid].totalAmountInr) / 2;

  return {
    status: 'QUOTES_AVAILABLE',
    totalQuotes: quotes.length,
    lowestQuote: {
      quoteId: lowest.id,
      vendorName: lowest.vendorName,
      totalAmountInr: lowest.totalAmountInr,
      turnaroundDays: lowest.turnaroundDays
    },
    highestQuote: {
      quoteId: highest.id,
      vendorName: highest.vendorName,
      totalAmountInr: highest.totalAmountInr
    },
    medianQuoteAmountInr: Math.round(medianTotal),
    quotes: sorted
  };
}
