/**
 * Ziggers Signal Sync - Digital Signal Profile Normalizer
 * File: src/lib/intelligence/signals/digitalSignalProfile.js
 *
 * Converts aggregate digital campaign insights from any ad provider (Meta, Google, TikTok)
 * into a standardized, privacy-preserving internal Digital Signal Profile object.
 *
 * Zero personal identifiers or individual records are retained.
 */

export function createDigitalSignalProfile(insights) {
  if (!insights) {
    throw new Error("Invalid campaign insights payload for Digital Signal Profile generation.");
  }

  const campaignId = insights.campaignId || 'meta_campaign_unknown';
  const objective = mapToZiggersObjective(insights.objective);
  const brand = insights.brand || 'Enterprise Brand';

  // Normalize Top Age Ranges
  const rawAges = insights.breakdowns?.age || [];
  const topAgeRanges = rawAges.length > 0 
    ? rawAges.map(a => ({
        range: a.ageRange,
        performance_score: parseFloat((a.performanceScore || (a.sharePct ? a.sharePct / 100 : 0.8)).toFixed(2)),
        share_pct: a.sharePct || 0
      }))
    : [{ range: '18-24', performance_score: 0.92, share_pct: 50 }, { range: '25-34', performance_score: 0.85, share_pct: 35 }];

  // Normalize Top Genders
  const rawGenders = insights.breakdowns?.gender || [];
  const topGenders = rawGenders.length > 0
    ? rawGenders.map(g => ({
        gender: g.gender.toUpperCase(),
        performance_score: parseFloat((g.performanceScore || 0.85).toFixed(2)),
        share_pct: g.sharePct || 50
      }))
    : [{ gender: 'ALL', performance_score: 0.88, share_pct: 100 }];

  // Normalize Top Geographies
  const rawGeos = insights.breakdowns?.geography || [];
  const topGeographies = rawGeos.length > 0
    ? rawGeos.map(geo => ({
        location: geo.location,
        region: geo.region || `${geo.location} Central`,
        performance_score: parseFloat((geo.performanceScore || 0.90).toFixed(2)),
        share_pct: geo.sharePct || 33
      }))
    : [{ location: 'Chennai', region: 'South Chennai', performance_score: 0.91, share_pct: 100 }];

  // Normalize Top Time Windows
  const rawHours = insights.breakdowns?.hourlyDistribution || [];
  const topTimeWindows = rawHours.length > 0
    ? rawHours.map(h => ({
        time_window: h.hourWindow,
        label: h.label,
        performance_score: parseFloat((h.performanceScore || 0.85).toFixed(2)),
        share_pct: h.sharePct || 20
      }))
    : [{ time_window: '18:00-22:00', label: 'Evening Prime', performance_score: 0.87, share_pct: 45 }];

  // Interests / Audience Context
  const audienceInterests = insights.breakdowns?.interests || ['fitness', 'sports', 'energy_drinks'];

  const metrics = insights.summary || {};
  const performanceMetrics = {
    spend: metrics.spend || 0,
    impressions: metrics.impressions || 0,
    reach: metrics.reach || 0,
    clicks: metrics.clicks || 0,
    ctr: parseFloat((metrics.ctr || 0.025).toFixed(4)),
    cpa: parseFloat((metrics.cpa || metrics.costPerResult || 40.0).toFixed(2)),
    cpm: parseFloat((metrics.cpm || 220.0).toFixed(2)),
    conversions: metrics.conversions || 0,
    conversion_rate: parseFloat((metrics.conversionRate || (metrics.clicks ? (metrics.conversions / metrics.clicks) * 100 : 8.5)).toFixed(2))
  };

  return {
    campaign_id: campaignId,
    campaign_name: insights.campaignName || 'Digital Activation',
    brand,
    objective,
    audience_context: insights.bestPerformingAudience?.audienceContext || audienceInterests.join(' + ').toUpperCase(),
    top_age_ranges: topAgeRanges,
    top_genders: topGenders,
    top_geographies: topGeographies,
    top_time_windows: topTimeWindows,
    audience_interests: audienceInterests,
    performance_metrics: performanceMetrics,
    provenance: insights.provenance || {
      source: 'AGGREGATE_DIGITAL_INSIGHTS',
      confidence: 0.90,
      isDemoData: true,
      lastUpdated: new Date().toISOString()
    }
  };
}

function mapToZiggersObjective(rawObjective) {
  const normalized = (rawObjective || '').toUpperCase();
  if (normalized.includes('SAMPL') || normalized.includes('TRIAL') || normalized.includes('PRODUCT_SAMPLING')) {
    return 'Product Sampling';
  }
  if (normalized.includes('LEAD') || normalized.includes('REGISTRATION')) {
    return 'Lead Generation';
  }
  if (normalized.includes('APP') || normalized.includes('INSTALL') || normalized.includes('DOWNLOAD')) {
    return 'App Downloads';
  }
  if (normalized.includes('STORE') || normalized.includes('VISIT') || normalized.includes('TRAFFIC')) {
    return 'Store Visits';
  }
  if (normalized.includes('RETAIL') || normalized.includes('POSM')) {
    return 'Retail Activation & POSM';
  }
  return 'Product Sampling';
}
