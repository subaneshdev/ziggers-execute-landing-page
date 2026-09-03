/**
 * Ziggers Operational Campaign Requirements Engine
 * 
 * Translates high-level campaign parameters (objective, venues, duration, reach)
 * into concrete, structured physical requirements (Manpower, Collateral, Logistics, Venues, Media).
 * 
 * Crucial Rule: Every item is tagged with its provenance (AI_SUGGESTED, USER_CONFIRMED, etc.)
 * and allows user modification.
 */

export const REQUIREMENT_CATEGORIES = {
  MANPOWER: 'MANPOWER',
  COLLATERAL: 'COLLATERAL',
  LOGISTICS: 'LOGISTICS',
  VENUE: 'VENUE',
  MEDIA: 'MEDIA'
};

export const PROVENANCE_STATES = {
  AI_SUGGESTED: 'AI_SUGGESTED',
  USER_CONFIRMED: 'USER_CONFIRMED',
  MANAGER_CONFIRMED: 'MANAGER_CONFIRMED',
  VENDOR_QUOTED: 'VENDOR_QUOTED'
};

/**
 * Generate physical operational requirements from a campaign brief
 * @param {Object} campaignBrief
 * @returns {Object} Structured requirements package
 */
export function generateCampaignRequirements(campaignBrief = {}) {
  const {
    campaignId = `camp_${Date.now()}`,
    objective = 'Product Sampling',
    location = 'Chennai',
    venueType = 'MALL',
    campaignDays = 5,
    promoterCount = 10,
    supervisorCount = 1,
    targetAudience = '18–30',
    expectedSamples = 10000,
    languages = ['Tamil', 'English']
  } = campaignBrief;

  const items = [];

  // 1. MANPOWER REQUIREMENTS
  items.push({
    id: `req_mp_promoters_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.MANPOWER,
    itemTitle: 'Field Brand Promoters',
    specification: `On-ground staff for ${objective}. Fluent in ${languages.join(', ')}. Age profile matching target ${targetAudience}.`,
    quantity: Math.max(1, promoterCount * campaignDays),
    unitMetric: 'SHIFT',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: true,
    status: 'PENDING'
  });

  if (supervisorCount > 0) {
    items.push({
      id: `req_mp_supervisors_${Date.now()}`,
      category: REQUIREMENT_CATEGORIES.MANPOWER,
      itemTitle: 'Field Operations Supervisors',
      specification: 'On-site team lead for attendance verification, stock handover, and live escalation management.',
      quantity: Math.max(1, supervisorCount * campaignDays),
      unitMetric: 'SHIFT',
      provenance: PROVENANCE_STATES.AI_SUGGESTED,
      isCritical: true,
      status: 'PENDING'
    });
  }

  // 2. COLLATERAL & MATERIALS REQUIREMENTS
  if (objective === 'Product Sampling' || expectedSamples > 0) {
    items.push({
      id: `req_mat_samples_${Date.now()}`,
      category: REQUIREMENT_CATEGORIES.COLLATERAL,
      itemTitle: 'Product Sample Sachets / Units',
      specification: 'Brand product units packaged for hygienic on-ground consumer distribution.',
      quantity: expectedSamples || 10000,
      unitMetric: 'UNIT',
      provenance: PROVENANCE_STATES.USER_CONFIRMED,
      isCritical: true,
      status: 'PENDING'
    });
  }

  items.push({
    id: `req_mat_tshirts_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.COLLATERAL,
    itemTitle: 'Branded Promoter Uniforms / T-Shirts',
    specification: 'High-visibility branded cotton t-shirts with brand identity and campaign call-to-action.',
    quantity: promoterCount + supervisorCount,
    unitMetric: 'UNIT',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: false,
    status: 'PENDING'
  });

  items.push({
    id: `req_mat_kiosks_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.COLLATERAL,
    itemTitle: 'Branded Display Canopy / Promotional Kiosk',
    specification: '6x6 ft weather-resistant promotional canopy with branded fascia, counter table, and rollup standees.',
    quantity: Math.max(1, Math.ceil(promoterCount / 5)),
    unitMetric: 'UNIT',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: true,
    status: 'PENDING'
  });

  // 3. LOGISTICS & DISTRIBUTION REQUIREMENTS
  items.push({
    id: `req_log_dispatch_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.LOGISTICS,
    itemTitle: 'Warehouse-to-Venue Material Logistics',
    specification: `Pick-up from brand hub and secure daily delivery to activation venue in ${location}.`,
    quantity: Math.max(1, Math.ceil(campaignDays / 2)),
    unitMetric: 'TRIP',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: true,
    status: 'PENDING'
  });

  // 4. VENUE & CLEARANCE REQUIREMENTS
  const permissionType = venueType.toUpperCase().includes('MALL') 
    ? 'Mall Operations & Marketing Department NOC' 
    : 'Local Municipal Right-of-Way & Police Station NOC';

  items.push({
    id: `req_ven_clearance_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.VENUE,
    itemTitle: 'Venue Permission & Access Clearance',
    specification: `Official written NOC from ${permissionType} for commercial brand activation.`,
    quantity: 1,
    unitMetric: 'PACKAGE',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: true,
    status: 'PENDING'
  });

  // 5. MEDIA & PROOF DOCUMENTATION
  items.push({
    id: `req_med_photo_${Date.now()}`,
    category: REQUIREMENT_CATEGORIES.MEDIA,
    itemTitle: 'On-Site Photographic & Video Documentation',
    specification: 'High-resolution geotagged photographs of booth setup, consumer sampling interactions, and crowd engagement.',
    quantity: campaignDays,
    unitMetric: 'DAY',
    provenance: PROVENANCE_STATES.AI_SUGGESTED,
    isCritical: false,
    status: 'PENDING'
  });

  return {
    campaignId,
    generatedAt: new Date().toISOString(),
    totalItems: items.length,
    criticalItemsCount: items.filter(i => i.isCritical).length,
    itemsByCategory: {
      MANPOWER: items.filter(i => i.category === REQUIREMENT_CATEGORIES.MANPOWER),
      COLLATERAL: items.filter(i => i.category === REQUIREMENT_CATEGORIES.COLLATERAL),
      LOGISTICS: items.filter(i => i.category === REQUIREMENT_CATEGORIES.LOGISTICS),
      VENUE: items.filter(i => i.category === REQUIREMENT_CATEGORIES.VENUE),
      MEDIA: items.filter(i => i.category === REQUIREMENT_CATEGORIES.MEDIA)
    },
    items
  };
}

/**
 * Allows the user or operations manager to confirm or edit an AI-suggested requirement
 */
export function updateRequirementItem(requirementsPackage, itemId, updates = {}) {
  const itemIndex = requirementsPackage.items.findIndex(i => i.id === itemId);
  if (itemIndex === -1) return requirementsPackage;

  const item = requirementsPackage.items[itemIndex];
  requirementsPackage.items[itemIndex] = {
    ...item,
    ...updates,
    provenance: updates.provenance || PROVENANCE_STATES.USER_CONFIRMED,
    updatedAt: new Date().toISOString()
  };

  return { ...requirementsPackage };
}
