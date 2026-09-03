import { describe, it, expect } from 'vitest';
import { validateBrand, formatBrandLabel } from '../src/domain/brand';
import { supportsChannel } from '../src/domain/vendor';
import { validateCampaign, canTransitionCampaignStatus } from '../src/domain/campaign';
import { createActivationEntity } from '../src/domain/activation';

describe('Domain Rules & Validation', () => {
  it('validates brand data correctly', () => {
    const invalidBrand = validateBrand({ name: '', code: 'A', industry: '' });
    expect(invalidBrand.isValid).toBe(false);
    expect(invalidBrand.errors.length).toBe(3);

    const validBrand = validateBrand({ name: 'Acme', code: 'ACME', industry: 'Retail' });
    expect(validBrand.isValid).toBe(true);
    expect(validBrand.errors).toHaveLength(0);
  });

  it('formats brand label properly', () => {
    const brand = { id: 'b1', name: 'Nike', code: 'NKE', industry: 'Apparel', active: true, createdAt: '2026-01-01' };
    expect(formatBrandLabel(brand)).toBe('Nike [NKE]');
  });

  it('checks vendor channel support', () => {
    const vendor = { id: 'v1', name: 'Meta', supportedChannels: ['SOCIAL' as const], apiEndpoint: 'http://test', rateLimitPerMinute: 100, active: true };
    expect(supportsChannel(vendor, 'SOCIAL')).toBe(true);
    expect(supportsChannel(vendor, 'SEARCH')).toBe(false);
  });

  it('validates campaign budget and dates', () => {
    const invalid = validateCampaign({
      brandId: 'b1',
      name: 'Summer Sale',
      budget: -100,
      startDate: '2026-06-10',
      endDate: '2026-06-01',
    });
    expect(invalid.isValid).toBe(false);
    expect(invalid.errors).toContain('Campaign budget must be greater than zero');
    expect(invalid.errors).toContain('Start date must be before end date');
  });

  it('enforces campaign status transition state machine', () => {
    expect(canTransitionCampaignStatus('DRAFT', 'SCHEDULED')).toBe(true);
    expect(canTransitionCampaignStatus('DRAFT', 'COMPLETED')).toBe(false);
    expect(canTransitionCampaignStatus('ACTIVE', 'PAUSED')).toBe(true);
    expect(canTransitionCampaignStatus('COMPLETED', 'ACTIVE')).toBe(false);
  });

  it('creates activation entity with pending status', () => {
    const input = {
      campaignId: 'cmp_1',
      vendorId: 'vnd_1',
      channel: 'DSP' as const,
      payload: { creativeId: 'cr_100' },
    };
    const act = createActivationEntity(input);
    expect(act.status).toBe('PENDING');
    expect(act.campaignId).toBe('cmp_1');
  });
});
