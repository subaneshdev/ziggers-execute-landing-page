import test from 'node:test';
import assert from 'node:assert/strict';
import { getH3CellsForRadius } from '../src/lib/intelligence/geo/h3Engine.js';

test('cached geometry preserves values and isolates caller mutations', () => {
  const original = getH3CellsForRadius(13.0827, 80.2707, 0.3, 9);
  const expected = structuredClone(original);
  original[0].overlapWeight = -99;
  original.pop();
  assert.deepEqual(getH3CellsForRadius(13.0827, 80.2707, 0.3, 9), expected);
});

test('geometry cache keys include coordinates, radius and resolution', () => {
  const base = getH3CellsForRadius(13.0827, 80.2707, 0.3, 9);
  assert.notDeepEqual(getH3CellsForRadius(12.9716, 77.5946, 0.3, 9), base);
  assert.notDeepEqual(getH3CellsForRadius(13.0827, 80.2707, 0.6, 9), base);
  assert.notDeepEqual(getH3CellsForRadius(13.0827, 80.2707, 0.3, 10), base);
});

test('geometry is unchanged after cache eviction', () => {
  const expected = getH3CellsForRadius(13.0827, 80.2707, 0.1, 9);
  for (let i = 0; i < 25; i++) getH3CellsForRadius(13.0827, 80.2707, 0.11 + i * 0.001, 9);
  assert.deepEqual(getH3CellsForRadius(13.0827, 80.2707, 0.1, 9), expected);
});
