import { describe, it, expect } from 'vitest';
import { campaignService } from '../src/services/campaignService';
import { activationService } from '../src/services/activationService';

describe('Service Layer Integration', () => {
  it('retrieves brands and filtered audiences', async () => {
    const brands = await campaignService.getBrands();
    expect(brands.length).toBeGreaterThan(0);

    const brandId = brands[0].id;
    const audiences = await campaignService.getAudiencesByBrand(brandId);
    audiences.forEach(aud => expect(aud.brandId).toBe(brandId));
  });

  it('creates a new campaign successfully via service', async () => {
    const newCampaign = await campaignService.createCampaign({
      brandId: 'b_1',
      name: 'Black Friday 2026',
      budget: 100000,
      currency: 'USD',
      startDate: '2026-11-20',
      endDate: '2026-11-30',
      targetAudienceIds: ['aud_1'],
      targetLocationIds: ['loc_1'],
    });

    expect(newCampaign.id).toBeDefined();
    expect(newCampaign.status).toBe('DRAFT');

    const fetched = await campaignService.getCampaignById(newCampaign.id);
    expect(fetched?.name).toBe('Black Friday 2026');
  });

  it('dispatches activation via activation service', async () => {
    const vendors = await activationService.getVendors();
    expect(vendors.length).toBeGreaterThan(0);

    const activation = await activationService.triggerActivation({
      campaignId: 'cmp_101',
      vendorId: vendors[0].id,
      channel: vendors[0].supportedChannels[0],
      payload: { headline: 'Test Promo' },
    });

    expect(activation.status).toBe('DISPATCHED');
    expect(activation.dispatchedAt).toBeDefined();
  });
});
