import { describe, it, expect } from 'vitest';
import { appReducer, initialAppState } from '../src/state/appStore';
import { Brand } from '../src/domain/brand';
import { Campaign } from '../src/domain/campaign';

describe('App State Reducer', () => {
  it('handles SET_BRANDS and auto-selects first brand', () => {
    const brands: Brand[] = [
      { id: 'b1', name: 'Brand A', code: 'A', industry: 'Tech', active: true, createdAt: '2026-01-01' },
      { id: 'b2', name: 'Brand B', code: 'B', industry: 'Retail', active: true, createdAt: '2026-01-01' },
    ];

    const state = appReducer(initialAppState, { type: 'SET_BRANDS', payload: brands });
    expect(state.brands).toHaveLength(2);
    expect(state.selectedBrandId).toBe('b1');
  });

  it('updates campaign in state on UPDATE_CAMPAIGN', () => {
    const campaign: Campaign = {
      id: 'c1',
      brandId: 'b1',
      name: 'Campaign 1',
      budget: 5000,
      currency: 'USD',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
      status: 'DRAFT',
      targetAudienceIds: [],
      targetLocationIds: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    const stateWithCampaign = appReducer(initialAppState, { type: 'ADD_CAMPAIGN', payload: campaign });
    expect(stateWithCampaign.campaigns).toHaveLength(1);

    const updatedCampaign: Campaign = { ...campaign, status: 'SCHEDULED' };
    const updatedState = appReducer(stateWithCampaign, { type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });

    expect(updatedState.campaigns[0].status).toBe('SCHEDULED');
  });
});
