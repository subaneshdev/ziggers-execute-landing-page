/**
 * Ziggers Signal Sync - Hierarchical QR Attribution Engine
 * File: src/lib/intelligence/signals/qrAttributionEngine.js
 *
 * Implements a 6-level QR code attribution taxonomy:
 * Brand → Campaign → Location → Geo Cell (H3) → Promoter → Creative / Activation Format
 *
 * Enables offline physical interaction attribution down to the exact promoter, H3 spatial zone, and timestamp.
 */

export class QrAttributionEngine {
  /**
   * Generate an attributed QR code manifest for a campaign deployment
   */
  static generateAttributionNode({
    brandName,
    campaignId,
    locationName,
    h3Cell = null,
    promoterId = 'PROMOTER_POOL',
    promoterName = 'Promoter Team',
    creativeId = 'CAN_SAMPLING_V1',
    baseLandingUrl = 'https://ziggers.com/experience'
  }) {
    const cleanBrand = (brandName || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCamp = (campaignId || 'camp').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLoc = (locationName || 'loc').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanProm = (promoterId || 'p1').toLowerCase().replace(/[^a-z0-9]/g, '');

    const qrCodeId = `qr_${cleanBrand}_${cleanCamp.slice(0, 8)}_${cleanLoc.slice(0, 6)}_${cleanProm.slice(0, 6)}`;

    // Build Attribution Query Parameters
    const params = new URLSearchParams({
      qr_id: qrCodeId,
      utm_source: 'ziggers_execute',
      utm_medium: 'physical_qr',
      utm_campaign: campaignId,
      utm_content: creativeId,
      brand: brandName,
      loc: locationName,
      geo_cell: h3Cell || '892f254f177ffff',
      promoter: promoterId
    });

    const destinationUrl = `${baseLandingUrl}?${params.toString()}`;

    return {
      qrCodeId,
      brandName,
      campaignId,
      locationName,
      h3Cell: h3Cell || '892f254f177ffff',
      promoterId,
      promoterName,
      creativeId,
      destinationUrl,
      generatedAt: new Date().toISOString(),
      hierarchy: {
        level1_brand: brandName,
        level2_campaign: campaignId,
        level3_location: locationName,
        level4_h3_cell: h3Cell || '892f254f177ffff',
        level5_promoter: promoterName,
        level6_creative: creativeId
      }
    };
  }

  /**
   * Parse attribution parameters from a scanned QR URL
   */
  static parseAttributionUrl(url) {
    try {
      const parsed = new URL(url);
      return {
        qrCodeId: parsed.searchParams.get('qr_id'),
        campaignId: parsed.searchParams.get('utm_campaign'),
        brandName: parsed.searchParams.get('brand'),
        locationName: parsed.searchParams.get('loc'),
        h3Cell: parsed.searchParams.get('geo_cell'),
        promoterId: parsed.searchParams.get('promoter'),
        creativeId: parsed.searchParams.get('utm_content')
      };
    } catch (e) {
      return null;
    }
  }
}
