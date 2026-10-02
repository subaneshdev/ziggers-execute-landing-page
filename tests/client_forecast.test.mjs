import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCampaignForecast } from '../src/lib/intelligence/clientForecast.js';

test('zero budget cannot produce preview interactions or leads', () => {
  const result = generateCampaignForecast({ budgetInr: 0, radiusKm: 0.5 });
  assert.equal(result.capacity.promoterCount, 0);
  assert.equal(result.expected.interactions, 0);
  assert.equal(result.expected.leads, 0);
});

test('preview carries its actual heuristic provenance', () => {
  const result = generateCampaignForecast({ radiusKm: 0.5 });
  assert.equal(result.provenance.modelType, 'HEURISTIC_PREVIEW');
  assert.equal(result.provenance.confidenceTier, 'LOW');
});

test('audience radius affects reachable demand with ample capacity', () => {
  const params = { budgetInr: 10000000, campaignDays: 1, shiftHours: 5 };
  const small = generateCampaignForecast({ ...params, radiusKm: 0.1 });
  const large = generateCampaignForecast({ ...params, radiusKm: 0.5 });
  assert.ok(large.expected.reach > small.expected.reach);
});
